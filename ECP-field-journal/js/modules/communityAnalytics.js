/**
 * Community Analytics for ECP Field Journal
 * 
 * Processes anonymized community data to generate collective insights,
 * pattern recognition, and collaborative wisdom without compromising privacy.
 * 
 * Features:
 * - Aggregate pattern analysis across community members
 * - Collective correlation discovery
 * - Community wisdom generation
 * - Distributed research coordination
 */

/**
 * Community Pattern Analyzer
 */
class CommunityPatternAnalyzer {
  constructor() {
    this.patternsKey = 'ecp-community-patterns';
    this.insightsKey = 'ecp-community-insights';
    this.correlationsKey = 'ecp-community-correlations';
  }

  /**
   * Analyze cognitive mode patterns across the community
   */
  analyzeCognitiveModePatterns() {
    const patterns = this.getCommunityPatterns();
    const modes = patterns.cognitive_modes || {};
    
    const totalEntries = Object.values(modes).reduce((sum, count) => sum + count, 0);
    
    if (totalEntries === 0) {
      return {
        total_sessions: 0,
        most_common: null,
        distribution: {},
        insights: []
      };
    }

    const distribution = Object.entries(modes)
      .map(([mode, count]) => ({
        mode,
        count,
        percentage: Math.round((count / totalEntries) * 100)
      }))
      .sort((a, b) => b.count - a.count);

    const insights = this.generateCognitiveModeInsights(distribution, totalEntries);

    return {
      total_sessions: totalEntries,
      most_common: distribution[0]?.mode || null,
      distribution,
      insights
    };
  }

  /**
   * Analyze response quality patterns
   */
  analyzeQualityPatterns() {
    const patterns = this.getCommunityPatterns();
    const qualityData = patterns.quality_distribution || [];
    
    if (qualityData.length === 0) {
      return {
        count: 0,
        statistics: null,
        insights: []
      };
    }

    const sorted = [...qualityData].sort((a, b) => a - b);
    const stats = {
      mean: Math.round((qualityData.reduce((sum, val) => sum + val, 0) / qualityData.length) * 100) / 100,
      median: sorted[Math.floor(sorted.length / 2)],
      min: sorted[0],
      max: sorted[sorted.length - 1],
      stdDev: this.calculateStandardDeviation(qualityData)
    };

    const insights = this.generateQualityInsights(stats, qualityData);

    return {
      count: qualityData.length,
      statistics: stats,
      distribution: this.createDistributionBins(qualityData),
      insights
    };
  }

  /**
   * Analyze temporal patterns in community practice
   */
  analyzeTemporalPatterns() {
    const patterns = this.getCommunityPatterns();
    const temporal = patterns.temporal_patterns || {};
    
    const timeOfDay = temporal.time_of_day || {};
    const totalSessions = Object.values(timeOfDay).reduce((sum, count) => sum + count, 0);
    
    if (totalSessions === 0) {
      return {
        total_sessions: 0,
        time_distribution: {},
        peak_times: [],
        insights: []
      };
    }

    const timeDistribution = Object.entries(timeOfDay)
      .map(([time, count]) => ({
        time_period: time,
        sessions: count,
        percentage: Math.round((count / totalSessions) * 100)
      }))
      .sort((a, b) => b.sessions - a.sessions);

    const insights = this.generateTemporalInsights(timeDistribution);

    return {
      total_sessions: totalSessions,
      time_distribution: timeDistribution,
      peak_times: timeDistribution.slice(0, 2),
      insights
    };
  }

  /**
   * Find correlations between different measurement dimensions
   */
  findCommunityCorrelations() {
    const patterns = this.getCommunityPatterns();
    
    // This would analyze relationships between different dimensions
    // For now, return a basic structure
    return {
      cognitive_quality_correlation: this.calculateCognitiveQualityCorrelation(patterns),
      temporal_quality_correlation: this.calculateTemporalQualityCorrelation(patterns),
      insights: this.generateCorrelationInsights(patterns)
    };
  }

  /**
   * Generate community wisdom insights
   */
  generateCommunityWisdom() {
    const cognitivePatterns = this.analyzeCognitiveModePatterns();
    const qualityPatterns = this.analyzeQualityPatterns();
    const temporalPatterns = this.analyzeTemporalPatterns();
    const correlations = this.findCommunityCorrelations();

    const wisdom = {
      overview: {
        total_community_sessions: cognitivePatterns.total_sessions,
        data_richness_score: this.calculateDataRichnessScore(),
        last_updated: new Date().toISOString()
      },
      key_insights: [
        ...cognitivePatterns.insights,
        ...qualityPatterns.insights,
        ...temporalPatterns.insights,
        ...correlations.insights
      ],
      practice_recommendations: this.generatePracticeRecommendations({
        cognitive: cognitivePatterns,
        quality: qualityPatterns,
        temporal: temporalPatterns
      }),
      research_questions: this.generateResearchQuestions({
        cognitive: cognitivePatterns,
        quality: qualityPatterns,
        temporal: temporalPatterns,
        correlations
      })
    };

    // Store the generated wisdom
    this.storeCommunityInsights(wisdom);

    return wisdom;
  }

