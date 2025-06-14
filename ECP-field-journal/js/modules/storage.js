


/**
 * Load user-specific label data from localStorage or a fallback public file.
 * @param {string} key - The label category (e.g., 'cognitive_mode').
 * @returns {string[]} Array of stored labels or empty array.
 */
export function loadUserLabels(key) {
  const raw = localStorage.getItem(`ecp-labels-${key}`);
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save or update a user's label list for a given category.
 * @param {string} key - The label category (e.g., 'cognitive_mode').
 * @param {string[]} values - List of strings to persist.
 */
export function saveUserLabels(key, values) {
  if (!Array.isArray(values)) return;
  localStorage.setItem(`ecp-labels-${key}`, JSON.stringify(values));
}

/**
 * Add a new label to a given category only if it doesn't already exist.
 * @param {string} key - The label category.
 * @param {string} newValue - New label to add.
 */
export function addUserLabel(key, newValue) {
  const current = loadUserLabels(key);
  if (!current.includes(newValue)) {
    current.push(newValue);
    saveUserLabels(key, current);
  }
}