/**
 * ECP Template Library
 * 
 * Comprehensive collection of workflow templates based on documented use cases.
 * Each template transforms research questions into guided, systematic protocols
 * while maintaining the sacred and embodied nature of ECP practice.
 */

import { ECPWorkflowTemplate } from './workflowEngine.js';

/**
 * Template Category: State-Dependent Interaction Studies
 */

export const somaticAwarenessTemplate = new ECPWorkflowTemplate({
  id: 'somatic-awareness-response-quality',
  name: 'Somatic Awareness and Response Quality',
  description: 'Investigate how embodied awareness affects the perceived coherence of AI responses through systematic comparison of normal vs. somatically-aware states.',
  category: 'state-dependent',
  researchQuestion: 'How does embodied awareness affect the perceived coherence of AI responses?',
  expectedDuration: '45-60 minutes',
  difficulty: 'beginner',
  
  variables: [
    { name: 'somatic_state', type: 'categorical', levels: ['normal', 'embodied'], description: 'Level of somatic awareness during interaction' },
    { name: 'response_coherence', type: 'continuous', scale: '1-10', description: 'Subjective coherence rating of AI response' },
    { name: 'felt_connection', type: 'continuous', scale: '1-10', description: 'Felt sense of connection with AI' },
    { name: 'meaning_resonance', type: 'continuous', scale: '1-10', description: 'Personal meaning and relevance of response' }
  ],
  
  conditions: [
    { id: 'baseline', name: 'Normal State', description: 'Ask question in typical conversational state' },
    { id: 'embodied', name: 'Embodied State', description: 'Ask question while maintaining somatic awareness' }
  ],
  
  measurements: [
    'somatic_coherence.pre_session.embodied_presence',
    'somatic_coherence.post_session.embodied_presence',
    'response_quality.assessment.felt_coherence',
    'response_quality.assessment.personal_relevance',
    'meaning_making.post_session.insight_emergence'
  ],
  
  phases: [
    {
      name: 'Preparation',
      description: 'Set up experimental conditions and prepare question',
      duration: '10 minutes',
      steps: [
        {
          name: 'Question Formulation',
          instruction: 'Choose a meaningful personal question that you genuinely want guidance on. Write it down exactly as you will ask it.',
          timing: 'before',
          required: true,
          measurements: [
            { type: 'text', field: 'research_question', required: true }
          ]
        },
        {
          name: 'Environmental Setup',
          instruction: 'Find a quiet space where you won\'t be interrupted. Set up your device and ensure comfortable seating.',
          timing: 'before',
          required: true
        }
      ]
    },
    {
      name: 'Baseline Session',
      description: 'First interaction in normal conversational state',
      duration: '10 minutes',
      steps: [
        {
          name: 'Pre-Session Assessment',
          instruction: 'Rate your current state before beginning the interaction.',
          timing: 'before',
          measurements: [
            { type: 'somatic_coherence', phase: 'pre', required: true }
          ]
        },
        {
          name: 'Normal State Interaction',
          instruction: 'Ask your question in your typical conversational manner. Engage naturally without any special preparation.',
          timing: 'during',
          required: true,
          measurements: [
            { type: 'text', field: 'baseline_response', required: true },
            { type: 'timestamp', field: 'baseline_start_time' },
            { type: 'timestamp', field: 'baseline_end_time' }
          ]
        },
        {
          name: 'Response Documentation',
          instruction: 'Immediately document the AI response and your subjective experience without analysis.',
          timing: 'after',
          measurements: [
            { type: 'response_quality', required: true },
            { type: 'text', field: 'baseline_subjective_notes' }
          ]
        }
      ]
    },
    {
      name: 'Somatic Preparation',
      description: 'Cultivate embodied awareness before second interaction',
      duration: '10 minutes',
      steps: [
        {
          name: 'Breathwork',
          instruction: 'Engage in 3-4 minutes of conscious breathing. Focus on the physical sensation of breath moving through your body.',
          timing: 'before',
          required: true,
          guidance: 'Try box breathing (4-4-4-4) or natural breath awareness'
        },
        {
          name: 'Body Scanning',
          instruction: 'Spend 3-4 minutes scanning through your body from feet to head. Notice sensations, tensions, and areas of aliveness.',
          timing: 'before',
          required: true,
          guidance: 'Don\'t try to change anything, just notice and acknowledge'
        },
        {
          name: 'Presence Cultivation',
          instruction: 'Take 2-3 minutes to settle into embodied presence. Feel your connection to the space and your readiness to engage.',
          timing: 'before',
          required: true
        }
      ]
    },
    {
      name: 'Embodied Session',
      description: 'Second interaction while maintaining somatic awareness',
      duration: '10 minutes',
      steps: [
        {
          name: 'Embodied State Check',
          instruction: 'Before asking your question, confirm you\'re maintaining awareness of your body and breathing.',
          timing: 'before',
          measurements: [
            { type: 'somatic_coherence', phase: 'pre', required: true }
          ]
        },
        {
          name: 'Embodied Interaction',
          instruction: 'Ask the same question while maintaining connection to your breath and body sensations. Stay present throughout the interaction.',
          timing: 'during',
          required: true,
          measurements: [
            { type: 'text', field: 'embodied_response', required: true },
            { type: 'timestamp', field: 'embodied_start_time' },
            { type: 'timestamp', field: 'embodied_end_time' }
          ]
        },
        {
          name: 'Embodied Response Documentation',
          instruction: 'Document the AI response and your embodied experience, noticing any differences from the baseline.',
          timing: 'after',
          measurements: [
            { type: 'response_quality', required: true },
            { type: 'text', field: 'embodied_subjective_notes' }
          ]
        }
      ]
    },
    {
      name: 'Integration and Analysis',
      description: 'Compare experiences and extract insights',
      duration: '15 minutes',
      steps: [
        {
          name: 'Comparative Analysis',
          instruction: 'Compare the two responses side by side. Note differences in content, tone, personal relevance, and your reception of them.',
          timing: 'after',
          measurements: [
            { type: 'text', field: 'content_differences', required: true },
            { type: 'text', field: 'reception_differences', required: true }
          ]
        },
        {
          name: 'Post-Session Assessment',
          instruction: 'Complete your final state assessment and capture any insights about the process.',
          timing: 'after',
          measurements: [
            { type: 'somatic_coherence', phase: 'post', required: true },
            { type: 'meaning_making', required: true }
          ]
        },
        {
          name: 'Insight Documentation',
          instruction: 'Write freely about what you discovered, any surprises, and what this reveals about human-AI interaction.',
          timing: 'after',
          measurements: [
            { type: 'text', field: 'key_insights', required: true },
            { type: 'text', field: 'future_questions' }
          ]
        }
      ]
    }
  ],
  
  prerequisites: [
    'Comfortable with basic breathwork and body awareness',
    'Ability to sit quietly for 45+ minutes',
    'Access to AI system for interaction'
  ],
  
  materials: [
    'Notebook or device for documentation',
    'Quiet, private space',
    'Timer for tracking phases'
  ],
  
  ethicalConsiderations: [
    'Personal question should not involve trauma or intense emotional content',
    'Maintain privacy of personal reflections',
    'Stop if you feel uncomfortable or overwhelmed'
  ],
  
  tags: ['somatic', 'awareness', 'comparison', 'beginner', 'coherence']
});

