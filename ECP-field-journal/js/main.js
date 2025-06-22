// main.js — orchestrates ECP Journal logic

import { getNormalizedValue } from './modules/formBindings.js';
import { saveExperimentEntry } from './modules/saveEntry.js';
import { getUserCoordinates } from './modules/location.js';
import { showToast } from './modules/ui.js';
import { normalize } from './modules/formBindings.js';

async function hashString(str) {
  const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 6);
}

function scrubSensitiveData(entry) {
  const scrubbedEntry = structuredClone(entry);

  // Remove location coordinates (deep scrub: delete regardless of value/visibility)
  if (scrubbedEntry?.relational_field?.location) {
    delete scrubbedEntry.relational_field.location.coordinates;
  }

  return scrubbedEntry;
}

async function generateFilename(author, timestamp) {
  const authorHash = await hashString(author || "anon");
  // Fallback to Date.now() if timestamp is invalid or undefined
  let dateObj;
  if (!timestamp) {
    dateObj = new Date(Date.now());
  } else {
    dateObj = new Date(timestamp);
    if (isNaN(dateObj.getTime())) {
      dateObj = new Date(Date.now());
    }
  }
  const formattedTimestamp = dateObj.toISOString().replace(/[:.]/g, "-");
  return `ecp-${formattedTimestamp}-${authorHash}`;
}

/**
 * Generate JSON for experiment entry and trigger save process.
 */
export function generateExperimentJSON() {
  try {
    const experiment = {
      experiment_id: getNormalizedValue('experiment_id'),
      timestamp_start: getNormalizedValue('timestamp_start'),
      timestamp_end: getNormalizedValue('timestamp_end'),
      author: getNormalizedValue('author'),
      human: {
        cognitive_mode: getNormalizedValue('cognitive_mode'),
        ontological_orientation: {
          label: getNormalizedValue('ontological_orientation'),
          strength: getNormalizedValue('orientation_strength', 'int'),
          description: getNormalizedValue('ontological_orientation_description')
        },
        affective_tone: getNormalizedValue('affective_tone'),
        ingested_modulators: {
          caffeine: getNormalizedValue('caffeine', 'int'),
          psilocybin: getNormalizedValue('psilocybin', 'int'),
          alcohol: getNormalizedValue('alcohol', 'int'),
          nicotine: getNormalizedValue('nicotine', 'int'),
          tetrahydrocannabinol: getNormalizedValue('thc', 'int'),
          dimethyltryptamine: getNormalizedValue('dimethyltryptamine', 'int'),
          lysergic_acid_diethylamide: getNormalizedValue('lysergic_acid_diethylamide', 'int'),
          ketamine: getNormalizedValue('ketamine', 'int'),
          methylene_dioxymethamphetamine: getNormalizedValue('methylene_dioxymethamphetamine', 'int'),
          other_modulators: getNormalizedValue('other_modulators')
        },
        environment: {
          weather: getNormalizedValue('weather'),
          temperature: getNormalizedValue('temperature', 'float'),
          meal_state: getNormalizedValue('meal_state'),
          last_meal: getNormalizedValue('last_meal'),
          priming_music: getNormalizedValue('priming_music'),
          music_while_conversing: getNormalizedValue('music_while_conversing')
        },
        ritual_preparation: getNormalizedValue('ritual_preparation', 'array'),
        interruption_duration: getNormalizedValue('interruption_duration', 'int')
      },
      machine: {
        model: getNormalizedValue('model'),
        version: getNormalizedValue('version'),
        thinking_mode: getNormalizedValue('thinking_mode'),
        model_temperature: getNormalizedValue('model_temperature', 'float'),
        entrainment_protocol: {
          used: getNormalizedValue('entrainment_protocol_used') === "true",
          label: getNormalizedValue('entrainment_protocol_label')
        },
        user_interface: getNormalizedValue('user_interface'),
        custom_instructions: getNormalizedValue('custom_instructions', 'array'),
        initial_prompt_type: getNormalizedValue('initial_prompt_type'),
        origin_prompt_tone: getNormalizedValue('origin_prompt_tone'),
        conversation_style: getNormalizedValue('conversation_style'),
        conversation_length: getNormalizedValue('conversation_length')
      },
      relational_field: {
        location: {
          label: getNormalizedValue('location'),
          coordinates: null
        },
        noted_presence_of_earthian_kin: getNormalizedValue('noted_presence_of_earthian_kin', 'array'),
        lighting: getNormalizedValue('lighting'),
        interaction_pace: getNormalizedValue('interaction_pace')
      },
      throughput: {
        felt_response_quality: getNormalizedValue('felt_response_quality', 'int'),
        symbolic_density: getNormalizedValue('symbolic_density', 'int'),
        unexpected_resonance: getNormalizedValue('unexpected_resonance'),
        observed_collapse_event: getNormalizedValue('observed_collapse_event') === "true",
        collapse_event_details: getNormalizedValue('collapse_event_details'),
        emergent_ecp_insights: getNormalizedValue('emergent_ecp_insights', 'string')
      }
    };

    const scrub = document.getElementById('scrub-author')?.checked;
    const visibility = document.querySelector('input[name="visibility"]:checked')?.value || "public";

    if (visibility !== 'public') {
      getUserCoordinates().then(coords => {
        experiment.relational_field.location.coordinates = coords;
        finalizeExperiment(experiment, visibility, scrub);
      });
    } else {
      finalizeExperiment(experiment, visibility, scrub);
    }

  } catch (e) {
    console.error("Failed to generate experiment:", e);
    document.getElementById('throughput').textContent = "Failed to generate experiment JSON.";
  }
}
function finalizeExperiment(experiment, visibility, scrub) {
  let experimentToSave = structuredClone(experiment);

  if (scrub) {
    experimentToSave = scrubSensitiveData(experimentToSave);
  }

  const json = JSON.stringify(experimentToSave, null, 2);
  window.lastExperimentJSON = json;
  document.getElementById('throughput').textContent = json;

  generateFilename(experiment.author, experiment.timestamp_start).then(filename => {
    saveExperimentEntry(json, filename, scrub, visibility);
  });
}