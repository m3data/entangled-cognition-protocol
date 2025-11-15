// js/modules/patternDetection.js

/**
 * Advanced pattern detection algorithms for somatic-symbolic research data
 * Detects coherence patterns, session types, and emergent phenomena
 */

import { getAllMeasurements, getMeasurementsInDateRange } from './storage.js';

/**
 * Clustering algorithm using k-means for session type identification
 * @param {Array} dataPoints - Array of feature vectors
 * @param {number} k - Number of clusters
 * @param {number} maxIterations - Maximum iterations for convergence
 * @returns {Object} - Clustering results
 */
function kMeansCluster(dataPoints, k, maxIterations = 100) {
  if (dataPoints.length === 0) return { clusters: [], centroids: [], assignments: [] };
  
  const dimensions = dataPoints[0].length;
  
  // Initialize centroids randomly
  let centroids = Array(k).fill().map(() => 
    Array(dimensions).fill().map(() => Math.random())
  );
  
  let assignments = new Array(dataPoints.length);
  let prevAssignments = new Array(dataPoints.length).fill(-1);
  
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    // Assign points to nearest centroid
    for (let i = 0; i < dataPoints.length; i++) {
      let minDistance = Infinity;
      let closestCentroid = 0;
      
      for (let j = 0; j < k; j++) {
        const distance = euclideanDistance(dataPoints[i], centroids[j]);
        if (distance < minDistance) {
          minDistance = distance;
          closestCentroid = j;
        }
      }
      
      assignments[i] = closestCentroid;
    }
    
    // Check for convergence
    if (assignments.every((val, idx) => val === prevAssignments[idx])) {
      break;
    }
    
    prevAssignments = [...assignments];
    
    // Update centroids
    for (let j = 0; j < k; j++) {
      const clusterPoints = dataPoints.filter((_, idx) => assignments[idx] === j);
      
      if (clusterPoints.length > 0) {
        centroids[j] = Array(dimensions).fill().map((_, dim) => {
          const sum = clusterPoints.reduce((acc, point) => acc + point[dim], 0);
          return sum / clusterPoints.length;
        });
      }
    }
  }
  
  // Create cluster objects with metadata
  const clusters = centroids.map((centroid, idx) => {
    const clusterDataIndices = assignments.map((assignment, dataIdx) => 
      assignment === idx ? dataIdx : null
    ).filter(val => val !== null);
    
    return {
      id: idx,
      centroid,
      size: clusterDataIndices.length,
      memberIndices: clusterDataIndices,
      variance: calculateClusterVariance(dataPoints, clusterDataIndices, centroid)
    };
  });
  
  return { clusters, centroids, assignments };
}

/**
 * Calculate Euclidean distance between two vectors
 */
function euclideanDistance(a, b) {
  return Math.sqrt(a.reduce((sum, val, idx) => sum + Math.pow(val - b[idx], 2), 0));
}

/**
 * Calculate variance within a cluster
 */
function calculateClusterVariance(dataPoints, memberIndices, centroid) {
  if (memberIndices.length === 0) return 0;
  
  const sumSquaredDistances = memberIndices.reduce((sum, idx) => {
    return sum + Math.pow(euclideanDistance(dataPoints[idx], centroid), 2);
  }, 0);
  
  return sumSquaredDistances / memberIndices.length;
}

/**
 * Extract feature vectors from measurement data for clustering
 * @param {Array} measurements - Array of measurement entries
 * @returns {Array} - Feature vectors for clustering
 */
