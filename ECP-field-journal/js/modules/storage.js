


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

/**
 * Store measurement data for trend analysis and pattern recognition
 * @param {string} experimentId - The experiment ID to associate with measurements
 * @param {Object} measurementData - Structured measurement framework data
 * @param {string} timestamp - ISO timestamp for the measurement
 */
export function storeMeasurementData(experimentId, measurementData, timestamp = new Date().toISOString()) {
  const key = `ecp-measurements-${experimentId}`;
  const entry = {
    experiment_id: experimentId,
    timestamp: timestamp,
    ...measurementData
  };
  
  try {
    localStorage.setItem(key, JSON.stringify(entry));
    
    // Also append to the measurements index for efficient querying
    updateMeasurementsIndex(experimentId, timestamp);
    
    return true;
  } catch (error) {
    console.error('Failed to store measurement data:', error);
    return false;
  }
}

/**
 * Retrieve measurement data for a specific experiment
 * @param {string} experimentId - The experiment ID
 * @returns {Object|null} - The measurement data or null if not found
 */
export function loadMeasurementData(experimentId) {
  const key = `ecp-measurements-${experimentId}`;
  const raw = localStorage.getItem(key);
  
  try {
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Failed to load measurement data:', error);
    return null;
  }
}

/**
 * Update the measurements index for efficient trend analysis
 * @param {string} experimentId - The experiment ID
 * @param {string} timestamp - ISO timestamp
 */
function updateMeasurementsIndex(experimentId, timestamp) {
  const indexKey = 'ecp-measurements-index';
  let index = [];
  
  try {
    const raw = localStorage.getItem(indexKey);
    index = raw ? JSON.parse(raw) : [];
  } catch {
    index = [];
  }
  
  // Add or update entry in index
  const existingIndex = index.findIndex(entry => entry.experiment_id === experimentId);
  const indexEntry = { experiment_id: experimentId, timestamp, date: new Date(timestamp) };
  
  if (existingIndex >= 0) {
    index[existingIndex] = indexEntry;
  } else {
    index.push(indexEntry);
  }
  
  // Sort by timestamp, most recent first
  index.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  // Keep only the latest 1000 entries to prevent storage overflow
  if (index.length > 1000) {
    index = index.slice(0, 1000);
  }
  
  localStorage.setItem(indexKey, JSON.stringify(index));
}

/**
 * Get all measurement entries for trend analysis
 * @param {number} limit - Maximum number of entries to return (default: 50)
 * @param {number} offset - Number of entries to skip (default: 0)
 * @returns {Array} - Array of measurement entries with metadata
 */
export function getAllMeasurements(limit = 50, offset = 0) {
  const indexKey = 'ecp-measurements-index';
  let index = [];
  
  try {
    const raw = localStorage.getItem(indexKey);
    index = raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
  
  // Apply pagination
  const paginatedIndex = index.slice(offset, offset + limit);
  
  // Load actual measurement data for each indexed entry
  const measurements = paginatedIndex.map(indexEntry => {
    const measurementData = loadMeasurementData(indexEntry.experiment_id);
    return measurementData ? { ...measurementData, ...indexEntry } : null;
  }).filter(Boolean);
  
  return measurements;
}

/**
 * Get measurement data within a date range
 * @param {Date} startDate - Start date for the range
 * @param {Date} endDate - End date for the range
 * @returns {Array} - Array of measurement entries within the date range
 */
export function getMeasurementsInDateRange(startDate, endDate) {
  const indexKey = 'ecp-measurements-index';
  let index = [];
  
  try {
    const raw = localStorage.getItem(indexKey);
    index = raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
  
  // Filter by date range
  const filteredIndex = index.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    return entryDate >= startDate && entryDate <= endDate;
  });
  
  // Load actual measurement data
  const measurements = filteredIndex.map(indexEntry => {
    const measurementData = loadMeasurementData(indexEntry.experiment_id);
    return measurementData ? { ...measurementData, ...indexEntry } : null;
  }).filter(Boolean);
  
  return measurements;
}

/**
 * Calculate trend statistics for a specific measurement scale
 * @param {string} scalePath - Dot notation path to the scale (e.g., 'somatic_coherence.pre_session.embodied_presence')
 * @param {number} days - Number of days to look back (default: 30)
 * @returns {Object} - Trend statistics
 */
