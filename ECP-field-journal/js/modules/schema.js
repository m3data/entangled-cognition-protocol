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
    "chatgpt_custom_instructions",
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
  ]
};
