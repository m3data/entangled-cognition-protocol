// js/modules/sessionOrchestrator.js

/**
 * Session Orchestrator Module
 *
 * Manages the 4-phase EECP experiment flow:
 *   Phase A: Threshold (grounding, intention, human context, somatic PRE, relational field)
 *   Phase B: Instrument Activation (EBS setup, SC setup)
 *   Phase C: The Experiment (external - happens in SC)
 *   Phase D: Phenomenological Capture (throughput, somatic POST, reflection, save)
 *   Synthesis: Mutual constraint review (unlocks after reflection saved)
 *
 * Key design principles:
 *   - Ceremony over mechanism
 *   - Positive friction (intentional), not admin burden
 *   - Gates protect phenomenological integrity (reflection before metrics)
 *   - Local-first, participant holds all keys
 */

import { experimentPhases, experimentTypes, groundingMethods, generateExperimentId, schemaVersion } from './schema.js';
import { checkEBSStatus, checkSCStatus, getInstrumentState, onStatusChange, ConnectionStatus } from './instrumentHealth.js';

/**
 * Session state
 */
let sessionState = {
  experimentId: null,
  experimentType: null,
  currentPhase: null,
  currentStep: null,
  startedAt: null,
  gates: {
    reflectionSaved: false,
    synthesisComplete: false
  },
  data: {
    threshold: {},
    activation: {},
    capture: {},
    synthesis: {}
  },
  instruments: {
    ebs: { connected: false, baseline: null },
    sc: { connected: false, model: null, sessionId: null }
  }
};

/**
 * Phase change listeners
 */
const phaseListeners = [];

/**
 * Register callback for phase/step changes
 * @param {Function} callback - Called with (phase, step, sessionState)
 */
export function onPhaseChange(callback) {
  phaseListeners.push(callback);
  return () => {
    const idx = phaseListeners.indexOf(callback);
    if (idx > -1) phaseListeners.splice(idx, 1);
  };
}

/**
 * Notify phase change listeners
 */
function notifyPhaseChange() {
  phaseListeners.forEach(cb => {
    try {
      cb(sessionState.currentPhase, sessionState.currentStep, { ...sessionState });
    } catch (e) {
      console.error('Phase listener error:', e);
    }
  });
}

/**
 * Initialize a new experiment session
 * @param {string} experimentType - From experimentTypes
 * @returns {object} Initial session state
 */
export function initSession(experimentType = 'human-ai-coupling') {
  const expType = experimentTypes.find(t => t.id === experimentType) || experimentTypes[0];

  sessionState = {
    experimentId: generateExperimentId(),
    experimentType: expType.id,
    currentPhase: 'threshold',
    currentStep: 0,
    startedAt: new Date().toISOString(),
    gates: {
      reflectionSaved: false,
      synthesisComplete: false
    },
    data: {
      threshold: {},
      activation: {},
      capture: {},
      synthesis: {}
    },
    instruments: {
      ebs: { connected: false, baseline: null },
      sc: { connected: false, model: null, sessionId: null }
    }
  };

  // Store in localStorage for recovery
  saveSessionToStorage();

  notifyPhaseChange();
  return { ...sessionState };
}

/**
 * Get current session state
 * @returns {object}
 */
export function getSessionState() {
  return { ...sessionState };
}

/**
 * Get current phase configuration
 * @returns {object|null}
 */
export function getCurrentPhase() {
  if (!sessionState.currentPhase) return null;
  return experimentPhases[sessionState.currentPhase];
}

/**
 * Get current step within phase
 * @returns {string|null}
 */
export function getCurrentStep() {
  const phase = getCurrentPhase();
  if (!phase) return null;
  return phase.steps[sessionState.currentStep] || null;
}

/**
 * Check if we can proceed to next step/phase
 * @returns {{canProceed: boolean, reason?: string}}
 */
export function canProceed() {
  const phase = getCurrentPhase();
  if (!phase) return { canProceed: false, reason: 'No active session' };

  // Phase-specific checks
  switch (sessionState.currentPhase) {
    case 'activation':
      // Instrument checks are informational, not blocking
      // User has seen the status and can proceed to experiment
      // (Instruments may connect during experiment phase)
      break;

    case 'synthesis':
      // Gate: reflection must be saved
      if (!sessionState.gates.reflectionSaved) {
        return { canProceed: false, reason: 'Reflection must be saved before viewing metrics' };
      }
      break;
  }

  return { canProceed: true };
}

/**
 * Advance to next step or phase
 * @returns {{success: boolean, phase: string, step: number, reason?: string}}
 */
