// js/modules/insightsEngine.js

/**
 * Personalized insights engine that generates recommendations and forecasts
 * based on user's historical ECP session data patterns
 */

import { getAllMeasurements, getMeasurementsInDateRange } from './storage.js';
import { identifySessionTypes, detectCoherencePatterns, detectAnomalies } from './patternDetection.js';
import { performSemanticClustering, analyzeMetaphorDensity, analyzeSentiment } from './semanticAnalysis.js';
import { analyzeTemporalPatterns, detectCyclesAcrossScales } from './timeSeriesAnalysis.js';

/**
 * Generate comprehensive personalized insights
 * @param {number} days - Number of days to analyze for insights
 * @returns {Object} - Personalized insights and recommendations
 */
export function generatePersonalizedInsights(days = 90) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const measurements = getMeasurementsInDateRange(startDate, endDate);
  
  if (measurements.length < 5) {
    return {
      insights: [],
      recommendations: [],
      error: 'Insufficient data for personalized insights',
      minRequired: 5,
      available: measurements.length
    };
  }
  
  try {
    // Gather analysis results from other modules
    const sessionTypes = identifySessionTypes(days);
    const coherencePatterns = detectCoherencePatterns(days);
    const anomalies = detectAnomalies(days);
    const semanticClusters = performSemanticClustering(days);
    const metaphorAnalysis = analyzeMetaphorDensity(measurements);
    const sentimentAnalysis = analyzeSentiment(days);
    const temporalCycles = detectCyclesAcrossScales(days);
    
    // Generate insights based on combined analysis
    const insights = generateCoreInsights(measurements, {
      sessionTypes,
      coherencePatterns, 
      anomalies,
      semanticClusters,
      metaphorAnalysis,
      sentimentAnalysis,
      temporalCycles
    });
    
    // Generate actionable recommendations
    const recommendations = generateRecommendations(measurements, insights);
    
    // Generate coherence forecast
    const coherenceForecast = generateCoherenceForecast(measurements, insights);
    
    // Personal pattern summary
    const personalPatterns = generatePersonalPatternSummary(insights);
    
    return {
      insights,
      recommendations,
      coherenceForecast,
      personalPatterns,
      dataQuality: assessDataQuality(measurements),
      analysisDate: new Date().toISOString(),
      timeRange: { startDate: startDate.toISOString(), endDate: endDate.toISOString() }
    };
    
  } catch (error) {
    console.error('Error generating personalized insights:', error);
    return {
      insights: [],
      recommendations: [],
      error: 'Failed to generate insights due to analysis error',
      details: error.message
    };
  }
}

/**
 * Generate core insights from analysis results
 */
