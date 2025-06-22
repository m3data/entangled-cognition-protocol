/**
 * dataSanitiser.js
 * 
 * This module provides a privacy-aware function for sanitizing experimental entry data
 * before publishing it to a public data repository.
 * 
 * The sanitizeForPublic(entry) function:
 * - Deep clones the input entry to avoid mutating original data
 * - Generalizes timestamp_start into a less identifiable "time of day" category
 * - Redacts sensitive GPS coordinates from the relational_field.location
 * - Flags high-risk user-entered fields that could lead to reidentification
 * 
 * Returns:
 * - sanitizedEntry: a version of the entry safe for public release
 * - riskInfo: metadata about redacted, generalized, and flagged fields
 */
export function sanitizeForPublic(entry) {
  const sanitizedEntry = JSON.parse(JSON.stringify(entry)); // Deep clone
  const riskInfo = {
    redacted: [],
    generalized: [],
    flaggedSensitive: [],
  };

  // Generalize timestamp_start to time of day
  const startTime = new Date(sanitizedEntry.timestamp_start);
  const hour = startTime.getHours();
  let timeOfDay = 'unknown';
  if (hour >= 5 && hour < 12) timeOfDay = 'morning';
  else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
  else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
  else timeOfDay = 'night';

  sanitizedEntry.time_of_day = timeOfDay;
  delete sanitizedEntry.timestamp_start;
  riskInfo.generalized.push('timestamp_start');

  // Redact coordinates
  if (
    sanitizedEntry.relational_field?.location?.coordinates
  ) {
    delete sanitizedEntry.relational_field.location.coordinates;
    riskInfo.redacted.push('relational_field.location.coordinates');
  }

  // Flag sensitive fields
  if (sanitizedEntry.human?.ingested_modulators?.length) {
    riskInfo.flaggedSensitive.push('human.ingested_modulators');
  }
  if (sanitizedEntry.human?.ontological_orientation?.description) {
    riskInfo.flaggedSensitive.push('human.ontological_orientation.description');
  }

  return { sanitizedEntry, riskInfo };
}