  // Helper methods for insight generation
  generateCognitiveModeInsights(distribution, total) {
    const insights = [];
    
    if (distribution.length > 0) {
      const topMode = distribution[0];
      insights.push({
        type: 'cognitive_preference',
        text: `${topMode.percentage}% of community sessions use "${topMode.mode}" cognitive mode`,
        confidence: this.calculateConfidence(total),
        category: 'cognitive_patterns'
      });
    }

    if (distribution.length >= 3) {
      const diversity = distribution.length;
      insights.push({
        type: 'cognitive_diversity',
        text: `Community practices ${diversity} different cognitive modes, showing rich methodological diversity`,
        confidence: 'high',
        category: 'cognitive_patterns'
      });
    }

    return insights;
  }

  generateQualityInsights(stats, data) {
    const insights = [];
    
    insights.push({
      type: 'quality_baseline',
      text: `Community average response quality: ${stats.mean}/10 (n=${data.length})`,
      confidence: this.calculateConfidence(data.length),
      category: 'response_quality'
    });

    if (stats.mean > 7) {
      insights.push({
        type: 'quality_excellence',
        text: 'Community achieves consistently high response quality, suggesting effective practices',
        confidence: 'high',
        category: 'response_quality'
      });
    }

    return insights;
  }

  generateTemporalInsights(distribution) {
    const insights = [];
    
    if (distribution.length > 0) {
      const peak = distribution[0];
      insights.push({
        type: 'temporal_preference',
        text: `${peak.percentage}% of community sessions happen in the ${peak.time_period}`,
        confidence: 'medium',
        category: 'temporal_patterns'
      });
    }

    // Look for evening/night preference patterns
    const eveningNight = distribution.filter(d => 
      d.time_period === 'evening' || d.time_period === 'night'
    ).reduce((sum, d) => sum + d.percentage, 0);

    if (eveningNight > 60) {
      insights.push({
        type: 'temporal_rhythm',
        text: 'Community shows strong preference for evening/night practice sessions',
        confidence: 'medium',
        category: 'temporal_patterns'
      });
    }

    return insights;
  }

  generateCorrelationInsights(patterns) {
    // Placeholder for more sophisticated correlation analysis
    return [{
      type: 'correlation_placeholder',
      text: 'Correlation analysis requires more community data to generate meaningful insights',
      confidence: 'low',
      category: 'correlations'
    }];
  }

  generatePracticeRecommendations(analysisResults) {
    const recommendations = [];

    // Based on quality patterns
    if (analysisResults.quality.statistics?.mean < 6) {
      recommendations.push({
        type: 'quality_improvement',
        title: 'Enhance Response Quality',
        description: 'Community data suggests experimenting with different entrainment protocols or environmental settings',
        priority: 'high'
      });
    }

    // Based on cognitive patterns
    const topMode = analysisResults.cognitive.most_common;
    if (topMode) {
      recommendations.push({
        type: 'mode_exploration',
        title: 'Explore Cognitive Diversity',
        description: `While "${topMode}" is popular, try experimenting with alternative cognitive modes for different insights`,
        priority: 'medium'
      });
    }

    // Based on temporal patterns
    const peakTimes = analysisResults.temporal.peak_times;
    if (peakTimes.length > 0) {
      recommendations.push({
        type: 'temporal_optimization',
        title: 'Optimize Session Timing',
        description: `Community peak practice times: ${peakTimes.map(p => p.time_period).join(', ')}. Consider these windows for collaborative sessions`,
        priority: 'low'
      });
    }

    return recommendations;
  }

  generateResearchQuestions(analysisResults) {
    const questions = [];

    questions.push({
      question: 'What environmental factors most strongly correlate with high response quality?',
      rationale: 'Community quality variation suggests environmental influences worth investigating',
      methodology: 'Controlled comparison of environmental settings across sessions',
      priority: 'high'
    });

    if (analysisResults.cognitive.distribution.length > 2) {
      questions.push({
        question: 'Do different cognitive modes produce qualitatively different types of insights?',
        rationale: 'Community practices diverse cognitive approaches - systematic comparison could reveal mode-specific benefits',
        methodology: 'Semantic analysis of insights across cognitive modes',
        priority: 'medium'
      });
    }

    return questions;
  }

