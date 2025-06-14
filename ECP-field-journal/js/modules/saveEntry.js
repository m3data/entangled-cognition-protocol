

// js/modules/saveEntry.js

/**
 * Save experiment JSON to appropriate location(s) based on visibility and privacy settings.
 *
 * @param {string} json - The full JSON stringified experiment entry.
 * @param {string} timestamp - ISO timestamp used to name the file.
 * @param {boolean} scrubAuthor - If true, replace author with 'anonymous' in public copy.
 * @param {string} visibility - 'public', 'private', or 'both'
 */
export function saveExperimentEntry(json, timestamp, scrubAuthor = false, visibility = "public") {
  const fileName = `ecp-${timestamp || Date.now()}.json`;
  let savePaths = [];

  if (visibility === "both") {
    const publicCopy = JSON.parse(json);
    if (scrubAuthor) publicCopy.author = 'anonymous';

    savePaths = [
      { path: `entries/experiments/_private/${fileName}`, content: json },
      { path: `entries/experiments/public/${fileName}`, content: JSON.stringify(publicCopy, null, 2) }
    ];
  } else {
    const folder = visibility === "private" ? "_private" : "public";
    const content = (visibility === "public" && scrubAuthor)
      ? (() => { const temp = JSON.parse(json); temp.author = 'anonymous'; return JSON.stringify(temp, null, 2); })()
      : json;

    savePaths = [{ path: `entries/experiments/${folder}/${fileName}`, content }];
  }

  Promise.all(savePaths.map(({ path, content }) =>
    fetch('/save-entry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, content })
    })
  ))
  .then(() => {
    const msg = `Experiment saved to ${visibility}${scrubAuthor && visibility !== "private" ? " (author scrubbed)" : ""}`;
    showToast(msg);
  })
  .catch(err => {
    console.error("Save failed:", err);
    showToast("Error saving experiment.");
  });
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