export function calculateScaleTrends(scalePath, days = 30) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const measurements = getMeasurementsInDateRange(startDate, endDate);
  
  // Extract values for the specified scale path
  const values = measurements.map(measurement => {
    const pathParts = scalePath.split('.');
    let value = measurement;
    
    for (const part of pathParts) {
      value = value?.[part];
    }
    
    return {
      value: value,
      timestamp: measurement.timestamp,
      experiment_id: measurement.experiment_id
    };
  }).filter(item => typeof item.value === 'number' && !isNaN(item.value));
  
  if (values.length === 0) {
    return {
      count: 0,
      mean: null,
      median: null,
      min: null,
      max: null,
      trend: null,
      values: []
    };
  }
  
  // Calculate basic statistics
  const numericValues = values.map(v => v.value).sort((a, b) => a - b);
  const sum = numericValues.reduce((a, b) => a + b, 0);
  const mean = sum / numericValues.length;
  const median = numericValues[Math.floor(numericValues.length / 2)];
  const min = numericValues[0];
  const max = numericValues[numericValues.length - 1];
  
  // Calculate simple trend (positive/negative/stable)
  let trend = 'stable';
  if (values.length >= 2) {
    const firstValue = values[values.length - 1].value; // Oldest
    const lastValue = values[0].value; // Most recent
    const change = lastValue - firstValue;
    const percentChange = Math.abs(change / firstValue);
    
    if (percentChange > 0.1) { // 10% threshold for trend detection
      trend = change > 0 ? 'increasing' : 'decreasing';
    }
  }
  
  return {
    count: values.length,
    mean: Math.round(mean * 100) / 100,
    median,
    min,
    max,
    trend,
    values: values.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  };
}

/**
 * Get correlation analysis between two measurement scales
 * @param {string} scalePath1 - First scale path
 * @param {string} scalePath2 - Second scale path
 * @param {number} days - Number of days to analyze (default: 30)
 * @returns {Object} - Correlation analysis results
 */
export function analyzeScaleCorrelation(scalePath1, scalePath2, days = 30) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const measurements = getMeasurementsInDateRange(startDate, endDate);
  
  // Extract paired values
  const pairs = measurements.map(measurement => {
    const getValue = (path) => {
      const pathParts = path.split('.');
      let value = measurement;
      for (const part of pathParts) {
        value = value?.[part];
      }
      return value;
    };
    
    return {
      x: getValue(scalePath1),
      y: getValue(scalePath2),
      timestamp: measurement.timestamp
    };
  }).filter(pair => 
    typeof pair.x === 'number' && !isNaN(pair.x) &&
    typeof pair.y === 'number' && !isNaN(pair.y)
  );
  
  if (pairs.length < 2) {
    return {
      correlation: null,
      count: pairs.length,
      message: 'Insufficient data for correlation analysis'
    };
  }
  
  // Calculate Pearson correlation coefficient
  const n = pairs.length;
  const sumX = pairs.reduce((sum, pair) => sum + pair.x, 0);
  const sumY = pairs.reduce((sum, pair) => sum + pair.y, 0);
  const sumXY = pairs.reduce((sum, pair) => sum + (pair.x * pair.y), 0);
  const sumX2 = pairs.reduce((sum, pair) => sum + (pair.x * pair.x), 0);
  const sumY2 = pairs.reduce((sum, pair) => sum + (pair.y * pair.y), 0);
  
  const numerator = (n * sumXY) - (sumX * sumY);
  const denominator = Math.sqrt(((n * sumX2) - (sumX * sumX)) * ((n * sumY2) - (sumY * sumY)));
  
  const correlation = denominator === 0 ? 0 : numerator / denominator;
  
  let strength = 'no correlation';
  const absCorr = Math.abs(correlation);
  if (absCorr >= 0.7) strength = 'strong';
  else if (absCorr >= 0.4) strength = 'moderate';
  else if (absCorr >= 0.2) strength = 'weak';
  
  return {
    correlation: Math.round(correlation * 1000) / 1000,
    strength,
    count: n,
    pairs
  };
}

/**
 * Delete measurement data for a specific experiment
 * @param {string} experimentId - The experiment ID
 * @returns {boolean} - Success status
 */
export function deleteMeasurementData(experimentId) {
  try {
    // Remove from storage
    localStorage.removeItem(`ecp-measurements-${experimentId}`);
    
    // Remove from index
    const indexKey = 'ecp-measurements-index';
    const raw = localStorage.getItem(indexKey);
    if (raw) {
      const index = JSON.parse(raw);
      const updatedIndex = index.filter(entry => entry.experiment_id !== experimentId);
      localStorage.setItem(indexKey, JSON.stringify(updatedIndex));
    }
    
    return true;
  } catch (error) {
    console.error('Failed to delete measurement data:', error);
    return false;
  }
}

/**
 * Export all measurement data for backup or analysis
 * @returns {Object} - Complete measurement dataset
 */
export function exportMeasurementData() {
  const measurements = getAllMeasurements(1000); // Get all measurements
  const index = JSON.parse(localStorage.getItem('ecp-measurements-index') || '[]');
  
  return {
    measurements,
    index,
    export_date: new Date().toISOString(),
    version: '1.0'
  };
}

/**
 * Import measurement data from backup
 * @param {Object} exportData - Data from exportMeasurementData()
 * @returns {boolean} - Success status
 */
export function importMeasurementData(exportData) {
  try {
    if (!exportData.measurements || !Array.isArray(exportData.measurements)) {
      throw new Error('Invalid export data format');
    }
    
    // Import each measurement
    exportData.measurements.forEach(measurement => {
      if (measurement.experiment_id && measurement.timestamp) {
        const { experiment_id, timestamp, ...measurementData } = measurement;
        storeMeasurementData(experiment_id, measurementData, timestamp);
      }
    });
    
    return true;
  } catch (error) {
    console.error('Failed to import measurement data:', error);
    return false;
  }
}