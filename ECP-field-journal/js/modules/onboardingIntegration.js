/**
 * Onboarding Integration Module
 * Connects the onboarding experience with existing Field Journal systems
 */

class OnboardingIntegration {
  constructor() {
    this.userProfile = this.loadUserProfile();
    this.measurementFrameworks = null;
    this.workflowTemplates = null;
  }

  loadUserProfile() {
    try {
      const profileData = localStorage.getItem('ecpUserProfile');
      return profileData ? JSON.parse(profileData) : null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }

  /**
   * Integrate user's onboarding choices with measurement frameworks
   */
  integrateWithMeasurementFrameworks() {
    if (!this.userProfile) return;

    // Load existing measurement integration if available
    if (typeof MeasurementIntegration !== 'undefined') {
      const measurementIntegration = new MeasurementIntegration();
      
      // Customize measurement suggestions based on user path
      const pathMeasurements = this.getPathSpecificMeasurements();
      measurementIntegration.addCustomMeasurements(pathMeasurements);
    }
  }

  getPathSpecificMeasurements() {
    if (!this.userProfile?.selectedPath) return {};

    const pathMeasurements = {
      researcher: {
        suggested: [
          'Response Quality Rating (1-10)',
          'Novel Concept Count',
          'Practical Applicability Score',
          'State Preparation Duration',
          'Subjective Coherence Rating'
        ],
        frameworks: ['quantitative', 'comparative', 'temporal']
      },
      artist: {
        suggested: [
          'Creative Surprise Factor (1-10)', 
          'Collaborative Flow Rating',
          'Emergent Insight Quality',
          'Ritual Preparation Effectiveness',
          'Integration Completeness'
        ],
        frameworks: ['phenomenological', 'qualitative', 'creative-flow']
      },
      consciousness: {
        suggested: [
          'Embodied Presence Rating (1-10)',
          'Somatic Awareness Shifts',
          'Inner-Outer Coherence',
          'Wisdom Emergence Quality',
          'Integration Depth'
        ],
        frameworks: ['somatic', 'phenomenological', 'contemplative']
      },
      skeptic: {
        suggested: [
          'Response Quality Delta',
          'Reproducibility Score',
          'Control Variable Isolation',
          'Statistical Significance',
          'Bias Detection Rating'
        ],
        frameworks: ['quantitative', 'comparative', 'statistical']
      }
    };

    return pathMeasurements[this.userProfile.selectedPath] || pathMeasurements.researcher;
  }

  /**
   * Create personalized workflow templates based on onboarding
   */
  generatePersonalizedTemplates() {
    if (!this.userProfile) return {};

    const baseTemplate = this.createBaseTemplate();
    const pathSpecificTemplate = this.createPathSpecificTemplate();
    const ritualTemplate = this.createRitualTemplate();

    return {
      base: baseTemplate,
      pathSpecific: pathSpecificTemplate,
      ritual: ritualTemplate,
      combined: this.combineTemplates(baseTemplate, pathSpecificTemplate, ritualTemplate)
    };
  }

  createBaseTemplate() {
    return {
      title: `${this.userProfile?.selectedPath || 'Personal'} ECP Template`,
      description: 'Generated from your onboarding profile',
      phases: [
        {
          name: 'Preparation',
          duration: '5-10 minutes',
          activities: this.getUserRitualActivities()
        },
        {
          name: 'Inquiry',
          duration: '15-25 minutes', 
          activities: ['Formulate question', 'Engage with AI', 'Document responses']
        },
        {
          name: 'Integration',
          duration: '5-15 minutes',
          activities: ['Reflect on experience', 'Note insights', 'Plan next steps']
        }
      ]
    };
  }

  createPathSpecificTemplate() {
    const pathTemplates = {
      researcher: {
        focus: 'Systematic experimentation',
        keyElements: [
          'Hypothesis formation',
          'Variable control',
          'Data collection',
          'Result analysis'
        ],
        measurements: this.getPathSpecificMeasurements().suggested
      },
      artist: {
        focus: 'Creative collaboration',
        keyElements: [
          'Creative intention setting',
          'Collaborative dialogue',
          'Emergent documentation',
          'Aesthetic integration'
        ],
        measurements: this.getPathSpecificMeasurements().suggested
      },
      consciousness: {
        focus: 'Embodied awareness',
        keyElements: [
          'Somatic preparation',
          'Presence cultivation',
          'Phenomenological observation',
          'Wisdom integration'
        ],
        measurements: this.getPathSpecificMeasurements().suggested
      },
      skeptic: {
        focus: 'Empirical testing',
        keyElements: [
          'Hypothesis testing',
          'Control conditions',
          'Objective measurement',
          'Critical analysis'
        ],
        measurements: this.getPathSpecificMeasurements().suggested
      }
    };

    return pathTemplates[this.userProfile?.selectedPath] || pathTemplates.researcher;
  }

  createRitualTemplate() {
    const ritualElements = this.userProfile?.ritualElements || [];
    const customRitual = this.userProfile?.customRitual || '';

    return {
      title: 'Your Personalized Ritual Container',
      elements: ritualElements,
      customPractice: customRitual,
      sacredSpace: this.userProfile?.sacredSpace,
      intention: this.userProfile?.intention,
      sequence: this.generateRitualSequence(ritualElements, customRitual)
    };
  }

  generateRitualSequence(elements, customRitual) {
    const sequence = [];
    
    // Opening
    sequence.push({
      step: 'Opening',
      description: 'Arrive in your sacred space with intention',
      duration: '1-2 minutes'
    });

    // Breathing (if selected)
    if (elements.includes('breathing')) {
      sequence.push({
        step: 'Conscious Breathing',
        description: '3-5 conscious breaths or box breathing',
        duration: '2-3 minutes'
      });
    }

    // Movement (if selected)
    if (elements.includes('movement')) {
      sequence.push({
        step: 'Embodiment',
        description: 'Gentle movement or stretching to arrive in body',
        duration: '3-5 minutes'
      });
    }

    // Silence (if selected)
    if (elements.includes('silence')) {
      sequence.push({
        step: 'Presence',
        description: 'Moment of stillness and inner listening',
        duration: '2-3 minutes'
      });
    }

    // Nature (if selected)
    if (elements.includes('nature')) {
      sequence.push({
        step: 'Natural Connection',
        description: 'Connect with natural elements or go outside briefly',
        duration: '3-5 minutes'
      });
    }

    // Journaling (if selected)
    if (elements.includes('journaling')) {
      sequence.push({
        step: 'Intention Setting',
        description: 'Brief journaling to clarify inquiry',
        duration: '2-3 minutes'
      });
    }

    // Custom ritual
    if (customRitual) {
      sequence.push({
        step: 'Personal Practice',
        description: customRitual,
        duration: 'As needed'
      });
    }

    // Closing preparation
    sequence.push({
      step: 'Inquiry Preparation',
      description: 'Final centering before engaging with AI',
      duration: '1 minute'
    });

    return sequence;
  }

  getUserRitualActivities() {
    if (!this.userProfile?.ritualElements) return ['Take three conscious breaths'];
    
    const activities = [];
    const elements = this.userProfile.ritualElements;
    
    if (elements.includes('breathing')) activities.push('Conscious breathing');
    if (elements.includes('movement')) activities.push('Gentle movement');
    if (elements.includes('silence')) activities.push('Moment of silence');
    if (elements.includes('nature')) activities.push('Natural connection');
    if (elements.includes('journaling')) activities.push('Intention setting');
    
    if (this.userProfile.customRitual) {
      activities.push(this.userProfile.customRitual);
    }
    
    return activities.length > 0 ? activities : ['Take three conscious breaths'];
  }

  combineTemplates(base, pathSpecific, ritual) {
    return {
      ...base,
      focus: pathSpecific.focus,
      ritualContainer: ritual,
      measurements: pathSpecific.measurements,
      keyElements: pathSpecific.keyElements,
      generatedFrom: 'onboarding-profile',
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Pre-populate experiment entry form based on user's designed experiment
   */
  prefillExperimentForm() {
    if (!this.userProfile?.experimentDesign) return;

    const experiment = this.userProfile.experimentDesign;
    const formData = {
      title: experiment.title,
      description: experiment.description,
      protocol: experiment.protocol.join('\n'),
      measurements: experiment.measurements.join(', '),
      duration: experiment.duration,
      materials: experiment.materials ? experiment.materials.join(', ') : '',
      methodology: experiment.methodology || 'mixed-methods'
    };

    // Store for experiment entry form to pick up
    sessionStorage.setItem('prefillExperimentData', JSON.stringify(formData));
  }

  /**
   * Add onboarding context to reflection entries
   */
  enhanceReflectionContext() {
    if (!this.userProfile) return {};

    return {
      userPath: this.userProfile.selectedPath,
      practiceContext: {
        sacredSpace: this.userProfile.sacredSpace,
        intention: this.userProfile.intention,
        ritualElements: this.userProfile.ritualElements
      },
      suggestedReflections: this.getPathSpecificReflections()
    };
  }

  getPathSpecificReflections() {
    const reflections = {
      researcher: [
        'What patterns am I noticing in AI responses based on my state?',
        'How might I refine my experimental methodology?',
        'What variables am I not accounting for?'
      ],
      artist: [
        'How did the collaborative quality feel different today?',
        'What creative surprises emerged?', 
        'How is my ritual practice evolving?'
      ],
      consciousness: [
        'What shifts did I notice in my embodied awareness?',
        'How did presence affect the quality of interaction?',
        'What wisdom wants to be integrated?'
      ],
      skeptic: [
        'What evidence am I gathering about ECP claims?',
        'What alternative explanations might account for results?',
        'How can I design better controls?'
      ]
    };

    return reflections[this.userProfile?.selectedPath] || reflections.researcher;
  }

  /**
   * Create dashboard customization based on user preferences
   */
  customizeDashboard() {
    if (!this.userProfile) return {};

    return {
      primaryMetrics: this.getPathSpecificMeasurements().suggested.slice(0, 3),
      frameworks: this.getPathSpecificMeasurements().frameworks,
      focusAreas: this.createPathSpecificTemplate().keyElements,
      ritualTracking: {
        elements: this.userProfile.ritualElements,
        effectivenessMetric: 'Preparation Quality (1-10)'
      },
      personalizedInsights: true
    };
  }

  /**
   * Integration API for existing systems
   */
  getIntegrationData() {
    return {
      userProfile: this.userProfile,
      templates: this.generatePersonalizedTemplates(),
      measurements: this.getPathSpecificMeasurements(),
      dashboardConfig: this.customizeDashboard(),
      reflectionContext: this.enhanceReflectionContext()
    };
  }

  /**
   * Save integration data for other modules to access
   */
  saveIntegrationData() {
    const integrationData = this.getIntegrationData();
    localStorage.setItem('ecpIntegrationData', JSON.stringify(integrationData));
    return integrationData;
  }

  /**
   * Load integration data in other modules
   */
  static loadIntegrationData() {
    try {
      const data = localStorage.getItem('ecpIntegrationData');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading integration data:', error);
      return null;
    }
  }
}

// Initialize and save integration data on page load
document.addEventListener('DOMContentLoaded', () => {
  const integration = new OnboardingIntegration();
  integration.saveIntegrationData();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OnboardingIntegration;
}

// Make available globally
window.OnboardingIntegration = OnboardingIntegration;