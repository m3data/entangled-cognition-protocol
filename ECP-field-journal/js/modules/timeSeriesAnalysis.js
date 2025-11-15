// js/modules/timeSeriesAnalysis.js

/**
 * Time series analysis for detecting cycles, trends, and temporal patterns
 * in somatic-symbolic research data
 */

import { getAllMeasurements, getMeasurementsInDateRange } from './storage.js';

/**
 * Simple moving average calculation
 * @param {Array} values - Array of numeric values
 * @param {number} window - Window size for moving average
 * @returns {Array} - Moving averages
 */
function calculateMovingAverage(values, window = 7) {
  if (values.length < window) return values;
  
  const movingAverages = [];
  for (let i = window - 1; i < values.length; i++) {
    const windowValues = values.slice(i - window + 1, i + 1);
    const average = windowValues.reduce((sum, val) => sum + val, 0) / window;
    movingAverages.push(average);
  }
  
  return movingAverages;
}

/**
 * Calculate autocorrelation for cycle detection
 * @param {Array} values - Time series values
 * @param {number} maxLag - Maximum lag to calculate
 * @returns {Array} - Autocorrelation values
 */
function calculateAutocorrelation(values, maxLag = Math.min(30, Math.floor(values.length / 3))) {
  const n = values.length;
  const mean = values.reduce((sum, val) => sum + val, 0) / n;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
  
  if (variance === 0) return Array(maxLag).fill(0);
  
  const autocorrelations = [];
  
  for (let lag = 0; lag < maxLag; lag++) {
    let sum = 0;
    const validPairs = n - lag;
    
    for (let i = 0; i < validPairs; i++) {
      sum += (values[i] - mean) * (values[i + lag] - mean);
    }
    
    const autocorr = (sum / validPairs) / variance;
    autocorrelations.push(autocorr);
  }
  
  return autocorrelations;
}

/**
 * Detect significant periodicities using autocorrelation
 * @param {Array} autocorrelations - Autocorrelation values
 * @param {number} significanceThreshold - Minimum correlation for significance
 * @returns {Array} - Detected periods
 */
function detectPeriods(autocorrelations, significanceThreshold = 0.3) {
  const periods = [];
  
  // Skip lag 0 (always 1.0) and look for subsequent peaks
  for (let lag = 2; lag < autocorrelations.length - 1; lag++) {
    const current = autocorrelations[lag];
    const prev = autocorrelations[lag - 1];
    const next = autocorrelations[lag + 1];
    
    // Check if this is a local maximum above threshold
    if (current > prev && current > next && current > significanceThreshold) {
      periods.push({
        period: lag,
        correlation: current,
        confidence: calculatePeriodConfidence(autocorrelations, lag)
      });
    }
  }
  
  return periods.sort((a, b) => b.correlation - a.correlation);
}

/**
 * Calculate confidence level for a detected period
 */
function calculatePeriodConfidence(autocorrelations, period) {
  // Check for consistency in nearby lags
  const windowSize = Math.min(3, Math.floor(period / 3));
  let consistentPeaks = 0;
  
  for (let offset = -windowSize; offset <= windowSize; offset++) {
    const lag = period + offset;
    if (lag >= 0 && lag < autocorrelations.length && autocorrelations[lag] > 0.2) {
      consistentPeaks++;
    }
  }
  
  return consistentPeaks / (2 * windowSize + 1);
}

/**
 * Detect trend using linear regression
 * @param {Array} values - Time series values
 * @param {Array} timePoints - Corresponding time points (optional)
 * @returns {Object} - Trend analysis
 */
