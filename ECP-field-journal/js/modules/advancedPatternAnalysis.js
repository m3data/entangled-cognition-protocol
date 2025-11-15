// js/modules/advancedPatternAnalysis.js

/**
 * Advanced pattern analysis orchestrator that integrates all analytical modules
 * for comprehensive somatic-symbolic research data analysis
 */

import { identifySessionTypes, detectCoherencePatterns, detectAnomalies } from './patternDetection.js';
import { performSemanticClustering, analyzeMetaphorDensity, analyzeSentiment } from './semanticAnalysis.js';
import { analyzeTemporalPatterns, detectCyclesAcrossScales } from './timeSeriesAnalysis.js';
import { generatePersonalizedInsights } from './insightsEngine.js';
import { getAllMeasurements, getMeasurementsInDateRange } from './storage.js';

/**
 * Perform comprehensive pattern analysis across all available data
 * @param {Object} options - Analysis configuration options
 * @returns {Object} - Comprehensive analysis results
 */
export function performComprehensiveAnalysis(options = {}) {
  const {
    days = 90,
    includeSemanticAnalysis = true,
    includeTemporalAnalysis = true,
    includeCoherenceAnalysis = true,
    includeInsights = true,
    sessionTypesClusters = 4,
    semanticClusters = 5,
    analysisDepth = 'full' // 'quick', 'standard', 'full'
  } = options;

  const startTime = Date.now();
  const results = {
    analysisConfig: options,
    startTime: new Date().toISOString(),
    analysisDepth,
    modules: {}
  };

  try {
    console.log('Starting comprehensive pattern analysis...');

    // Get measurement data
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const measurements = getMeasurementsInDateRange(startDate, endDate);

    if (measurements.length < 3) {
      return {
        ...results,
        error: 'Insufficient data for comprehensive analysis',
        minRequired: 3,
        available: measurements.length,
        completionTime: Date.now() - startTime
      };
    }

    results.dataOverview = {
      totalSessions: measurements.length,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        daysCovered: days
      },
      dataQuality: assessDataCompleteness(measurements)
    };

    // Core pattern detection
    console.log('Analyzing session types and coherence patterns...');
    if (analysisDepth !== 'quick') {
      results.modules.sessionTypes = identifySessionTypes(days, sessionTypesClusters);
      results.modules.coherencePatterns = detectCoherencePatterns(days);
      results.modules.anomalies = detectAnomalies(Math.min(days * 1.5, 120)); // Extend range for better anomaly detection
    }

    // Semantic analysis
    if (includeSemanticAnalysis && (analysisDepth === 'full' || analysisDepth === 'standard')) {
      console.log('Performing semantic analysis...');
      results.modules.semanticClusters = performSemanticClustering(days, semanticClusters);
      results.modules.metaphorAnalysis = analyzeMetaphorDensity(measurements);
      results.modules.sentimentAnalysis = analyzeSentiment(days);
    }

    // Temporal analysis
    if (includeTemporalAnalysis && analysisDepth !== 'quick') {
      console.log('Analyzing temporal patterns and cycles...');
      results.modules.temporalCycles = detectCyclesAcrossScales(days);
      
      if (analysisDepth === 'full') {
        // Individual scale temporal analysis for key measurements
        const keyScales = [
          'somatic_coherence.pre_session.embodied_presence',
          'somatic_coherence.post_session.embodied_presence',
          'response_quality.assessment.felt_coherence',
          'meaning_making.post_session.insight_emergence'
        ];
        
        results.modules.individualTemporalPatterns = {};
        for (const scale of keyScales) {
          try {
            results.modules.individualTemporalPatterns[scale] = analyzeTemporalPatterns(scale, days);
          } catch (error) {
            console.warn(`Failed to analyze temporal patterns for ${scale}:`, error);
          }
        }
      }
    }

    // Advanced coherence analysis (if enabled)
    if (includeCoherenceAnalysis && analysisDepth !== 'quick') {
      console.log('Performing advanced coherence analysis...');
      results.modules.advancedCoherence = performAdvancedCoherenceAnalysis(measurements, results.modules);
    }

    // Personalized insights generation
    if (includeInsights) {
      console.log('Generating personalized insights...');
      results.modules.personalizedInsights = generatePersonalizedInsights(days);
    }

    // Cross-module pattern integration
    if (analysisDepth === 'full') {
      console.log('Integrating cross-module patterns...');
      results.modules.integratedPatterns = integrateAcrossModules(results.modules, measurements);
    }

    // Generate executive summary
    results.executiveSummary = generateExecutiveSummary(results.modules, measurements);

    const completionTime = Date.now() - startTime;
    results.completionTime = completionTime;
    results.completionTimeFormatted = `${(completionTime / 1000).toFixed(2)}s`;

    console.log(`Comprehensive analysis completed in ${results.completionTimeFormatted}`);
    
    return results;

  } catch (error) {
    console.error('Error in comprehensive analysis:', error);
    return {
      ...results,
      error: 'Failed to complete comprehensive analysis',
      errorDetails: error.message,
      completionTime: Date.now() - startTime
    };
  }
}