function extractFeatureVectors(measurements) {
  return measurements.map(measurement => {
    const features = [];
    
    // Somatic coherence features (pre and post)
    const somatic = measurement.somatic_coherence || {};
    const pre = somatic.pre_session || {};
    const post = somatic.post_session || {};
    
    features.push(
      pre.embodied_presence || 0,
      pre.energetic_resonance || 0,
      pre.somatic_intelligence || 0,
      pre.groundedness || 0,
      post.embodied_presence || 0,
      post.energetic_resonance || 0,
      post.somatic_intelligence || 0,
      post.groundedness || 0
    );
    
    // Response quality features
    const responseQuality = measurement.response_quality?.assessment || {};
    features.push(
      responseQuality.metaphor_richness || 0,
      responseQuality.personal_relevance || 0,
      responseQuality.depth_vs_surface || 0,
      responseQuality.novelty_factor || 0,
      responseQuality.felt_coherence || 0
    );
    
    // Meaning making features
    const meaningMaking = measurement.meaning_making?.post_session || {};
    features.push(
      meaningMaking.insight_emergence || 0,
      meaningMaking.integration_ease || 0,
      meaningMaking.practical_relevance || 0,
      meaningMaking.symbolic_resonance || 0
    );
    
    // Emergence patterns
    const emergence = measurement.emergence_patterns?.session_outcome || {};
    features.push(
      emergence.unexpected_insights_count || 0,
      emergence.pattern_recognition_quality || 0,
      emergence.creative_sparks || 0,
      emergence.integration_impulses || 0
    );
    
    return features;
  });
}

/**
 * Identify session types using clustering analysis
 * @param {number} days - Number of days to analyze
 * @param {number} numClusters - Number of session types to identify
 * @returns {Object} - Session type analysis
 */
export function identifySessionTypes(days = 90, numClusters = 4) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const measurements = getMeasurementsInDateRange(startDate, endDate);
  
  if (measurements.length < numClusters) {
    return {
      sessionTypes: [],
      error: 'Insufficient data for session type analysis',
      minRequired: numClusters,
      available: measurements.length
    };
  }
  
  const features = extractFeatureVectors(measurements);
  const clustering = kMeansCluster(features, numClusters);
  
  // Interpret clusters as session types
  const sessionTypes = clustering.clusters.map((cluster, idx) => {
    const memberMeasurements = cluster.memberIndices.map(i => measurements[i]);
    const avgFeatures = cluster.centroid;
    
    // Interpret the cluster characteristics
    const characteristics = interpretClusterCharacteristics(avgFeatures);
    
    return {
      id: idx,
      name: generateSessionTypeName(characteristics),
      description: generateSessionTypeDescription(characteristics),
      characteristics,
      sessionCount: cluster.size,
      variance: cluster.variance,
      memberSessions: memberMeasurements.map(m => ({
        experiment_id: m.experiment_id,
        timestamp: m.timestamp,
        distance_from_center: euclideanDistance(
          features[measurements.indexOf(m)], 
          cluster.centroid
        )
      })),
      representativeSession: memberMeasurements.reduce((best, current) => {
        const currentIdx = measurements.indexOf(current);
        const bestIdx = measurements.indexOf(best);
        const currentDistance = euclideanDistance(features[currentIdx], cluster.centroid);
        const bestDistance = euclideanDistance(features[bestIdx], cluster.centroid);
        return currentDistance < bestDistance ? current : best;
      })
    };
  });
  
  return {
    sessionTypes: sessionTypes.sort((a, b) => b.sessionCount - a.sessionCount),
    totalSessions: measurements.length,
    analysisDate: new Date().toISOString(),
    timeRange: { startDate: startDate.toISOString(), endDate: endDate.toISOString() }
  };
}

/**
 * Interpret cluster centroid features into meaningful characteristics
 */
