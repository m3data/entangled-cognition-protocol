// js/modules/measurementWidgets.js

/**
 * Measurement framework widgets for pre/post session assessments
 * Handles somatic coherence, response quality, and meaning-making scales
 */

import { measurementScales } from './schema.js';

/**
 * Creates a scale widget with visual slider and numerical display
 * @param {string} id - Unique identifier for the widget
 * @param {Object} scaleConfig - Configuration from measurementScales
 * @param {number} defaultValue - Default value for the scale
 * @param {string} containerClass - CSS class for styling
 * @returns {HTMLElement} - Complete widget element
 */
export function createScaleWidget(id, scaleConfig, defaultValue = null, containerClass = 'measurement-widget') {
  const widget = document.createElement('div');
  widget.className = `${containerClass} scale-widget`;
  widget.id = `${id}_widget`;

  const { label, question, scale, description } = scaleConfig;
  const currentValue = defaultValue || Math.ceil(scale.max / 2);

  widget.innerHTML = `
    <div class="scale-header">
      <label for="${id}" class="scale-label">${label}</label>
      <span class="scale-value" id="${id}_value">${currentValue}</span>
    </div>
    <div class="scale-question">${question}</div>
    <div class="scale-container">
      <input 
        type="range" 
        id="${id}" 
        name="${id}"
        min="${scale.min}" 
        max="${scale.max}" 
        value="${currentValue}"
        class="scale-slider"
        data-description="${description}"
      />
      <div class="scale-labels">
        <span class="scale-min">${scale.min}</span>
        <span class="scale-max">${scale.max}</span>
      </div>
    </div>
    <div class="scale-description">${description}</div>
  `;

  // Add interactive behavior
  const slider = widget.querySelector('.scale-slider');
  const valueDisplay = widget.querySelector('.scale-value');
  
  slider.addEventListener('input', (e) => {
    valueDisplay.textContent = e.target.value;
    widget.dispatchEvent(new CustomEvent('scaleChange', {
      detail: { id, value: parseInt(e.target.value), scale: scaleConfig }
    }));
  });

  return widget;
}

/**
 * Creates a complete somatic coherence assessment section
 * @param {string} sessionType - 'pre' or 'post'
 * @param {Object} existingData - Any existing measurement data
 * @returns {HTMLElement} - Complete assessment section
 */
export function createSomaticCoherenceAssessment(sessionType = 'pre', existingData = {}) {
  const section = document.createElement('div');
  section.className = 'somatic-coherence-assessment measurement-section';
  section.id = `somatic_coherence_${sessionType}`;

  const headerText = sessionType === 'pre' ? 'Pre-Session Somatic State' : 'Post-Session Somatic State';
  const scales = measurementScales.somatic_coherence;

  section.innerHTML = `
    <div class="measurement-section-header">
      <h3><i class="ph ph-heart-straight"></i> ${headerText}</h3>
      <p class="section-description">
        ${sessionType === 'pre'
          ? 'Assess your current embodied state before beginning the session'
          : 'Reflect on how your embodied state has shifted through the session'
        }
      </p>
    </div>
    <div class="scales-container" data-session-type="${sessionType}">
    </div>
  `;

  const scalesContainer = section.querySelector('.scales-container');

  // Create each scale widget
  Object.entries(scales).forEach(([scaleId, scaleConfig]) => {
    const fullId = `${sessionType}_${scaleId}`;
    const existingValue = existingData[fullId];
    const widget = createScaleWidget(fullId, scaleConfig, existingValue, 'somatic-scale');
    scalesContainer.appendChild(widget);
  });

  return section;
}

/**
 * Creates response quality assessment widgets
 * @param {Object} existingData - Any existing measurement data
 * @returns {HTMLElement} - Complete response quality section
 */
