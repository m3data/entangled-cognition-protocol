// js/modules/schema.js

/**
 * ECP Experiment Schema v0.2
 *
 * Restructured for EECP orchestrated experiments.
 * Supports real-time integration with Semantic Climate and EarthianBioSense.
 *
 * Key changes from v0.1:
 * - Added experiment_type and intention fields
 * - Added session_links for cross-client correlation
 * - Added instrument_status for EBS/SC connection state
 * - Reorganized for 4-phase ceremony flow (Threshold → Activation → Experiment → Capture)
 * - Somatic coherence PRE moved to threshold phase
 * - Somatic coherence POST moved to capture phase
 * - Machine fields auto-populated from SC where possible
 */

export const schemaVersion = "0.2.0";

export const defaultSchema = {
  metadata: [
    "experiment_id",
    "schema_version",
    "timestamp_start",
    "timestamp_end",
    "author",
    "experiment_type",
    "intention"
  ],

  // Session links for cross-client correlation (EECP orchestration)
  session_links: [
    "sc_session_id",
    "ebs_session_file",
    "sc_export_path",
    "correlation_consented"
  ],

  // Instrument status captured during activation phase
  instrument_status: [
    "ebs_connected",
    "ebs_baseline_hr",
    "ebs_baseline_coherence",
    "sc_connected",
    "sc_model",
    "sc_model_temperature"
  ],

  human: {
    // Captured during threshold phase (PRE-session)
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
      "dmt",
      "other_modulator"
    ],
    environment: [
      "weather",
      "temperature",
      "meal_state",
      "last_meal"
    ],
    ritual: [
      "ritual_preparation",
      "grounding_method",
      "interruption_duration"
    ]
  },

  // Machine context - auto-populated from SC where possible
  machine: [
    "provider",
    "model_family",
    "model_temperature",
    "thinking_mode",
    "entrainment_protocol",
    "custom_instructions",
    "initial_prompt_type",
    "origin_prompt_tone",
    "conversation_style",
    "conversation_length"
  ],

  relational_field: [
    "location",
    "coordinates",
    "noted_presence_of_earthian_kin",
    "lighting",
    "interaction_pace",
    "more_than_human_acknowledged"
  ],

  // Captured during phenomenological capture phase (POST-session)
  // CRITICAL: Captured BEFORE participant sees any metrics
  throughput: [
    "felt_response_quality",
    "symbolic_density",
    "unexpected_resonance",
    "observed_collapse_event",
    "collapse_event_details",
    "turning_points",
    "somatic_shifts_noted",
    "emergent_ecp_insights"
  ],

  // Reflection captured before metrics reveal
  reflection: [
    "first_person_account",
    "what_surprised_you",
    "body_memory",
    "unresolved_threads"
  ],

  measurement_frameworks: {
    somatic_coherence: {
      // PRE: Captured during threshold phase
      pre_session: [
        "embodied_presence",
        "energetic_resonance",
        "somatic_intelligence",
        "groundedness"
      ],
      // POST: Captured during phenomenological capture phase
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
      // Captured POST-session during phenomenological capture
      assessment: [
        "metaphor_richness",
        "personal_relevance",
        "depth_vs_surface",
        "novelty_factor",
        "felt_coherence"
      ]
    },
    meaning_making: {
      // Captured POST-session
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
  },

  // Synthesis - created after mutual constraint review
  synthesis: [
    "metrics_reflection_alignment",
    "metrics_reflection_divergence",
    "divergence_interpretation",
    "synthesis_notes",
    "synthesis_completed_at"
  ]
};

/**
 * Experiment types supported
 */
export const experimentTypes = [
  {
    id: "human-ai-coupling",
    label: "Human-AI Coupling",
    description: "Dialogue with LLM while monitoring semantic and biosignal coupling",
    requires: ["sc", "ebs"],
    default: true
  },
  {
    id: "human-ai-semantic-only",
    label: "Human-AI (Semantic Only)",
    description: "Dialogue with LLM, semantic metrics only (no biosignal)",
    requires: ["sc"]
  },
  {
    id: "human-human",
    label: "Human-Human",
    description: "Conversation between humans with coupling analysis",
    requires: ["ebs"],
    future: true
  },
  {
    id: "solo-contemplation",
    label: "Solo Contemplation",
    description: "Individual practice with biosignal monitoring",
    requires: ["ebs"],
    future: true
  },
  {
    id: "more-than-human",
    label: "More-Than-Human",
    description: "Coupling with plants, animals, or environments",
    requires: ["ebs"],
    future: true
  }
];