/**
 * Assess data completeness and quality
 */
function assessDataCompleteness(measurements) {
  let somaticDataCount = 0;
  let responseQualityCount = 0;
  let meaningMakingCount = 0;
  let qualitativeDataCount = 0;
  let temporalSpreadScore = 0;

  const dates = measurements.map(m => new Date(m.timestamp));
  const uniqueDays = new Set(dates.map(d => d.toDateString())).size;
  const timeSpan = dates.length > 1 ? 
    (Math.max(...dates) - Math.min(...dates)) / (1000 * 60 * 60 * 24) : 0;

  measurements.forEach(measurement => {
    if (measurement.somatic_coherence?.pre_session || measurement.somatic_coherence?.post_session) {
      somaticDataCount++;
    }
    if (measurement.response_quality?.assessment) {
      responseQualityCount++;
    }
    if (measurement.meaning_making?.post_session) {
      meaningMakingCount++;
    }
    if (measurement.emergent_ecp_insights || measurement.somatic_coherence?.qualitative_notes) {
      qualitativeDataCount++;
    }
  });

  temporalSpreadScore = uniqueDays / Math.max(timeSpan, 1);

  const total = measurements.length;
  return {
    somaticCompleteness: Math.round((somaticDataCount / total) * 100),
    responseQualityCompleteness: Math.round((responseQualityCount / total) * 100),
    meaningMakingCompleteness: Math.round((meaningMakingCount / total) * 100),
    qualitativeCompleteness: Math.round((qualitativeDataCount / total) * 100),
    temporalDistribution: Math.min(100, Math.round(temporalSpreadScore * 100)),
    overallQuality: calculateOverallDataQuality(somaticDataCount, responseQualityCount, meaningMakingCount, qualitativeDataCount, total)
  };
}

/**
 * Calculate overall data quality score
 */
function calculateOverallDataQuality(somaticCount, responseCount, meaningCount, qualitativeCount, total) {
  const somaticRatio = somaticCount / total;
  const responseRatio = responseCount / total;
  const meaningRatio = meaningCount / total;
  const qualitativeRatio = qualitativeCount / total;

  const weightedScore = (somaticRatio * 0.3) + (responseRatio * 0.25) + (meaningRatio * 0.25) + (qualitativeRatio * 0.2);

  if (weightedScore > 0.8 && total >= 20) return 'excellent';
  if (weightedScore > 0.6 && total >= 10) return 'good';
  if (weightedScore > 0.4 && total >= 5) return 'fair';
  return 'poor';
}

/**
 * Perform advanced coherence analysis that goes beyond basic pattern detection
 */
function performAdvancedCoherenceAnalysis(measurements, moduleResults) {
  const coherenceAnalysis = {
    multiDimensionalCoherence: calculateMultiDimensionalCoherence(measurements),
    coherenceEvolution: analyzeCoherenceEvolution(measurements),
    coherenceDrivers: identifyCoherenceDrivers(measurements, moduleResults),
    coherenceStability: analyzeCoherenceStability(measurements)
  };

  return coherenceAnalysis;
}

/**
 * Calculate multi-dimensional coherence across different measurement domains
 */