export function nextStep() {
  const phase = getCurrentPhase();
  if (!phase) return { success: false, reason: 'No active session' };

  const { canProceed: ok, reason } = canProceed();
  if (!ok) return { success: false, reason };

  // Check if we're at the last step of this phase
  if (sessionState.currentStep >= phase.steps.length - 1) {
    // Move to next phase
    const phaseOrder = ['threshold', 'activation', 'experiment', 'capture', 'synthesis'];
    const currentIdx = phaseOrder.indexOf(sessionState.currentPhase);

    if (currentIdx < phaseOrder.length - 1) {
      sessionState.currentPhase = phaseOrder[currentIdx + 1];
      sessionState.currentStep = 0;
    } else {
      // Session complete
      return { success: true, phase: 'complete', step: 0 };
    }
  } else {
    sessionState.currentStep++;
  }

  saveSessionToStorage();
  notifyPhaseChange();

  return {
    success: true,
    phase: sessionState.currentPhase,
    step: sessionState.currentStep
  };
}

/**
 * Go back to previous step or phase
 * @returns {{success: boolean, phase: string, step: number, reason?: string}}
 */
export function previousStep() {
  const phase = getCurrentPhase();
  if (!phase) return { success: false, reason: 'No active session' };

  if (!phase.allowBack) {
    return { success: false, reason: 'Cannot go back from this phase' };
  }

  if (sessionState.currentStep > 0) {
    sessionState.currentStep--;
  } else {
    // Move to previous phase
    const phaseOrder = ['threshold', 'activation', 'experiment', 'capture', 'synthesis'];
    const currentIdx = phaseOrder.indexOf(sessionState.currentPhase);

    if (currentIdx > 0) {
      const prevPhaseId = phaseOrder[currentIdx - 1];
      const prevPhase = experimentPhases[prevPhaseId];

      // Can't go back to 'experiment' phase (external)
      if (prevPhase.external) {
        return { success: false, reason: 'Cannot return to experiment phase' };
      }

      sessionState.currentPhase = prevPhaseId;
      sessionState.currentStep = prevPhase.steps.length - 1;
    } else {
      return { success: false, reason: 'Already at first step' };
    }
  }

  saveSessionToStorage();
  notifyPhaseChange();

  return {
    success: true,
    phase: sessionState.currentPhase,
    step: sessionState.currentStep
  };
}

/**
 * Jump to specific phase (with validation)
 * @param {string} phaseId
 * @returns {{success: boolean, reason?: string}}
 */
export function goToPhase(phaseId) {
  const phase = experimentPhases[phaseId];
  if (!phase) return { success: false, reason: 'Invalid phase' };

  // Check gate requirements
  if (phase.requiresGate && !sessionState.gates[phase.requiresGate.replace('-', '')]) {
    return { success: false, reason: `Gate not passed: ${phase.requiresGate}` };
  }

  sessionState.currentPhase = phaseId;
  sessionState.currentStep = 0;

  saveSessionToStorage();
  notifyPhaseChange();

  return { success: true };
}

/**
 * Update session data for a specific phase
 * @param {object} data - Data to merge
 * @param {string} [phase] - Target phase key. If not specified, uses current phase.
 */
export function updatePhaseData(data, phase = null) {
  const phaseKey = phase || (sessionState.currentPhase === 'experiment' ? 'activation' : sessionState.currentPhase);
  if (!phaseKey) return;

  sessionState.data[phaseKey] = {
    ...sessionState.data[phaseKey],
    ...data
  };

  saveSessionToStorage();
}

/**
 * Update instrument connection status
 * @param {string} instrument - 'ebs' or 'sc'
 * @param {object} status - Connection status data
 */
export function updateInstrumentStatus(instrument, status) {
  if (instrument === 'ebs') {
    sessionState.instruments.ebs = {
      connected: status.connected,
      baseline: status.data ? {
        hr: status.data.hr,
        coherence: status.data.coherence
      } : null
    };
  } else if (instrument === 'sc') {
    sessionState.instruments.sc = {
      connected: status.connected,
      model: status.data?.session?.model || null,
      sessionId: status.data?.session?.session_id || null,
      models: status.data?.models || []
    };
  }

  saveSessionToStorage();
}

/**
 * Update experiment type (e.g., when user changes selection in Phase A)
 * @param {string} experimentTypeId - The new experiment type ID
 */
export function updateExperimentType(experimentTypeId) {
  const expType = experimentTypes.find(t => t.id === experimentTypeId);
  if (expType) {
    sessionState.experimentType = expType.id;
    saveSessionToStorage();
    notifyPhaseChange(); // Trigger UI update
  }
}

/**
 * Mark reflection as saved (unlocks synthesis phase)
 */
export function markReflectionSaved() {
  sessionState.gates.reflectionSaved = true;
  saveSessionToStorage();
}

/**
 * Check if synthesis is unlocked
 * @returns {boolean}
 */