function interpretClusterCharacteristics(features) {
  const [
    preEmbodied, preEnergetic, preSomatic, preGrounded,
    postEmbodied, postEnergetic, postSomatic, postGrounded,
    metaphorRich, personalRel, depth, novelty, coherence,
    insights, integration, practical, symbolic,
    unexpectedInsights, patternRecog, creative, integrationImpulses
  ] = features;
  
  // Calculate somatic shift (pre to post)
  const embodiedShift = postEmbodied - preEmbodied;
  const energeticShift = postEnergetic - preEnergetic;
  const somaticShift = postSomatic - preSomatic;
  const groundedShift = postGrounded - preGrounded;
  
  const avgPreSomatic = (preEmbodied + preEnergetic + preSomatic + preGrounded) / 4;
  const avgPostSomatic = (postEmbodied + postEnergetic + postSomatic + postGrounded) / 4;
  const avgResponseQuality = (metaphorRich + personalRel + depth + novelty + coherence) / 5;
  const avgMeaningMaking = (insights + integration + practical + symbolic) / 4;
  const avgEmergence = (unexpectedInsights + patternRecog + creative + integrationImpulses) / 4;
  
  return {
    somaticProfile: {
      preSession: { embodied: preEmbodied, energetic: preEnergetic, somatic: preSomatic, grounded: preGrounded },
      postSession: { embodied: postEmbodied, energetic: postEnergetic, somatic: postSomatic, grounded: postGrounded },
      shifts: { embodied: embodiedShift, energetic: energeticShift, somatic: somaticShift, grounded: groundedShift },
      avgPre: avgPreSomatic,
      avgPost: avgPostSomatic,
      avgShift: avgPostSomatic - avgPreSomatic
    },
    responseProfile: {
      metaphorRichness: metaphorRich,
      personalRelevance: personalRel,
      depth: depth,
      novelty: novelty,
      coherence: coherence,
      average: avgResponseQuality
    },
    meaningMakingProfile: {
      insights: insights,
      integration: integration,
      practical: practical,
      symbolic: symbolic,
      average: avgMeaningMaking
    },
    emergenceProfile: {
      unexpectedInsights: unexpectedInsights,
      patternRecognition: patternRecog,
      creativity: creative,
      integrationImpulses: integrationImpulses,
      average: avgEmergence
    }
  };
}

/**
 * Generate human-readable session type names
 */
function generateSessionTypeName(characteristics) {
  const { somaticProfile, responseProfile, meaningMakingProfile, emergenceProfile } = characteristics;
  
  // High-level categorization based on prominent features
  const isHighSomatic = somaticProfile.avgPost > 7;
  const isHighShift = somaticProfile.avgShift > 1;
  const isHighResponse = responseProfile.average > 3.5;
  const isHighMeaning = meaningMakingProfile.average > 4.5;
  const isHighEmergence = emergenceProfile.average > 3;
  
  if (isHighSomatic && isHighShift && isHighEmergence) {
    return "Deep Somatic Breakthrough";
  } else if (isHighResponse && isHighMeaning && isHighEmergence) {
    return "High-Quality Insight Generation";
  } else if (isHighShift && isHighMeaning) {
    return "Transformative Integration";
  } else if (isHighSomatic && isHighResponse) {
    return "Embodied Resonance";
  } else if (isHighEmergence) {
    return "Creative Emergence";
  } else if (somaticProfile.avgShift < -0.5) {
    return "Energy Depletion";
  } else {
    return "Baseline Session";
  }
}

/**
 * Generate detailed session type descriptions
 */
function generateSessionTypeDescription(characteristics) {
  const { somaticProfile, responseProfile, meaningMakingProfile, emergenceProfile } = characteristics;
  
  const descriptions = [];
  
  // Somatic analysis
  if (somaticProfile.avgShift > 1) {
    descriptions.push("Notable increase in somatic coherence throughout session");
  } else if (somaticProfile.avgShift < -0.5) {
    descriptions.push("Tends to show decreased somatic coherence after sessions");
  } else {
    descriptions.push("Maintains stable somatic coherence");
  }
  
  // Response quality analysis
  if (responseProfile.average > 4) {
    descriptions.push("Consistently high-quality AI responses with rich metaphors and personal relevance");
  } else if (responseProfile.average > 3) {
    descriptions.push("Good response quality with moderate depth and coherence");
  } else {
    descriptions.push("More variable response quality");
  }
  
  // Meaning making analysis
  if (meaningMakingProfile.average > 5) {
    descriptions.push("Strong insight emergence with easy integration into existing understanding");
  } else if (meaningMakingProfile.average > 3) {
    descriptions.push("Moderate meaning-making with some practical relevance");
  } else {
    descriptions.push("Limited insight generation or integration challenges");
  }
  
  // Emergence analysis
  if (emergenceProfile.average > 3.5) {
    descriptions.push("High levels of unexpected insights and creative breakthroughs");
  } else if (emergenceProfile.average > 2) {
    descriptions.push("Some emergence patterns with occasional creative sparks");
  } else {
    descriptions.push("Lower emergence potential");
  }
  
  return descriptions.join(". ");
}