function generateCoreInsights(measurements, analysisResults) {
  const insights = [];
  const { sessionTypes, coherencePatterns, anomalies, semanticClusters, metaphorAnalysis, sentimentAnalysis, temporalCycles } = analysisResults;
  
  // Session type insights
  if (sessionTypes.sessionTypes && sessionTypes.sessionTypes.length > 0) {
    const dominantType = sessionTypes.sessionTypes[0];
    insights.push({
      type: 'session_pattern',
      priority: 'high',
      title: `Your Dominant Session Pattern: ${dominantType.name}`,
      description: dominantType.description,
      evidence: `${dominantType.sessionCount} of ${sessionTypes.totalSessions} sessions (${Math.round(dominantType.sessionCount / sessionTypes.totalSessions * 100)}%)`,
      actionable: true,
      recommendations: generateSessionTypeRecommendations(dominantType, sessionTypes.sessionTypes)
    });
    
    // Less common but potentially valuable session types
    const rareValueableTypes = sessionTypes.sessionTypes.filter(type => 
      type.sessionCount < dominantType.sessionCount * 0.5 && 
      type.name.includes('Breakthrough') || type.name.includes('Insight')
    );
    
    if (rareValueableTypes.length > 0) {
      insights.push({
        type: 'rare_pattern_opportunity',
        priority: 'medium',
        title: 'Untapped Potential Patterns',
        description: `You occasionally experience high-value session types that could be cultivated more intentionally.`,
        evidence: rareValueableTypes.map(type => `${type.name}: ${type.sessionCount} sessions`).join('; '),
        actionable: true,
        sessionTypes: rareValueableTypes
      });
    }
  }
  
  // Coherence pattern insights
  if (coherencePatterns.patterns && coherencePatterns.patterns.length > 0) {
    coherencePatterns.patterns.forEach(pattern => {
      insights.push({
        type: 'coherence_pattern',
        priority: pattern.type === 'high_coherence_trend' ? 'high' : 'medium',
        title: pattern.name,
        description: pattern.description,
        evidence: pattern.evidence,
        confidence: pattern.confidence,
        actionable: true
      });
    });
  }
  
  // Semantic insights
  if (semanticClusters.clusters && semanticClusters.clusters.length > 0) {
    const dominantCluster = semanticClusters.clusters[0];
    insights.push({
      type: 'thematic_pattern',
      priority: 'medium',
      title: `Primary Thematic Focus: ${dominantCluster.name}`,
      description: dominantCluster.description,
      evidence: `${dominantCluster.size} sessions with consistent themes`,
      themes: dominantCluster.themes,
      somaticPattern: dominantCluster.somaticPatterns,
      actionable: true
    });
  }
  
  // Sentiment insights
  if (sentimentAnalysis.sentimentAnalysis) {
    const sentiment = sentimentAnalysis.sentimentAnalysis;
    if (sentiment.sentimentTrend !== 'insufficient_data') {
      insights.push({
        type: 'sentiment_trend',
        priority: sentiment.sentimentTrend === 'declining' ? 'high' : 'medium',
        title: `Emotional Tone Pattern: ${sentiment.sentimentTrend}`,
        description: `Your session reflections show a ${sentiment.sentimentTrend} emotional tone over time.`,
        evidence: `Average sentiment: ${sentiment.averageSentiment}, ${sentiment.positiveSessions} positive, ${sentiment.negativeSessions} negative sessions`,
        trend: sentiment.sentimentTrend,
        actionable: true
      });
    }
  }
  
  // Temporal insights
  if (temporalCycles.dominantPatterns) {
    const patterns = temporalCycles.dominantPatterns;
    
    // Weekly patterns
    if (Object.keys(patterns.weeklyPatterns).length > 0) {
      const dominantWeeklyPattern = Object.entries(patterns.weeklyPatterns)
        .sort(([,a], [,b]) => b - a)[0];
      
      insights.push({
        type: 'temporal_pattern',
        priority: 'medium',
        title: `Weekly Rhythm: ${dominantWeeklyPattern[0].replace(/_/g, ' ')}`,
        description: generateWeeklyPatternDescription(dominantWeeklyPattern[0]),
        evidence: `Pattern observed in ${dominantWeeklyPattern[1]} measurement scales`,
        pattern: dominantWeeklyPattern[0],
        actionable: true
      });
    }
  }
  
  // Anomaly insights
  if (anomalies.anomalies && anomalies.anomalies.length > 0) {
    const recentAnomalies = anomalies.anomalies.filter(anomaly => {
      const anomalyDate = new Date(anomaly.timestamp);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return anomalyDate > thirtyDaysAgo;
    });
    
    if (recentAnomalies.length > 0) {
      insights.push({
        type: 'anomaly_pattern',
        priority: 'medium',
        title: 'Recent Unusual Sessions',
        description: 'You\'ve had some sessions that deviated significantly from your typical patterns.',
        evidence: `${recentAnomalies.length} anomalous sessions in the last 30 days`,
        anomalies: recentAnomalies.slice(0, 3), // Top 3 most anomalous
        actionable: true
      });
    }
  }
  
  // Metaphor density insights
  if (metaphorAnalysis.analysis) {
    const metaphors = metaphorAnalysis.analysis;
    if (metaphors.highDensitySessionCount > 0) {
      insights.push({
        type: 'metaphor_pattern',
        priority: 'low',
        title: 'Symbolic Communication Patterns',
        description: `You tend to receive AI responses with ${metaphors.averageDensity.toFixed(1)}/5 metaphor density.`,
        evidence: `${metaphors.highDensitySessionCount} high-density sessions out of ${metaphors.totalSessions}`,
        averageDensity: metaphors.averageDensity,
        actionable: false
      });
    }
  }
  
  return insights.sort((a, b) => {
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    return priorityWeight[b.priority] - priorityWeight[a.priority];
  });
}

/**
 * Generate actionable recommendations based on insights
 */