/**
 * Grounding methods for threshold phase
 */
export const groundingMethods = [
  { id: "breathing", label: "Breathing Exercise", duration: 60 },
  { id: "humming", label: "Humming / Toning", duration: 30 },
  { id: "movement", label: "Gentle Movement", duration: 60 },
  { id: "earth-contact", label: "Earth Contact (garden, ground)", duration: 120 },
  { id: "water-contact", label: "Water Contact (ocean, stream)", duration: 120 },
  { id: "stillness", label: "Simple Stillness", duration: 60 },
  { id: "custom", label: "Custom Practice", duration: null }
];

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

/**
 * Phase definitions for EECP experiment flow
 */
export const experimentPhases = {
  threshold: {
    id: "threshold",
    label: "Phase A: Threshold",
    description: "Grounding, intention setting, and pre-session state capture",
    steps: ["grounding", "intention", "human-context", "somatic-pre", "relational-field"],
    allowBack: true,
    allowSkip: false
  },
  activation: {
    id: "activation",
    label: "Phase B: Instrument Activation",
    description: "Connect biosignal and semantic climate instruments",
    steps: ["ebs-setup", "sc-setup"],
    allowBack: true,
    allowSkip: false,
    healthChecks: ["ebs", "sc"]
  },
  experiment: {
    id: "experiment",
    label: "Phase C: The Experiment",
    description: "Dialogue unfolds in Semantic Climate (metrics not visible)",
    steps: ["sc-session"],
    allowBack: false,
    allowSkip: false,
    external: true  // Happens in SC app
  },
  capture: {
    id: "capture",
    label: "Phase D: Phenomenological Capture",
    description: "First-person account BEFORE viewing any metrics",
    steps: ["throughput", "somatic-post", "reflection", "save"],
    allowBack: true,
    allowSkip: false,
    gate: "reflection-required"  // Must complete reflection before metrics
  },
  synthesis: {
    id: "synthesis",
    label: "Synthesis",
    description: "Review metrics alongside reflection (mutual constraint)",
    steps: ["view-analysis", "synthesis-notes"],
    allowBack: true,
    allowSkip: true,  // Can return later
    requiresGate: "reflection-saved"
  }
};

/**
 * Instrument endpoints for health checks
 */
export const instrumentEndpoints = {
  ebs: {
    name: "EarthianBioSense",
    healthCheck: "ws://localhost:8765",  // WebSocket endpoint
    type: "websocket",
    statusPath: null  // WS connection test
  },
  sc: {
    name: "Semantic Climate",
    healthCheck: "http://localhost:8000/api/ollama/status",
    type: "rest",
    sessionPath: "/api/session/status",
    ebsPath: "/api/ebs/status"
  }
};

/**
 * Provider inference from model name
 */
export const inferProvider = (modelName) => {
  if (!modelName) return "unknown";
  const lower = modelName.toLowerCase();

  if (lower.includes("gpt") || lower.includes("o1") || lower.includes("o3")) return "openai";
  if (lower.includes("claude")) return "anthropic";
  if (lower.includes("gemini") || lower.includes("palm")) return "google";
  if (lower.includes("llama") || lower.includes("codellama")) return "meta";
  if (lower.includes("mistral") || lower.includes("mixtral")) return "mistral";
  if (lower.includes("deepseek")) return "deepseek";
  if (lower.includes("qwen")) return "alibaba";
  if (lower.includes("phi")) return "microsoft";

  return "other";
};

/**
 * Generate experiment ID
 */
export const generateExperimentId = () => {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toTimeString().split(' ')[0].replace(/:/g, '');
  const random = Math.random().toString(36).substring(2, 6);
  return `ecp-${date}-${time}-${random}`;
};
