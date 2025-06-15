/****
 * Initializes a chip-style tag input field.
 * Binds event listeners to allow entry via Enter or comma,
 * and handles chip rendering and deletion.
 * @param {string} id - The ID of the wrapper element.
 */
export function initTagInput(id) {
  const wrapper = document.getElementById(id);
  const input = wrapper.querySelector("input");

  // Add chip on Enter or comma
  input.addEventListener("keydown", (e) => {
    const text = input.value.trim();

    if ((e.key === "Enter" || e.key === ",") && text !== "") {
      e.preventDefault();
      addChip(wrapper, text);
      input.value = "";
    }
  });

  // Focus input when wrapper is clicked
  wrapper.addEventListener("click", () => input.focus());
}

/**
 * Adds a new chip to the wrapper if it's not a duplicate.
 * @param {HTMLElement} wrapper - The container element.
 * @param {string} text - The chip label to insert.
 */
function addChip(wrapper, text) {
  const chipList = wrapper.querySelector(".chip-list");

  // Prevent duplicate chips (case-insensitive)
  const existing = [...chipList.querySelectorAll(".chip")].map(c =>
    c.textContent.trim().toLowerCase()
  );
  if (existing.includes(text.toLowerCase())) return;

  // Create chip element
  const chip = document.createElement("span");
  chip.className = "chip";
  chip.textContent = text;

  // Add removable "×" button inside chip with inline SVG icon
  const remove = document.createElement("button");
  remove.className = "chip-remove";
  remove.setAttribute("aria-label", "Remove tag");
  remove.innerHTML = `
    <svg width="10" height="10" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
      <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" stroke-width="1"/>
      <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" stroke-width="1"/>
    </svg>
  `;
  remove.addEventListener("click", () => chip.parentElement.remove());

  chip.appendChild(remove);

  // Wrap chip in <li> and insert before input
  const li = document.createElement("li");
  li.appendChild(chip);
  chipList.insertBefore(li, chipList.lastElementChild);
}

/**
 * Retrieves all current chip labels from a tag input field.
 * @param {string} id - The ID of the wrapper element.
 * @returns {string[]} Array of chip label strings.
 */
export function getTags(id) {
  const wrapper = document.getElementById(id);
  return [...wrapper.querySelectorAll(".chip")].map(chip => chip.textContent.trim());
}