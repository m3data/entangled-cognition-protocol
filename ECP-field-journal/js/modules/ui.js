

/**
 * Display a temporary toast message on the screen.
 * Requires a DOM element with id="toast".
 *
 * @param {string} message - The text to display in the toast.
 * @param {number} duration - Duration in milliseconds before hiding (default: 3000ms).
 */
export function showToast(message, duration = 3000) {
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