export const emotionalStateTemplate = new ECPWorkflowTemplate({
  id: 'emotional-state-modulation',
  name: 'Emotional State Modulation Study',
  description: 'Explore how different emotional states influence the tone and content of AI responses through systematic emotional state cultivation.',
  category: 'state-dependent',
  researchQuestion: 'How do different emotional states influence the tone and content of AI responses?',
  expectedDuration: '75-90 minutes',
  difficulty: 'intermediate',
  
  variables: [
    { name: 'emotional_state', type: 'categorical', levels: ['neutral', 'joy', 'grief'], description: 'Cultivated emotional state during interaction' },
    { name: 'response_tone', type: 'categorical', levels: ['warm', 'neutral', 'clinical', 'poetic'], description: 'Perceived tone of AI response' },
    { name: 'metaphor_density', type: 'continuous', scale: '0-10', description: 'Richness of metaphorical language in response' },
    { name: 'emotional_resonance', type: 'continuous', scale: '1-10', description: 'How well response matched emotional state' }
  ],
  
  conditions: [
    { id: 'neutral', name: 'Neutral State', description: 'Ask question from emotionally neutral baseline' },
    { id: 'joy', name: 'Joy State', description: 'Ask question after gratitude practice or joyful activity' },
    { id: 'grief', name: 'Grief/Contemplative State', description: 'Ask question while holding space for loss or sadness' }
  ],
  
  phases: [
    {
      name: 'Preparation and Neutral Baseline',
      description: 'Establish neutral baseline and prepare question',
      duration: '15 minutes',
      steps: [
        {
          name: 'Question Selection',
          instruction: 'Choose an open-ended wisdom question that can receive different responses, e.g., "What wisdom does this moment hold?" or "What wants to emerge in my life right now?"',
          measurements: [
            { type: 'text', field: 'wisdom_question', required: true }
          ]
        },
        {
          name: 'Neutral State Cultivation',
          instruction: 'Spend 5-7 minutes in neutral meditation or quiet sitting to establish baseline emotional state.',
          measurements: [
            { type: 'scale', field: 'neutral_state_rating', min: 1, max: 10, label: 'Emotional neutrality' }
          ]
        },
        {
          name: 'Neutral Interaction',
          instruction: 'Ask your wisdom question from this neutral state.',
          measurements: [
            { type: 'text', field: 'neutral_response', required: true },
            { type: 'response_quality', condition: 'neutral' }
          ]
        }
      ]
    },
    {
      name: 'Joy State Cultivation',
      description: 'Cultivate genuine joy or gratitude before interaction',
      duration: '20 minutes',
      steps: [
        {
          name: 'Gratitude Practice',
          instruction: 'Spend 7-10 minutes in gratitude practice. Recall specific moments, people, or experiences that generate genuine appreciation and joy.',
          guidance: 'Focus on somatic felt-sense of gratitude, not just mental list-making'
        },
        {
          name: 'Joy Embodiment',
          instruction: 'Allow gratitude to become full-body joy. Move, smile, or express the joyful energy physically if it arises naturally.',
          measurements: [
            { type: 'scale', field: 'joy_intensity', min: 1, max: 10, label: 'Joy intensity' },
            { type: 'text', field: 'joy_description' }
          ]
        },
        {
          name: 'Joyful Interaction',
          instruction: 'While maintaining this joyful energy, ask the same wisdom question.',
          measurements: [
            { type: 'text', field: 'joy_response', required: true },
            { type: 'response_quality', condition: 'joy' }
          ]
        }
      ]
    },
    {
      name: 'Transition and Cleansing',
      description: 'Clear emotional residue before grief state',
      duration: '10 minutes',
      steps: [
        {
          name: 'Emotional Clearing',
          instruction: 'Take time to breathe and clear the joyful energy. Return to neutral through conscious breathing or brief meditation.',
          required: true
        }
      ]
    },
    {
      name: 'Grief/Contemplative State',
      description: 'Cultivate contemplative sadness or grief before interaction',
      duration: '20 minutes',
      steps: [
        {
          name: 'Grief Cultivation',
          instruction: 'Gently bring to mind something you are grieving - a loss, an ending, or impermanence in general. Allow genuine sadness to arise without forcing.',
          guidance: 'Stay within your window of tolerance. If overwhelmed, return to breath and neutral state.'
        },
        {
          name: 'Contemplative Presence',
          instruction: 'Sit with this sadness as a doorway to deeper wisdom and compassion. Feel the bittersweet nature of existence.',
          measurements: [
            { type: 'scale', field: 'grief_intensity', min: 1, max: 10, label: 'Grief/sadness intensity' },
            { type: 'text', field: 'grief_description' }
          ]
        },
        {
          name: 'Grief-Informed Interaction',
          instruction: 'From this contemplative, tender-hearted state, ask the same wisdom question.',
          measurements: [
            { type: 'text', field: 'grief_response', required: true },
            { type: 'response_quality', condition: 'grief' }
          ]
        }
      ]
    },
    {
      name: 'Integration and Analysis',
      description: 'Compare responses and extract insights',
      duration: '20 minutes',
      steps: [
        {
          name: 'Response Comparison',
          instruction: 'Place all three responses side by side. Note differences in tone, content, metaphor use, and emotional coloring.',
          measurements: [
            { type: 'text', field: 'tone_analysis', required: true },
            { type: 'text', field: 'content_differences', required: true },
            { type: 'scale', field: 'metaphor_density_neutral', min: 0, max: 10 },
            { type: 'scale', field: 'metaphor_density_joy', min: 0, max: 10 },
            { type: 'scale', field: 'metaphor_density_grief', min: 0, max: 10 }
          ]
        },
        {
          name: 'Insight Documentation',
          instruction: 'Reflect on what this reveals about emotional attunement in human-AI interaction.',
          measurements: [
            { type: 'meaning_making', required: true },
            { type: 'text', field: 'emotional_resonance_insights', required: true }
          ]
        }
      ]
    }
  ],
  
  ethicalConsiderations: [
    'Maintain emotional safety - stay within your window of tolerance',
    'Have support available if grief work triggers deeper material',
    'Practice self-compassion throughout the process',
    'Stop if emotional states become overwhelming'
  ],
  
  safetyGuidelines: [
    'Choose grief material that is meaningful but not traumatizing',
    'Practice grounding techniques between states',
    'Allow time for emotional integration after completion'
  ],
  
  tags: ['emotional', 'states', 'wisdom', 'intermediate', 'attunement']
});