function detectTrend(values, timePoints = null) {
  if (values.length < 3) {
    return { slope: 0, intercept: 0, rSquared: 0, trend: 'insufficient_data' };
  }
  
  const n = values.length;
  const x = timePoints || Array.from({ length: n }, (_, i) => i);
  
  // Calculate means
  const xMean = x.reduce((sum, val) => sum + val, 0) / n;
  const yMean = values.reduce((sum, val) => sum + val, 0) / n;
  
  // Calculate slope and intercept
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < n; i++) {
    numerator += (x[i] - xMean) * (values[i] - yMean);
    denominator += Math.pow(x[i] - xMean, 2);
  }
  
  if (denominator === 0) {
    return { slope: 0, intercept: yMean, rSquared: 0, trend: 'no_trend' };
  }
  
  const slope = numerator / denominator;
  const intercept = yMean - slope * xMean;
  
  // Calculate R-squared
  let totalSumSquares = 0;
  let residualSumSquares = 0;
  
  for (let i = 0; i < n; i++) {
    const predicted = slope * x[i] + intercept;
    totalSumSquares += Math.pow(values[i] - yMean, 2);
    residualSumSquares += Math.pow(values[i] - predicted, 2);
  }
  
  const rSquared = totalSumSquares === 0 ? 0 : 1 - (residualSumSquares / totalSumSquares);
  
  // Classify trend
  let trend = 'stable';
  const slopeThreshold = Math.abs(slope) * n; // Scale by length for significance
  
  if (Math.abs(slope) > 0.01 && rSquared > 0.1) {
    if (slopeThreshold > 0.1) {
      trend = slope > 0 ? 'increasing' : 'decreasing';
    }
  }
  
  return {
    slope: Math.round(slope * 10000) / 10000,
    intercept: Math.round(intercept * 100) / 100,
    rSquared: Math.round(rSquared * 1000) / 1000,
    trend,
    significance: rSquared > 0.3 ? 'high' : rSquared > 0.1 ? 'moderate' : 'low'
  };
}

/**
 * Analyze temporal patterns for a specific measurement scale
 * @param {string} scalePath - Dot notation path to the measurement scale
 * @param {number} days - Number of days to analyze
 * @returns {Object} - Temporal pattern analysis
 */
export function analyzeTemporalPatterns(scalePath, days = 90) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const measurements = getMeasurementsInDateRange(startDate, endDate);
  
  if (measurements.length < 7) {
    return {
      patterns: [],
      error: 'Insufficient data for temporal analysis',
      minRequired: 7,
      available: measurements.length
    };
  }
  
  // Extract time series data
  const timeSeriesData = measurements.map(measurement => {
    const pathParts = scalePath.split('.');
    let value = measurement;
    
    for (const part of pathParts) {
      value = value?.[part];
    }
    
    return {
      timestamp: new Date(measurement.timestamp),
      value: typeof value === 'number' ? value : null,
      experiment_id: measurement.experiment_id
    };
  }).filter(item => item.value !== null)
    .sort((a, b) => a.timestamp - b.timestamp);
  
  if (timeSeriesData.length < 7) {
    return {
      patterns: [],
      error: 'Insufficient valid values for temporal analysis',
      minRequired: 7,
      available: timeSeriesData.length
    };
  }
  
  const values = timeSeriesData.map(item => item.value);
  const timestamps = timeSeriesData.map(item => item.timestamp);
  
  // Trend analysis
  const trendAnalysis = detectTrend(values);
  
  // Cycle detection via autocorrelation
  const autocorrelations = calculateAutocorrelation(values);
  const detectedPeriods = detectPeriods(autocorrelations);
  
  // Moving average for smoothing
  const movingAverage = calculateMovingAverage(values, Math.min(7, Math.floor(values.length / 3)));
  
  // Detect volatility patterns
  const volatilityAnalysis = analyzeVolatility(values);
  
  // Weekly pattern detection
  const weeklyPatterns = analyzeWeeklyPatterns(timeSeriesData);
  
  // Monthly pattern detection (if enough data)
  const monthlyPatterns = timeSeriesData.length >= 30 ? analyzeMonthlyPatterns(timeSeriesData) : null;
  
  return {
    scalePath,
    timeRange: { 
      startDate: startDate.toISOString(), 
      endDate: endDate.toISOString() 
    },
    dataPoints: timeSeriesData.length,
    trendAnalysis,
    periodicPatterns: detectedPeriods,
    volatilityAnalysis,
    weeklyPatterns,
    monthlyPatterns,
    movingAverage: {
      window: Math.min(7, Math.floor(values.length / 3)),
      values: movingAverage
    },
    autocorrelations: autocorrelations.slice(0, 20), // Return first 20 lags
    rawData: timeSeriesData,
    analysisDate: new Date().toISOString()
  };
}

/**
 * Analyze volatility patterns
 * @param {Array} values - Time series values
 * @returns {Object} - Volatility analysis
 */