function calculateMultiDimensionalCoherence(measurements) {
  const coherenceDimensions = {
    somaticCoherence: [],
    responseCoherence: [], 
    meaningCoherence: [],
    emergenceCoherence: [],
    crossDomainCoherence: []
  };

  measurements.forEach(measurement => {
    // Somatic coherence
    const somatic = measurement.somatic_coherence;
    if (somatic?.pre_session && somatic?.post_session) {
      const somaticValues = [
        somatic.pre_session.embodied_presence,
        somatic.pre_session.energetic_resonance,
        somatic.pre_session.somatic_intelligence,
        somatic.pre_session.groundedness,
        somatic.post_session.embodied_presence,
        somatic.post_session.energetic_resonance,
        somatic.post_session.somatic_intelligence,
        somatic.post_session.groundedness
      ].filter(v => typeof v === 'number');

      if (somaticValues.length >= 6) {
        coherenceDimensions.somaticCoherence.push(calculateInternalCoherence(somaticValues));
      }
    }

    // Response coherence
    const response = measurement.response_quality?.assessment;
    if (response) {
      const responseValues = [
        response.metaphor_richness,
        response.personal_relevance,
        response.depth_vs_surface,
        response.novelty_factor,
        response.felt_coherence
      ].filter(v => typeof v === 'number');

      if (responseValues.length >= 4) {
        coherenceDimensions.responseCoherence.push(calculateInternalCoherence(responseValues));
      }
    }

    // Meaning-making coherence
    const meaning = measurement.meaning_making?.post_session;
    if (meaning) {
      const meaningValues = [
        meaning.insight_emergence,
        meaning.integration_ease,
        meaning.practical_relevance,
        meaning.symbolic_resonance
      ].filter(v => typeof v === 'number');

      if (meaningValues.length >= 3) {
        coherenceDimensions.meaningCoherence.push(calculateInternalCoherence(meaningValues));
      }
    }

    // Emergence coherence
    const emergence = measurement.emergence_patterns?.session_outcome;
    if (emergence) {
      const emergenceValues = [
        emergence.unexpected_insights_count,
        emergence.pattern_recognition_quality,
        emergence.creative_sparks,
        emergence.integration_impulses
      ].filter(v => typeof v === 'number');

      if (emergenceValues.length >= 3) {
        coherenceDimensions.emergenceCoherence.push(calculateInternalCoherence(emergenceValues));
      }
    }
  });

  // Calculate cross-domain coherence
  const minLength = Math.min(...Object.values(coherenceDimensions).map(arr => arr.length));
  for (let i = 0; i < minLength; i++) {
    const crossDomainValues = [
      coherenceDimensions.somaticCoherence[i] || null,
      coherenceDimensions.responseCoherence[i] || null,
      coherenceDimensions.meaningCoherence[i] || null,
      coherenceDimensions.emergenceCoherence[i] || null
    ].filter(v => v !== null);

    if (crossDomainValues.length >= 2) {
      coherenceDimensions.crossDomainCoherence.push(calculateInternalCoherence(crossDomainValues));
    }
  }

  // Calculate summary statistics
  const summaryStats = {};
  Object.entries(coherenceDimensions).forEach(([dimension, values]) => {
    if (values.length > 0) {
      summaryStats[dimension] = {
        mean: values.reduce((sum, v) => sum + v, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        variance: calculateVariance(values),
        count: values.length,
        trend: values.length >= 3 ? calculateSimpleTrend(values) : null
      };
    }
  });

  return {
    dimensionData: coherenceDimensions,
    summaryStats,
    overallCoherence: calculateOverallCoherenceScore(summaryStats)
  };
}

/**
 * Calculate internal coherence within a set of values (inverse of variance)
 */
function calculateInternalCoherence(values) {
  if (values.length < 2) return 0;
  
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  
  // Normalize variance based on scale (assuming max scale of 10)
  const normalizedVariance = variance / 25; // Max possible variance for scale 0-10
  
  // Coherence is inverse of normalized variance, scaled to 0-1
  return Math.max(0, 1 - normalizedVariance);
}

/**
 * Analyze how coherence evolves over time
 */
function analyzeCoherenceEvolution(measurements) {
  // Sort measurements by timestamp
  const sortedMeasurements = [...measurements].sort((a, b) => 
    new Date(a.timestamp) - new Date(b.timestamp)
  );

  const coherenceTimeSeries = sortedMeasurements.map(measurement => {
    const timestamp = new Date(measurement.timestamp);
    const coherenceScore = calculateMeasurementCoherence(measurement);
    return { timestamp, coherence: coherenceScore };
  }).filter(item => item.coherence !== null);

  if (coherenceTimeSeries.length < 3) {
    return { evolution: null, error: 'Insufficient data for coherence evolution analysis' };
  }

  // Calculate moving averages
  const windowSizes = [3, 7, 14];
  const movingAverages = {};
  
  windowSizes.forEach(windowSize => {
    if (coherenceTimeSeries.length >= windowSize) {
      movingAverages[`ma_${windowSize}`] = calculateMovingAverage(
        coherenceTimeSeries.map(item => item.coherence), 
        windowSize
      );
    }
  });

  // Detect coherence phases (periods of similar coherence levels)
  const phases = detectCoherencePhases(coherenceTimeSeries);

  // Calculate overall evolution trend
  const values = coherenceTimeSeries.map(item => item.coherence);
  const evolutionTrend = calculateSimpleTrend(values);

  return {
    timeSeries: coherenceTimeSeries,
    movingAverages,
    phases,
    evolutionTrend,
    totalSessions: coherenceTimeSeries.length,
    timeSpan: coherenceTimeSeries.length > 1 ? 
      (coherenceTimeSeries[coherenceTimeSeries.length - 1].timestamp - coherenceTimeSeries[0].timestamp) / (1000 * 60 * 60 * 24) : 0
  };
}

/**
 * Calculate coherence score for a single measurement
 */
function calculateMeasurementCoherence(measurement) {
  const coherenceComponents = [];

  // Somatic coherence component
  const somatic = measurement.somatic_coherence;
  if (somatic?.post_session) {
    const somaticValues = [
      somatic.post_session.embodied_presence,
      somatic.post_session.energetic_resonance,
      somatic.post_session.somatic_intelligence,
      somatic.post_session.groundedness
    ].filter(v => typeof v === 'number' && !isNaN(v));

    if (somaticValues.length >= 3) {
      coherenceComponents.push(calculateInternalCoherence(somaticValues));
    }
  }

  // Response quality coherence component
  const response = measurement.response_quality?.assessment;
  if (response) {
    const responseValues = [
      response.felt_coherence,
      response.depth_vs_surface,
      response.personal_relevance
    ].filter(v => typeof v === 'number' && !isNaN(v));

    if (responseValues.length >= 2) {
      coherenceComponents.push(calculateInternalCoherence(responseValues));
    }
  }

  // Meaning-making coherence component
  const meaning = measurement.meaning_making?.post_session;
  if (meaning) {
    const meaningValues = [
      meaning.insight_emergence,
      meaning.integration_ease,
      meaning.symbolic_resonance
    ].filter(v => typeof v === 'number' && !isNaN(v));

    if (meaningValues.length >= 2) {
      coherenceComponents.push(calculateInternalCoherence(meaningValues));
    }
  }

  if (coherenceComponents.length === 0) return null;

  return coherenceComponents.reduce((sum, component) => sum + component, 0) / coherenceComponents.length;
}

/**
 * Detect distinct phases in coherence evolution
 */
function detectCoherencePhases(coherenceTimeSeries) {
  if (coherenceTimeSeries.length < 6) return [];

  const phases = [];
  let currentPhase = {
    startIndex: 0,
    values: [coherenceTimeSeries[0].coherence],
    startTimestamp: coherenceTimeSeries[0].timestamp
  };

  const phaseChangeThreshold = 0.15; // Minimum change to constitute a new phase

  for (let i = 1; i < coherenceTimeSeries.length; i++) {
    const currentValue = coherenceTimeSeries[i].coherence;
    const phaseAvg = currentPhase.values.reduce((sum, v) => sum + v, 0) / currentPhase.values.length;

    if (Math.abs(currentValue - phaseAvg) > phaseChangeThreshold && currentPhase.values.length >= 3) {
      // End current phase
      currentPhase.endIndex = i - 1;
      currentPhase.endTimestamp = coherenceTimeSeries[i - 1].timestamp;
      currentPhase.average = phaseAvg;
      currentPhase.duration = Math.round((currentPhase.endTimestamp - currentPhase.startTimestamp) / (1000 * 60 * 60 * 24));
      phases.push(currentPhase);

      // Start new phase
      currentPhase = {
        startIndex: i,
        values: [currentValue],
        startTimestamp: coherenceTimeSeries[i].timestamp
      };
    } else {
      currentPhase.values.push(currentValue);
    }
  }

  // Close final phase
  if (currentPhase.values.length >= 3) {
    currentPhase.endIndex = coherenceTimeSeries.length - 1;
    currentPhase.endTimestamp = coherenceTimeSeries[coherenceTimeSeries.length - 1].timestamp;
    currentPhase.average = currentPhase.values.reduce((sum, v) => sum + v, 0) / currentPhase.values.length;
    currentPhase.duration = Math.round((currentPhase.endTimestamp - currentPhase.startTimestamp) / (1000 * 60 * 60 * 24));
    phases.push(currentPhase);
  }

  return phases.map((phase, index) => ({
    phaseNumber: index + 1,
    average: Math.round(phase.average * 1000) / 1000,
    sessionCount: phase.values.length,
    duration: phase.duration,
    startDate: phase.startTimestamp.toISOString().split('T')[0],
    endDate: phase.endTimestamp.toISOString().split('T')[0],
    trend: phase.values.length >= 3 ? calculateSimpleTrend(phase.values).slope > 0.01 ? 'increasing' : 
           calculateSimpleTrend(phase.values).slope < -0.01 ? 'decreasing' : 'stable' : 'stable'
  }));
}

/**
 * Identify what factors drive coherence improvements
 */
function identifyCoherenceDrivers(measurements, moduleResults) {
  // This is a complex analysis that would benefit from more sophisticated statistical methods
  // For now, we'll do a simplified correlation analysis

  const drivers = {
    environmentalFactors: {},
    temporalFactors: {},
    preparationFactors: {},
    sessionCharacteristics: {}
  };

  // Analyze correlations between coherence and various factors
  const measurementsWithCoherence = measurements.map(measurement => ({
    ...measurement,
    coherenceScore: calculateMeasurementCoherence(measurement)
  })).filter(m => m.coherenceScore !== null);

  if (measurementsWithCoherence.length < 5) {
    return { drivers: null, error: 'Insufficient data for coherence driver analysis' };
  }

  // Environmental correlations
  if (moduleResults.temporalCycles?.individualScales) {
    const weeklyPatterns = Object.values(moduleResults.temporalCycles.individualScales)
      .map(scale => scale.weeklyPatterns)
      .filter(pattern => pattern.bestDay);

    if (weeklyPatterns.length > 0) {
      drivers.temporalFactors.weeklyPattern = {
        bestDay: weeklyPatterns[0].bestDay?.dayName || 'Unknown',
        strength: 'moderate'
      };
    }
  }

  // Session type correlations
  if (moduleResults.sessionTypes?.sessionTypes) {
    const highCoherenceTypes = moduleResults.sessionTypes.sessionTypes
      .filter(type => type.characteristics?.somaticProfile?.avgPost > 7)
      .map(type => type.name);

    if (highCoherenceTypes.length > 0) {
      drivers.sessionCharacteristics.highCoherenceTypes = highCoherenceTypes;
    }
  }

  return drivers;
}

/**
 * Analyze coherence stability and variability patterns
 */
function analyzeCoherenceStability(measurements) {
  const coherenceValues = measurements.map(m => calculateMeasurementCoherence(m)).filter(v => v !== null);

  if (coherenceValues.length < 5) {
    return { stability: null, error: 'Insufficient data for stability analysis' };
  }

  const mean = coherenceValues.reduce((sum, v) => sum + v, 0) / coherenceValues.length;
  const variance = calculateVariance(coherenceValues);
  const standardDeviation = Math.sqrt(variance);
  const coefficientOfVariation = standardDeviation / mean;

  // Calculate stability metrics
  const stabilityScore = Math.max(0, 1 - coefficientOfVariation);
  let stabilityLevel = 'unstable';
  if (stabilityScore > 0.8) stabilityLevel = 'very_stable';
  else if (stabilityScore > 0.6) stabilityLevel = 'stable';
  else if (stabilityScore > 0.4) stabilityLevel = 'moderately_stable';

  // Identify stability patterns
  const patterns = [];
  if (coefficientOfVariation < 0.15) {
    patterns.push('consistent_performer');
  } else if (coefficientOfVariation > 0.4) {
    patterns.push('high_variability');
  }

  return {
    mean: Math.round(mean * 1000) / 1000,
    variance: Math.round(variance * 1000) / 1000,
    standardDeviation: Math.round(standardDeviation * 1000) / 1000,
    coefficientOfVariation: Math.round(coefficientOfVariation * 1000) / 1000,
    stabilityScore: Math.round(stabilityScore * 1000) / 1000,
    stabilityLevel,
    patterns,
    sampleSize: coherenceValues.length
  };
}

/**
 * Integrate patterns across all analysis modules to find meta-patterns
 */
function integrateAcrossModules(modules, measurements) {
  const integrations = {
    convergentPatterns: [],
    divergentPatterns: [],
    emergentPatterns: [],
    crossValidatedInsights: []
  };

  // Look for convergent patterns (similar findings across modules)
  const convergentFindings = findConvergentPatterns(modules);
  integrations.convergentPatterns = convergentFindings;

  // Look for divergent patterns (conflicting findings that need explanation)
  const divergentFindings = findDivergentPatterns(modules);
  integrations.divergentPatterns = divergentFindings;

  // Look for emergent patterns (insights that only appear when combining modules)
  const emergentFindings = findEmergentPatterns(modules, measurements);
  integrations.emergentPatterns = emergentFindings;

  return integrations;
}

/**
 * Find patterns that appear consistently across multiple analysis modules
 */
function findConvergentPatterns(modules) {
  const convergentPatterns = [];

  // Pattern 1: High performance consistency
  const hasHighCoherence = modules.coherencePatterns?.patterns?.some(p => p.type === 'high_coherence_trend');
  const hasPositiveSentiment = modules.sentimentAnalysis?.sentimentAnalysis?.sentimentTrend === 'improving';
  const hasBreakthroughSessions = modules.sessionTypes?.sessionTypes?.some(t => t.name.includes('Breakthrough'));

  if ([hasHighCoherence, hasPositiveSentiment, hasBreakthroughSessions].filter(Boolean).length >= 2) {
    convergentPatterns.push({
      type: 'high_performance_convergence',
      name: 'Consistent High Performance Pattern',
      description: 'Multiple analysis modules confirm a pattern of high-quality, coherent sessions with positive outcomes.',
      supportingModules: [
        hasHighCoherence && 'coherence_analysis',
        hasPositiveSentiment && 'sentiment_analysis', 
        hasBreakthroughSessions && 'session_types'
      ].filter(Boolean),
      confidence: 'high'
    });
  }

  // Pattern 2: Temporal rhythm convergence
  const hasWeeklyPattern = modules.temporalCycles?.dominantPatterns?.weeklyPatterns && 
    Object.keys(modules.temporalCycles.dominantPatterns.weeklyPatterns).length > 0;
  const hasStableCoherence = modules.advancedCoherence?.coherenceStability?.stabilityLevel === 'stable' ||
    modules.advancedCoherence?.coherenceStability?.stabilityLevel === 'very_stable';

  if (hasWeeklyPattern && hasStableCoherence) {
    convergentPatterns.push({
      type: 'temporal_stability_convergence',
      name: 'Stable Rhythmic Pattern',
      description: 'Both temporal analysis and coherence stability indicate you have established sustainable practice rhythms.',
      supportingModules: ['temporal_analysis', 'coherence_stability'],
      confidence: 'medium'
    });
  }

  return convergentPatterns;
}

/**
 * Find patterns that conflict between modules (requiring further investigation)
 */
function findDivergentPatterns(modules) {
  const divergentPatterns = [];

  // Pattern 1: Sentiment-coherence divergence
  const hasHighCoherence = modules.coherencePatterns?.summary?.averageOverallCoherence > 0.7;
  const hasNegativeSentiment = modules.sentimentAnalysis?.sentimentAnalysis?.sentimentTrend === 'declining';

  if (hasHighCoherence && hasNegativeSentiment) {
    divergentPatterns.push({
      type: 'coherence_sentiment_divergence',
      name: 'High Coherence with Declining Sentiment',
      description: 'Your sessions maintain technical coherence but emotional tone is declining. This may indicate intellectual engagement without emotional fulfillment.',
      conflictingModules: ['coherence_analysis', 'sentiment_analysis'],
      investigationSuggestions: [
        'Review whether session goals align with emotional needs',
        'Consider the balance between analytical and experiential engagement',
        'Examine if increased competence is reducing sense of discovery'
      ]
    });
  }

  // Pattern 2: Performance-stability divergence  
  const hasHighPerformanceSessions = modules.sessionTypes?.sessionTypes?.some(t => 
    t.name.includes('Breakthrough') || t.name.includes('Deep')
  );
  const hasHighVariability = modules.advancedCoherence?.coherenceStability?.stabilityLevel === 'unstable';

  if (hasHighPerformanceSessions && hasHighVariability) {
    divergentPatterns.push({
      type: 'performance_stability_divergence', 
      name: 'High Performance with High Variability',
      description: 'You achieve breakthrough sessions but with high variability. This suggests untapped potential for more consistent high performance.',
      conflictingModules: ['session_types', 'coherence_stability'],
      investigationSuggestions: [
        'Identify specific conditions that enable breakthrough sessions',
        'Develop more systematic approaches to session preparation',
        'Track environmental and internal factors more consistently'
      ]
    });
  }

  return divergentPatterns;
}

/**
 * Find patterns that only emerge when analyzing data across multiple modules
 */
function findEmergentPatterns(modules, measurements) {
  const emergentPatterns = [];

  // Pattern 1: Semantic-somatic alignment phases
  if (modules.semanticClusters?.clusters && modules.advancedCoherence?.coherenceEvolution?.phases) {
    const semanticThemes = modules.semanticClusters.clusters.map(c => c.themes?.[0]?.category).filter(Boolean);
    const coherencePhases = modules.advancedCoherence.coherenceEvolution.phases;

    if (semanticThemes.length > 0 && coherencePhases.length > 1) {
      emergentPatterns.push({
        type: 'thematic_coherence_evolution',
        name: 'Thematic-Coherence Co-Evolution',
        description: 'Your thematic interests and coherence levels appear to co-evolve, suggesting deep integration between content and process.',
        evidence: `${semanticThemes.length} thematic clusters align with ${coherencePhases.length} coherence phases`,
        implications: [
          'Content and process are deeply interrelated in your practice',
          'Thematic shifts may predict coherence changes', 
          'Coherence phases may influence thematic accessibility'
        ]
      });
    }
  }

  // Pattern 2: Anomaly-emergence correlation
  if (modules.anomalies?.anomalies && modules.personalizedInsights?.insights) {
    const positiveAnomalies = modules.anomalies.anomalies.filter(a => 
      a.type === 'emergence_anomaly' || a.description.includes('unusually high')
    );
    
    const emergenceInsights = modules.personalizedInsights.insights.filter(i =>
      i.type === 'rare_pattern_opportunity' || i.title.includes('Breakthrough')
    );

    if (positiveAnomalies.length > 0 && emergenceInsights.length > 0) {
      emergentPatterns.push({
        type: 'anomaly_emergence_correlation',
        name: 'Anomalous Sessions as Emergence Predictors',
        description: 'Your anomalous sessions appear to correlate with emergence opportunities, suggesting breakthrough potential.',
        evidence: `${positiveAnomalies.length} positive anomalies coincide with ${emergenceInsights.length} emergence insights`,
        actionable: true,
        recommendations: [
          'Pay special attention to conditions surrounding anomalous sessions',
          'Use anomaly detection as an early indicator for deeper work opportunities',
          'Document the lead-up to anomalous sessions for pattern recognition'
        ]
      });
    }
  }

  return emergentPatterns;
}

/**
 * Generate executive summary of all findings
 */
function generateExecutiveSummary(modules, measurements) {
  const summary = {
    overallAssessment: 'developing', // developing, established, advanced, expert
    keyFindings: [],
    primaryRecommendations: [],
    practiceMaturity: assessPracticeMaturity(modules, measurements),
    dataInsights: generateDataInsights(modules, measurements)
  };

  // Assess overall trajectory
  const hasHighCoherence = modules.coherencePatterns?.patterns?.length > 0;
  const hasPositiveSentiment = modules.sentimentAnalysis?.sentimentAnalysis?.averageSentiment > 0;
  const hasBreakthroughCapacity = modules.sessionTypes?.sessionTypes?.some(t => t.name.includes('Breakthrough'));
  const hasStablePatterns = modules.temporalCycles?.dominantPatterns;

  const positiveIndicators = [hasHighCoherence, hasPositiveSentiment, hasBreakthroughCapacity, hasStablePatterns].filter(Boolean).length;

  if (positiveIndicators >= 3) summary.overallAssessment = 'advanced';
  else if (positiveIndicators >= 2) summary.overallAssessment = 'established';
  else if (positiveIndicators >= 1) summary.overallAssessment = 'developing';

  // Key findings
  if (modules.personalizedInsights?.insights) {
    summary.keyFindings = modules.personalizedInsights.insights
      .filter(insight => insight.priority === 'high')
      .slice(0, 3)
      .map(insight => ({
        finding: insight.title,
        description: insight.description,
        confidence: insight.confidence || 'medium'
      }));
  }

  // Primary recommendations
  if (modules.personalizedInsights?.recommendations) {
    summary.primaryRecommendations = modules.personalizedInsights.recommendations
      .slice(0, 5)
      .map(rec => ({
        action: rec.title,
        description: rec.description,
        priority: rec.priority,
        category: rec.category
      }));
  }

  return summary;
}

/**
 * Assess overall practice maturity based on various indicators
 */
function assessPracticeMaturity(modules, measurements) {
  let maturityScore = 0;
  const indicators = [];

  // Data consistency (20 points)
  if (measurements.length >= 30) {
    maturityScore += 20;
    indicators.push('sustained_practice');
  } else if (measurements.length >= 10) {
    maturityScore += 10;
    indicators.push('developing_consistency');
  }

  // Coherence development (25 points)
  const avgCoherence = modules.coherencePatterns?.summary?.averageOverallCoherence || 0;
  if (avgCoherence > 0.8) {
    maturityScore += 25;
    indicators.push('high_coherence');
  } else if (avgCoherence > 0.6) {
    maturityScore += 15;
    indicators.push('developing_coherence');
  }

  // Breakthrough capacity (20 points)
  const hasBreakthroughs = modules.sessionTypes?.sessionTypes?.some(t => 
    t.name.includes('Breakthrough') || t.name.includes('Deep')
  );
  if (hasBreakthroughs) {
    maturityScore += 20;
    indicators.push('breakthrough_capacity');
  }

  // Integration capacity (20 points) 
  const hasIntegration = modules.semanticClusters?.clusters?.some(c => 
    c.themes?.some(theme => theme.category === 'transformational')
  );
  if (hasIntegration) {
    maturityScore += 20;
    indicators.push('integration_capacity');
  }

  // Stability (15 points)
  const isStable = modules.advancedCoherence?.coherenceStability?.stabilityLevel === 'stable' ||
    modules.advancedCoherence?.coherenceStability?.stabilityLevel === 'very_stable';
  if (isStable) {
    maturityScore += 15;
    indicators.push('stable_practice');
  }

  let maturityLevel = 'novice';
  if (maturityScore >= 80) maturityLevel = 'expert';
  else if (maturityScore >= 60) maturityLevel = 'advanced';
  else if (maturityScore >= 40) maturityLevel = 'intermediate';
  else if (maturityScore >= 20) maturityLevel = 'developing';

  return {
    level: maturityLevel,
    score: maturityScore,
    maxScore: 100,
    indicators,
    nextDevelopmentAreas: suggestDevelopmentAreas(indicators, maturityScore)
  };
}

/**
 * Suggest areas for development based on maturity assessment
 */
function suggestDevelopmentAreas(currentIndicators, currentScore) {
  const allIndicators = ['sustained_practice', 'high_coherence', 'breakthrough_capacity', 'integration_capacity', 'stable_practice'];
  const missingIndicators = allIndicators.filter(indicator => !currentIndicators.includes(indicator));

  const suggestions = {
    sustained_practice: 'Focus on consistency - aim for regular session rhythm over breakthrough intensity',
    high_coherence: 'Work on developing coherence across somatic, response, and meaning-making domains',
    breakthrough_capacity: 'Experiment with session conditions to cultivate breakthrough experiences',
    integration_capacity: 'Focus on translating insights into embodied understanding and life changes',
    stable_practice: 'Develop consistent preparation rituals and environmental setups'
  };

  return missingIndicators.map(indicator => ({
    area: indicator.replace(/_/g, ' '),
    suggestion: suggestions[indicator]
  }));
}

/**
 * Generate insights about the user's data patterns themselves
 */
function generateDataInsights(modules, measurements) {
  const insights = [];

  // Data completeness insight
  const qualitativeRatio = measurements.filter(m => 
    m.emergent_ecp_insights || m.somatic_coherence?.qualitative_notes
  ).length / measurements.length;

  if (qualitativeRatio > 0.7) {
    insights.push({
      type: 'data_strength',
      insight: 'Rich qualitative data enables deep semantic analysis',
      recommendation: 'Continue detailed reflection practices'
    });
  } else if (qualitativeRatio < 0.3) {
    insights.push({
      type: 'data_opportunity',
      insight: 'More qualitative reflection could enable deeper pattern analysis',
      recommendation: 'Consider adding brief post-session reflections'
    });
  }

  // Temporal coverage insight
  const uniqueDays = new Set(measurements.map(m => new Date(m.timestamp).getDay())).size;
  if (uniqueDays >= 5) {
    insights.push({
      type: 'data_strength',
      insight: 'Good temporal coverage enables reliable weekly pattern detection',
      recommendation: 'Maintain diverse session timing for continued insights'
    });
  }

  return insights;
}

/**
 * Helper functions
 */
function calculateVariance(values) {
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  return values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
}

function calculateSimpleTrend(values) {
  const n = values.length;
  const x = Array.from({ length: n }, (_, i) => i);
  
  const xSum = x.reduce((sum, val) => sum + val, 0);
  const ySum = values.reduce((sum, val) => sum + val, 0);
  const xySum = x.reduce((sum, val, idx) => sum + (val * values[idx]), 0);
  const x2Sum = x.reduce((sum, val) => sum + (val * val), 0);
  
  const slope = (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum);
  const intercept = (ySum - slope * xSum) / n;
  
  return { slope, intercept };
}

function calculateMovingAverage(values, windowSize) {
  const result = [];
  for (let i = windowSize - 1; i < values.length; i++) {
    const window = values.slice(i - windowSize + 1, i + 1);
    const average = window.reduce((sum, val) => sum + val, 0) / windowSize;
    result.push(average);
  }
  return result;
}

function calculateOverallCoherenceScore(summaryStats) {
  const validStats = Object.values(summaryStats).filter(stat => stat && typeof stat.mean === 'number');
  if (validStats.length === 0) return null;
  
  const weightedSum = validStats.reduce((sum, stat) => sum + stat.mean, 0);
  return Math.round((weightedSum / validStats.length) * 1000) / 1000;
}

export default {
  performComprehensiveAnalysis
};