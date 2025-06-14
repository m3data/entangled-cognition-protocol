


/**
 * Initialize a tag input field with chip behavior.
 * Allows users to press Enter to add chips and click chips to remove them.
 *
 * @param {string} divId - The ID of the contenteditable div.
 * @param {string} category - Optional category name for styling or future lookups.
 */
export function initLabelInput(divId, category = "") {
  const container = document.getElementById(divId);
  if (!container) return;

  container.classList.add("tag-input-initialized");
  container.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const text = getCaretText(container).trim();
      if (text) {
        addChip(container, text);
        clearCaret(container);
      }
    }
  });

  container.addEventListener("click", (e) => {
    if (e.target.classList.contains("tag-chip")) {
      e.target.remove();
    }
  });
}

/**
 * Extract an array of chip label strings from a tag input field.
 *
 * @param {string} divId - The ID of the tag input container.
 * @returns {string[]} An array of chip texts.
 */
export function getChips(divId) {
  const container = document.getElementById(divId);
  return [...container.querySelectorAll('.tag-chip')].map(el => el.textContent.trim()).filter(Boolean);
}

/**
 * Internal helper: Add a visual chip to a container.
 *
 * @param {HTMLElement} container - The contenteditable tag input div.
 * @param {string} text - The label to convert into a chip.
 */
function addChip(container, text) {
  const chip = document.createElement("span");
  chip.className = "tag-chip";
  chip.textContent = text;
  container.appendChild(chip);
}

/**
 * Internal helper: Get current typed text from contenteditable container.
 */
function getCaretText(container) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return "";
  return selection.toString();
}

/**
 * Internal helper: Clear typed content after chip added.
 */
function clearCaret(container) {
  container.blur();
  container.focus();
}