export function isSynthesisUnlocked() {
  return sessionState.gates.reflectionSaved;
}

/**
 * Save session state to localStorage
 */
function saveSessionToStorage() {
  try {
    localStorage.setItem('ecp_active_session', JSON.stringify(sessionState));
  } catch (e) {
    console.warn('Could not save session to storage:', e);
  }
}

/**
 * Recover session from localStorage
 * @returns {object|null} Recovered session or null
 */
export function recoverSession() {
  try {
    const saved = localStorage.getItem('ecp_active_session');
    if (saved) {
      const recovered = JSON.parse(saved);
      // Only recover if less than 24 hours old
      const age = Date.now() - new Date(recovered.startedAt).getTime();
      if (age < 24 * 60 * 60 * 1000) {
        sessionState = recovered;
        notifyPhaseChange();
        return { ...sessionState };
      }
    }
  } catch (e) {
    console.warn('Could not recover session:', e);
  }
  return null;
}

/**
 * Clear current session
 */
export function clearSession() {
  sessionState = {
    experimentId: null,
    experimentType: null,
    currentPhase: null,
    currentStep: null,
    startedAt: null,
    gates: { reflectionSaved: false, synthesisComplete: false },
    data: { threshold: {}, activation: {}, capture: {}, synthesis: {} },
    instruments: { ebs: { connected: false, baseline: null }, sc: { connected: false, model: null, sessionId: null } }
  };
  localStorage.removeItem('ecp_active_session');
  notifyPhaseChange();
}

/**
 * Build final experiment entry from session data
 * @returns {object} Complete experiment entry for saving
 */
export function buildExperimentEntry() {
  const { data, instruments, experimentId, experimentType, startedAt, gates } = sessionState;

  return {
    metadata: {
      experiment_id: experimentId,
      schema_version: schemaVersion,
      experiment_type: experimentType,
      timestamp_start: startedAt,
      timestamp_end: new Date().toISOString(),
      ...data.threshold.metadata
    },
    session_links: {
      sc_session_id: instruments.sc.sessionId,
      ebs_session_file: data.activation.ebs_session_file || null,
      correlation_consented: data.threshold.correlation_consented || false
    },
    instrument_status: {
      ebs_connected: instruments.ebs.connected,
      ebs_baseline_hr: instruments.ebs.baseline?.hr,
      ebs_baseline_coherence: instruments.ebs.baseline?.coherence,
      sc_connected: instruments.sc.connected,
      sc_model: instruments.sc.model
    },
    human: data.threshold.human || {},
    machine: data.activation.machine || {},
    relational_field: data.threshold.relational_field || {},
    throughput: data.capture.throughput || {},
    reflection: data.capture.reflection || {},
    measurement_frameworks: {
      somatic_coherence: {
        pre_session: data.threshold.somatic_pre || {},
        post_session: data.capture.somatic_post || {},
        qualitative_notes: data.capture.somatic_notes || {}
      },
      response_quality: data.capture.response_quality || {},
      meaning_making: data.capture.meaning_making || {}
    },
    synthesis: gates.reflectionSaved ? {
      ...data.synthesis,
      synthesis_completed_at: data.synthesis.completed_at || null
    } : null
  };
}

/**
 * Get phase progress for UI
 * @returns {object[]} Array of phase statuses
 */
export function getPhaseProgress() {
  const phaseOrder = ['threshold', 'activation', 'experiment', 'capture', 'synthesis'];
  const currentIdx = phaseOrder.indexOf(sessionState.currentPhase);

  return phaseOrder.map((phaseId, idx) => {
    const phase = experimentPhases[phaseId];
    let status = 'pending';

    if (idx < currentIdx) {
      status = 'complete';
    } else if (idx === currentIdx) {
      status = 'active';
    } else if (phaseId === 'synthesis' && !sessionState.gates.reflectionSaved) {
      status = 'locked';
    }

    return {
      id: phaseId,
      label: phase.label,
      description: phase.description,
      status,
      stepCount: phase.steps.length,
      currentStep: idx === currentIdx ? sessionState.currentStep : null
    };
  });
}

/**
 * Create phase navigation UI
 * @returns {HTMLElement}
 */