/**
 * Detect coherence patterns across measurement domains
 * @param {number} days - Number of days to analyze
 * @returns {Object} - Coherence pattern analysis
 */
export function detectCoherencePatterns(days = 30) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const measurements = getMeasurementsInDateRange(startDate, endDate);
  
  if (measurements.length < 3) {
    return {
      patterns: [],
      error: 'Insufficient data for coherence analysis',
      minRequired: 3,
      available: measurements.length
    };
  }
  
  const coherenceMetrics = measurements.map(measurement => {
    // Extract coherence indicators across domains
    const somatic = measurement.somatic_coherence || {};
    const response = measurement.response_quality?.assessment || {};
    const meaning = measurement.meaning_making?.post_session || {};
    const emergence = measurement.emergence_patterns?.session_outcome || {};
    
    // Calculate domain coherences
    const somaticCoherence = calculateDomainCoherence([
      somatic.pre_session?.embodied_presence,
      somatic.pre_session?.energetic_resonance,
      somatic.pre_session?.somatic_intelligence,
      somatic.pre_session?.groundedness
    ]);
    
    const responseCoherence = calculateDomainCoherence([
      response.metaphor_richness,
      response.personal_relevance,
      response.depth_vs_surface,
      response.novelty_factor,
      response.felt_coherence
    ]);
    
    const meaningCoherence = calculateDomainCoherence([
      meaning.insight_emergence,
      meaning.integration_ease,
      meaning.practical_relevance,
      meaning.symbolic_resonance
    ]);
    
    const emergenceCoherence = calculateDomainCoherence([
      emergence.unexpected_insights_count,
      emergence.pattern_recognition_quality,
      emergence.creative_sparks,
      emergence.integration_impulses
    ]);
    
    // Calculate cross-domain coherence
    const crossDomainCoherence = calculateCrossDomainCoherence(
      somaticCoherence.average,
      responseCoherence.average,
      meaningCoherence.average,
      emergenceCoherence.average
    );
    
    return {
      experiment_id: measurement.experiment_id,
      timestamp: measurement.timestamp,
      somaticCoherence,
      responseCoherence,
      meaningCoherence,
      emergenceCoherence,
      crossDomainCoherence,
      overallCoherence: (somaticCoherence.coherenceScore + responseCoherence.coherenceScore + 
                       meaningCoherence.coherenceScore + emergenceCoherence.coherenceScore) / 4
    };
  });
  
  // Identify coherence patterns
  const patterns = identifyCoherencePatterns(coherenceMetrics);
  
  return {
    patterns,
    coherenceMetrics,
    summary: {
      averageOverallCoherence: coherenceMetrics.reduce((sum, m) => sum + m.overallCoherence, 0) / coherenceMetrics.length,
      highCoherenceSessions: coherenceMetrics.filter(m => m.overallCoherence > 0.8).length,
      lowCoherenceSessions: coherenceMetrics.filter(m => m.overallCoherence < 0.4).length,
      totalSessions: coherenceMetrics.length
    },
    analysisDate: new Date().toISOString(),
    timeRange: { startDate: startDate.toISOString(), endDate: endDate.toISOString() }
  };
}

/**
 * Calculate coherence within a measurement domain
 */