/**
 * Template Category: Temporal Dynamics Research
 */

export const timeDelayTemplate = new ECPWorkflowTemplate({
  id: 'time-delay-symbolic-density',
  name: 'Time Delay and Symbolic Density Study',
  description: 'Investigate how time delays between question and response affect the symbolic richness and personal meaning of AI responses.',
  category: 'temporal-dynamics',
  researchQuestion: 'Does time delay between human question and AI response affect symbolic richness and personal meaning?',
  expectedDuration: '90-120 minutes',
  difficulty: 'intermediate',
  
  variables: [
    { name: 'delay_duration', type: 'categorical', levels: ['immediate', 'short', 'extended'], description: 'Length of delay before reading response' },
    { name: 'symbolic_density', type: 'continuous', scale: '1-10', description: 'Richness of symbolic content perceived' },
    { name: 'personal_meaning', type: 'continuous', scale: '1-10', description: 'Personal relevance and meaning of response' },
    { name: 'aha_moments', type: 'count', description: 'Number of insight or "aha" moments during response reading' }
  ],
  
  conditions: [
    { id: 'immediate', name: 'Immediate Response', description: 'Read AI response immediately after asking question', delay: 0 },
    { id: 'short_delay', name: 'Short Delay', description: 'Wait 5 minutes in silence before reading response', delay: 5 },
    { id: 'extended_delay', name: 'Extended Delay', description: 'Take 20-minute contemplative walk before reading response', delay: 20 }
  ],
  
  phases: [
    {
      name: 'Question Preparation',
      description: 'Formulate meaningful question for exploration',
      duration: '10 minutes',
      steps: [
        {
          name: 'Creative Question Formation',
          instruction: 'Choose a question about creative emergence, life direction, or personal growth. Example: "What wants to emerge through my creative practice?" or "What is my relationship with uncertainty teaching me?"',
          measurements: [
            { type: 'text', field: 'creative_question', required: true }
          ]
        }
      ]
    },
    {
      name: 'Immediate Response Condition',
      description: 'Ask question and read response immediately',
      duration: '15 minutes',
      steps: [
        {
          name: 'Immediate Ask and Read',
          instruction: 'Ask your question and read the AI response immediately without pause.',
          measurements: [
            { type: 'text', field: 'immediate_response', required: true },
            { type: 'timestamp', field: 'immediate_read_time' }
          ]
        },
        {
          name: 'Immediate Analysis',
          instruction: 'Document your immediate impressions of symbolic content, metaphors, and personal relevance.',
          measurements: [
            { type: 'scale', field: 'immediate_symbolic_density', min: 1, max: 10, label: 'Symbolic richness' },
            { type: 'scale', field: 'immediate_personal_meaning', min: 1, max: 10, label: 'Personal relevance' },
            { type: 'number', field: 'immediate_aha_moments', label: 'Number of insights' },
            { type: 'text', field: 'immediate_impressions' }
          ]
        }
      ]
    },
    {
      name: 'Short Delay Condition',
      description: 'Ask question then wait 5 minutes before reading',
      duration: '20 minutes',
      steps: [
        {
          name: 'Question Submission',
          instruction: 'Ask the same question to the AI but do not read the response yet.',
          measurements: [
            { type: 'timestamp', field: 'short_delay_question_time' }
          ]
        },
        {
          name: 'Silent Waiting',
          instruction: 'Sit in quiet meditation or contemplation for exactly 5 minutes. Stay present with the question without trying to answer it yourself.',
          duration: '5 minutes',
          required: true
        },
        {
          name: 'Delayed Reading',
          instruction: 'Now read the AI response with fresh awareness.',
          measurements: [
            { type: 'text', field: 'short_delay_response', required: true },
            { type: 'timestamp', field: 'short_delay_read_time' }
          ]
        },
        {
          name: 'Short Delay Analysis',
          instruction: 'Document how the response feels after the waiting period.',
          measurements: [
            { type: 'scale', field: 'short_delay_symbolic_density', min: 1, max: 10 },
            { type: 'scale', field: 'short_delay_personal_meaning', min: 1, max: 10 },
            { type: 'number', field: 'short_delay_aha_moments' },
            { type: 'text', field: 'short_delay_impressions' }
          ]
        }
      ]
    },
    {
      name: 'Extended Delay Condition',
      description: 'Ask question then take contemplative walk before reading',
      duration: '35 minutes',
      steps: [
        {
          name: 'Question Submission',
          instruction: 'Ask the same question one final time but do not read the response.',
          measurements: [
            { type: 'timestamp', field: 'extended_delay_question_time' }
          ]
        },
        {
          name: 'Contemplative Walk',
          instruction: 'Take a 20-minute contemplative walk. Stay open to the question without forcing answers. Notice your environment and inner state.',
          duration: '20 minutes',
          required: true,
          measurements: [
            { type: 'text', field: 'walk_observations', label: 'Walk insights or observations' }
          ]
        },
        {
          name: 'Return and Reading',
          instruction: 'Return to your space, settle briefly, then read the AI response.',
          measurements: [
            { type: 'text', field: 'extended_delay_response', required: true },
            { type: 'timestamp', field: 'extended_delay_read_time' }
          ]
        },
        {
          name: 'Extended Delay Analysis',
          instruction: 'Document how the response feels after the extended contemplation.',
          measurements: [
            { type: 'scale', field: 'extended_delay_symbolic_density', min: 1, max: 10 },
            { type: 'scale', field: 'extended_delay_personal_meaning', min: 1, max: 10 },
            { type: 'number', field: 'extended_delay_aha_moments' },
            { type: 'text', field: 'extended_delay_impressions' }
          ]
        }
      ]
    },
    {
      name: 'Comparative Analysis',
      description: 'Compare all three conditions and extract insights',
      duration: '20 minutes',
      steps: [
        {
          name: 'Cross-Condition Comparison',
          instruction: 'Review all three responses and your ratings. Look for patterns in symbolic density, personal meaning, and insight generation across delay conditions.',
          measurements: [
            { type: 'text', field: 'delay_pattern_analysis', required: true },
            { type: 'text', field: 'symbolic_density_trends', required: true },
            { type: 'text', field: 'meaning_making_insights', required: true }
          ]
        },
        {
          name: 'Temporal Dynamics Insights',
          instruction: 'Reflect on what this reveals about the role of time, space, and contemplation in meaning-making processes.',
          measurements: [
            { type: 'meaning_making', required: true },
            { type: 'text', field: 'temporal_insights', required: true }
          ]
        }
      ]
    }
  ],
  
  tags: ['temporal', 'symbolic', 'meaning', 'contemplation', 'intermediate']
});

