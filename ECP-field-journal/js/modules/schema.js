// js/modules/schema.js

/**
 * Defines the default structure and key groupings for ECP experiment entries.
 * Used for reference, validation, or form generation.
 */

export const defaultSchema = {
  metadata: [
    "experiment_id",
    "timestamp_start",
    "timestamp_end",
    "author"
  ],
  human: {
    core: [
      "cognitive_mode",
      "ontological_orientation",
      "orientation_strength",
      "affective_tone"
    ],
    modulators: [
      "caffeine",
      "psilocybin",
      "alcohol",
      "nicotine",
      "thc",
      "dmt"
    ],
    environment: [
      "weather",
      "temperature",
      "meal_state",
      "last_meal",
      "priming_music",
      "music_while_conversing"
    ],
    ritual: [
      "ritual_preparation",
      "interruption_duration"
    ]
  },
  machine: [
    "provider",
    "model_family",
    "model_temperature",
    "thinking_mode",
    "entrainment_protocol",
    "user_interface",
    "custom_instructions",
    "initial_prompt_type",
    "origin_prompt_tone",
    "conversation_style",
    "conversation_length"
  ],
  relational_field: [
    "location",
    "noted_presence_of_earthian_kin",
    "lighting",
    "interaction_pace"
  ],
  throughput: [
    "felt_response_quality",
    "symbolic_density",
    "unexpected_resonance",
    "observed_collapse_event",
    "collapse_event_details",
    "emergent_ecp_insights"
  ],
  measurement_frameworks: {
    somatic_coherence: {
      pre_session: [
        "embodied_presence",
        "energetic_resonance", 
        "somatic_intelligence",
        "groundedness"
      ],
      post_session: [
        "embodied_presence",
        "energetic_resonance",
        "somatic_intelligence", 
        "groundedness"
      ],
      qualitative_notes: [
        "physical_sensations",
        "energetic_shifts",
        "embodied_insights",
        "somatic_response_to_ai"
      ]
    },
    response_quality: {
      assessment: [
        "metaphor_richness",
        "personal_relevance",
        "depth_vs_surface",
        "novelty_factor",
        "felt_coherence"
      ]
    },
    meaning_making: {
      post_session: [
        "insight_emergence",
        "integration_ease",
        "practical_relevance",
        "symbolic_resonance"
      ]
    },
    emergence_patterns: {
      session_outcome: [
        "unexpected_insights_count",
        "pattern_recognition_quality",
        "creative_sparks",
        "integration_impulses"
      ]
    }
  }
};

/**
 * Measurement framework scale definitions with metadata
 */
export const measurementScales = {
  somatic_coherence: {
    embodied_presence: {
      label: "Embodied Presence",
      question: "How present in my body do I feel?",
      scale: { min: 1, max: 10 },
      description: "Awareness of bodily sensations and felt sense"
    },
    energetic_resonance: {
      label: "Energetic Resonance", 
      question: "How aligned/coherent does my energy feel?",
      scale: { min: 1, max: 10 },
      description: "Sense of energetic alignment and coherence"
    },
    somatic_intelligence: {
      label: "Somatic Intelligence",
      question: "How much am I sensing through my body?",
      scale: { min: 1, max: 10 },
      description: "Body's capacity for sensing and knowing"
    },
    groundedness: {
      label: "Groundedness",
      question: "How connected to the earth/physical reality do I feel?",
      scale: { min: 1, max: 10 },
      description: "Connection to physical reality and earth"
    }
  },
  response_quality: {
    metaphor_richness: {
      label: "Metaphor Richness",
      question: "Rate the density of symbolic/poetic language",
      scale: { min: 1, max: 5 },
      description: "Richness of metaphorical and symbolic expression"
    },
    personal_relevance: {
      label: "Personal Relevance",
      question: "How much does the response speak to your specific context?",
      scale: { min: 1, max: 5 },
      description: "Relevance to personal situation and context"
    },
    depth_vs_surface: {
      label: "Depth vs Surface",
      question: "Rate the depth of insight vs superficial advice",
      scale: { min: 1, max: 5 },
      description: "Depth of understanding vs surface-level response"
    },
    novelty_factor: {
      label: "Novelty Factor",
      question: "How novel are the perspectives offered?",
      scale: { min: 1, max: 5 },
      description: "Freshness and originality of insights"
    },
    felt_coherence: {
      label: "Felt Coherence",
      question: "Does the response 'land' emotionally/intuitively?",
      scale: { min: 1, max: 5 },
      description: "Intuitive sense of response resonance"
    }
  },
  meaning_making: {
    insight_emergence: {
      label: "Insight Emergence",
      question: "How much new understanding arose?",
      scale: { min: 1, max: 7 },
      description: "Degree of new insights and understanding"
    },
    integration_ease: {
      label: "Integration Ease", 
      question: "How readily do insights connect with existing knowledge?",
      scale: { min: 1, max: 7 },
      description: "Ease of integrating insights with existing understanding"
    },
    practical_relevance: {
      label: "Practical Relevance",
      question: "How applicable are insights to your life situation?",
      scale: { min: 1, max: 7 },
      description: "Real-world applicability of insights"
    },
    symbolic_resonance: {
      label: "Symbolic Resonance",
      question: "How much do metaphors/images support understanding?",
      scale: { min: 1, max: 7 },
      description: "Power of symbolic content to deepen understanding"
    }
  }
};
