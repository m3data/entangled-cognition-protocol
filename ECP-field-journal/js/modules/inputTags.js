/****
 * Initializes a chip-style tag input field.
 * Binds event listeners to allow entry via Enter or comma,
 * and handles chip rendering and deletion.
 * @param {string} id - The ID of the wrapper element.
 */
export function initTagInput(id) {
  const wrapper = document.getElementById(id);
  const input = wrapper.querySelector("input");

  // Enhanced keyboard navigation and selection for autocomplete
  let selectedIndex = -1;

  // Create autocomplete dropdown
  const dropdown = document.createElement("ul");
  dropdown.className = "autocomplete-list";
  wrapper.appendChild(dropdown);

  input.addEventListener("keydown", (e) => {
    const text = input.value.trim();

    if ((e.key === "Enter" || e.key === ",") && text !== "") {
      if (dropdown.children.length > 0 && selectedIndex >= 0) {
        e.preventDefault();
        const selectedItem = dropdown.children[selectedIndex];
        if (selectedItem) {
          const value = selectedItem.textContent;
          addChip(wrapper, value);
          saveTag(id, value);
          input.value = "";
          dropdown.innerHTML = "";
          selectedIndex = -1;
        }
        return;
      }

      e.preventDefault();
      addChip(wrapper, text);
      saveTag(id, text);
      input.value = "";
      dropdown.innerHTML = "";
      selectedIndex = -1;
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (dropdown.children.length > 0) {
        selectedIndex = (selectedIndex + 1) % dropdown.children.length;
        updateHighlight();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (dropdown.children.length > 0) {
        selectedIndex = (selectedIndex - 1 + dropdown.children.length) % dropdown.children.length;
        updateHighlight();
      }
    } else if (e.key === "Escape") {
      dropdown.innerHTML = "";
      selectedIndex = -1;
    }
  });

  input.addEventListener("input", () => {
    const text = input.value.trim().toLowerCase();
    const saved = getSavedTags(id);
    const matches = saved.filter(tag => tag.toLowerCase().startsWith(text) && text !== "");

    dropdown.innerHTML = "";
    selectedIndex = -1;
    matches.slice(0, 5).forEach(match => {
      const item = document.createElement("li");
      item.className = "autocomplete-item";
      item.textContent = match;
      item.addEventListener("mousedown", (e) => {
        e.preventDefault(); // prevent input blur
        addChip(wrapper, match);
        input.value = "";
        dropdown.innerHTML = "";
        selectedIndex = -1;
      });
      dropdown.appendChild(item);
    });
    updateHighlight();
  });

  // Hide dropdown on blur
  input.addEventListener("blur", () => {
    setTimeout(() => dropdown.innerHTML = "", 100);
  });

  // Focus input when wrapper is clicked
  wrapper.addEventListener("click", () => input.focus());

  // Log saved tags from localStorage
  input.addEventListener("focus", () => {
    const saved = getSavedTags(id);
    console.log(`Saved tags for ${id}:`, saved);
  });

  // Helper to highlight currently selected autocomplete item
  function updateHighlight() {
    [...dropdown.children].forEach((el, i) => {
      el.style.backgroundColor = i === selectedIndex ? "#e5dac1" : "";
    });
  }
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

/**
 * Saves a tag value to localStorage under the given category.
 * @param {string} category - Identifier (input ID).
 * @param {string} value - Tag to store.
 */
function saveTag(category, value) {
  const key = `tags:${category}`;
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  const lower = value.toLowerCase();
  if (!existing.map(t => t.toLowerCase()).includes(lower)) {
    existing.push(value);
    localStorage.setItem(key, JSON.stringify(existing));
  }
}

/**
 * Retrieves saved tags from localStorage.
 * @param {string} category - Identifier (input ID).
 * @returns {string[]} Array of stored tags.
 */
function getSavedTags(category) {
  const key = `tags:${category}`;
  return JSON.parse(localStorage.getItem(key) || "[]");
}