function generateRecommendations(measurements, insights) {
  const recommendations = [];
  
  insights.forEach(insight => {
    if (!insight.actionable) return;
    
    switch (insight.type) {
      case 'session_pattern':
        recommendations.push(...generateSessionPatternRecommendations(insight, measurements));
        break;
        
      case 'coherence_pattern':
        recommendations.push(...generateCoherenceRecommendations(insight, measurements));
        break;
        
      case 'thematic_pattern':
        recommendations.push(...generateThematicRecommendations(insight, measurements));
        break;
        
      case 'sentiment_trend':
        recommendations.push(...generateSentimentRecommendations(insight, measurements));
        break;
        
      case 'temporal_pattern':
        recommendations.push(...generateTemporalRecommendations(insight, measurements));
        break;
        
      case 'anomaly_pattern':
        recommendations.push(...generateAnomalyRecommendations(insight, measurements));
        break;
        
      case 'rare_pattern_opportunity':
        recommendations.push(...generateRarePatternRecommendations(insight, measurements));
        break;
    }
  });
  
  return recommendations
    .sort((a, b) => a.priority_weight - b.priority_weight)
    .slice(0, 12); // Limit to top 12 recommendations
}

/**
 * Generate session pattern-specific recommendations
 */
function generateSessionPatternRecommendations(insight, measurements) {
  const recommendations = [];
  
  if (insight.title.includes('Baseline Session')) {
    recommendations.push({
      type: 'optimization',
      priority: 'medium',
      priority_weight: 2,
      title: 'Elevate Your Session Quality',
      description: 'Your sessions show consistent but baseline patterns. Try experimenting with different preparation rituals or session timing.',
      specific_actions: [
        'Try a 5-minute embodiment practice before sessions',
        'Experiment with different times of day',
        'Set a specific intention before each conversation',
        'Try asking the AI for more metaphorical responses'
      ],
      category: 'session_enhancement'
    });
  }
  
  if (insight.title.includes('Energy Depletion')) {
    recommendations.push({
      type: 'warning',
      priority: 'high',
      priority_weight: 1,
      title: 'Address Energy Depletion Pattern',
      description: 'Your sessions tend to leave you with lower somatic coherence. This suggests the need for better boundary setting or post-session integration.',
      specific_actions: [
        'Take 5 minutes to ground yourself after each session',
        'Set clearer intentions about what you want from the conversation',
        'Consider shorter, more focused sessions',
        'Practice embodied closing rituals'
      ],
      category: 'energy_management'
    });
  }
  
  if (insight.title.includes('Deep Somatic Breakthrough')) {
    recommendations.push({
      type: 'enhancement',
      priority: 'medium',
      priority_weight: 3,
      title: 'Replicate Breakthrough Conditions',
      description: 'You\'ve demonstrated capacity for deep somatic breakthroughs. Identify and replicate the conditions that support these experiences.',
      specific_actions: [
        'Review the environmental and internal conditions of your breakthrough sessions',
        'Develop pre-session rituals that prime for deep embodiment',
        'Allow more time for post-session integration',
        'Consider recording insights immediately after high-impact sessions'
      ],
      category: 'breakthrough_cultivation'
    });
  }
  
  return recommendations;
}

/**
 * Generate coherence-specific recommendations
 */
function generateCoherenceRecommendations(insight, measurements) {
  const recommendations = [];
  
  if (insight.title.includes('High Coherence Trend')) {
    recommendations.push({
      type: 'maintenance',
      priority: 'medium',
      priority_weight: 4,
      title: 'Maintain Your Coherence Momentum',
      description: 'You\'re in a period of high coherence across domains. Focus on maintaining and deepening this pattern.',
      specific_actions: [
        'Document what environmental and internal factors support your coherence',
        'Consider gradually increasing session complexity or depth',
        'Share insights with others to solidify learning',
        'Explore how this coherence translates to other life areas'
      ],
      category: 'coherence_maintenance'
    });
  }
  
  if (insight.title.includes('Somatic-Symbolic Alignment')) {
    recommendations.push({
      type: 'enhancement',
      priority: 'medium',
      priority_weight: 3,
      title: 'Leverage Your Embodied-Symbolic Integration',
      description: 'Your body awareness and meaning-making processes are well-aligned. This is a powerful foundation for deeper work.',
      specific_actions: [
        'Trust your somatic responses when evaluating AI insights',
        'Ask for responses that bridge conceptual and felt-sense knowing',
        'Practice translating insights into embodied actions',
        'Explore how symbols and metaphors land in your body'
      ],
      category: 'integration_enhancement'
    });
  }
  
  return recommendations;
}