export function createResponseQualityAssessment(existingData = {}) {
  const section = document.createElement('div');
  section.className = 'response-quality-assessment measurement-section';
  section.id = 'response_quality_assessment';

  const scales = measurementScales.response_quality;

  section.innerHTML = `
    <div class="measurement-section-header">
      <h3><i class="ph ph-chat-circle-dots"></i> AI Response Quality Assessment</h3>
      <p class="section-description">
        Rate the quality characteristics of the AI responses during this session
      </p>
    </div>
    <div class="scales-container">
    </div>
    <div class="response-notes">
      <label for="response_quality_notes">Additional Response Quality Notes</label>
      <textarea
        id="response_quality_notes"
        name="response_quality_notes"
        rows="3"
        placeholder="Note any specific examples or patterns in AI responses..."
      >${existingData.response_quality_notes || ''}</textarea>
    </div>
  `;

  const scalesContainer = section.querySelector('.scales-container');

  Object.entries(scales).forEach(([scaleId, scaleConfig]) => {
    const existingValue = existingData[scaleId];
    const widget = createScaleWidget(scaleId, scaleConfig, existingValue, 'response-quality-scale');
    scalesContainer.appendChild(widget);
  });

  return section;
}

/**
 * Creates meaning-making quality assessment
 * @param {Object} existingData - Any existing measurement data
 * @returns {HTMLElement} - Complete meaning-making section
 */
export function createMeaningMakingAssessment(existingData = {}) {
  const section = document.createElement('div');
  section.className = 'meaning-making-assessment measurement-section';
  section.id = 'meaning_making_assessment';

  const scales = measurementScales.meaning_making;

  section.innerHTML = `
    <div class="measurement-section-header">
      <h3><i class="ph ph-lightbulb"></i> Meaning-Making Quality Assessment</h3>
      <p class="section-description">
        Reflect on the quality of insights and understanding that emerged
      </p>
    </div>
    <div class="scales-container">
    </div>
    <div class="meaning-making-notes">
      <label for="key_insights">Key Insights & Realizations</label>
      <textarea
        id="key_insights"
        name="key_insights"
        rows="4"
        placeholder="Document the most significant insights or realizations that emerged..."
      >${existingData.key_insights || ''}</textarea>
      
      <label for="integration_intentions">Integration Intentions</label>
      <textarea 
        id="integration_intentions" 
        name="integration_intentions"
        rows="3" 
        placeholder="How do you intend to integrate these insights into your life/work/practice?"
      >${existingData.integration_intentions || ''}</textarea>
    </div>
  `;

  const scalesContainer = section.querySelector('.scales-container');

  Object.entries(scales).forEach(([scaleId, scaleConfig]) => {
    const existingValue = existingData[scaleId];
    const widget = createScaleWidget(scaleId, scaleConfig, existingValue, 'meaning-making-scale');
    scalesContainer.appendChild(widget);
  });

  return section;
}

/**
 * Creates emergence patterns tracking section
 * @param {Object} existingData - Any existing measurement data
 * @returns {HTMLElement} - Complete emergence patterns section
 */
export function createEmergencePatternsSection(existingData = {}) {
  const section = document.createElement('div');
  section.className = 'emergence-patterns-section measurement-section';
  section.id = 'emergence_patterns';

  section.innerHTML = `
    <div class="measurement-section-header">
      <h3>Emergence & Pattern Recognition</h3>
      <p class="section-description">
        Track unexpected insights, pattern recognition, and creative sparks
      </p>
    </div>
    <div class="emergence-metrics">
      <div class="metric-group">
        <label for="unexpected_insights_count">Number of Unexpected Insights</label>
        <input 
          type="number" 
          id="unexpected_insights_count" 
          name="unexpected_insights_count"
          min="0" 
          max="20" 
          value="${existingData.unexpected_insights_count || 0}"
          class="count-input"
        />
      </div>
      
      <div class="metric-group">
        <label for="pattern_recognition_quality">Pattern Recognition Quality (1-10)</label>
        <input 
          type="range" 
          id="pattern_recognition_quality" 
          name="pattern_recognition_quality"
          min="1" 
          max="10" 
          value="${existingData.pattern_recognition_quality || 5}"
          class="quality-slider"
        />
        <span class="slider-value">${existingData.pattern_recognition_quality || 5}</span>
      </div>
      
      <div class="metric-group">
        <label for="creative_sparks">Creative Sparks & Novel Ideas</label>
        <textarea 
          id="creative_sparks" 
          name="creative_sparks"
          rows="3" 
          placeholder="Describe any creative ideas or novel directions that emerged..."
        >${existingData.creative_sparks || ''}</textarea>
      </div>
      
      <div class="metric-group">
        <label for="integration_impulses">Integration Impulses</label>
        <textarea 
          id="integration_impulses" 
          name="integration_impulses"
          rows="3" 
          placeholder="What impulses arose to act on or share insights?"
        >${existingData.integration_impulses || ''}</textarea>
      </div>
    </div>
  `;

  // Add interactive behavior for the quality slider
  const qualitySlider = section.querySelector('#pattern_recognition_quality');
  const qualityValue = section.querySelector('.slider-value');
  
  qualitySlider.addEventListener('input', (e) => {
    qualityValue.textContent = e.target.value;
  });

  return section;
}