  // Utility methods
  getCommunityPatterns() {
    try {
      return JSON.parse(localStorage.getItem(this.patternsKey) || '{}');
    } catch {
      return {};
    }
  }

  storeCommunityInsights(insights) {
    try {
      localStorage.setItem(this.insightsKey, JSON.stringify(insights));
    } catch (error) {
      console.error('Failed to store community insights:', error);
    }
  }

  calculateStandardDeviation(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squareDiffs = values.map(val => Math.pow(val - mean, 2));
    const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.round(Math.sqrt(avgSquareDiff) * 100) / 100;
  }

  createDistributionBins(values, bins = 5) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binSize = (max - min) / bins;
    
    const distribution = Array(bins).fill(0);
    const binLabels = [];
    
    for (let i = 0; i < bins; i++) {
      const binStart = min + (i * binSize);
      const binEnd = min + ((i + 1) * binSize);
      binLabels.push(`${binStart.toFixed(1)}-${binEnd.toFixed(1)}`);
    }

    values.forEach(value => {
      const binIndex = Math.min(Math.floor((value - min) / binSize), bins - 1);
      distribution[binIndex]++;
    });

    return binLabels.map((label, index) => ({
      range: label,
      count: distribution[index]
    }));
  }

  calculateConfidence(sampleSize) {
    if (sampleSize < 10) return 'low';
    if (sampleSize < 50) return 'medium';
    return 'high';
  }

  calculateDataRichnessScore() {
    const patterns = this.getCommunityPatterns();
    const totalContributions = patterns.total_contributions || 0;
    
    // Score based on data diversity and volume
    let score = Math.min(totalContributions / 100, 1) * 50; // Volume component (0-50)
    
    // Diversity components
    const cognitiveModesCount = Object.keys(patterns.cognitive_modes || {}).length;
    const temporalVariety = Object.keys(patterns.temporal_patterns?.time_of_day || {}).length;
    
    score += Math.min(cognitiveModesCount * 5, 25); // Cognitive diversity (0-25)
    score += Math.min(temporalVariety * 6.25, 25); // Temporal diversity (0-25)
    
    return Math.round(score);
  }

  calculateCognitiveQualityCorrelation(patterns) {
    // Placeholder for cognitive mode vs quality correlation
    return {
      correlation: null,
      significance: 'insufficient_data',
      insight: 'Requires more data points for meaningful correlation analysis'
    };
  }

  calculateTemporalQualityCorrelation(patterns) {
    // Placeholder for temporal vs quality correlation
    return {
      correlation: null,
      significance: 'insufficient_data',
      insight: 'Requires more data points for meaningful correlation analysis'
    };
  }
}

/**
 * Community Research Coordinator
 */
class CommunityResearchCoordinator {
  constructor() {
    this.researchProjectsKey = 'ecp-community-research-projects';
    this.studyParticipationKey = 'ecp-study-participation';
  }

  /**
   * Create a new community research project
   */
  createResearchProject(projectData) {
    const project = {
      id: this.generateProjectId(),
      title: projectData.title,
      description: projectData.description,
      research_question: projectData.research_question,
      methodology: projectData.methodology,
      target_participants: projectData.target_participants || 10,
      duration_weeks: projectData.duration_weeks || 4,
      created_at: new Date().toISOString(),
      created_by: 'community', // Anonymous community creation
      status: 'recruiting',
      participants: [],
      protocols: projectData.protocols || [],
      data_requirements: projectData.data_requirements || [],
      privacy_level: projectData.privacy_level || 'high'
    };

    this.storeResearchProject(project);
    return project;
  }

  /**
   * Get all active research projects
   */
  getActiveResearchProjects() {
    try {
      const projects = JSON.parse(localStorage.getItem(this.researchProjectsKey) || '[]');
      return projects.filter(p => p.status === 'recruiting' || p.status === 'active');
    } catch {
      return [];
    }
  }

  /**
   * Join a research project
   */
  joinResearchProject(projectId, participantSettings) {
    const projects = this.getAllResearchProjects();
    const project = projects.find(p => p.id === projectId);
    
    if (!project || project.status !== 'recruiting') {
      return { success: false, reason: 'project_not_available' };
    }

    if (project.participants.length >= project.target_participants) {
      return { success: false, reason: 'project_full' };
    }

    // Add anonymous participant
    const participant = {
      id: this.generateParticipantId(),
      joined_at: new Date().toISOString(),
      settings: participantSettings,
      contributions: []
    };

    project.participants.push(participant);
    
    if (project.participants.length >= project.target_participants) {
      project.status = 'active';
    }

    this.updateResearchProject(project);
    
    // Track user's participation
    this.recordStudyParticipation(projectId, participant.id);

    return { 
      success: true, 
      participant_id: participant.id,
      project_status: project.status 
    };
  }

