// js/modules/instrumentHealth.js

/**
 * Instrument Health Module
 *
 * Checks connection status of EBS (EarthianBioSense) and SC (Semantic Climate)
 * for EECP orchestrated experiments.
 *
 * Part of the Phase B: Instrument Activation flow.
 */

import { instrumentEndpoints } from './schema.js';

/**
 * Connection status states
 */
export const ConnectionStatus = {
  UNKNOWN: 'unknown',
  CHECKING: 'checking',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ERROR: 'error'
};

/**
 * Current instrument state - updated by health checks
 */
let instrumentState = {
  ebs: {
    status: ConnectionStatus.UNKNOWN,
    lastCheck: null,
    data: null,
    error: null
  },
  sc: {
    status: ConnectionStatus.UNKNOWN,
    lastCheck: null,
    data: null,
    error: null
  }
};

/**
 * Event listeners for status changes
 */
const statusListeners = [];

/**
 * Register a callback for status changes
 * @param {Function} callback - Called with (instrument, status, data)
 */
export function onStatusChange(callback) {
  statusListeners.push(callback);
  return () => {
    const idx = statusListeners.indexOf(callback);
    if (idx > -1) statusListeners.splice(idx, 1);
  };
}

/**
 * Notify all listeners of status change
 */
function notifyStatusChange(instrument, status, data) {
  instrumentState[instrument] = {
    status,
    lastCheck: new Date().toISOString(),
    data: status === ConnectionStatus.CONNECTED ? data : null,
    error: status === ConnectionStatus.ERROR ? data : null
  };

  statusListeners.forEach(cb => {
    try {
      cb(instrument, status, data);
    } catch (e) {
      console.error('Status listener error:', e);
    }
  });
}

/**
 * Check EBS (EarthianBioSense) connection via WebSocket
 * @returns {Promise<{connected: boolean, data?: object, error?: string}>}
 */
export async function checkEBSStatus() {
  notifyStatusChange('ebs', ConnectionStatus.CHECKING, null);

  const endpoint = instrumentEndpoints.ebs;

  return new Promise((resolve) => {
    try {
      const ws = new WebSocket(endpoint.healthCheck);
      const timeout = setTimeout(() => {
        ws.close();
        notifyStatusChange('ebs', ConnectionStatus.DISCONNECTED, null);
        resolve({ connected: false, error: 'Connection timeout' });
      }, 3000);

      ws.onopen = () => {
        clearTimeout(timeout);
        // Request current state
        ws.send(JSON.stringify({ type: 'status_request' }));
      };

      ws.onmessage = (event) => {
        clearTimeout(timeout);
        try {
          const data = JSON.parse(event.data);
          ws.close();
          // EBS sends: hr, stability (coherence), entrainment, phase_label
          const parsed = {
            hr: data.hr || data.heart_rate,
            coherence: data.stability || data.coherence,  // EBS uses 'stability'
            entrainment: data.entrainment,
            phase_label: data.phase_label || data.label
          };
          notifyStatusChange('ebs', ConnectionStatus.CONNECTED, parsed);
          resolve({ connected: true, data: parsed });
        } catch (e) {
          ws.close();
          notifyStatusChange('ebs', ConnectionStatus.CONNECTED, { raw: event.data });
          resolve({ connected: true, data: { raw: event.data } });
        }
      };

      ws.onerror = (error) => {
        clearTimeout(timeout);
        notifyStatusChange('ebs', ConnectionStatus.DISCONNECTED, null);
        resolve({ connected: false, error: 'WebSocket connection failed' });
      };

      ws.onclose = () => {
        clearTimeout(timeout);
      };

    } catch (error) {
      notifyStatusChange('ebs', ConnectionStatus.ERROR, error.message);
      resolve({ connected: false, error: error.message });
    }
  });
}

/**
 * Check SC (Semantic Climate) connection via REST API
 * @returns {Promise<{connected: boolean, data?: object, error?: string}>}
 */
export async function checkSCStatus() {
  notifyStatusChange('sc', ConnectionStatus.CHECKING, null);

  const endpoint = instrumentEndpoints.sc;

  try {
    // Check Ollama status first
    const ollamaResponse = await fetch(endpoint.healthCheck, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(3000)
    });

    if (!ollamaResponse.ok) {
      notifyStatusChange('sc', ConnectionStatus.DISCONNECTED, null);
      return { connected: false, error: `HTTP ${ollamaResponse.status}` };
    }

    const ollamaData = await ollamaResponse.json();

    // Try to get session status if endpoint exists
    let sessionData = null;
    try {
      const sessionResponse = await fetch(
        `http://localhost:8000${endpoint.sessionPath}`,
        {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(2000)
        }
      );
      if (sessionResponse.ok) {
        sessionData = await sessionResponse.json();
      }
    } catch (e) {
      // Session endpoint may not exist yet - that's ok
    }

    // Try to get EBS status from SC
    let ebsViaSC = null;
    try {
      const ebsResponse = await fetch(
        `http://localhost:8000${endpoint.ebsPath}`,
        {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(2000)
        }
      );
      if (ebsResponse.ok) {
        ebsViaSC = await ebsResponse.json();
      }
    } catch (e) {
      // EBS endpoint may not be available
    }

    const combinedData = {
      ollama: ollamaData,
      session: sessionData,
      ebs_via_sc: ebsViaSC,
      models: ollamaData.models || []
    };

    notifyStatusChange('sc', ConnectionStatus.CONNECTED, combinedData);
    return { connected: true, data: combinedData };

  } catch (error) {
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      notifyStatusChange('sc', ConnectionStatus.DISCONNECTED, null);
      return { connected: false, error: 'Connection timeout' };
    }
    notifyStatusChange('sc', ConnectionStatus.ERROR, error.message);
    return { connected: false, error: error.message };
  }
}

