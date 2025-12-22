// js/modules/saveEntry.js

/**
 * Save experiment entry to appropriate location(s) based on visibility and privacy settings.
 *
 * @param {object} entry - The experiment entry object (will be JSON stringified)
 * @param {object} options - Save options
 * @param {string} options.visibility - 'public', 'private', or 'both'
 * @param {boolean} options.scrubAuthor - If true, replace author with 'anonymous' in public copy
 * @param {boolean} options.isSynthesis - If true, this is a synthesis update to existing entry
 * @returns {Promise<void>}
 */
export async function saveExperimentEntry(entry, options = {}) {
  const { visibility = 'private', scrubAuthor = false, isSynthesis = false } = options;

  // Generate filename from experiment_id or metadata
  const experimentId = entry.metadata?.experiment_id || entry.experiment_id || `ecp-${Date.now()}`;
  const suffix = isSynthesis ? '-synthesis' : '';
  const safeFilename = `${experimentId}${suffix}.json`;

  const json = JSON.stringify(entry, null, 2);
  let savePaths = [];

  if (visibility === "both") {
    const publicCopy = JSON.parse(json);
    if (scrubAuthor && publicCopy.metadata) {
      publicCopy.metadata.author = 'anonymous';
    }

    savePaths = [
      { path: `entries/experiments/_private/${safeFilename}`, content: json },
      { path: `entries/experiments/public/${safeFilename}`, content: JSON.stringify(publicCopy, null, 2) }
    ];
  } else {
    const folder = visibility === "private" ? "_private" : "public";
    let content = json;

    if (visibility === "public" && scrubAuthor) {
      const temp = JSON.parse(json);
      if (temp.metadata) temp.metadata.author = 'anonymous';
      content = JSON.stringify(temp, null, 2);
    }

    savePaths = [{ path: `entries/experiments/${folder}/${safeFilename}`, content }];
  }

  const results = await Promise.all(savePaths.map(({ path, content }) =>
    fetch('/save-entry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, content })
    })
  ));

  // Check all responses succeeded
  for (const res of results) {
    if (!res.ok) {
      throw new Error(`Save failed: ${res.statusText}`);
    }
  }

  const msg = `Experiment saved to ${visibility}${scrubAuthor && visibility !== "private" ? " (author scrubbed)" : ""}`;
  showToast(msg);
}

/**
 * Show a temporary toast message to the user.
 *
 * @param {string} message - The message to display.
 * @param {number} duration - How long to show it (ms)
 */
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