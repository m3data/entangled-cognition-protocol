// js/modules/experimentEntryController.js

/**
 * Experiment Entry Controller
 *
 * Manages the EECP experiment entry flow:
 * - Phase navigation and visibility
 * - Instrument health checking
 * - Form data collection and saving
 * - Conditional UI based on experiment type
 */

import { initTagInput } from './inputTags.js';
import { initTooltips } from './ui.js';
import {
  createSomaticCoherenceAssessment,
  initMeasurementFrameworks
} from './measurementWidgets.js';
import {
  checkEBSStatus,
  checkSCStatus,
  createStatusIndicator,
  injectInstrumentStyles,
  onStatusChange,
  ConnectionStatus
} from './instrumentHealth.js';
import {
  initSession,
  getSessionState,
  nextStep,
  updatePhaseData,
  updateInstrumentStatus,
  updateExperimentType,
  markReflectionSaved,
  buildExperimentEntry,
  createPhaseNavigation,
  injectOrchestratorStyles,
  onPhaseChange,
  recoverSession
} from './sessionOrchestrator.js';
import { saveExperimentEntry } from './saveEntry.js';
import { experimentTypes } from './schema.js';

/**
 * Check if experiment type requires biosignal instrument
 * @param {string} expTypeId - Experiment type ID
 * @returns {boolean}
 */
function requiresBiosignal(expTypeId) {
  const expType = experimentTypes.find(t => t.id === expTypeId);
  return expType?.requires?.includes('ebs') ?? false;
}

/**
 * Get tag input values from a chip list container
 * @param {string} containerId - Container element ID
 * @returns {string[]}
 */
function getTagValues(containerId) {
  const chips = document.querySelectorAll(`#${containerId} .chip-list .chip`);
  return Array.from(chips).map(chip => chip.textContent.replace('×', '').trim()).filter(Boolean);
}

/**
 * Show a specific phase container
 * @param {string} phaseId - Phase ID to show
 */
function showPhase(phaseId) {
  document.querySelectorAll('.phase-container').forEach(container => {
    container.style.display = container.dataset.phase === phaseId ? 'block' : 'none';
  });
}

/**
 * Show a specific step within a phase
 * @param {string} phaseId - Phase ID
 * @param {number} stepIndex - Step index to show
 */
function showStep(phaseId, stepIndex) {
  document.querySelectorAll(`.phase-step[data-phase="${phaseId}"]`).forEach((step, idx) => {
    step.style.display = idx === stepIndex ? 'block' : 'none';
  });
}

/**
 * Collect all form data and update session state
 */
function collectFormData() {
  // Threshold phase data
  updatePhaseData({
    grounding_method: document.getElementById('grounding_method')?.value,
    grounding_complete: document.getElementById('grounding_complete')?.checked,
    human: {
      cognitive_mode: getTagValues('cognitive_mode'),
      affective_tone: getTagValues('affective_tone'),
      ontological_orientation: getTagValues('ontological_orientation'),
      modulators: {
        caffeine: document.getElementById('caffeine')?.value || 'none',
        psilocybin: document.getElementById('psilocybin')?.value || 'none',
        thc: document.getElementById('thc')?.value || 'none',
        other: document.getElementById('other_modulator')?.value || ''
      },
      meal_state: document.getElementById('meal_state')?.value
    },
    relational_field: {
      location: document.getElementById('location')?.value,
      noted_presence_of_earthian_kin: getTagValues('noted_presence_of_earthian_kin'),
      lighting: getTagValues('lighting'),
      weather: getTagValues('weather'),
      more_than_human_acknowledged: document.getElementById('more_than_human_acknowledged')?.checked
    },
    metadata: {
      experiment_type: document.getElementById('experiment_type')?.value,
      intention: document.getElementById('intention')?.value,
      author: document.getElementById('author')?.value || 'anonymous'
    },
    correlation_consented: document.getElementById('correlation_consented')?.checked
  }, 'threshold');

  // Capture phase data
  updatePhaseData({
    throughput: {
      felt_response_quality: parseInt(document.getElementById('felt_response_quality')?.value) || null,
      symbolic_density: parseInt(document.getElementById('symbolic_density')?.value) || null,
      turning_points: document.getElementById('turning_points')?.value,
      somatic_shifts_noted: document.getElementById('somatic_shifts_noted')?.value,
      observed_collapse_event: document.getElementById('observed_collapse_event')?.value,
      collapse_event_details: document.getElementById('collapse_event_details')?.value
    },
    reflection: {
      first_person_account: document.getElementById('first_person_account')?.value,
      what_surprised_you: document.getElementById('what_surprised_you')?.value,
      body_memory: document.getElementById('body_memory')?.value,
      unresolved_threads: document.getElementById('unresolved_threads')?.value,
      emergent_ecp_insights: document.getElementById('emergent_ecp_insights')?.value
    }
  }, 'capture');
}