export function createPhaseNavigation() {
  const nav = document.createElement('div');
  nav.className = 'phase-navigation';

  const updateNav = () => {
    const progress = getPhaseProgress();

    nav.innerHTML = `
      <div class="phase-progress-bar">
        ${progress.map((p, idx) => `
          <div class="phase-marker ${p.status}" data-phase="${p.id}" title="${p.label}">
            <span class="phase-dot">${idx + 1}</span>
            <span class="phase-label">${p.label.replace('Phase ', '').split(':')[0]}</span>
          </div>
        `).join('')}
      </div>
      <div class="phase-info">
        <h3>${progress.find(p => p.status === 'active')?.label || 'Session Complete'}</h3>
        <p>${progress.find(p => p.status === 'active')?.description || ''}</p>
      </div>
      <div class="phase-controls">
        <button type="button" class="phase-prev-btn" ${sessionState.currentStep === 0 && sessionState.currentPhase === 'threshold' ? 'disabled' : ''}>← Back</button>
        <span class="step-indicator">Step ${sessionState.currentStep + 1} of ${getCurrentPhase()?.steps.length || 1}</span>
        <button type="button" class="phase-next-btn">Continue →</button>
      </div>
    `;

    // Add event listeners
    nav.querySelector('.phase-prev-btn')?.addEventListener('click', () => {
      previousStep();
      updateNav();
    });

    nav.querySelector('.phase-next-btn')?.addEventListener('click', () => {
      const result = nextStep();
      if (!result.success) {
        // Show reason to user
        alert(result.reason);
      }
      updateNav();
    });

    // Phase dot clicks (for skipping, if allowed)
    nav.querySelectorAll('.phase-marker').forEach(marker => {
      marker.addEventListener('click', () => {
        const phaseId = marker.dataset.phase;
        const phase = experimentPhases[phaseId];
        if (phase.allowSkip || marker.classList.contains('complete')) {
          goToPhase(phaseId);
          updateNav();
        }
      });
    });
  };

  // Initial render
  updateNav();

  // Subscribe to changes
  onPhaseChange(updateNav);

  return nav;
}

/**
 * Inject orchestrator styles
 */
export function injectOrchestratorStyles() {
  if (document.getElementById('orchestrator-styles')) return;

  const style = document.createElement('style');
  style.id = 'orchestrator-styles';
  style.textContent = `
    .phase-navigation {
      margin-bottom: 2rem;
      padding: 1rem;
      background: var(--bg-secondary, #f9f9f9);
      border-radius: 8px;
    }

    .phase-progress-bar {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      position: relative;
    }

    .phase-progress-bar::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--border-color, #ddd);
      transform: translateY(-50%);
      z-index: 0;
    }

    .phase-marker {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      z-index: 1;
      cursor: pointer;
    }

    .phase-dot {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.9rem;
      background: var(--bg-primary, white);
      border: 2px solid var(--border-color, #ddd);
      transition: all 0.2s;
    }

    .phase-marker.complete .phase-dot {
      background: var(--success-color, #5cb85c);
      border-color: var(--success-color, #5cb85c);
      color: white;
    }

    .phase-marker.active .phase-dot {
      background: var(--primary-color, #4a90a4);
      border-color: var(--primary-color, #4a90a4);
      color: white;
      transform: scale(1.1);
    }

    .phase-marker.locked .phase-dot {
      background: var(--bg-disabled, #e0e0e0);
      border-color: var(--border-color, #ddd);
      color: var(--text-muted, #888);
    }

    .phase-label {
      font-size: 0.75rem;
      margin-top: 0.25rem;
      color: var(--text-muted, #666);
    }

    .phase-marker.active .phase-label {
      color: var(--primary-color, #4a90a4);
      font-weight: 600;
    }

    .phase-info {
      text-align: center;
      margin-bottom: 1rem;
    }

    .phase-info h3 {
      margin: 0 0 0.25rem;
      font-size: 1.1rem;
    }

    .phase-info p {
      margin: 0;
      color: var(--text-muted, #666);
      font-size: 0.9rem;
    }

    .phase-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .phase-prev-btn, .phase-next-btn {
      padding: 0.5rem 1rem;
      border: 1px solid var(--border-color, #ddd);
      border-radius: 4px;
      background: var(--bg-primary, white);
      cursor: pointer;
      transition: background 0.2s;
    }

    .phase-prev-btn:hover:not(:disabled), .phase-next-btn:hover:not(:disabled) {
      background: var(--bg-hover, #f0f0f0);
    }

    .phase-prev-btn:disabled, .phase-next-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .phase-next-btn {
      background: var(--primary-color, #4a90a4);
      border-color: var(--primary-color, #4a90a4);
      color: white;
    }

    .phase-next-btn:hover:not(:disabled) {
      background: var(--primary-hover, #3d7a8c);
    }

    .step-indicator {
      font-size: 0.85rem;
      color: var(--text-muted, #666);
    }

    /* Gate indicator */
    .gate-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
      border-left: 4px solid #ffc107;
      border-radius: 4px;
      margin: 1rem 0;
    }

    .gate-indicator.unlocked {
      background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
      border-left-color: #4caf50;
    }

    .gate-indicator .gate-icon {
      font-size: 1.2rem;
    }

    .gate-indicator .gate-text {
      font-size: 0.9rem;
    }
  `;

  document.head.appendChild(style);
}
