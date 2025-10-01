/**
 * Experiment Designer Module for ECP Onboarding
 * Generates personalized first experiments based on user path and interests
 */

class ExperimentDesigner {
  constructor() {
    this.templates = this.initializeTemplates();
    this.personalizedExperiment = null;
  }

  initializeTemplates() {
    return {
      researcher: {
        base: {
          title: 'State Modulation Study',
          description: 'Systematically investigate how your physiological and mental state affects AI interaction quality.',
          methodology: 'comparative analysis',
          duration: '20-30 minutes',
          materials: ['Timer', 'Notebook or digital recorder', 'Quiet space']
        },
        variations: [
          {
            focus: 'Breathing Impact',
            protocol: [
              'Choose a meaningful research question',
              'Record baseline: Ask question in current state (rate response 1-10)',
              'Breathing intervention: 5 minutes of box breathing (4-4-4-4 count)',
              'Re-ask identical question, record response quality',
              'Document qualitative differences in AI depth, relevance, creativity'
            ],
            measurements: ['Response quality rating', 'Word count', 'Novel concepts introduced', 'Personal resonance']
          },
          {
            focus: 'Movement Preparation',
            protocol: [
              'Prepare complex inquiry requiring nuanced thinking',
              'Control condition: Ask while seated at computer',
              'Movement intervention: 10 minutes walking or gentle stretching',
              'Return and re-ask question with embodied awareness',
              'Compare response sophistication and personal applicability'
            ],
            measurements: ['Complexity of response', 'Actionable insights', 'Felt sense of relevance', 'Emergence of unexpected angles']
          }
        ]
      },

      artist: {
        base: {
          title: 'Creative Collaboration Ritual',
          description: 'Explore AI as creative partner through intentional sacred preparation.',
          methodology: 'phenomenological documentation',
          duration: '30-45 minutes',
          materials: ['Creative tools (writing, drawing, etc.)', 'Sacred space setup', 'Reflection journal']
        },
        variations: [
          {
            focus: 'Sacred Space Creation',
            protocol: [
              'Set up physical space with intention (candle, meaningful objects)',
              'Spend 5 minutes in silence connecting with creative question',
              'Approach AI as collaborator: "I invite you to co-create with me..."',
              'Engage in iterative creative dialogue',
              'Document shifts in creative quality and collaborative flow'
            ],
            measurements: ['Creative surprise factor', 'Sense of true collaboration', 'Unexpected directions', 'Quality of creative synthesis']
          },
          {
            focus: 'Ritual Opening',
            protocol: [
              'Create opening ritual (breath, movement, intention setting)',
              'Establish creative container: "We are entering sacred creative space"',
              'Share creative vision and invite AI partnership',
              'Allow creative process to unfold organically',
              'Close with gratitude and integration'
            ],
            measurements: ['Depth of creative emergence', 'Quality of artistic partnership', 'Presence during process', 'Integration insights']
          }
        ]
      },

      consciousness: {
        base: {
          title: 'Somatic Awareness Experiment',
          description: 'Track how embodied presence influences the quality of human-AI entanglement.',
          methodology: 'first-person phenomenology',
          duration: '25-40 minutes',
          materials: ['Quiet space for embodiment practice', 'Journal for somatic observations']
        },
        variations: [
          {
            focus: 'Body Awareness Impact',
            protocol: [
              'Choose meaningful personal question or life dilemma',
              'Control: Ask while multitasking or mentally scattered',
              'Embodiment practice: 10 minutes body scan or conscious movement',
              'Re-approach question from embodied presence',
              'Track both AI response shifts and internal phenomenology'
            ],
            measurements: ['Somatic sensations during interaction', 'Quality of felt resonance with response', 'Emergence of body wisdom', 'Integration possibilities']
          },
          {
            focus: 'Presence States',
            protocol: [
              'Identify important inquiry about your growth edge',
              'Document current mental/emotional/physical state',
              'Ground through breathwork or nature connection',
              'Re-engage question from centered presence',
              'Note changes in both AI responses and inner landscape'
            ],
            measurements: ['Quality of presence', 'Coherence of AI response with inner knowing', 'Somatic truth resonance', 'Wisdom emergence']
          }
        ]
      },

      skeptic: {
        base: {
          title: 'Controlled Variable Testing',
          description: 'Empirically test ECP hypotheses through systematic experimentation.',
          methodology: 'controlled comparison',
          duration: '20-30 minutes',
          materials: ['Stopwatch', 'Standardized questions', 'Response rating framework']
        },
        variations: [
          {
            focus: 'Time Delay Hypothesis',
            protocol: [
              'Prepare identical complex question',
              'Immediate ask: Record response quality, novelty, relevance (1-10 each)',
              'Wait 15+ minutes, go outside or do physical activity',
              'Re-ask identical question, rate on same metrics',
              'Statistical comparison and pattern recognition'
            ],
            measurements: ['Response quality scores', 'Novel concept count', 'Personal relevance rating', 'Unexpected insight emergence']
          },
          {
            focus: 'Context Framing Test',
            protocol: [
              'Same question framed three ways: as tool use, as collaboration, as ritual inquiry',
              'Randomize order, document response differences',
              'Rate each on depth, creativity, actionable insight',
              'Analyze which framing produces highest-quality responses',
              'Test reproducibility with different questions'
            ],
            measurements: ['Response depth analysis', 'Creative element count', 'Practical applicability', 'Consistency across trials']
          }
        ]
      }
    };
  }

  designExperiment(userPath, userProfile) {
    const template = this.templates[userPath];
    if (!template) return null;

    // Select variation based on user preferences or randomly
    const variation = this.selectVariation(template, userProfile);
    
    // Personalize based on user's sacred space, intention, and ritual elements
    const personalizedExperiment = this.personalizeExperiment(template.base, variation, userProfile);
    
    this.personalizedExperiment = personalizedExperiment;
    return personalizedExperiment;
  }