/**
 * Check all instruments
 * @returns {Promise<{ebs: object, sc: object}>}
 */
export async function checkAllInstruments() {
  const [ebs, sc] = await Promise.all([
    checkEBSStatus(),
    checkSCStatus()
  ]);
  return { ebs, sc };
}

/**
 * Get current instrument state (without triggering new check)
 * @returns {object}
 */
export function getInstrumentState() {
  return { ...instrumentState };
}

/**
 * Create status indicator UI element
 * @param {string} instrument - 'ebs' or 'sc'
 * @returns {HTMLElement}
 */
export function createStatusIndicator(instrument) {
  const config = instrumentEndpoints[instrument];

  const container = document.createElement('div');
  container.className = 'instrument-status';
  container.dataset.instrument = instrument;

  container.innerHTML = `
    <div class="status-header">
      <span class="status-icon" data-status="unknown">●</span>
      <span class="status-name">${config.name}</span>
    </div>
    <div class="status-details">
      <span class="status-text">Not checked</span>
    </div>
    <button class="status-check-btn" type="button">Check Connection</button>
  `;

  const icon = container.querySelector('.status-icon');
  const text = container.querySelector('.status-text');
  const btn = container.querySelector('.status-check-btn');

  // Update on status changes
  onStatusChange((inst, status, data) => {
    if (inst !== instrument) return;

    icon.dataset.status = status;

    switch (status) {
      case ConnectionStatus.CHECKING:
        text.textContent = 'Checking...';
        btn.disabled = true;
        break;
      case ConnectionStatus.CONNECTED:
        if (instrument === 'ebs' && data) {
          text.textContent = `Connected (HR: ${data.hr || '?'})`;
        } else if (instrument === 'sc' && data) {
          const modelCount = data.models?.length || 0;
          text.textContent = `Connected (${modelCount} models)`;
        } else {
          text.textContent = 'Connected';
        }
        btn.disabled = false;
        break;
      case ConnectionStatus.DISCONNECTED:
        text.textContent = 'Not running';
        btn.disabled = false;
        break;
      case ConnectionStatus.ERROR:
        text.textContent = `Error: ${data || 'Unknown'}`;
        btn.disabled = false;
        break;
      default:
        text.textContent = 'Unknown';
        btn.disabled = false;
    }
  });

  // Check button handler
  btn.addEventListener('click', async () => {
    if (instrument === 'ebs') {
      await checkEBSStatus();
    } else {
      await checkSCStatus();
    }
  });

  return container;
}

/**
 * Create combined instrument panel for Phase B
 * @returns {HTMLElement}
 */
export function createInstrumentPanel() {
  const panel = document.createElement('div');
  panel.className = 'instrument-panel';

  panel.innerHTML = `
    <h3>Instrument Status</h3>
    <p class="instrument-guidance">
      Ensure your instruments are running before proceeding to the experiment.
    </p>
    <div class="instrument-grid"></div>
    <div class="instrument-actions">
      <button type="button" class="check-all-btn">Check All</button>
    </div>
  `;

  const grid = panel.querySelector('.instrument-grid');
  grid.appendChild(createStatusIndicator('ebs'));
  grid.appendChild(createStatusIndicator('sc'));

  const checkAllBtn = panel.querySelector('.check-all-btn');
  checkAllBtn.addEventListener('click', checkAllInstruments);

  return panel;
}

/**
 * CSS styles for instrument status indicators
 * Call this once to inject styles
 */
export function injectInstrumentStyles() {
  if (document.getElementById('instrument-health-styles')) return;

  const style = document.createElement('style');
  style.id = 'instrument-health-styles';
  style.textContent = `
    .instrument-panel {
      padding: 1rem;
      border: 1px solid var(--border-color, #ddd);
      border-radius: 8px;
      margin: 1rem 0;
    }

    .instrument-panel h3 {
      margin-top: 0;
      margin-bottom: 0.5rem;
    }

    .instrument-guidance {
      color: var(--text-muted, #666);
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    .instrument-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .instrument-status {
      padding: 1rem;
      border: 1px solid var(--border-color, #ddd);
      border-radius: 6px;
      background: var(--bg-secondary, #f9f9f9);
    }

    .status-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .status-icon {
      font-size: 1.2rem;
    }

    .status-icon[data-status="unknown"] { color: #888; }
    .status-icon[data-status="checking"] { color: #f0ad4e; animation: pulse 1s infinite; }
    .status-icon[data-status="connected"] { color: #5cb85c; }
    .status-icon[data-status="disconnected"] { color: #d9534f; }
    .status-icon[data-status="error"] { color: #d9534f; }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .status-name {
      font-weight: 600;
    }

    .status-details {
      font-size: 0.85rem;
      color: var(--text-muted, #666);
      margin-bottom: 0.75rem;
    }

    .status-check-btn {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid var(--border-color, #ddd);
      border-radius: 4px;
      background: var(--bg-primary, white);
      cursor: pointer;
      transition: background 0.2s;
    }

    .status-check-btn:hover:not(:disabled) {
      background: var(--bg-hover, #f0f0f0);
    }

    .status-check-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .instrument-actions {
      margin-top: 1rem;
      display: flex;
      justify-content: center;
    }

    .check-all-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      background: var(--primary-color, #4a90a4);
      color: white;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.2s;
    }

    .check-all-btn:hover {
      background: var(--primary-hover, #3d7a8c);
    }
  `;

  document.head.appendChild(style);
}