function analyzeVolatility(values) {
  if (values.length < 3) return { volatility: 0, pattern: 'insufficient_data' };
  
  // Calculate period-to-period changes
  const changes = [];
  for (let i = 1; i < values.length; i++) {
    changes.push(Math.abs(values[i] - values[i - 1]));
  }
  
  const avgVolatility = changes.reduce((sum, change) => sum + change, 0) / changes.length;
  const maxVolatility = Math.max(...changes);
  
  // Detect volatility clustering
  const highVolatilityThreshold = avgVolatility * 1.5;
  const lowVolatilityThreshold = avgVolatility * 0.5;
  
  let currentCluster = null;
  const volatilityClusters = [];
  
  changes.forEach((change, idx) => {
    const isHigh = change > highVolatilityThreshold;
    const isLow = change < lowVolatilityThreshold;
    
    if (isHigh || isLow) {
      const type = isHigh ? 'high' : 'low';
      
      if (currentCluster && currentCluster.type === type) {
        currentCluster.endIndex = idx + 1;
        currentCluster.length++;
      } else {
        if (currentCluster && currentCluster.length >= 2) {
          volatilityClusters.push(currentCluster);
        }
        currentCluster = {
          type,
          startIndex: idx + 1,
          endIndex: idx + 1,
          length: 1
        };
      }
    } else {
      if (currentCluster && currentCluster.length >= 2) {
        volatilityClusters.push(currentCluster);
      }
      currentCluster = null;
    }
  });
  
  if (currentCluster && currentCluster.length >= 2) {
    volatilityClusters.push(currentCluster);
  }
  
  return {
    averageVolatility: Math.round(avgVolatility * 1000) / 1000,
    maxVolatility: Math.round(maxVolatility * 1000) / 1000,
    volatilityRatio: avgVolatility === 0 ? 0 : Math.round((maxVolatility / avgVolatility) * 100) / 100,
    pattern: classifyVolatilityPattern(avgVolatility, volatilityClusters),
    clusters: volatilityClusters
  };
}

/**
 * Classify volatility pattern
 */
function classifyVolatilityPattern(avgVolatility, clusters) {
  if (avgVolatility < 0.5) return 'stable';
  if (avgVolatility > 2.0) return 'highly_volatile';
  
  const highVolClusters = clusters.filter(c => c.type === 'high').length;
  const lowVolClusters = clusters.filter(c => c.type === 'low').length;
  
  if (highVolClusters > 2) return 'volatile_bursts';
  if (lowVolClusters > 2) return 'stable_periods';
  
  return 'moderate_volatility';
}

/**
 * Analyze weekly patterns
 * @param {Array} timeSeriesData - Time series with timestamps
 * @returns {Object} - Weekly pattern analysis
 */
function analyzeWeeklyPatterns(timeSeriesData) {
  // Group by day of week
  const dayGroups = {
    0: [], // Sunday
    1: [], // Monday
    2: [], // Tuesday
    3: [], // Wednesday
    4: [], // Thursday
    5: [], // Friday
    6: []  // Saturday
  };
  
  timeSeriesData.forEach(item => {
    const dayOfWeek = item.timestamp.getDay();
    dayGroups[dayOfWeek].push(item.value);
  });
  
  // Calculate statistics for each day
  const dayStats = Object.entries(dayGroups).map(([day, values]) => {
    if (values.length === 0) return { day: parseInt(day), avg: null, count: 0 };
    
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    
    return {
      day: parseInt(day),
      dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day],
      average: Math.round(avg * 100) / 100,
      variance: Math.round(variance * 100) / 100,
      count: values.length,
      values
    };
  }).filter(stat => stat.count > 0);
  
  // Find the best and worst days
  const validDays = dayStats.filter(stat => stat.average !== null);
  const bestDay = validDays.length > 0 ? validDays.reduce((best, current) => 
    current.average > best.average ? current : best) : null;
  const worstDay = validDays.length > 0 ? validDays.reduce((worst, current) => 
    current.average < worst.average ? current : worst) : null;
  
  // Detect weekend vs weekday patterns
  const weekdayValues = [];
  const weekendValues = [];
  
  dayStats.forEach(stat => {
    if (stat.day === 0 || stat.day === 6) {
      weekendValues.push(...stat.values);
    } else {
      weekdayValues.push(...stat.values);
    }
  });
  
  const weekdayAvg = weekdayValues.length > 0 ? 
    weekdayValues.reduce((sum, val) => sum + val, 0) / weekdayValues.length : null;
  const weekendAvg = weekendValues.length > 0 ? 
    weekendValues.reduce((sum, val) => sum + val, 0) / weekendValues.length : null;
  
  return {
    dayStatistics: dayStats,
    bestDay,
    worstDay,
    weekdayAverage: weekdayAvg ? Math.round(weekdayAvg * 100) / 100 : null,
    weekendAverage: weekendAvg ? Math.round(weekendAvg * 100) / 100 : null,
    weekdayWeekendDifference: (weekdayAvg && weekendAvg) ? 
      Math.round((weekendAvg - weekdayAvg) * 100) / 100 : null,
    pattern: classifyWeeklyPattern(dayStats, weekdayAvg, weekendAvg)
  };
}