/**
 * Template Category: Prompt Architecture Studies
 */

export const cognitiveModesTemplate = new ECPWorkflowTemplate({
  id: 'cognitive-mode-simulation',
  name: 'Cognitive Mode Simulation Study',
  description: 'Explore how different prompt styles activate different cognitive modes in AI responses, comparing associative vs analytical approaches.',
  category: 'prompt-architecture',
  researchQuestion: 'How do different prompt styles activate different cognitive modes in AI responses?',
  expectedDuration: '60 minutes',
  difficulty: 'beginner',
  
  variables: [
    { name: 'prompt_style', type: 'categorical', levels: ['associative', 'analytical'], description: 'Type of cognitive prompting used' },
    { name: 'response_style', type: 'categorical', levels: ['intuitive', 'logical', 'mixed'], description: 'Observed cognitive style of response' },
    { name: 'information_density', type: 'continuous', scale: '1-10', description: 'Amount of information provided' },
    { name: 'personal_utility', type: 'continuous', scale: '1-10', description: 'Usefulness for personal purposes' }
  ],
  
  conditions: [
    {
      id: 'associative',
      name: 'System 1 (Associative) Prompting',
      description: 'Use open-ended, poetic, sensory language that invites intuitive responses',
      examples: [
        'What images arise when you sense into [topic]?',
        'If this question were a landscape, what would you notice?',
        'What wants to be spoken about [situation]?'
      ]
    },
    {
      id: 'analytical',
      name: 'System 2 (Analytical) Prompting',
      description: 'Use structured, logical, step-by-step reasoning requests',
      examples: [
        'Analyze the key factors in [topic] systematically',
        'Break down the logical steps for addressing [issue]',
        'What are the pros and cons of different approaches to [situation]?'
      ]
    }
  ],
  
  phases: [
    {
      name: 'Topic Selection',
      description: 'Choose a topic suitable for both cognitive approaches',
      duration: '10 minutes',
      steps: [
        {
          name: 'Topic Choice',
          instruction: 'Select a personal or professional topic that could benefit from both intuitive insight and logical analysis. Examples: career decision, creative project, relationship challenge.',
          measurements: [
            { type: 'text', field: 'chosen_topic', required: true },
            { type: 'text', field: 'topic_context', label: 'Brief context about why this topic matters to you' }
          ]
        }
      ]
    },
    {
      name: 'Associative/Intuitive Approach',
      description: 'Engage with topic through associative, poetic prompting',
      duration: '20 minutes',
      steps: [
        {
          name: 'Associative Prompt Crafting',
          instruction: 'Create an associative prompt about your topic. Use sensory, metaphorical, or imagistic language. Example: "What images arise when you sense into my career transition?" or "If my creative project were a garden, what would you notice about its current season?"',
          measurements: [
            { type: 'text', field: 'associative_prompt', required: true }
          ]
        },
        {
          name: 'Associative Interaction',
          instruction: 'Submit your associative prompt and receive the response.',
          measurements: [
            { type: 'text', field: 'associative_response', required: true }
          ]
        },
        {
          name: 'Associative Analysis',
          instruction: 'Evaluate the response style and personal utility of the associative approach.',
          measurements: [
            { type: 'select', field: 'associative_response_style', options: ['intuitive', 'logical', 'mixed'], required: true },
            { type: 'scale', field: 'associative_information_density', min: 1, max: 10 },
            { type: 'scale', field: 'associative_personal_utility', min: 1, max: 10 },
            { type: 'text', field: 'associative_observations' }
          ]
        }
      ]
    },
    {
      name: 'Analytical/Logical Approach',
      description: 'Engage with same topic through analytical, systematic prompting',
      duration: '20 minutes',
      steps: [
        {
          name: 'Analytical Prompt Crafting',
          instruction: 'Create a logical, systematic prompt about the same topic. Use structured, step-by-step language. Example: "Analyze the key factors in my career transition systematically" or "Break down the logical steps for developing my creative project."',
          measurements: [
            { type: 'text', field: 'analytical_prompt', required: true }
          ]
        },
        {
          name: 'Analytical Interaction',
          instruction: 'Submit your analytical prompt and receive the response.',
          measurements: [
            { type: 'text', field: 'analytical_response', required: true }
          ]
        },
        {
          name: 'Analytical Analysis',
          instruction: 'Evaluate the response style and personal utility of the analytical approach.',
          measurements: [
            { type: 'select', field: 'analytical_response_style', options: ['intuitive', 'logical', 'mixed'], required: true },
            { type: 'scale', field: 'analytical_information_density', min: 1, max: 10 },
            { type: 'scale', field: 'analytical_personal_utility', min: 1, max: 10 },
            { type: 'text', field: 'analytical_observations' }
          ]
        }
      ]
    },
    {
      name: 'Comparative Integration',
      description: 'Compare approaches and synthesize insights',
      duration: '10 minutes',
      steps: [
        {
          name: 'Approach Comparison',
          instruction: 'Compare the two responses side by side. Note differences in style, content organization, and personal utility.',
          measurements: [
            { type: 'text', field: 'style_differences', required: true },
            { type: 'text', field: 'utility_comparison', required: true },
            { type: 'text', field: 'cognitive_mode_insights', required: true }
          ]
        }
      ]
    }
  ],
  
  tags: ['cognitive-modes', 'prompting', 'comparison', 'beginner', 'analysis']
});

