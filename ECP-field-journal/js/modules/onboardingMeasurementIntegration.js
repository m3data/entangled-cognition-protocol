/**
 * Onboarding Measurement Integration
 * Connects onboarding profile to measurement frameworks and templates
 */

class OnboardingMeasurementIntegration {
  constructor() {
    this.integrationData = null;
    this.init();
  }

  init() {
    this.integrationData = OnboardingIntegration.loadIntegrationData();
    if (this.integrationData) {
      this.enhanceExperimentEntry();
      this.enhanceMeasurementDashboard();
      this.enhanceWorkflowTemplates();
    }
  }

  /**
   * Enhance experiment entry form with onboarding context
   */
  enhanceExperimentEntry() {
    // Check if we're on experiment entry page
    if (!window.location.pathname.includes('experiment-entry.html')) return;

    // Pre-fill experiment form if data available
    const prefillData = sessionStorage.getItem('prefillExperimentData');
    if (prefillData) {
      this.prefillExperimentForm(JSON.parse(prefillData));
    }

    // Add personalized measurement suggestions
    this.addPersonalizedMeasurements();
    
    // Add ritual preparation reminder
    this.addRitualPreparationSection();
  }

  prefillExperimentForm(data) {
    setTimeout(() => {
      const titleField = document.querySelector('#experiment-title, [name="title"]');
      const descField = document.querySelector('#experiment-description, [name="description"]');
      const protocolField = document.querySelector('#experiment-protocol, [name="protocol"]');
      
      if (titleField && data.title) titleField.value = data.title;
      if (descField && data.description) descField.value = data.description;
      if (protocolField && data.protocol) protocolField.value = data.protocol;
      
      // Clear the session data after use
      sessionStorage.removeItem('prefillExperimentData');
    }, 100);
  }

  addPersonalizedMeasurements() {
    if (!this.integrationData?.measurements) return;

    const measurementSection = document.querySelector('.measurement-section, #measurement-frameworks');
    if (!measurementSection) return;

    const personalizedMeasurements = document.createElement('div');
    personalizedMeasurements.className = 'personalized-measurements';
    personalizedMeasurements.innerHTML = `
      <h3>Recommended for Your Path</h3>
      <p class="measurement-intro">Based on your ${this.integrationData.userProfile.selectedPath} focus:</p>
      <div class="suggested-measurements">
        ${this.integrationData.measurements.suggested.map(measurement => `
          <label class="measurement-suggestion">
            <input type="checkbox" value="${measurement}" name="suggested-measurements">
            <span>${measurement}</span>
          </label>
        `).join('')}
      </div>
    `;

    measurementSection.prepend(personalizedMeasurements);
    this.bindMeasurementSuggestions();
  }