/**
 * Generate thematic recommendations
 */
function generateThematicRecommendations(insight, measurements) {
  const recommendations = [];
  
  if (insight.themes && insight.themes.length > 0) {
    const dominantTheme = insight.themes[0];
    
    recommendations.push({
      type: 'exploration',
      priority: 'low',
      priority_weight: 5,
      title: `Deepen Your ${dominantTheme.category} Exploration`,
      description: `Your sessions consistently engage with ${dominantTheme.category} themes. Consider deepening this exploration systematically.`,
      specific_actions: [
        `Ask the AI to explore ${dominantTheme.category} themes more explicitly`,
        'Keep a separate journal tracking insights in this domain',
        'Look for patterns in how this theme connects to other areas of your life',
        'Consider seeking out additional resources on this topic'
      ],
      category: 'thematic_exploration'
    });
  }
  
  return recommendations;
}

/**
 * Generate sentiment-based recommendations
 */
function generateSentimentRecommendations(insight, measurements) {
  const recommendations = [];
  
  if (insight.trend === 'declining') {
    recommendations.push({
      type: 'warning',
      priority: 'high',
      priority_weight: 1,
      title: 'Address Declining Emotional Tone',
      description: 'Your session reflections show increasingly negative emotional tone. This may indicate fatigue, overwhelm, or misaligned expectations.',
      specific_actions: [
        'Review your session goals and expectations',
        'Consider taking a break or reducing session frequency',
        'Focus on more supportive, affirming interactions',
        'Check if external life stressors are affecting your sessions'
      ],
      category: 'emotional_wellness'
    });
  }
  
  if (insight.trend === 'improving') {
    recommendations.push({
      type: 'enhancement',
      priority: 'medium',
      priority_weight: 4,
      title: 'Build on Positive Momentum',
      description: 'Your sessions are becoming more emotionally positive. Identify what\'s working and amplify it.',
      specific_actions: [
        'Document what has shifted to create more positive experiences',
        'Consider sharing successes with others in similar practices',
        'Gradually expand your comfort zone while maintaining emotional safety',
        'Use this positive state to tackle more challenging questions'
      ],
      category: 'positive_amplification'
    });
  }
  
  return recommendations;
}

/**
 * Generate temporal pattern recommendations
 */
function generateTemporalRecommendations(insight, measurements) {
  const recommendations = [];
  
  if (insight.pattern === 'strong_weekend_boost') {
    recommendations.push({
      type: 'optimization',
      priority: 'medium',
      priority_weight: 3,
      title: 'Optimize Your Weekend Sessions',
      description: 'You consistently have better sessions on weekends. Consider how to bring weekend conditions into weekday sessions.',
      specific_actions: [
        'Identify what makes weekend sessions different (more time, less stress, different mindset)',
        'Build longer buffers around weekday sessions',
        'Consider weekend-style preparation rituals for important weekday sessions',
        'Schedule your most important conversations for weekends when possible'
      ],
      category: 'timing_optimization'
    });
  }
  
  if (insight.pattern === 'strong_weekday_preference') {
    recommendations.push({
      type: 'optimization',
      priority: 'medium', 
      priority_weight: 3,
      title: 'Leverage Your Weekday Rhythm',
      description: 'You have better sessions during weekdays. Your professional rhythm may support focused inner work.',
      specific_actions: [
        'Schedule important sessions during your weekday peak hours',
        'Use weekend sessions for lighter, more exploratory conversations',
        'Consider the cognitive momentum from weekday activities as preparation',
        'Protect your weekday session time from weekend-style distractions'
      ],
      category: 'timing_optimization'
    });
  }
  
  return recommendations;
}

/**
 * Generate anomaly-based recommendations
 */