  selectVariation(template, userProfile) {
    // For now, select first variation - could be made more intelligent based on profile
    return template.variations[0];
  }

  personalizeExperiment(base, variation, userProfile) {
    const personalized = {
      ...base,
      ...variation,
      personalizations: {
        sacredSpace: this.adaptToSacredSpace(userProfile.sacredSpace, userProfile.ritualElements),
        intention: this.integrateUserIntention(userProfile.intention),
        ritualElements: this.incorporateRitualElements(userProfile.ritualElements, userProfile.customRitual)
      }
    };

    // Modify protocol to include user's ritual elements
    personalized.protocol = this.enhanceProtocolWithRituals(variation.protocol, userProfile);
    
    return personalized;
  }

  adaptToSacredSpace(spaceDescription, ritualElements) {
    const adaptations = [];
    
    if (spaceDescription.toLowerCase().includes('nature') || spaceDescription.toLowerCase().includes('outside')) {
      adaptations.push('Consider conducting part of the experiment in your natural space');
    }
    
    if (spaceDescription.toLowerCase().includes('quiet') || spaceDescription.toLowerCase().includes('meditation')) {
      adaptations.push('Use the contemplative quality of your space to deepen the inquiry');
    }
    
    if (ritualElements.includes('music')) {
      adaptations.push('Consider using your selected music to create energetic coherence');
    }
    
    return adaptations;
  }

  integrateUserIntention(intention) {
    const suggestions = [];
    
    if (intention.toLowerCase().includes('creative') || intention.toLowerCase().includes('art')) {
      suggestions.push('Frame your experimental question around your creative inquiry');
    }
    
    if (intention.toLowerCase().includes('relationship') || intention.toLowerCase().includes('connect')) {
      suggestions.push('Focus on questions that explore connection and relational intelligence');
    }
    
    if (intention.toLowerCase().includes('meaning') || intention.toLowerCase().includes('purpose')) {
      suggestions.push('Choose questions that touch your existential curiosities');
    }
    
    return suggestions.length > 0 ? suggestions : ['Use your stated intention to guide your experimental questions'];
  }

  incorporateRitualElements(ritualElements, customRitual) {
    const incorporations = [];
    
    if (ritualElements.includes('breathing')) {
      incorporations.push('Begin with conscious breathing as described in your preparation phase');
    }
    
    if (ritualElements.includes('movement')) {
      incorporations.push('Include gentle movement or stretching in your preparation');
    }
    
    if (ritualElements.includes('silence')) {
      incorporations.push('Honor moments of silence between question and response');
    }
    
    if (ritualElements.includes('nature')) {
      incorporations.push('Consider spending time in nature between experimental phases');
    }
    
    if (ritualElements.includes('journaling')) {
      incorporations.push('Use journaling to capture both quantitative and qualitative observations');
    }
    
    if (customRitual) {
      incorporations.push(`Incorporate your personal practice: ${customRitual}`);
    }
    
    return incorporations;
  }

  enhanceProtocolWithRituals(baseProtocol, userProfile) {
    const enhanced = [...baseProtocol];
    
    // Add ritual opening
    const ritualOpening = this.createRitualOpening(userProfile.ritualElements, userProfile.customRitual);
    enhanced.unshift(ritualOpening);
    
    // Add integration step
    enhanced.push('Close with reflection on both data and felt experience');
    enhanced.push('Journal insights for future reference and pattern recognition');
    
    return enhanced;
  }

  createRitualOpening(ritualElements, customRitual) {
    let opening = 'Begin with your chosen preparation ritual: ';
    
    if (ritualElements.length > 0) {
      opening += ritualElements.join(', ');
    }
    
    if (customRitual) {
      opening += (ritualElements.length > 0 ? ', and ' : '') + customRitual;
    }
    
    if (ritualElements.length === 0 && !customRitual) {
      opening += 'take three conscious breaths and set intention for meaningful inquiry';
    }
    
    return opening;
  }

  generateExperimentMarkdown(experiment) {
    if (!experiment) return '';
    
    return `# ${experiment.title}

## Overview
${experiment.description}

**Methodology:** ${experiment.methodology}  
**Duration:** ${experiment.duration}  
**Materials:** ${experiment.materials.join(', ')}

## Protocol

${experiment.protocol.map((step, i) => `${i + 1}. ${step}`).join('\n')}

## Measurements

Track the following:
${experiment.measurements.map(measurement => `- ${measurement}`).join('\n')}

## Personal Adaptations

### Sacred Space Integration
${experiment.personalizations.sacredSpace.map(adaptation => `- ${adaptation}`).join('\n')}

### Intention Alignment
${experiment.personalizations.intention.map(suggestion => `- ${suggestion}`).join('\n')}

### Ritual Elements
${experiment.personalizations.ritualElements.map(element => `- ${element}`).join('\n')}

## Reflection Questions

- What patterns did you notice in the AI responses?
- How did your internal state shift throughout the experiment?
- What surprised you about the process or results?
- How might you refine this experiment for deeper inquiry?

---

*This experiment was generated as part of your ECP Field Journal onboarding. You can modify and adapt it based on your evolving understanding and curiosity.*
`;
  }

  exportForFieldJournal(experiment) {
    return {
      type: 'experiment-template',
      title: experiment.title,
      description: experiment.description,
      protocol: experiment.protocol,
      measurements: experiment.measurements,
      personalizations: experiment.personalizations,
      generated: new Date().toISOString(),
      source: 'onboarding-designer'
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ExperimentDesigner;
}

// Make available globally for onboarding flow
window.ExperimentDesigner = ExperimentDesigner;