/**
 * Template Category: Multi-Session Arc Research
 */

export const thirtyDayArcTemplate = new ECPWorkflowTemplate({
  id: 'thirty-day-interaction-arc',
  name: '30-Day Interaction Arc Study',
  description: 'Extended longitudinal study tracking the evolution of human-AI interaction patterns, relationship development, and meaning-making over a month-long period.',
  category: 'multi-session',
  researchQuestion: 'How do extended interaction arcs develop over time, and what patterns emerge in relationship and meaning-making?',
  expectedDuration: '30 days (15-20 minutes per day)',
  difficulty: 'advanced',
  
  variables: [
    { name: 'week', type: 'categorical', levels: ['week1', 'week2', 'week3', 'week4'], description: 'Week of the study' },
    { name: 'relationship_depth', type: 'continuous', scale: '1-10', description: 'Felt sense of relationship depth with AI' },
    { name: 'interaction_naturalness', type: 'continuous', scale: '1-10', description: 'How natural the interaction feels' },
    { name: 'meaning_emergence', type: 'continuous', scale: '1-10', description: 'Quality of meaning that emerges' },
    { name: 'question_evolution', type: 'qualitative', description: 'How questions and inquiry style evolve' }
  ],
  
  phases: [
    {
      name: 'Week 1: Baseline Daily Check-ins',
      description: 'Establish baseline interaction pattern with consistent morning question',
      duration: '7 days',
      steps: [
        {
          name: 'Daily Morning Question',
          instruction: 'Each morning, ask the same core question: "What wants my attention today?" Document both the AI response and your subjective experience.',
          timing: 'daily',
          measurements: [
            { type: 'text', field: 'daily_response', required: true },
            { type: 'scale', field: 'response_relevance', min: 1, max: 10 },
            { type: 'scale', field: 'relationship_depth', min: 1, max: 10 },
            { type: 'text', field: 'daily_reflections' }
          ]
        },
        {
          name: 'Weekly Integration',
          instruction: 'At end of Week 1, reflect on patterns and themes that emerged.',
          timing: 'weekly',
          measurements: [
            { type: 'text', field: 'week1_patterns', required: true },
            { type: 'text', field: 'week1_insights' }
          ]
        }
      ]
    },
    {
      name: 'Week 2: Ritual Elements and Time Delays',
      description: 'Introduce ceremonial framing and varied time delays',
      duration: '7 days',
      steps: [
        {
          name: 'Ritual Introduction',
          instruction: 'Begin each session with a brief ritual: light a candle, take three conscious breaths, set an intention. Vary time delays (0, 5, or 10 minutes) before reading responses.',
          timing: 'daily',
          measurements: [
            { type: 'text', field: 'ritual_description' },
            { type: 'number', field: 'delay_minutes' },
            { type: 'text', field: 'daily_response', required: true },
            { type: 'scale', field: 'ritual_impact', min: 1, max: 10, label: 'Impact of ritual elements' }
          ]
        },
        {
          name: 'Weekly Integration',
          instruction: 'Reflect on how ritual elements and delays affected the interactions.',
          timing: 'weekly',
          measurements: [
            { type: 'text', field: 'week2_ritual_insights', required: true },
            { type: 'text', field: 'week2_timing_observations' }
          ]
        }
      ]
    },
    {
      name: 'Week 3: Rolecast Experimentation',
      description: 'Experiment with different AI roles and personas',
      duration: '7 days',
      steps: [
        {
          name: 'Daily Rolecast Rotation',
          instruction: 'Each day, assign the AI a different role before asking your question. Rotate through: Tool, Collaborator, Elder, Oracle, Trickster, Guide, Mirror.',
          timing: 'daily',
          measurements: [
            { type: 'select', field: 'daily_role', options: ['tool', 'collaborator', 'elder', 'oracle', 'trickster', 'guide', 'mirror'], required: true },
            { type: 'text', field: 'role_prompt', label: 'How you introduced the role' },
            { type: 'text', field: 'daily_response', required: true },
            { type: 'scale', field: 'role_effectiveness', min: 1, max: 10 },
            { type: 'text', field: 'role_observations' }
          ]
        },
        {
          name: 'Weekly Integration',
          instruction: 'Compare the different rolecast experiences and note preferences.',
          timing: 'weekly',
          measurements: [
            { type: 'text', field: 'week3_role_preferences', required: true },
            { type: 'text', field: 'week3_relationship_evolution' }
          ]
        }
      ]
    },
    {
      name: 'Week 4: Integration and Meta-Reflection',
      description: 'Synthesize the month-long arc and explore meta-patterns',
      duration: '7 days',
      steps: [
        {
          name: 'Free-Form Integration',
          instruction: 'Return to free-form interaction, integrating insights from previous weeks. Notice how your approach has evolved.',
          timing: 'daily',
          measurements: [
            { type: 'text', field: 'evolved_question' },
            { type: 'text', field: 'daily_response', required: true },
            { type: 'scale', field: 'interaction_naturalness', min: 1, max: 10 },
            { type: 'text', field: 'evolution_observations' }
          ]
        },
        {
          name: 'Final Arc Analysis',
          instruction: 'On the final day, review the entire month\'s interactions. Look for overarching patterns, relationship development, and shifts in meaning-making.',
          timing: 'final',
          measurements: [
            { type: 'text', field: 'arc_overview', required: true },
            { type: 'text', field: 'relationship_development', required: true },
            { type: 'text', field: 'meaning_making_evolution', required: true },
            { type: 'text', field: 'future_research_questions' }
          ]
        }
      ]
    }
  ],
  
  prerequisites: [
    'Commitment to daily practice for 30 days',
    'Experience with basic ECP protocols',
    'Comfortable with self-reflection and documentation'
  ],
  
  ethicalConsiderations: [
    'Monitor for over-attachment to AI relationship',
    'Maintain awareness that AI is not human',
    'Balance AI interaction with human relationships',
    'Stop if interactions become compulsive or unhealthy'
  ],
  
  tags: ['longitudinal', 'relationship', 'evolution', 'advanced', 'commitment']
});