/**
 * Classify weekly pattern
 */
function classifyWeeklyPattern(dayStats, weekdayAvg, weekendAvg) {
  if (!weekdayAvg || !weekendAvg || dayStats.length < 4) return 'insufficient_data';
  
  const difference = Math.abs(weekendAvg - weekdayAvg);
  const avgOverall = (weekdayAvg + weekendAvg) / 2;
  const relativedifference = difference / avgOverall;
  
  if (relativeDistance < 0.1) return 'no_weekly_pattern';
  
  if (weekendAvg > weekdayAvg) {
    return relativeDistance > 0.2 ? 'strong_weekend_boost' : 'mild_weekend_boost';
  } else {
    return relativeDistance > 0.2 ? 'strong_weekday_preference' : 'mild_weekday_preference';
  }
}

/**
 * Analyze monthly patterns (if sufficient data)
 * @param {Array} timeSeriesData - Time series with timestamps
 * @returns {Object} - Monthly pattern analysis
 */
function analyzeMonthlyPatterns(timeSeriesData) {
  // Group by day of month
  const dayOfMonthGroups = {};
  
  timeSeriesData.forEach(item => {
    const dayOfMonth = item.timestamp.getDate();
    if (!dayOfMonthGroups[dayOfMonth]) {
      dayOfMonthGroups[dayOfMonth] = [];
    }
    dayOfMonthGroups[dayOfMonth].push(item.value);
  });
  
  // Calculate statistics for each day of month
  const monthlyStats = Object.entries(dayOfMonthGroups).map(([day, values]) => {
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    return {
      dayOfMonth: parseInt(day),
      average: Math.round(avg * 100) / 100,
      count: values.length
    };
  }).sort((a, b) => a.dayOfMonth - b.dayOfMonth);
  
  // Detect early/mid/late month patterns
  const earlyMonth = monthlyStats.filter(stat => stat.dayOfMonth <= 10);
  const midMonth = monthlyStats.filter(stat => stat.dayOfMonth > 10 && stat.dayOfMonth <= 20);
  const lateMonth = monthlyStats.filter(stat => stat.dayOfMonth > 20);
  
  const earlyAvg = earlyMonth.length > 0 ? 
    earlyMonth.reduce((sum, stat) => sum + stat.average * stat.count, 0) / 
    earlyMonth.reduce((sum, stat) => sum + stat.count, 0) : null;
  
  const midAvg = midMonth.length > 0 ? 
    midMonth.reduce((sum, stat) => sum + stat.average * stat.count, 0) / 
    midMonth.reduce((sum, stat) => sum + stat.count, 0) : null;
  
  const lateAvg = lateMonth.length > 0 ? 
    lateMonth.reduce((sum, stat) => sum + stat.average * stat.count, 0) / 
    lateMonth.reduce((sum, stat) => sum + stat.count, 0) : null;
  
  return {
    dailyStatistics: monthlyStats,
    earlyMonthAverage: earlyAvg ? Math.round(earlyAvg * 100) / 100 : null,
    midMonthAverage: midAvg ? Math.round(midAvg * 100) / 100 : null,
    lateMonthAverage: lateAvg ? Math.round(lateAvg * 100) / 100 : null,
    pattern: classifyMonthlyPattern(earlyAvg, midAvg, lateAvg)
  };
}

/**
 * Classify monthly pattern
 */
function classifyMonthlyPattern(earlyAvg, midAvg, lateAvg) {
  if (!earlyAvg || !midAvg || !lateAvg) return 'insufficient_data';
  
  const values = [earlyAvg, midAvg, lateAvg];
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const range = maxVal - minVal;
  const avgVal = (earlyAvg + midAvg + lateAvg) / 3;
  const relativeRange = range / avgVal;
  
  if (relativeRange < 0.1) return 'no_monthly_pattern';
  
  if (earlyAvg === maxVal) return 'early_month_peak';
  if (midAvg === maxVal) return 'mid_month_peak';
  if (lateAvg === maxVal) return 'late_month_peak';
  
  return 'variable_monthly_pattern';
}

/**
 * Comprehensive cycle detection across multiple scales
 * @param {number} days - Number of days to analyze
 * @returns {Object} - Multi-scale cycle analysis
 */
