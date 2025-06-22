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

/**
 * Initialize multistep form navigation.
 * Should be called once on page load for experiment-entry.html.
 */
export function initMultistepForm() {
  const steps = document.querySelectorAll(".form-step");
  let currentStep = 0;

  function showStep(stepIndex) {
    steps.forEach((step, index) => {
      step.style.display = index === stepIndex ? "block" : "none";
    });
  }

  function nextStep() {
    if (currentStep < steps.length - 1) {
      currentStep++;
      showStep(currentStep);
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  }

  document.querySelectorAll(".next-step-btn").forEach(btn =>
    btn.addEventListener("click", nextStep)
  );

  document.querySelectorAll(".prev-step-btn").forEach(btn =>
    btn.addEventListener("click", prevStep)
  );

  showStep(currentStep);
}