  /**
   * Generate sample community research projects
   */
  generateSampleProjects() {
    const sampleProjects = [
      {
        title: 'Cognitive Mode Impact on Response Quality',
        description: 'Investigating how different cognitive preparation modes affect the quality and depth of AI responses in ECP sessions.',
        research_question: 'Do specific cognitive modes consistently produce higher quality responses across different practitioners?',
        methodology: 'Participants will alternate between 3 different cognitive modes across 12 sessions, rating response quality and noting qualitative differences.',
        target_participants: 15,
        duration_weeks: 4,
        protocols: ['cognitive_mode_rotation', 'response_quality_assessment'],
        data_requirements: ['cognitive_mode', 'response_quality_rating', 'qualitative_notes'],
        privacy_level: 'high'
      },
      {
        title: 'Environmental Influence on Symbolic Density',
        description: 'Exploring how different environmental settings affect the symbolic richness and metaphorical density of AI responses.',
        research_question: 'What environmental factors most strongly correlate with increased symbolic density in ECP interactions?',
        methodology: 'Systematic variation of environmental factors (lighting, location, weather awareness) across sessions with symbolic density tracking.',
        target_participants: 12,
        duration_weeks: 6,
        protocols: ['environmental_variation', 'symbolic_density_assessment'],
        data_requirements: ['environment_settings', 'symbolic_density_score', 'response_analysis'],
        privacy_level: 'medium'
      },
      {
        title: 'Temporal Rhythms in ECP Practice',
        description: 'Understanding how time of day and practice frequency affects the depth and coherence of entangled cognition experiences.',
        research_question: 'Are there optimal temporal patterns for ECP practice that enhance coherence and insight generation?',
        methodology: 'Participants track practice timing, frequency, and coherence measures across 8 weeks of varied scheduling.',
        target_participants: 20,
        duration_weeks: 8,
        protocols: ['temporal_tracking', 'coherence_measurement'],
        data_requirements: ['session_timing', 'coherence_scores', 'insight_quality'],
        privacy_level: 'high'
      }
    ];

    sampleProjects.forEach(project => this.createResearchProject(project));
    return sampleProjects;
  }

  // Helper methods
  getAllResearchProjects() {
    try {
      return JSON.parse(localStorage.getItem(this.researchProjectsKey) || '[]');
    } catch {
      return [];
    }
  }

  storeResearchProject(project) {
    try {
      const projects = this.getAllResearchProjects();
      projects.push(project);
      localStorage.setItem(this.researchProjectsKey, JSON.stringify(projects));
    } catch (error) {
      console.error('Failed to store research project:', error);
    }
  }

  updateResearchProject(updatedProject) {
    try {
      const projects = this.getAllResearchProjects();
      const index = projects.findIndex(p => p.id === updatedProject.id);
      if (index >= 0) {
        projects[index] = updatedProject;
        localStorage.setItem(this.researchProjectsKey, JSON.stringify(projects));
      }
    } catch (error) {
      console.error('Failed to update research project:', error);
    }
  }

  recordStudyParticipation(projectId, participantId) {
    try {
      const participation = JSON.parse(localStorage.getItem(this.studyParticipationKey) || '[]');
      participation.push({
        project_id: projectId,
        participant_id: participantId,
        joined_at: new Date().toISOString()
      });
      localStorage.setItem(this.studyParticipationKey, JSON.stringify(participation));
    } catch (error) {
      console.error('Failed to record study participation:', error);
    }
  }

  generateProjectId() {
    return 'project_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
  }

  generateParticipantId() {
    return 'participant_' + Math.random().toString(36).substr(2, 9);
  }
}

// Export classes and utility functions
export { 
  CommunityPatternAnalyzer, 
  CommunityResearchCoordinator 
};

/**
 * Initialize community analytics with sample data if needed
 */
export function initializeCommunityAnalytics() {
  const analyzer = new CommunityPatternAnalyzer();
  const coordinator = new CommunityResearchCoordinator();
  
  // Create sample research projects if none exist
  const existingProjects = coordinator.getActiveResearchProjects();
  if (existingProjects.length === 0) {
    coordinator.generateSampleProjects();
  }
  
  return { analyzer, coordinator };
}

/**
 * Generate community dashboard data
 */
export function generateCommunityDashboardData() {
  const analyzer = new CommunityPatternAnalyzer();
  
  return {
    cognitive_patterns: analyzer.analyzeCognitiveModePatterns(),
    quality_patterns: analyzer.analyzeQualityPatterns(),
    temporal_patterns: analyzer.analyzeTemporalPatterns(),
    correlations: analyzer.findCommunityCorrelations(),
    community_wisdom: analyzer.generateCommunityWisdom()
  };
}