function generateAnomalyRecommendations(insight, measurements) {
  const recommendations = [];
  
  if (insight.anomalies && insight.anomalies.length > 0) {
    const hasPositiveAnomalies = insight.anomalies.some(anomaly => 
      anomaly.type === 'emergence_anomaly' || anomaly.description.includes('unusually high')
    );
    
    if (hasPositiveAnomalies) {
      recommendations.push({
        type: 'exploration',
        priority: 'medium',
        priority_weight: 2,
        title: 'Investigate Your Breakthrough Sessions',
        description: 'Some of your recent sessions showed unusually high emergence or quality. Understanding these conditions could help replicate them.',
        specific_actions: [
          'Review the context and conditions of your anomalous sessions',
          'Look for patterns in preparation, timing, or environmental factors',
          'Consider what internal state or external circumstances were different',
          'Try intentionally recreating some of these conditions'
        ],
        category: 'pattern_investigation'
      });
    } else {
      recommendations.push({
        type: 'adjustment',
        priority: 'medium',
        priority_weight: 2,
        title: 'Understand Your Challenging Sessions',
        description: 'Some recent sessions showed unusual patterns that may indicate misalignment or suboptimal conditions.',
        specific_actions: [
          'Review what was different about these challenging sessions',
          'Consider if external stressors affected your session quality',
          'Adjust your preparation or expectations based on these learnings',
          'Don\'t abandon exploration but refine your approach'
        ],
        category: 'pattern_adjustment'
      });
    }
  }
  
  return recommendations;
}

/**
 * Generate recommendations for rare valuable patterns
 */
function generateRarePatternRecommendations(insight, measurements) {
  const recommendations = [];
  
  if (insight.sessionTypes) {
    insight.sessionTypes.forEach(sessionType => {
      recommendations.push({
        type: 'cultivation',
        priority: 'medium',
        priority_weight: 2,
        title: `Cultivate More ${sessionType.name} Sessions`,
        description: `You occasionally experience ${sessionType.name} but this represents untapped potential.`,
        specific_actions: [
          `Review your ${sessionType.sessionCount} ${sessionType.name} sessions for common conditions`,
          'Identify the environmental and internal factors that support this session type',
          'Practice intentionally creating these conditions',
          'Set specific intentions to cultivate this pattern more regularly'
        ],
        category: 'pattern_cultivation',
        sessionType: sessionType.name
      });
    });
  }
  
  return recommendations;
}

/**
 * Generate coherence forecast based on historical patterns
 */
function generateCoherenceForecast(measurements, insights) {
  if (measurements.length < 10) {
    return {
      forecast: null,
      error: 'Insufficient data for coherence forecasting'
    };
  }
  
  // Calculate recent trend in overall coherence
  const recentMeasurements = measurements.slice(0, Math.min(10, measurements.length));
  const coherenceScores = recentMeasurements.map(m => calculateOverallCoherenceScore(m)).filter(score => score !== null);
  
  if (coherenceScores.length < 5) {
    return {
      forecast: null,
      error: 'Insufficient coherence data for forecasting'
    };
  }
  
  // Simple trend analysis for forecasting
  const trend = calculateSimpleTrend(coherenceScores);
  const currentAverage = coherenceScores.reduce((sum, score) => sum + score, 0) / coherenceScores.length;
  
  // Generate forecast based on trends and patterns
  let forecastDirection = 'stable';
  let confidence = 0.5;
  let forecastedScore = currentAverage;
  
  if (trend.slope > 0.05) {
    forecastDirection = 'improving';
    forecastedScore = Math.min(1, currentAverage + trend.slope * 3);
    confidence = Math.min(0.8, trend.rSquared + 0.3);
  } else if (trend.slope < -0.05) {
    forecastDirection = 'declining';
    forecastedScore = Math.max(0, currentAverage + trend.slope * 3);
    confidence = Math.min(0.8, trend.rSquared + 0.3);
  }
  
  // Adjust forecast based on patterns
  const hasHighCoherenceTrend = insights.some(insight => insight.title.includes('High Coherence Trend'));
  if (hasHighCoherenceTrend) {
    confidence += 0.2;
    if (forecastDirection === 'stable') forecastDirection = 'improving';
  }
  
  const hasNegativeSentiment = insights.some(insight => insight.trend === 'declining');
  if (hasNegativeSentiment) {
    confidence -= 0.1;
    if (forecastDirection === 'improving') forecastDirection = 'stable';
  }
  
  return {
    forecast: {
      direction: forecastDirection,
      confidence: Math.max(0.3, Math.min(0.9, confidence)),
      currentCoherence: Math.round(currentAverage * 100),
      forecastedCoherence: Math.round(forecastedScore * 100),
      timeframe: '2-3 sessions',
      factors: generateForecastFactors(insights, trend)
    },
    basedOnSessions: coherenceScores.length,
    analysisDate: new Date().toISOString()
  };
}

/**
 * Calculate overall coherence score for a measurement
 */
