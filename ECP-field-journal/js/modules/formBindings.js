

/**
 * Normalize input values based on type.
 * Handles user input from DOM form elements to ensure consistent formatting
 * before saving or processing within the app.
 *
 * @param {string} value - The raw value from an input field.
 * @param {string} type - One of: 'string', 'int', 'float', 'array'. Defaults to 'string'.
 * @returns {*} Normalized value of the appropriate type.
 */
export function normalize(value, type = "string") {
  // Trim whitespace and default to empty string
  if (type === "string") return value?.trim() || "";

  // Parse integer or default to 0
  if (type === "int") return isNaN(parseInt(value)) ? 0 : parseInt(value);

  // Parse float or default to 0.0
  if (type === "float") return isNaN(parseFloat(value)) ? 0.0 : parseFloat(value);

  // Split comma-separated string into trimmed array values
  if (type === "array") {
    return value
      ? value.split(',').map(s => s.trim()).filter(Boolean)
      : [];
  }

  // Fallback for unrecognized types
  return value || null;
}

/**
 * Fetch and normalize a value from a form input by its DOM element ID.
 *
 * @param {string} id - The DOM element ID.
 * @param {string} type - Type to normalize the value into. Defaults to 'string'.
 * @returns {*} The normalized value.
 */
export function getNormalizedValue(id, type = "string") {
  const el = document.getElementById(id);
  return normalize(el?.value || "", type);
}