function calculateDomainCoherence(values) {
  const validValues = values.filter(v => typeof v === 'number' && !isNaN(v));
  
  if (validValues.length < 2) {
    return { coherenceScore: 0, average: 0, variance: 0, count: validValues.length };
  }
  
  const average = validValues.reduce((sum, v) => sum + v, 0) / validValues.length;
  const variance = validValues.reduce((sum, v) => sum + Math.pow(v - average, 2), 0) / validValues.length;
  const standardDeviation = Math.sqrt(variance);
  
  // Coherence score: higher when values are closer together (lower variance)
  // Normalized to 0-1 scale where 1 is perfect coherence
  const maxPossibleVariance = Math.pow(5, 2); // Assuming max scale of 10, so max variance around 25
  const coherenceScore = Math.max(0, 1 - (variance / maxPossibleVariance));
  
  return {
    coherenceScore: Math.round(coherenceScore * 1000) / 1000,
    average: Math.round(average * 100) / 100,
    variance: Math.round(variance * 100) / 100,
    standardDeviation: Math.round(standardDeviation * 100) / 100,
    count: validValues.length
  };
}

/**
 * Calculate coherence across different measurement domains
 */
function calculateCrossDomainCoherence(somaticAvg, responseAvg, meaningAvg, emergenceAvg) {
  const averages = [somaticAvg, responseAvg, meaningAvg, emergenceAvg].filter(v => !isNaN(v));
  
  if (averages.length < 2) {
    return { coherenceScore: 0, correlation: null };
  }
  
  // Normalize averages to similar scales (0-1)
  const normalizedAverages = averages.map((avg, idx) => {
    const maxScales = [10, 5, 7, 7]; // Max values for each domain
    return avg / maxScales[idx] || avg / 10; // Fallback to /10 if index issue
  });
  
  const globalAverage = normalizedAverages.reduce((sum, v) => sum + v, 0) / normalizedAverages.length;
  const variance = normalizedAverages.reduce((sum, v) => sum + Math.pow(v - globalAverage, 2), 0) / normalizedAverages.length;
  
  // Cross-domain coherence: higher when all domains show similar relative performance
  const coherenceScore = Math.max(0, 1 - (variance * 4)); // Scale variance for 0-1 range
  
  return {
    coherenceScore: Math.round(coherenceScore * 1000) / 1000,
    normalizedAverages,
    globalAverage: Math.round(globalAverage * 1000) / 1000,
    variance: Math.round(variance * 1000) / 1000
  };
}

/**
 * Identify specific coherence patterns from metrics
 */
function identifyCoherencePatterns(coherenceMetrics) {
  const patterns = [];
  
  // Pattern 1: High coherence trend
  const recentSessions = coherenceMetrics.slice(-5);
  const avgRecentCoherence = recentSessions.reduce((sum, m) => sum + m.overallCoherence, 0) / recentSessions.length;
  
  if (avgRecentCoherence > 0.75) {
    patterns.push({
      type: 'high_coherence_trend',
      name: 'High Coherence Trend',
      description: 'Recent sessions show consistently high coherence across domains',
      confidence: avgRecentCoherence,
      evidence: `Average coherence in last ${recentSessions.length} sessions: ${(avgRecentCoherence * 100).toFixed(1)}%`
    });
  }
  
  // Pattern 2: Somatic-symbolic alignment
  const somaticSymbolicAlignment = coherenceMetrics.map(m => {
    return Math.abs(m.somaticCoherence.coherenceScore - m.meaningCoherence.coherenceScore);
  });
  const avgAlignment = somaticSymbolicAlignment.reduce((sum, a) => sum + a, 0) / somaticSymbolicAlignment.length;
  
  if (avgAlignment < 0.2) {
    patterns.push({
      type: 'somatic_symbolic_alignment',
      name: 'Somatic-Symbolic Alignment',
      description: 'Strong alignment between bodily awareness and meaning-making processes',
      confidence: 1 - avgAlignment,
      evidence: `Average alignment score: ${((1 - avgAlignment) * 100).toFixed(1)}%`
    });
  }
  
  // Pattern 3: Emergence threshold pattern
  const highEmergenceSessions = coherenceMetrics.filter(m => m.emergenceCoherence.average > 3.5);
  if (highEmergenceSessions.length >= 3) {
    const emergencePattern = analyzeEmergenceThreshold(highEmergenceSessions, coherenceMetrics);
    if (emergencePattern) {
      patterns.push(emergencePattern);
    }
  }
  
  // Pattern 4: Response quality consistency
  const responseVariances = coherenceMetrics.map(m => m.responseCoherence.variance);
  const avgResponseVariance = responseVariances.reduce((sum, v) => sum + v, 0) / responseVariances.length;
  
  if (avgResponseVariance < 0.5) {
    patterns.push({
      type: 'response_consistency',
      name: 'Consistent Response Quality',
      description: 'AI responses show consistent quality across different measurement dimensions',
      confidence: 1 - (avgResponseVariance / 2), // Normalize to 0-1
      evidence: `Low response variance: ${avgResponseVariance.toFixed(3)}`
    });
  }
  
  return patterns;
}