function calculateOverallCoherenceScore(measurement) {
  const somatic = measurement.somatic_coherence;
  const response = measurement.response_quality?.assessment;
  const meaning = measurement.meaning_making?.post_session;
  
  if (!somatic && !response && !meaning) return null;
  
  let totalScore = 0;
  let components = 0;
  
  if (somatic?.post_session) {
    const somaticScore = (
      (somatic.post_session.embodied_presence || 0) +
      (somatic.post_session.energetic_resonance || 0) +
      (somatic.post_session.somatic_intelligence || 0) +
      (somatic.post_session.groundedness || 0)
    ) / 4 / 10; // Normalize to 0-1
    
    totalScore += somaticScore;
    components++;
  }
  
  if (response) {
    const responseScore = (
      (response.felt_coherence || 0) +
      (response.depth_vs_surface || 0) +
      (response.personal_relevance || 0)
    ) / 3 / 5; // Normalize to 0-1
    
    totalScore += responseScore;
    components++;
  }
  
  if (meaning) {
    const meaningScore = (
      (meaning.insight_emergence || 0) +
      (meaning.integration_ease || 0) +
      (meaning.symbolic_resonance || 0)
    ) / 3 / 7; // Normalize to 0-1
    
    totalScore += meaningScore;
    components++;
  }
  
  return components > 0 ? totalScore / components : null;
}

/**
 * Calculate simple trend for forecasting
 */
function calculateSimpleTrend(values) {
  const n = values.length;
  const x = Array.from({ length: n }, (_, i) => i);
  
  const xSum = x.reduce((sum, val) => sum + val, 0);
  const ySum = values.reduce((sum, val) => sum + val, 0);
  const xySum = x.reduce((sum, val, idx) => sum + (val * values[idx]), 0);
  const x2Sum = x.reduce((sum, val) => sum + (val * val), 0);
  
  const slope = (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum);
  const intercept = (ySum - slope * xSum) / n;
  
  // Calculate R-squared
  const yMean = ySum / n;
  let totalSumSquares = 0;
  let residualSumSquares = 0;
  
  for (let i = 0; i < n; i++) {
    const predicted = slope * x[i] + intercept;
    totalSumSquares += Math.pow(values[i] - yMean, 2);
    residualSumSquares += Math.pow(values[i] - predicted, 2);
  }
  
  const rSquared = totalSumSquares === 0 ? 0 : 1 - (residualSumSquares / totalSumSquares);
  
  return { slope, intercept, rSquared };
}

/**
 * Generate factors that influence the coherence forecast
 */
function generateForecastFactors(insights, trend) {
  const factors = [];
  
  insights.forEach(insight => {
    switch (insight.type) {
      case 'coherence_pattern':
        factors.push({
          type: 'positive',
          description: `${insight.title} supports continued coherence`,
          impact: 'medium'
        });
        break;
        
      case 'sentiment_trend':
        if (insight.trend === 'declining') {
          factors.push({
            type: 'negative',
            description: 'Declining emotional tone may affect coherence',
            impact: 'medium'
          });
        } else if (insight.trend === 'improving') {
          factors.push({
            type: 'positive',
            description: 'Improving emotional tone supports coherence',
            impact: 'medium'
          });
        }
        break;
        
      case 'session_pattern':
        if (insight.title.includes('Energy Depletion')) {
          factors.push({
            type: 'negative',
            description: 'Energy depletion pattern may limit coherence growth',
            impact: 'high'
          });
        } else if (insight.title.includes('Breakthrough')) {
          factors.push({
            type: 'positive',
            description: 'Breakthrough capacity suggests coherence potential',
            impact: 'high'
          });
        }
        break;
    }
  });
  
  return factors;
}

/**
 * Generate personal pattern summary
 */
