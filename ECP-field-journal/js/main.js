import { version } from "react";

function normalize(value, type = "string") {
  if (type === "string") return value?.trim() || "";
  if (type === "int") return isNaN(parseInt(value)) ? 0 : parseInt(value);
  if (type === "float") return isNaN(parseFloat(value)) ? 0.0 : parseFloat(value);
  if (type === "array") return value ? value.split(',').map(s => s.trim()).filter(Boolean) : [];
  return value || null;
}

function getSaveLocation(entryType) {
  const visibility = document.querySelector('input[name="visibility"]:checked')?.value || "public";
  const folder = visibility === "private" ? "_private" : "public";
  return `entries/${entryType}/${folder}`;
}

export function generateExperimentJSON() {
  try {
    const getValue = id => document.getElementById(id)?.value || "";

    const experiment = {
      experiment_id: normalize(getValue('experiment_id'), 'string'),
      timestamp_start: normalize(getValue('timestamp_start'), 'string'),
      timestamp_end: normalize(getValue('timestamp_end'), 'string'),
      author: normalize(getValue('author'), 'string'),
      human: {
        cognitive_mode: normalize(getValue('cognitive_mode'), 'string'),
        ontological_orientation: normalize(getValue('ontological_orientation'), 'string'),
        orientation_strength: normalize(getValue('orientation_strength'), 'int'),
        affective_tone: normalize(getValue('affective_tone'), 'string'),
        ingested_modulators: {
          caffeine: normalize(getValue('caffeine'), 'int'),
          psilocybin: normalize(getValue('psilocybin'), 'int'),
          alcohol: normalize(getValue('alcohol'), 'int'),
          nicotine: normalize(getValue('nicotine'), 'int'),
          tetrahydrocannabinol: normalize(getValue('thc'), 'int'),
          dimethyltryptamine: normalize(getValue('dimethyltryptamine'), 'int'),
          lysergic_acid_diethylamide: normalize(getValue('lysergic_acid_diethylamide'), 'int'),
          ketamine: normalize(getValue('ketamine'), 'int'),
          methylene_dioxymethamphetamine: normalize(getValue('methylene_dioxymethamphetamine'), 'int'),
          other_modulators: normalize(getValue('other_modulators'), 'string')
        },
        environment: {
          weather: normalize(getValue('weather'), 'string'),
          temperature: normalize(getValue('temperature'), 'float'),
          meal_state: normalize(getValue('meal_state'), 'string'),
          last_meal: normalize(getValue('last_meal'), 'string'),
          priming_music: normalize(getValue('priming_music'), 'string')
        },
        ritual_preparation: normalize(getValue('ritual_preparation'), 'array'),
        delay_before_prompt: normalize(getValue('delay_before_prompt'), 'int')
      },
      machine: {
        model: normalize(getValue('model'), 'string'),
        version: normalize(getValue('version'), 'string'),
        thinking_mode: normalize(getValue('thinking_mode'), 'string'),
        temperature: normalize(getValue('temperature'), 'float'),
        entrainment_protocol: normalize(getValue('entrainment_protocol'), 'string'),
        interface: normalize(getValue('interface'), 'string'),
        chatgpt_custom_instructions: normalize(getValue('chatgpt_custom_instructions'), 'array'),
        initial_prompt_type: normalize(getValue('initial_prompt_type'), 'string'),
        narrative_prompt_tones: normalize(getValue('narrative_prompt_tones'), 'array'),
        conversation_style: normalize(getValue('conversation_style'), 'string'),
        conversation_length_at_journal_entry: normalize(getValue('conversation_length_at_journal_entry'), 'string')
      },
      relational_field: {
        location: normalize(getValue('location'), 'string'),
        noted_presence_of_earthian_kin: normalize(getValue('noted_presence'), 'array'),
        lighting: normalize(getValue('lighting'), 'string'),
        interaction_pace: normalize(getValue('interaction_pace'), 'string'),
        interaction_style: normalize(getValue('interaction_style'), 'string')
      },
      throughput: {
        felt_response_quality: normalize(getValue('felt_response_quality'), 'int'),
        symbolic_density: normalize(getValue('symbolic_density'), 'int'),
        unexpected_resonance: normalize(getValue('unexpected_resonance'), 'string'),
        observed_collapse_event: normalize(getValue('observed_collapse'), 'string'),
        collapse_event_details: normalize(getValue('collapse_event_details'), 'string'),
        emergent_ecp_insights: normalize(getValue('emergent_insights'), 'array')
      }
    };

    const json = JSON.stringify(experiment, null, 2);
    const scrubPublic = document.getElementById('scrub-author')?.checked;
    window.lastExperimentJSON = json;
    const visibility = document.querySelector('input[name="visibility"]:checked')?.value || "public";
    const fileName = `ecp-${experiment.timestamp_start || Date.now()}.json`;
    let savePaths = [];

    if (visibility === "both") {
      const publicCopy = JSON.parse(json);
      if (scrubPublic) publicCopy.author = 'anonymous';

      savePaths = [
        { path: `entries/experiments/_private/${fileName}`, content: json },
        { path: `entries/experiments/public/${fileName}`, content: JSON.stringify(publicCopy, null, 2) }
      ];
    } else {
      const folder = visibility === "private" ? "_private" : "public";
      const content = (visibility === "public" && scrubPublic)
        ? (() => { const temp = JSON.parse(json); temp.author = 'anonymous'; return JSON.stringify(temp, null, 2); })()
        : json;

      savePaths = [{ path: `entries/experiments/${folder}/${fileName}`, content }];
    }
    Promise.all(savePaths.map(({path, content}) =>
      fetch('/save-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, content })
      })
    ))
    .then(() => {
      const toastMessage = `Experiment saved to ${visibility}${scrubPublic && visibility !== "private" ? " (author scrubbed)" : ""}`;
      showToast(toastMessage);
    })
    .catch(err => {
      console.error(err);
    });
    document.getElementById('output').textContent = json;
  } catch (e) {
    console.error("Error generating experiment JSON:", e);
    document.getElementById('output').textContent = "Failed to generate experiment JSON.";
  }
}