export function detectCyclesAcrossScales(days = 120) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const measurements = getMeasurementsInDateRange(startDate, endDate);
  
  if (measurements.length < 14) {
    return {
      cycles: [],
      error: 'Insufficient data for cycle detection',
      minRequired: 14,
      available: measurements.length
    };
  }
  
  // Define key measurement paths to analyze
  const measurementPaths = [
    'somatic_coherence.pre_session.embodied_presence',
    'somatic_coherence.post_session.embodied_presence',
    'response_quality.assessment.felt_coherence',
    'meaning_making.post_session.insight_emergence'
  ];
  
  const cycleResults = {};
  
  measurementPaths.forEach(path => {
    try {
      const analysis = analyzeTemporalPatterns(path, days);
      if (!analysis.error) {
        cycleResults[path] = {
          trends: analysis.trendAnalysis,
          periods: analysis.periodicPatterns,
          weeklyPatterns: analysis.weeklyPatterns,
          monthlyPatterns: analysis.monthlyPatterns,
          volatility: analysis.volatilityAnalysis
        };
      }
    } catch (error) {
      console.warn(`Failed to analyze temporal patterns for ${path}:`, error);
    }
  });
  
  // Cross-scale cycle detection
  const crossScaleCycles = detectCrossScaleCycles(cycleResults);
  
  // Dominant patterns summary
  const dominantPatterns = summarizeDominantPatterns(cycleResults);
  
  return {
    individualScales: cycleResults,
    crossScaleCycles,
    dominantPatterns,
    analysisDate: new Date().toISOString(),
    timeRange: { startDate: startDate.toISOString(), endDate: endDate.toISOString() }
  };
}

/**
 * Detect cycles that appear across multiple measurement scales
 */
function detectCrossScaleCycles(cycleResults) {
  const allPeriods = [];
  
  // Collect all detected periods
  Object.entries(cycleResults).forEach(([scale, results]) => {
    results.periods.forEach(period => {
      allPeriods.push({
        scale,
        period: period.period,
        correlation: period.correlation,
        confidence: period.confidence
      });
    });
  });
  
  // Find periods that appear across multiple scales
  const periodCounts = {};
  allPeriods.forEach(({ period, correlation, confidence }) => {
    const periodKey = Math.round(period); // Group similar periods
    
    if (!periodCounts[periodKey]) {
      periodCounts[periodKey] = {
        period: periodKey,
        occurrences: [],
        totalCorrelation: 0,
        totalConfidence: 0
      };
    }
    
    periodCounts[periodKey].occurrences.push({ correlation, confidence });
    periodCounts[periodKey].totalCorrelation += correlation;
    periodCounts[periodKey].totalConfidence += confidence;
  });
  
  // Identify cross-scale cycles (appearing in 2+ scales)
  const crossScaleCycles = Object.values(periodCounts)
    .filter(period => period.occurrences.length >= 2)
    .map(period => ({
      period: period.period,
      scaleCount: period.occurrences.length,
      averageCorrelation: period.totalCorrelation / period.occurrences.length,
      averageConfidence: period.totalConfidence / period.occurrences.length,
      strength: (period.occurrences.length * period.totalCorrelation) / Object.keys(cycleResults).length
    }))
    .sort((a, b) => b.strength - a.strength);
  
  return crossScaleCycles;
}

/**
 * Summarize dominant temporal patterns
 */
function summarizeDominantPatterns(cycleResults) {
  const patterns = {
    trends: { increasing: 0, decreasing: 0, stable: 0 },
    volatility: { stable: 0, moderate: 0, high: 0 },
    weeklyPatterns: {},
    commonPeriods: []
  };
  
  Object.values(cycleResults).forEach(results => {
    // Trend patterns
    if (results.trends.trend !== 'insufficient_data') {
      patterns.trends[results.trends.trend] = (patterns.trends[results.trends.trend] || 0) + 1;
    }
    
    // Volatility patterns
    const volPattern = results.volatility.pattern;
    if (volPattern === 'stable') patterns.volatility.stable++;
    else if (['volatile_bursts', 'highly_volatile'].includes(volPattern)) patterns.volatility.high++;
    else patterns.volatility.moderate++;
    
    // Weekly patterns
    if (results.weeklyPatterns.pattern !== 'insufficient_data') {
      const weekPattern = results.weeklyPatterns.pattern;
      patterns.weeklyPatterns[weekPattern] = (patterns.weeklyPatterns[weekPattern] || 0) + 1;
    }
  });
  
  return patterns;
}

export default {
  analyzeTemporalPatterns,
  detectCyclesAcrossScales,
  calculateMovingAverage,
  calculateAutocorrelation,
  detectPeriods,
  detectTrend
};