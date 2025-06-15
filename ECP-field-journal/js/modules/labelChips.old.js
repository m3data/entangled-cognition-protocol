/****
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
  container.addEventListener("keyup", (e) => {
    if ((e.key === "Enter" || e.key === ",") && !e.shiftKey) {
      e.preventDefault();
      const text = container.textContent.trim();
      if (text) {
        clearCaret(container);
        addChip(container, text);
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
  const existingChips = [...container.querySelectorAll('.tag-chip')]
    .map(chip => chip.textContent.trim().toLowerCase());
  if (existingChips.includes(text.toLowerCase())) return;

  const chip = document.createElement("span");
  chip.className = "tag-chip";
  chip.textContent = text;
  chip.addEventListener("click", () => chip.remove());

  // Insert chip before any trailing space text node or at end
  let inserted = false;
  for (let i = container.childNodes.length - 1; i >= 0; i--) {
    const node = container.childNodes[i];
    if (node.nodeType === Node.TEXT_NODE && /^\s*$/.test(node.textContent)) {
      container.insertBefore(chip, node);
      inserted = true;
      break;
    }
  }
  if (!inserted) {
    container.appendChild(chip);
  }
  const br = document.createElement("br");
  container.appendChild(br);

  const placeholder = document.createElement("span");
  placeholder.className = "caret-placeholder";
  placeholder.appendChild(document.createTextNode("\u200B")); // zero-width space
  container.appendChild(placeholder);

  const range = document.createRange();
  const sel = window.getSelection();
  range.setStart(placeholder.firstChild, 1);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
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
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
  let node;
  while ((node = walker.nextNode())) {
    node.remove();
  }
}