  bindMeasurementSuggestions() {
    document.querySelectorAll('.measurement-suggestion input').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.addMeasurementToForm(e.target.value);
        }
      });
    });
  }

  addMeasurementToForm(measurement) {
    // Find measurement frameworks section and add this measurement
    const measurementFrameworks = document.querySelector('#measurement-frameworks-container');
    if (measurementFrameworks && typeof initMeasurementFrameworks === 'function') {
      // If measurement frameworks are available, add this measurement type
      const measurementWidget = this.createMeasurementWidget(measurement);
      if (measurementWidget) {
        measurementFrameworks.appendChild(measurementWidget);
      }
    }
  }

  createMeasurementWidget(measurement) {
    const widget = document.createElement('div');
    widget.className = 'measurement-widget personalized';
    widget.innerHTML = `
      <h4>${measurement}</h4>
      <div class="measurement-scale">
        <label>Rate from 1 (low) to 10 (high):</label>
        <input type="range" min="1" max="10" value="5" class="measurement-slider" name="${measurement.toLowerCase().replace(/\s+/g, '-')}">
        <div class="scale-labels">
          <span>1</span><span>5</span><span>10</span>
        </div>
      </div>
      <textarea placeholder="Optional notes about ${measurement.toLowerCase()}..." class="measurement-notes"></textarea>
    `;
    
    return widget;
  }

  addRitualPreparationSection() {
    if (!this.integrationData?.userProfile?.ritualElements) return;

    const experimentForm = document.querySelector('form, .experiment-form');
    if (!experimentForm) return;

    const ritualSection = document.createElement('fieldset');
    ritualSection.className = 'ritual-preparation-section';
    ritualSection.innerHTML = `
      <legend>Your Ritual Preparation</legend>
      <p>Based on your onboarding, your preparation ritual includes:</p>
      <div class="ritual-checklist">
        ${this.generateRitualChecklist()}
      </div>
      <div class="preparation-reflection">
        <label>How effective was your preparation today? (1-10)</label>
        <input type="range" min="1" max="10" value="5" name="preparation-effectiveness" class="preparation-slider">
        <textarea placeholder="Any notes about your preparation process..." name="preparation-notes" class="preparation-notes"></textarea>
      </div>
    `;

    // Insert before the main experiment fields
    const firstFieldset = experimentForm.querySelector('fieldset');
    if (firstFieldset) {
      experimentForm.insertBefore(ritualSection, firstFieldset);
    } else {
      experimentForm.prepend(ritualSection);
    }
  }

  generateRitualChecklist() {
    const elements = this.integrationData.userProfile.ritualElements;
    const custom = this.integrationData.userProfile.customRitual;
    
    let checklist = elements.map(element => `
      <label class="ritual-item">
        <input type="checkbox" name="ritual-completed" value="${element}">
        <span>${this.formatRitualElement(element)}</span>
      </label>
    `).join('');
    
    if (custom) {
      checklist += `
        <label class="ritual-item">
          <input type="checkbox" name="ritual-completed" value="custom">
          <span>${custom}</span>
        </label>
      `;
    }
    
    return checklist;
  }

  formatRitualElement(element) {
    const formatted = {
      'breathing': 'Conscious breathing',
      'movement': 'Movement or stretching',
      'silence': 'Moment of silence',
      'nature': 'Connection with nature',
      'journaling': 'Intention setting/journaling',
      'music': 'Music or sound'
    };
    
    return formatted[element] || element;
  }

  /**
   * Enhance measurement dashboard with personalized insights
   */
  enhanceMeasurementDashboard() {
    if (!window.location.pathname.includes('measurement-dashboard.html')) return;

    this.addPersonalizedDashboardSections();
    this.addPathSpecificAnalytics();
  }

  addPersonalizedDashboardSections() {
    const dashboard = document.querySelector('.dashboard-content, .measurement-dashboard');
    if (!dashboard || !this.integrationData) return;

    const personalizedSection = document.createElement('div');
    personalizedSection.className = 'personalized-dashboard-section';
    personalizedSection.innerHTML = `
      <div class="user-profile-summary">
        <h3>Your ECP Practice Profile</h3>
        <div class="profile-grid">
          <div class="profile-item">
            <strong>Path:</strong> ${this.getPathDisplayName()}
          </div>
          <div class="profile-item">
            <strong>Focus:</strong> ${this.integrationData.templates.pathSpecific.focus}
          </div>
          <div class="profile-item">
            <strong>Ritual Elements:</strong> ${this.formatRitualElements()}
          </div>
        </div>
      </div>
      
      <div class="recommended-metrics">
        <h4>Recommended Metrics for Your Path</h4>
        <div class="metrics-grid">
          ${this.integrationData.dashboardConfig.primaryMetrics.map(metric => `
            <div class="metric-card">
              <h5>${metric}</h5>
              <p class="metric-status">Track this in your experiments</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    dashboard.prepend(personalizedSection);
  }

  addPathSpecificAnalytics() {
    // Add path-specific analysis widgets to dashboard
    const analyticsSection = document.querySelector('.analytics-section, #advanced-analytics');
    if (!analyticsSection || !this.integrationData) return;

    const pathAnalytics = document.createElement('div');
    pathAnalytics.className = 'path-specific-analytics';
    pathAnalytics.innerHTML = `
      <h3>${this.getPathDisplayName()} Analytics</h3>
      <div class="analytics-focus">
        ${this.generatePathSpecificAnalytics()}
      </div>
    `;

    analyticsSection.appendChild(pathAnalytics);
  }

  generatePathSpecificAnalytics() {
    const path = this.integrationData.userProfile.selectedPath;
    
    const analytics = {
      researcher: `
        <div class="research-analytics">
          <h4>State-Response Correlations</h4>
          <p>Track how different preparation states affect AI response quality</p>
          <div class="correlation-placeholder">Correlation analysis will appear here as you collect more data</div>
        </div>
      `,
      artist: `
        <div class="creative-analytics">
          <h4>Creative Flow Patterns</h4>
          <p>Monitor creative collaboration quality and emergent insights</p>
          <div class="flow-pattern-placeholder">Creative flow patterns will appear here as you collect more data</div>
        </div>
      `,
      consciousness: `
        <div class="consciousness-analytics">
          <h4>Embodiment-Insight Correlations</h4>
          <p>Track how somatic awareness affects depth of insights</p>
          <div class="embodiment-placeholder">Embodiment patterns will appear here as you collect more data</div>
        </div>
      `,
      skeptic: `
        <div class="skeptical-analytics">
          <h4>Evidence Accumulation</h4>
          <p>Statistical analysis of your experimental findings</p>
          <div class="evidence-placeholder">Statistical evidence will appear here as you collect more data</div>
        </div>
      `
    };

    return analytics[path] || analytics.researcher;
  }

  /**
   * Enhance workflow templates with personalized options
   */
  enhanceWorkflowTemplates() {
    if (!window.location.pathname.includes('workflow-templates.html')) return;

    this.addPersonalizedTemplates();
    this.highlightRecommendedTemplates();
  }

  addPersonalizedTemplates() {
    const templatesContainer = document.querySelector('.templates-container, .workflow-templates');
    if (!templatesContainer || !this.integrationData) return;

    const personalizedSection = document.createElement('div');
    personalizedSection.className = 'personalized-templates-section';
    personalizedSection.innerHTML = `
      <div class="user-template-section">
        <h3>Your Personalized Template</h3>
        <p>Based on your onboarding profile and chosen path</p>
        <div class="personal-template-card">
          <h4>${this.integrationData.templates.combined.title}</h4>
          <p>${this.integrationData.templates.combined.description || 'Generated from your onboarding profile'}</p>
          <div class="template-preview">
            <strong>Focus:</strong> ${this.integrationData.templates.combined.focus}<br>
            <strong>Key Elements:</strong> ${this.integrationData.templates.combined.keyElements.join(', ')}
          </div>
          <button class="use-template-btn" data-template="personal">Use This Template</button>
        </div>
      </div>
    `;

    templatesContainer.prepend(personalizedSection);
    this.bindPersonalizedTemplateButtons();
  }

  bindPersonalizedTemplateButtons() {
    document.querySelectorAll('[data-template="personal"]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.loadPersonalizedTemplate();
      });
    });
  }

  loadPersonalizedTemplate() {
    // Store personalized template data for experiment entry form
    const templateData = {
      title: this.integrationData.templates.combined.title,
      description: this.integrationData.templates.combined.description,
      protocol: this.integrationData.templates.combined.phases?.map(phase => 
        `${phase.name}: ${phase.activities.join(', ')}`
      ).join('\n') || 'Your personalized protocol',
      measurements: this.integrationData.templates.combined.measurements.join(', '),
      source: 'personalized-onboarding'
    };

    sessionStorage.setItem('prefillExperimentData', JSON.stringify(templateData));
    window.location.href = 'experiment-entry.html';
  }

  highlightRecommendedTemplates() {
    if (!this.integrationData) return;

    const path = this.integrationData.userProfile.selectedPath;
    const recommendedTemplates = this.getRecommendedTemplatesForPath(path);
    
    recommendedTemplates.forEach(templateName => {
      const templateCard = document.querySelector(`[data-template="${templateName}"], .template-card:contains("${templateName}")`);
      if (templateCard) {
        templateCard.classList.add('recommended-for-path');
        templateCard.insertAdjacentHTML('afterbegin', 
          '<div class="recommendation-badge">Recommended for you</div>'
        );
      }
    });
  }

  getRecommendedTemplatesForPath(path) {
    const recommendations = {
      researcher: ['Systematic State Study', 'Comparative Analysis', 'Variable Control'],
      artist: ['Creative Collaboration', 'Emergent Dialogue', 'Aesthetic Inquiry'],
      consciousness: ['Somatic Awareness', 'Contemplative Inquiry', 'Embodied Research'],
      skeptic: ['Controlled Experiment', 'Evidence Collection', 'Hypothesis Testing']
    };

    return recommendations[path] || recommendations.researcher;
  }

  // Utility methods
  getPathDisplayName() {
    const names = {
      researcher: 'Rigorous Researcher',
      artist: 'Creative Explorer',
      consciousness: 'Consciousness Explorer',
      skeptic: 'Curious Skeptic'
    };

    return names[this.integrationData.userProfile.selectedPath] || 'Explorer';
  }

  formatRitualElements() {
    if (!this.integrationData.userProfile.ritualElements) return 'Custom practices';
    
    return this.integrationData.userProfile.ritualElements.map(element => 
      this.formatRitualElement(element)
    ).join(', ');
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  new OnboardingMeasurementIntegration();
});