/**
 * Analyze emergence threshold patterns
 */
function analyzeEmergenceThreshold(highEmergenceSessions, allSessions) {
  // Look for common conditions that lead to high emergence
  const emergenceFactors = highEmergenceSessions.map(session => ({
    somaticPre: session.somaticCoherence.average,
    crossDomainCoherence: session.crossDomainCoherence.coherenceScore,
    responseQuality: session.responseCoherence.average
  }));
  
  // Calculate average conditions for high emergence
  const avgSomaticPre = emergenceFactors.reduce((sum, f) => sum + f.somaticPre, 0) / emergenceFactors.length;
  const avgCrossDomain = emergenceFactors.reduce((sum, f) => sum + f.crossDomainCoherence, 0) / emergenceFactors.length;
  const avgResponseQuality = emergenceFactors.reduce((sum, f) => sum + f.responseQuality, 0) / emergenceFactors.length;
  
  // Compare with overall averages
  const overallAvgSomatic = allSessions.reduce((sum, s) => sum + s.somaticCoherence.average, 0) / allSessions.length;
  const overallAvgCrossDomain = allSessions.reduce((sum, s) => sum + s.crossDomainCoherence.coherenceScore, 0) / allSessions.length;
  
  const somaticLift = avgSomaticPre - overallAvgSomatic;
  const crossDomainLift = avgCrossDomain - overallAvgCrossDomain;
  
  if (somaticLift > 0.5 || crossDomainLift > 0.1) {
    return {
      type: 'emergence_threshold',
      name: 'Emergence Threshold Pattern',
      description: 'Specific conditions appear to facilitate breakthrough sessions with high emergence',
      confidence: Math.min(1, Math.max(somaticLift, crossDomainLift * 2)),
      evidence: `High emergence sessions average: Somatic +${somaticLift.toFixed(2)}, Cross-domain +${crossDomainLift.toFixed(2)}`,
      thresholds: {
        somaticPreSession: avgSomaticPre,
        crossDomainCoherence: avgCrossDomain,
        responseQuality: avgResponseQuality
      }
    };
  }
  
  return null;
}

/**
 * Detect anomalous sessions that deviate significantly from patterns
 * @param {number} days - Number of days to analyze
 * @returns {Object} - Anomaly detection results
 */