function generatePersonalPatternSummary(insights) {
  const summary = {
    strengths: [],
    challenges: [],
    opportunities: [],
    uniquePatterns: []
  };
  
  insights.forEach(insight => {
    const confidence = insight.confidence || 0.5;
    
    if (insight.priority === 'high' && confidence > 0.6) {
      if (insight.type === 'coherence_pattern' || insight.title.includes('Breakthrough')) {
        summary.strengths.push({
          pattern: insight.title,
          description: insight.description,
          evidence: insight.evidence
        });
      } else if (insight.title.includes('Depletion') || insight.trend === 'declining') {
        summary.challenges.push({
          pattern: insight.title,
          description: insight.description,
          evidence: insight.evidence
        });
      }
    }
    
    if (insight.type === 'rare_pattern_opportunity') {
      summary.opportunities.push({
        pattern: insight.title,
        description: insight.description,
        evidence: insight.evidence
      });
    }
    
    if (insight.type === 'anomaly_pattern' && insight.anomalies) {
      const positiveAnomalies = insight.anomalies.filter(a => 
        a.description.includes('unusually high') || a.type === 'emergence_anomaly'
      );
      
      if (positiveAnomalies.length > 0) {
        summary.uniquePatterns.push({
          pattern: 'Breakthrough Capacity',
          description: 'You occasionally achieve session states well above your typical patterns',
          evidence: `${positiveAnomalies.length} breakthrough sessions identified`
        });
      }
    }
  });
  
  return summary;
}

/**
 * Assess data quality for insights generation
 */
function assessDataQuality(measurements) {
  const totalSessions = measurements.length;
  let qualitativeTextCount = 0;
  let completeMeasurementCount = 0;
  let diversityScore = 0;
  
  measurements.forEach(measurement => {
    // Check for qualitative text
    if (measurement.emergent_ecp_insights || 
        measurement.somatic_coherence?.qualitative_notes) {
      qualitativeTextCount++;
    }
    
    // Check for complete measurements
    const hasSomatic = measurement.somatic_coherence?.pre_session && measurement.somatic_coherence?.post_session;
    const hasResponse = measurement.response_quality?.assessment;
    const hasMeaning = measurement.meaning_making?.post_session;
    
    if (hasSomatic && hasResponse && hasMeaning) {
      completeMeasurementCount++;
    }
  });
  
  // Calculate diversity (simplified: unique days of week)
  const uniqueDays = new Set(measurements.map(m => new Date(m.timestamp).getDay())).size;
  diversityScore = uniqueDays / 7;
  
  return {
    totalSessions,
    qualitativeRatio: qualitativeTextCount / totalSessions,
    completenessRatio: completeMeasurementCount / totalSessions,
    diversityScore,
    quality: assessOverallQuality(totalSessions, qualitativeTextCount / totalSessions, completeMeasurementCount / totalSessions, diversityScore)
  };
}

/**
 * Assess overall data quality
 */
function assessOverallQuality(total, qualitativeRatio, completenessRatio, diversityScore) {
  if (total < 10) return 'insufficient';
  if (total >= 30 && qualitativeRatio > 0.7 && completenessRatio > 0.8 && diversityScore > 0.4) return 'excellent';
  if (total >= 20 && qualitativeRatio > 0.5 && completenessRatio > 0.6 && diversityScore > 0.3) return 'good';
  if (total >= 10 && qualitativeRatio > 0.3 && completenessRatio > 0.4) return 'fair';
  return 'poor';
}

/**
 * Generate weekly pattern description
 */
function generateWeeklyPatternDescription(pattern) {
  const descriptions = {
    'no_weekly_pattern': 'Your sessions show consistent quality regardless of the day of the week.',
    'strong_weekend_boost': 'You consistently have higher-quality sessions on weekends, likely due to more time and less external pressure.',
    'mild_weekend_boost': 'Weekend sessions tend to be slightly better, possibly due to a more relaxed state of mind.',
    'strong_weekday_preference': 'Your weekday sessions significantly outperform weekend ones, suggesting you thrive on structured, focused time.',
    'mild_weekday_preference': 'Weekday sessions tend to be slightly better, possibly due to cognitive momentum from daily activities.'
  };
  
  return descriptions[pattern] || 'Your weekly session patterns show interesting variations worth exploring.';
}

/**
 * Generate session type recommendations (helper function)
 */
function generateSessionTypeRecommendations(dominantType, allTypes) {
  const recommendations = [];
  
  // Find complementary session types
  const otherValueableTypes = allTypes.filter(type => 
    type.id !== dominantType.id && 
    (type.name.includes('Insight') || type.name.includes('Breakthrough') || type.name.includes('Resonance'))
  );
  
  if (otherValueableTypes.length > 0) {
    recommendations.push(`Occasionally try to cultivate conditions that support ${otherValueableTypes[0].name}`);
  }
  
  return recommendations;
}

export default {
  generatePersonalizedInsights,
  generateCoherenceForecast,
  calculateOverallCoherenceScore,
  assessDataQuality
};