// Add CSS for personalized elements
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    .personalized-measurements {
      background: rgba(125, 162, 109, 0.1);
      border: 2px solid var(--green-soft);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .personalized-measurements h3 {
      color: var(--green-soft);
      margin-bottom: 1rem;
      font-family: var(--font-title);
    }
    
    .measurement-intro {
      font-style: italic;
      margin-bottom: 1.5rem;
      color: var(--text-color);
    }
    
    .suggested-measurements {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }
    
    .measurement-suggestion {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .measurement-suggestion:hover {
      background: rgba(255, 255, 255, 0.9);
      transform: translateY(-2px);
    }
    
    .measurement-widget.personalized {
      border-left: 4px solid var(--green-soft);
    }
    
    .ritual-preparation-section {
      background: rgba(245, 240, 235, 0.8);
      border: 2px solid var(--accent-color);
      border-radius: 12px;
      margin-bottom: 2rem;
    }
    
    .ritual-preparation-section legend {
      color: var(--accent-color);
      font-family: var(--font-title);
      font-weight: bold;
      padding: 0 1rem;
    }
    
    .ritual-checklist {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin: 1.5rem 0;
    }
    
    .ritual-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      background: white;
      border-radius: 6px;
      cursor: pointer;
    }
    
    .preparation-reflection {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px dashed var(--accent-color);
    }
    
    .preparation-slider {
      width: 100%;
      margin: 0.5rem 0 1rem 0;
    }
    
    .preparation-notes {
      width: 100%;
      min-height: 80px;
      padding: 0.75rem;
      border-radius: 6px;
      border: 1px solid #ddd;
      font-family: var(--font-body);
    }
    
    .personalized-dashboard-section {
      background: rgba(125, 162, 109, 0.1);
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
    }
    
    .user-profile-summary h3 {
      color: var(--green-soft);
      font-family: var(--font-title);
      margin-bottom: 1.5rem;
    }
    
    .profile-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    
    .profile-item {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      font-size: 0.95rem;
    }
    
    .recommended-metrics h4 {
      color: var(--accent-color);
      margin-bottom: 1rem;
    }
    
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
    }
    
    .metric-card {
      background: white;
      border: 2px solid var(--green-soft);
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
    }
    
    .metric-card h5 {
      color: var(--accent-color);
      margin-bottom: 0.5rem;
      font-size: 1rem;
    }
    
    .metric-status {
      font-size: 0.85rem;
      color: var(--text-color);
      font-style: italic;
      margin: 0;
    }
    
    .path-specific-analytics {
      background: rgba(255, 255, 255, 0.6);
      border-radius: 12px;
      padding: 2rem;
      margin-top: 2rem;
    }
    
    .path-specific-analytics h3 {
      color: var(--accent-color);
      font-family: var(--font-title);
      margin-bottom: 1.5rem;
    }
    
    .personalized-templates-section {
      background: linear-gradient(135deg, rgba(125, 162, 109, 0.1), rgba(245, 240, 235, 0.8));
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
    }
    
    .user-template-section h3 {
      color: var(--green-soft);
      font-family: var(--font-title);
      margin-bottom: 1rem;
    }
    
    .personal-template-card {
      background: white;
      border: 2px solid var(--green-soft);
      border-radius: 10px;
      padding: 1.5rem;
      margin-top: 1.5rem;
    }
    
    .personal-template-card h4 {
      color: var(--accent-color);
      margin-bottom: 1rem;
    }
    
    .template-preview {
      background: rgba(245, 240, 235, 0.5);
      padding: 1rem;
      border-radius: 6px;
      margin: 1rem 0;
      font-size: 0.9rem;
    }
    
    .use-template-btn {
      background: var(--green-soft);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
    }
    
    .use-template-btn:hover {
      background: var(--accent-color);
      transform: translateY(-2px);
    }
    
    .recommended-for-path {
      position: relative;
      border: 2px solid var(--green-soft) !important;
    }
    
    .recommendation-badge {
      position: absolute;
      top: -10px;
      right: 10px;
      background: var(--green-soft);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 15px;
      font-size: 0.8rem;
      font-weight: 500;
    }
    
    @media (max-width: 768px) {
      .suggested-measurements,
      .profile-grid,
      .metrics-grid {
        grid-template-columns: 1fr;
      }
      
      .ritual-checklist {
        grid-template-columns: 1fr;
      }
    }
  `;
  
  document.head.appendChild(style);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OnboardingMeasurementIntegration;
}