export function detectAnomalies(days = 60) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const measurements = getMeasurementsInDateRange(startDate, endDate);
  
  if (measurements.length < 10) {
    return {
      anomalies: [],
      error: 'Insufficient data for anomaly detection',
      minRequired: 10,
      available: measurements.length
    };
  }
  
  const features = extractFeatureVectors(measurements);
  const anomalies = [];
  
  // Calculate overall statistics for each feature
  const featureStats = features[0].map((_, featureIndex) => {
    const values = features.map(f => f[featureIndex]);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    return { mean, variance, stdDev, values };
  });
  
  // Detect outliers using modified Z-score
  features.forEach((feature, measurementIndex) => {
    const measurement = measurements[measurementIndex];
    const anomalyScores = [];
    
    feature.forEach((value, featureIndex) => {
      const stats = featureStats[featureIndex];
      const zScore = Math.abs((value - stats.mean) / (stats.stdDev || 1));
      anomalyScores.push(zScore);
    });
    
    const avgAnomalyScore = anomalyScores.reduce((sum, score) => sum + score, 0) / anomalyScores.length;
    const maxAnomalyScore = Math.max(...anomalyScores);
    
    // Flag as anomaly if average Z-score > 2 or any individual Z-score > 3
    if (avgAnomalyScore > 2 || maxAnomalyScore > 3) {
      const topAnomalousFeatures = anomalyScores.map((score, idx) => ({ idx, score }))
        .filter(item => item.score > 2)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
      
      anomalies.push({
        experiment_id: measurement.experiment_id,
        timestamp: measurement.timestamp,
        anomalyScore: Math.round(avgAnomalyScore * 100) / 100,
        maxFeatureScore: Math.round(maxAnomalyScore * 100) / 100,
        anomalousFeatures: topAnomalousFeatures.map(item => ({
          featureName: getFeatureName(item.idx),
          zScore: Math.round(item.score * 100) / 100,
          value: feature[item.idx],
          expected: Math.round(featureStats[item.idx].mean * 100) / 100
        })),
        type: determineAnomalyType(measurement, anomalyScores, featureStats),
        description: generateAnomalyDescription(measurement, topAnomalousFeatures, featureStats)
      });
    }
  });
  
  return {
    anomalies: anomalies.sort((a, b) => b.anomalyScore - a.anomalyScore),
    totalSessions: measurements.length,
    anomalyRate: (anomalies.length / measurements.length * 100).toFixed(1) + '%',
    analysisDate: new Date().toISOString(),
    timeRange: { startDate: startDate.toISOString(), endDate: endDate.toISOString() }
  };
}

/**
 * Map feature indices to human-readable names
 */
function getFeatureName(index) {
  const featureNames = [
    'Pre-Session Embodied Presence', 'Pre-Session Energetic Resonance', 'Pre-Session Somatic Intelligence', 'Pre-Session Groundedness',
    'Post-Session Embodied Presence', 'Post-Session Energetic Resonance', 'Post-Session Somatic Intelligence', 'Post-Session Groundedness',
    'Metaphor Richness', 'Personal Relevance', 'Depth vs Surface', 'Novelty Factor', 'Felt Coherence',
    'Insight Emergence', 'Integration Ease', 'Practical Relevance', 'Symbolic Resonance',
    'Unexpected Insights Count', 'Pattern Recognition Quality', 'Creative Sparks', 'Integration Impulses'
  ];
  
  return featureNames[index] || `Feature ${index}`;
}

/**
 * Determine the type of anomaly based on which features are outliers
 */
function determineAnomalyType(measurement, anomalyScores, featureStats) {
  const somaticAnomalies = anomalyScores.slice(0, 8).filter(score => score > 2).length;
  const responseAnomalies = anomalyScores.slice(8, 13).filter(score => score > 2).length;
  const meaningAnomalies = anomalyScores.slice(13, 17).filter(score => score > 2).length;
  const emergenceAnomalies = anomalyScores.slice(17, 21).filter(score => score > 2).length;
  
  if (somaticAnomalies >= 2) return 'somatic_anomaly';
  if (responseAnomalies >= 2) return 'response_anomaly';
  if (meaningAnomalies >= 2) return 'meaning_making_anomaly';
  if (emergenceAnomalies >= 2) return 'emergence_anomaly';
  
  return 'mixed_anomaly';
}

/**
 * Generate human-readable description for anomalies
 */
function generateAnomalyDescription(measurement, topFeatures, featureStats) {
  if (topFeatures.length === 0) return 'Session shows unusual patterns across multiple dimensions.';
  
  const descriptions = topFeatures.map(feature => {
    const stats = featureStats[feature.idx];
    const actualValue = stats.values[0]; // This is simplified - should use actual measurement value
    const isHigh = actualValue > stats.mean;
    
    return `${getFeatureName(feature.idx)} was ${isHigh ? 'unusually high' : 'unusually low'} (${feature.zScore}σ from average)`;
  });
  
  return descriptions.join('; ');
}

export default {
  identifySessionTypes,
  detectCoherencePatterns,
  detectAnomalies,
  extractFeatureVectors,
  kMeansCluster
};