/**
 * Collects all measurement data from active widgets
 * @param {HTMLElement} container - Container element with measurement widgets
 * @returns {Object} - Structured measurement data
 */
export function collectMeasurementData(container) {
  const data = {
    somatic_coherence: {
      pre_session: {},
      post_session: {},
      qualitative_notes: {}
    },
    response_quality: {
      assessment: {},
      notes: ""
    },
    meaning_making: {
      post_session: {},
      key_insights: "",
      integration_intentions: ""
    },
    emergence_patterns: {
      session_outcome: {}
    }
  };

  // Collect somatic coherence data
  container.querySelectorAll('.somatic-scale .scale-slider').forEach(slider => {
    const id = slider.id;
    const [sessionType, scaleId] = id.split('_', 2);
    const restId = id.split('_').slice(2).join('_'); // Handle multi-word scale IDs
    
    if (sessionType === 'pre' || sessionType === 'post') {
      const session = sessionType === 'pre' ? 'pre_session' : 'post_session';
      data.somatic_coherence[session][restId] = parseInt(slider.value);
    }
  });

  // Collect response quality data
  container.querySelectorAll('.response-quality-scale .scale-slider').forEach(slider => {
    data.response_quality.assessment[slider.id] = parseInt(slider.value);
  });

  const responseNotesEl = container.querySelector('#response_quality_notes');
  if (responseNotesEl) {
    data.response_quality.notes = responseNotesEl.value;
  }

  // Collect meaning-making data
  container.querySelectorAll('.meaning-making-scale .scale-slider').forEach(slider => {
    data.meaning_making.post_session[slider.id] = parseInt(slider.value);
  });

  const keyInsightsEl = container.querySelector('#key_insights');
  const integrationIntentionsEl = container.querySelector('#integration_intentions');
  
  if (keyInsightsEl) data.meaning_making.key_insights = keyInsightsEl.value;
  if (integrationIntentionsEl) data.meaning_making.integration_intentions = integrationIntentionsEl.value;

  // Collect emergence patterns data
  const unexpectedInsightsEl = container.querySelector('#unexpected_insights_count');
  const patternQualityEl = container.querySelector('#pattern_recognition_quality');
  const creativeSparksEl = container.querySelector('#creative_sparks');
  const integrationImpulsesEl = container.querySelector('#integration_impulses');

  if (unexpectedInsightsEl) {
    data.emergence_patterns.session_outcome.unexpected_insights_count = parseInt(unexpectedInsightsEl.value);
  }
  if (patternQualityEl) {
    data.emergence_patterns.session_outcome.pattern_recognition_quality = parseInt(patternQualityEl.value);
  }
  if (creativeSparksEl) {
    data.emergence_patterns.session_outcome.creative_sparks = creativeSparksEl.value;
  }
  if (integrationImpulsesEl) {
    data.emergence_patterns.session_outcome.integration_impulses = integrationImpulsesEl.value;
  }

  return data;
}

/**
 * Populates measurement widgets with existing data
 * @param {HTMLElement} container - Container with measurement widgets
 * @param {Object} measurementData - Existing measurement data to populate
 */