/**
 * Initialize instrument status indicators
 */
function initInstrumentIndicators() {
  const ebsContainer = document.getElementById('ebs-status-container');
  if (ebsContainer) {
    ebsContainer.appendChild(createStatusIndicator('ebs'));
  }

  const scContainer = document.getElementById('sc-status-container');
  if (scContainer) {
    scContainer.appendChild(createStatusIndicator('sc'));
  }

  // Listen for instrument status changes
  onStatusChange((instrument, status, data) => {
    updateInstrumentStatus(instrument, { connected: status === ConnectionStatus.CONNECTED, data });

    if (instrument === 'ebs' && status === ConnectionStatus.CONNECTED && data) {
      const baseline = document.getElementById('ebs-baseline');
      if (baseline) {
        baseline.style.display = 'block';
        document.getElementById('ebs-baseline-hr').textContent = data.hr || '--';
        const coherenceVal = data.coherence != null ? (data.coherence * 100).toFixed(0) + '%' : '--';
        document.getElementById('ebs-baseline-coherence').textContent = coherenceVal;
      }
    }

    if (instrument === 'sc' && status === ConnectionStatus.CONNECTED && data) {
      const modelSelect = document.getElementById('sc_model');
      const modelSection = document.getElementById('sc-model-selection');
      if (modelSelect && data.models?.length) {
        modelSection.style.display = 'block';
        modelSelect.innerHTML = data.models.map(m => `<option value="${m}">${m}</option>`).join('');
      }
    }
  });
}

/**
 * Initialize instrument launcher controls
 */