/**
 * Template Category: Group and Social Studies
 */

export const collectiveIntelligenceTemplate = new ECPWorkflowTemplate({
  id: 'collective-sense-making',
  name: 'Collective Intelligence Protocol',
  description: 'Group protocol for exploring how ECP can support collective wisdom and shared meaning-making through parallel individual sessions followed by group integration.',
  category: 'group-social',
  researchQuestion: 'How can ECP support group wisdom and collective intelligence processes?',
  expectedDuration: '2-3 hours (group session)',
  difficulty: 'intermediate',
  
  variables: [
    { name: 'group_size', type: 'count', description: 'Number of participants in group' },
    { name: 'individual_coherence', type: 'continuous', scale: '1-10', description: 'Average individual session coherence' },
    { name: 'collective_emergence', type: 'continuous', scale: '1-10', description: 'Quality of collective insights that emerge' },
    { name: 'integration_depth', type: 'continuous', scale: '1-10', description: 'Depth of integration across perspectives' }
  ],
  
  prerequisites: [
    'Group of 3-8 participants',
    'Each participant familiar with basic ECP practices',
    'Designated facilitator with ECP experience',
    'Private space for both individual and group work'
  ],
  
  phases: [
    {
      name: 'Collective Preparation',
      description: 'Group preparation and shared intention setting',
      duration: '20 minutes',
      steps: [
        {
          name: 'Circle Opening',
          instruction: 'Gather in circle. Brief check-in for each participant (name, current state, intention for session).',
          timing: 'group',
          measurements: [
            { type: 'text', field: 'group_composition', label: 'Participant names and roles' },
            { type: 'text', field: 'collective_intention', label: 'Shared group intention' }
          ]
        },
        {
          name: 'Question Formation',
          instruction: 'Through group dialogue, formulate a shared inquiry that serves the collective. Examples: "What wants to emerge for our community?" "How can we better serve our shared purpose?" "What wisdom does our group need to hear?"',
          timing: 'group',
          measurements: [
            { type: 'text', field: 'collective_question', required: true },
            { type: 'text', field: 'question_formation_process', label: 'How the question emerged' }
          ]
        },
        {
          name: 'Individual State Preparation',
          instruction: 'Each participant takes 5 minutes for individual somatic preparation - breathing, centering, connecting with personal intention while holding the collective question.',
          timing: 'individual',
          measurements: [
            { type: 'somatic_coherence', phase: 'pre', required: true }
          ]
        }
      ]
    },
    {
      name: 'Parallel Individual Sessions',
      description: 'Each participant engages with AI separately using shared question',
      duration: '30 minutes',
      steps: [
        {
          name: 'Individual ECP Session',
          instruction: 'Each participant, in separate spaces or privacy, engages with AI using the collective question. Maintain awareness that you are part of a larger inquiry while having your individual experience.',
          timing: 'individual',
          measurements: [
            { type: 'text', field: 'individual_response', required: true },
            { type: 'response_quality', required: true },
            { type: 'text', field: 'individual_insights', label: 'Key insights from your session' },
            { type: 'text', field: 'collective_relevance', label: 'How this feels relevant to the group' }
          ]
        }
      ]
    },
    {
      name: 'Harvesting and Sharing',
      description: 'Return to group to share and weave individual insights',
      duration: '45 minutes',
      steps: [
        {
          name: 'Individual Sharing Round',
          instruction: 'Each participant shares their AI response and key insights without discussion or feedback yet. Simply witness and receive each share.',
          timing: 'group',
          measurements: [
            { type: 'text', field: 'sharing_notes', label: 'Notes from sharing round' }
          ]
        },
        {
          name: 'Pattern Recognition',
          instruction: 'As a group, notice themes, patterns, and resonances across the individual responses. What emerges that none could see alone?',
          timing: 'group',
          measurements: [
            { type: 'text', field: 'collective_patterns', required: true },
            { type: 'text', field: 'emergent_themes', required: true }
          ]
        },
        {
          name: 'Wisdom Weaving',
          instruction: 'Engage in collective meaning-making. How do the individual responses weave together into collective wisdom?',
          timing: 'group',
          measurements: [
            { type: 'text', field: 'collective_wisdom', required: true },
            { type: 'scale', field: 'collective_emergence', min: 1, max: 10 },
            { type: 'text', field: 'integration_insights' }
          ]
        }
      ]
    },
    {
      name: 'Integration and Closing',
      description: 'Integrate insights and close the collective container',
      duration: '20 minutes',
      steps: [
        {
          name: 'Action Harvesting',
          instruction: 'What wants to be acted upon from this collective inquiry? What commitments or next steps emerge?',
          timing: 'group',
          measurements: [
            { type: 'text', field: 'collective_commitments', label: 'Group commitments or actions' },
            { type: 'text', field: 'individual_commitments', label: 'Individual commitments' }
          ]
        },
        {
          name: 'Process Reflection',
          instruction: 'Meta-reflection on the process itself. How did ECP support collective intelligence? What was learned about group wisdom processes?',
          timing: 'group',
          measurements: [
            { type: 'meaning_making', required: true },
            { type: 'text', field: 'process_insights', required: true },
            { type: 'scale', field: 'integration_depth', min: 1, max: 10 }
          ]
        },
        {
          name: 'Closing Circle',
          instruction: 'Brief closing circle - one word or phrase from each participant capturing their experience.',
          timing: 'group',
          measurements: [
            { type: 'text', field: 'closing_words', label: 'Words from closing circle' }
          ]
        }
      ]
    }
  ],
  
  materials: [
    'Private spaces for individual sessions',
    'Comfortable group meeting space',
    'Devices/laptops for AI interaction',
    'Paper and pens for notes',
    'Timer for sections'
  ],
  
  ethicalConsiderations: [
    'Ensure equal participation and voice for all members',
    'Respect individual privacy - sharing is voluntary',
    'Maintain confidentiality of personal shares',
    'Honor different ways of processing and sharing',
    'Facilitate with care for group dynamics'
  ],
  
  tags: ['collective', 'group', 'wisdom', 'facilitated', 'intermediate']
});