export function populateMeasurementWidgets(container, measurementData) {
  if (!measurementData || typeof measurementData !== 'object') return;

  // Populate somatic coherence scales
  if (measurementData.somatic_coherence) {
    ['pre_session', 'post_session'].forEach(session => {
      if (measurementData.somatic_coherence[session]) {
        Object.entries(measurementData.somatic_coherence[session]).forEach(([scaleId, value]) => {
          const sessionPrefix = session === 'pre_session' ? 'pre' : 'post';
          const slider = container.querySelector(`#${sessionPrefix}_${scaleId}`);
          const valueDisplay = container.querySelector(`#${sessionPrefix}_${scaleId}_value`);
          
          if (slider && !isNaN(value)) {
            slider.value = value;
            if (valueDisplay) valueDisplay.textContent = value;
          }
        });
      }
    });
  }

  // Populate response quality scales
  if (measurementData.response_quality?.assessment) {
    Object.entries(measurementData.response_quality.assessment).forEach(([scaleId, value]) => {
      const slider = container.querySelector(`#${scaleId}`);
      const valueDisplay = container.querySelector(`#${scaleId}_value`);
      
      if (slider && !isNaN(value)) {
        slider.value = value;
        if (valueDisplay) valueDisplay.textContent = value;
      }
    });
  }

  // Populate meaning-making scales
  if (measurementData.meaning_making?.post_session) {
    Object.entries(measurementData.meaning_making.post_session).forEach(([scaleId, value]) => {
      const slider = container.querySelector(`#${scaleId}`);
      const valueDisplay = container.querySelector(`#${scaleId}_value`);
      
      if (slider && !isNaN(value)) {
        slider.value = value;
        if (valueDisplay) valueDisplay.textContent = value;
      }
    });
  }
}

/**
 * Creates a complete measurement framework form step
 * @param {Object} existingData - Any existing measurement data
 * @returns {HTMLElement} - Complete measurement form step
 */
export function createMeasurementFormStep(existingData = {}) {
  const step = document.createElement('div');
  step.className = 'form-step measurement-form-step';
  step.setAttribute('data-step', 'measurement');
  step.style.display = 'none';

  step.innerHTML = `
    <fieldset>
      <legend>Measurement Frameworks</legend>
      <p>These assessments help track patterns in your ECP practice over time. Complete what feels relevant to your session.</p>
      <div class="measurement-sections-container">
      </div>
    </fieldset>
  `;

  const container = step.querySelector('.measurement-sections-container');
  
  // Add all measurement sections
  container.appendChild(createSomaticCoherenceAssessment('pre', existingData.somatic_coherence?.pre_session));
  container.appendChild(createSomaticCoherenceAssessment('post', existingData.somatic_coherence?.post_session));
  container.appendChild(createResponseQualityAssessment(existingData.response_quality));
  container.appendChild(createMeaningMakingAssessment(existingData.meaning_making));
  container.appendChild(createEmergencePatternsSection(existingData.emergence_patterns?.session_outcome));

  return step;
}

/**
 * Initialize measurement framework functionality on a page
 * @param {HTMLElement} container - Container element to search within
 */
export function initMeasurementFrameworks(container = document) {
  // Add event listeners for real-time data collection
  container.addEventListener('scaleChange', (e) => {
    // Custom event handling for real-time updates
    console.log('Scale updated:', e.detail);
  });

  // Add CSS classes for styling if not already present
  if (!document.querySelector('#measurement-frameworks-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'measurement-frameworks-styles';
    styleElement.textContent = `
      .measurement-section {
        margin: 2rem 0;
        padding: 1.5rem;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        background: #fafafa;
      }
      
      .measurement-section-header h3 {
        margin: 0 0 0.5rem 0;
        color: #333;
      }
      
      .section-description {
        color: #666;
        font-style: italic;
        margin-bottom: 1.5rem;
      }
      
      .scale-widget {
        margin: 1rem 0;
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: white;
      }
      
      .scale-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }
      
      .scale-label {
        font-weight: bold;
        color: #333;
      }
      
      .scale-value {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--accent-color, #8b5e3c);
        min-width: 2rem;
        text-align: center;
      }
      
      .scale-question {
        color: #555;
        margin-bottom: 1rem;
        font-style: italic;
      }
      
      .scale-container {
        position: relative;
      }
      
      .scale-slider {
        width: 100%;
        margin: 0.5rem 0;
      }
      
      .scale-labels {
        display: flex;
        justify-content: space-between;
        font-size: 0.9rem;
        color: #666;
      }
      
      .scale-description {
        font-size: 0.8rem;
        color: #888;
        margin-top: 0.5rem;
      }
      
      .metric-group {
        margin: 1rem 0;
      }
      
      .metric-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: bold;
      }
      
      .count-input, .quality-slider {
        width: 100%;
        max-width: 200px;
      }
      
      .slider-value {
        margin-left: 1rem;
        font-weight: bold;
        color: #007acc;
      }
      
      textarea {
        width: 100%;
        resize: vertical;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 0.5rem;
      }
    `;
    document.head.appendChild(styleElement);
  }
}