export function generateReflectionMarkdown() {
  const scrubPublic = document.getElementById('scrub-author')?.checked;
  const title = normalize(document.getElementById('reflection-title').value);
  const date = normalize(document.getElementById('reflection-date').value);
  const author = normalize(document.getElementById('reflection-author').value) || "Anonymous";
  const insights = normalize(document.getElementById('insights').value);
  const challenges = normalize(document.getElementById('challenges').value);
  const shifts = normalize(document.getElementById('shifts').value);
  const nextSteps = normalize(document.getElementById('next-steps').value);

  const frontmatter = `---\ntitle: \"${title}\"\ndate: ${date}\nlayout: reflection\nauthor: ${author}\ncategories: [field-reflection]\n---`;

  const content = `## Key Insights\n${insights}\n\n## Challenges / Tensions\n${challenges}\n\n## Shifts in Perspective\n${shifts}\n\n## Next Steps / Invitations\n${nextSteps}`;

  const output = `${frontmatter}\n\n${content}`;
  let outputPublic = output;
  if (scrubPublic) {
    outputPublic = output.replace(/^author: .+$/m, 'author: anonymous');
  }
  document.getElementById('reflection-output').textContent = output;
  const visibility = document.querySelector('input[name="visibility"]:checked')?.value || "public";
  const fileName = `reflection-${date || Date.now()}.md`;
  const savePaths = [];

  if (visibility === "both") {
    savePaths.push(
      { path: `entries/reflections/_private/${fileName}`, content: output },
      { path: `entries/reflections/public/${fileName}`, content: outputPublic }
    );
  } else {
    const folder = visibility === "private" ? "_private" : "public";
    const content = (visibility === "public" && scrubPublic) ? outputPublic : output;

    savePaths.push({ path: `entries/reflections/${folder}/${fileName}`, content });
  }
  Promise.all(savePaths.map(({path, content}) =>
    fetch('/save-entry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, content })
    })
  ))
  .then(() => {
    const toastMessage = `Reflection saved to ${visibility}${scrubPublic && visibility !== "private" ? " (author scrubbed)" : ""}`;
    showToast(toastMessage);
  })
  .catch(err => {
    console.error(err);
  });
}

export function showPanel(file) {
  return fetch(file)
    .then(res => {
      if (!res.ok) throw new Error(`Failed to load ${file}`);
      return res.text();
    })
    .then(html => {
      const container = document.getElementById('panel-container');
      container.innerHTML = html;
    })
    .catch(err => {
      console.error(err);
      const container = document.getElementById('panel-container');
      container.innerHTML = `<p style="color:red;">Could not load ${file}</p>`;
    });
}

export { getSaveLocation };

function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.remove('hidden');
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hidden');
  }, duration);
}