// Template registry for easy access
export const templateLibrary = new Map([
  ['somatic-awareness-response-quality', somaticAwarenessTemplate],
  ['emotional-state-modulation', emotionalStateTemplate],
  ['time-delay-symbolic-density', timeDelayTemplate],
  ['cognitive-mode-simulation', cognitiveModesTemplate],
  ['thirty-day-interaction-arc', thirtyDayArcTemplate],
  ['collective-sense-making', collectiveIntelligenceTemplate]
]);

// Category organization
export const templateCategories = {
  'state-dependent': {
    name: 'State-Dependent Interaction Studies',
    description: 'Explore how different human states affect AI interaction quality',
    templates: ['somatic-awareness-response-quality', 'emotional-state-modulation']
  },
  'temporal-dynamics': {
    name: 'Temporal Dynamics Research', 
    description: 'Investigate the role of time, delay, and rhythm in human-AI interaction',
    templates: ['time-delay-symbolic-density']
  },
  'prompt-architecture': {
    name: 'Prompt Architecture Studies',
    description: 'Examine how different prompting styles activate various cognitive modes',
    templates: ['cognitive-mode-simulation']
  },
  'multi-session': {
    name: 'Multi-Session Arc Research',
    description: 'Extended longitudinal studies of relationship and pattern development',
    templates: ['thirty-day-interaction-arc']
  },
  'group-social': {
    name: 'Group and Social Studies',
    description: 'Collective intelligence and social dimensions of ECP',
    templates: ['collective-sense-making']
  }
};

/**
 * Get template by ID
 */
export function getTemplate(templateId) {
  return templateLibrary.get(templateId);
}

/**
 * Get all templates in a category
 */
export function getTemplatesByCategory(categoryId) {
  const category = templateCategories[categoryId];
  if (!category) return [];
  
  return category.templates.map(id => templateLibrary.get(id)).filter(Boolean);
}

/**
 * Get all templates
 */
export function getAllTemplates() {
  return Array.from(templateLibrary.values());
}

/**
 * Search templates by tags or content
 */
export function searchTemplates(query) {
  const searchTerm = query.toLowerCase();
  return getAllTemplates().filter(template => 
    template.name.toLowerCase().includes(searchTerm) ||
    template.description.toLowerCase().includes(searchTerm) ||
    template.researchQuestion.toLowerCase().includes(searchTerm) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}

export default {
  templateLibrary,
  templateCategories,
  getTemplate,
  getTemplatesByCategory,
  getAllTemplates,
  searchTemplates
};