function initInstrumentLauncher() {
  const startBtn = document.getElementById('start-instruments-btn');
  const stopBtn = document.getElementById('stop-instruments-btn');
  const statusEl = document.getElementById('launcher-status');

  if (!startBtn) return;

  const setStatus = (message, type = '') => {
    if (statusEl) {
      statusEl.textContent = message;
      statusEl.className = 'launcher-status' + (type ? ` ${type}` : '');
    }
  };

  const setLoading = (btn, loading) => {
    if (loading) {
      btn.classList.add('loading');
      btn.disabled = true;
    } else {
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  };

  startBtn.addEventListener('click', async () => {
    setLoading(startBtn, true);
    setStatus('Starting instruments...');

    try {
      const response = await fetch('/api/instruments/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instrument: 'all' })
      });

      const result = await response.json();

      if (result.success) {
        setStatus('Instruments started!', 'success');
        // Trigger status checks after a short delay
        setTimeout(() => {
          checkEBSStatus();
          checkSCStatus();
        }, 2000);
      } else {
        setStatus('Failed: ' + (result.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      setStatus('Error: ' + error.message, 'error');
    } finally {
      setLoading(startBtn, false);
    }
  });

  stopBtn?.addEventListener('click', async () => {
    setLoading(stopBtn, true);
    setStatus('Stopping instruments...');

    try {
      const response = await fetch('/api/instruments/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();

      if (result.success) {
        setStatus('Instruments stopped', 'success');
      } else {
        setStatus('Failed: ' + (result.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      setStatus('Error: ' + error.message, 'error');
    } finally {
      setLoading(stopBtn, false);
    }
  });
}

/**
 * Initialize somatic coherence measurement widgets
 */
function initSomaticWidgets() {
  const somaticPreContainer = document.getElementById('somatic-pre-container');
  if (somaticPreContainer) {
    somaticPreContainer.appendChild(createSomaticCoherenceAssessment('pre'));
    initMeasurementFrameworks(somaticPreContainer);
  }

  const somaticPostContainer = document.getElementById('somatic-post-container');
  if (somaticPostContainer) {
    somaticPostContainer.appendChild(createSomaticCoherenceAssessment('post'));
    initMeasurementFrameworks(somaticPostContainer);
  }
}

/**
 * Set up phase navigation with conditional EBS visibility
 */
function initPhaseNavigation() {
  const navContainer = document.getElementById('phase-nav-container');
  navContainer.appendChild(createPhaseNavigation());

  const ebsStep = document.querySelector('.phase-step[data-phase="activation"][data-step="0"]');

  // Subscribe to phase changes
  onPhaseChange((phase, step, state) => {
    showPhase(phase);

    // Handle activation phase - check if biosignal is required
    if (phase === 'activation') {
      const expType = document.getElementById('experiment_type')?.value || state.experimentType;
      const needsBiosignal = requiresBiosignal(expType);

      if (ebsStep) {
        ebsStep.style.display = needsBiosignal && step === 0 ? 'block' : 'none';
      }

      // If biosignal not required and we're on step 0, show SC step instead
      if (!needsBiosignal && step === 0) {
        const scStep = document.querySelector('.phase-step[data-phase="activation"][data-step="1"]');
        if (scStep) scStep.style.display = 'block';
      } else {
        showStep(phase, step);
      }
    } else {
      showStep(phase, step);
    }
  });

  // Auto-check instruments on activation phase
  onPhaseChange((phase) => {
    if (phase === 'activation') {
      checkEBSStatus();
      checkSCStatus();
    }
  });
}

/**
 * Initialize to current session state
 */
function initCurrentState() {
  const state = getSessionState();
  const ebsStep = document.querySelector('.phase-step[data-phase="activation"][data-step="0"]');

  if (state.currentPhase) {
    showPhase(state.currentPhase);

    // Handle activation phase initial state
    if (state.currentPhase === 'activation') {
      const expType = document.getElementById('experiment_type')?.value || state.experimentType;
      const needsBiosignal = requiresBiosignal(expType);

      if (!needsBiosignal && state.currentStep === 0) {
        if (ebsStep) ebsStep.style.display = 'none';
        const scStep = document.querySelector('.phase-step[data-phase="activation"][data-step="1"]');
        if (scStep) scStep.style.display = 'block';
      } else {
        showStep(state.currentPhase, state.currentStep);
      }
    } else {
      showStep(state.currentPhase, state.currentStep);
    }
  }
}

/**
 * Initialize form event listeners
 */
function initFormListeners() {
  // Tag inputs
  [
    "cognitive_mode",
    "ontological_orientation",
    "affective_tone",
    "weather",
    "noted_presence_of_earthian_kin",
    "lighting",
  ].forEach(id => initTagInput(id));

  // Experiment type change listener
  document.getElementById('experiment_type')?.addEventListener('change', (e) => {
    updateExperimentType(e.target.value);
  });

  // Collapse event toggle
  document.getElementById('observed_collapse_event')?.addEventListener('change', (e) => {
    const details = document.getElementById('collapse_details_container');
    details.style.display = e.target.value === 'yes' ? 'block' : 'none';
  });
}

/**
 * Initialize save handlers
 */
function initSaveHandlers() {
  // Save reflection handler
  document.getElementById('save-reflection-btn')?.addEventListener('click', async () => {
    collectFormData();

    const entry = buildExperimentEntry();
    const visibility = document.querySelector('input[name="visibility"]:checked')?.value || 'private';
    const scrubAuthor = document.getElementById('scrub-author')?.checked || false;

    try {
      await saveExperimentEntry(entry, { visibility, scrubAuthor });
      markReflectionSaved();
      nextStep();
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save entry: ' + error.message);
    }
  });

  // Save synthesis handler
  document.getElementById('save-synthesis-btn')?.addEventListener('click', async () => {
    collectFormData();

    updatePhaseData({
      metrics_reflection_alignment: document.getElementById('metrics_reflection_alignment')?.value,
      metrics_reflection_divergence: document.getElementById('metrics_reflection_divergence')?.value,
      divergence_interpretation: document.getElementById('divergence_interpretation')?.value,
      synthesis_notes: document.getElementById('synthesis_notes')?.value,
      completed_at: new Date().toISOString()
    }, 'synthesis');

    const entry = buildExperimentEntry();

    try {
      await saveExperimentEntry(entry, { visibility: 'private', isSynthesis: true });
      alert('Experiment complete! Your session has been saved.');
    } catch (error) {
      console.error('Synthesis save failed:', error);
      alert('Failed to save synthesis: ' + error.message);
    }
  });
}

/**
 * Initialize the experiment entry controller
 * Call this on DOMContentLoaded
 */
export function init() {
  // Inject styles
  injectInstrumentStyles();
  injectOrchestratorStyles();

  // Try to recover existing session or start new
  const recovered = recoverSession();
  if (!recovered) {
    initSession('human-ai-coupling');
  }

  // Initialize components
  initPhaseNavigation();
  initSomaticWidgets();
  initInstrumentIndicators();
  initInstrumentLauncher();
  initCurrentState();
  initFormListeners();
  initSaveHandlers();
  initTooltips();
}
