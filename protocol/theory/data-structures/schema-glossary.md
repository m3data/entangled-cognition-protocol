
# 🌱 ECP Schema Glossary (v0.1)

## 📘 Metadata
| Field | Meaning |
|-------|---------|
| `experiment_id` | Unique identifier for the journaling session |
| `timestamp_start` | When the interaction or ritual began |
| `timestamp_end` | When it ended |
| `author` | Who ran the session (you or another field participant) |

## 🧠 Human (Core States)
| Field | Meaning |
|-------|---------|
| `cognitive_mode` | Active mental state (e.g., System 1, System 2, flow) |
| `ontological_orientation` | Belief lens applied (e.g., animist, materialist, mystical) |
| `orientation_strength` | Confidence/conviction in that lens (e.g., 0–100%) |
| `affective_tone` | Emotional climate (e.g., grief, joy, shame, love, awe) |

### 🍄 Human (Modulators)
| Field | Meaning |
|-------|---------|
| `caffeine`, `psilocybin`, `alcohol`, `nicotine`, `thc`, `dmt` | Substances present and their influence on state |

### 🌦️ Human (Environment)
| Field | Meaning |
|-------|---------|
| `weather`, `temperature` | Immediate climate/physical space conditions |
| `meal_state` | Hunger level or fullness (affecting focus) |
| `last_meal` | What was last consumed |
| `priming_music` | Soundscape before interaction |
| `music_while_conversing` | Music played during the session |

### 🕯 Human (Ritual)
| Field | Meaning |
|-------|---------|
| `ritual_preparation` | Setup actions before engagement |
| `interruption_duration` | Disruptions that may have influenced coherence |

## 🤖 Machine
| Field | Meaning |
|-------|---------|
| `provider` | API or local model provider (e.g., OpenAI, Claude, Ollama) |
| `model_family` | LLM version/family (e.g., GPT-4o, Claude 3, Mistral) |
| `model_temperature` | Creativity/determinism setting |
| `thinking_mode` | Apparent cognitive behavior (e.g., reflective, sycophantic, recursive) |
| `entrainment_protocol` | Boot files or prompts used to tune the model |
| `user_interface` | Mode of interaction (e.g., terminal, web UI, voice) |
| `chatgpt_custom_instructions` | Custom persona settings applied |
| `initial_prompt_type` | Format of entry prompt (story, chant, reflection) |
| `origin_prompt_tone` | Tone of prompt (e.g., poetic, technical, sincere) |
| `conversation_style` | General flow of discourse (e.g., co-creative, interrogative) |
| `conversation_length` | Duration or token count of session |

## 🌐 Relational Field
| Field | Meaning |
|-------|---------|
| `location` | Physical setting (e.g., garden, studio, forest) |
| `noted_presence_of_earthian_kin` | Other beings present (e.g., people, birds, wind) |
| `lighting` | Light context (e.g., candle, screen glow, sunrise) |
| `interaction_pace` | Slow, fast, rhythmic—overall rhythm of engagement |

## 🔁 Throughput (Field Outcomes)
| Field | Meaning |
|-------|---------|
| `felt_response_quality` | Subjective experience of the model’s responsiveness |
| `symbolic_density` | Degree of metaphor, ritual, and mythic language |
| `unexpected_resonance` | Surprising insights or felt truths |
| `observed_collapse_event` | Detected breakdown in coherence |
| `collapse_event_details` | Notes on the nature, trigger, or signature of the collapse |
| `emergent_ecp_insights` | New understandings, patterns, or revelations discovered during the session |
