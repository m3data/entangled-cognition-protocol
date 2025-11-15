// js/modules/semanticAnalysis.js

/**
 * Semantic analysis for qualitative somatic-symbolic research data
 * Processes text data from reflections, insights, and qualitative notes
 */

import { getAllMeasurements, getMeasurementsInDateRange } from './storage.js';

/**
 * Simple tokenization and text preprocessing
 * @param {string} text - Input text
 * @returns {Array} - Array of processed tokens
 */
function tokenize(text) {
  if (!text || typeof text !== 'string') return [];
  
  return text.toLowerCase()
    .replace(/[^\w\s'-]/g, ' ') // Keep words, whitespace, hyphens, apostrophes
    .split(/\s+/)
    .filter(token => token.length > 2) // Remove very short tokens
    .filter(token => !isStopWord(token));
}

/**
 * Check if a word is a stop word
 */
function isStopWord(word) {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'this', 'that', 'these', 'those', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may',
    'might', 'can', 'cannot', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him',
    'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their'
  ]);
  
  return stopWords.has(word);
}

/**
 * Calculate Term Frequency-Inverse Document Frequency (TF-IDF) vectors
 * @param {Array} documents - Array of tokenized documents
 * @returns {Object} - TF-IDF vectors and vocabulary
 */
function calculateTFIDF(documents) {
  // Build vocabulary
  const vocabulary = new Set();
  documents.forEach(doc => {
    doc.forEach(token => vocabulary.add(token));
  });
  
  const vocabArray = Array.from(vocabulary);
  const numDocs = documents.length;
  
  // Calculate document frequency for each term
  const documentFreq = {};
  vocabArray.forEach(term => {
    documentFreq[term] = documents.filter(doc => doc.includes(term)).length;
  });
  
  // Calculate TF-IDF vectors
  const tfidfVectors = documents.map(doc => {
    const termCounts = {};
    doc.forEach(token => {
      termCounts[token] = (termCounts[token] || 0) + 1;
    });
    
    const docLength = doc.length;
    const vector = [];
    
    vocabArray.forEach(term => {
      const tf = (termCounts[term] || 0) / docLength;
      const idf = Math.log(numDocs / (documentFreq[term] || 1));
      vector.push(tf * idf);
    });
    
    return vector;
  });
  
  return {
    vectors: tfidfVectors,
    vocabulary: vocabArray,
    documentFreq
  };
}

/**
 * Calculate cosine similarity between two vectors
 * @param {Array} vecA - First vector
 * @param {Array} vecB - Second vector
 * @returns {number} - Cosine similarity (0-1)
 */
function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) return 0;
  
  const dotProduct = vecA.reduce((sum, a, i) => sum + (a * vecB[i]), 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + (a * a), 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + (b * b), 0));
  
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  
  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Perform hierarchical clustering on documents
 * @param {Array} vectors - TF-IDF vectors
 * @param {number} numClusters - Desired number of clusters
 * @returns {Array} - Cluster assignments
 */
function hierarchicalCluster(vectors, numClusters = 5) {
  if (vectors.length === 0) return [];
  if (vectors.length <= numClusters) {
    return vectors.map((_, idx) => idx);
  }
  
  // Initialize: each document in its own cluster
  let clusters = vectors.map((vector, idx) => ({
    id: idx,
    vectors: [vector],
    members: [idx],
    centroid: [...vector]
  }));
  
  // Merge clusters until we reach desired number
  while (clusters.length > numClusters) {
    let minDistance = Infinity;
    let mergeIndices = [0, 1];
    
    // Find closest pair of clusters
    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const similarity = cosineSimilarity(clusters[i].centroid, clusters[j].centroid);
        const distance = 1 - similarity;
        
        if (distance < minDistance) {
          minDistance = distance;
          mergeIndices = [i, j];
        }
      }
    }
    
    // Merge the closest clusters
    const [i, j] = mergeIndices;
    const newCluster = {
      id: Math.max(clusters[i].id, clusters[j].id),
      vectors: [...clusters[i].vectors, ...clusters[j].vectors],
      members: [...clusters[i].members, ...clusters[j].members],
      centroid: calculateCentroid([...clusters[i].vectors, ...clusters[j].vectors])
    };
    
    // Remove old clusters and add new one
    clusters = clusters.filter((_, idx) => idx !== i && idx !== j);
    clusters.push(newCluster);
  }
  
  // Create assignment array
  const assignments = new Array(vectors.length);
  clusters.forEach((cluster, clusterIdx) => {
    cluster.members.forEach(memberIdx => {
      assignments[memberIdx] = clusterIdx;
    });
  });
  
  return assignments;
}

/**
 * Calculate centroid of a set of vectors
 */
function calculateCentroid(vectors) {
  if (vectors.length === 0) return [];
  
  const dimensions = vectors[0].length;
  const centroid = new Array(dimensions).fill(0);
  
  vectors.forEach(vector => {
    vector.forEach((value, idx) => {
      centroid[idx] += value;
    });
  });
  
  return centroid.map(sum => sum / vectors.length);
}

/**
 * Extract qualitative text data from measurements
 * @param {Array} measurements - Array of measurement entries
 * @returns {Array} - Array of text documents with metadata
 */
function extractQualitativeTexts(measurements) {
  const texts = [];
  
  measurements.forEach(measurement => {
    const somaticNotes = measurement.somatic_coherence?.qualitative_notes || {};
    const emergentInsights = measurement.emergent_ecp_insights;
    const collapseDetails = measurement.collapse_event_details;
    
    // Combine all textual content for this measurement
    const textParts = [];
    
    // Somatic qualitative notes
    if (somaticNotes.physical_sensations) textParts.push(somaticNotes.physical_sensations);
    if (somaticNotes.energetic_shifts) textParts.push(somaticNotes.energetic_shifts);
    if (somaticNotes.embodied_insights) textParts.push(somaticNotes.embodied_insights);
    if (somaticNotes.somatic_response_to_ai) textParts.push(somaticNotes.somatic_response_to_ai);
    
    // Other qualitative fields
    if (emergentInsights) textParts.push(emergentInsights);
    if (collapseDetails) textParts.push(collapseDetails);
    
    if (textParts.length > 0) {
      texts.push({
        experiment_id: measurement.experiment_id,
        timestamp: measurement.timestamp,
        combinedText: textParts.join(' '),
        textParts: textParts,
        measurement: measurement
      });
    }
  });
  
  return texts;
}

/**
 * Perform semantic clustering on qualitative reflection entries
 * @param {number} days - Number of days to analyze
 * @param {number} numClusters - Number of thematic clusters to identify
 * @returns {Object} - Semantic clustering results
 */
export function performSemanticClustering(days = 90, numClusters = 5) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const measurements = getMeasurementsInDateRange(startDate, endDate);
  const qualitativeTexts = extractQualitativeTexts(measurements);
  
  if (qualitativeTexts.length < 3) {
    return {
      clusters: [],
      error: 'Insufficient qualitative data for clustering',
      minRequired: 3,
      available: qualitativeTexts.length
    };
  }
  
  // Tokenize documents
  const tokenizedDocs = qualitativeTexts.map(doc => tokenize(doc.combinedText));
  
  // Calculate TF-IDF vectors
  const tfidf = calculateTFIDF(tokenizedDocs);
  
  // Perform clustering
  const clusterAssignments = hierarchicalCluster(tfidf.vectors, Math.min(numClusters, qualitativeTexts.length));
  
  // Group documents by cluster and analyze themes
  const clusters = {};
  clusterAssignments.forEach((clusterId, docIdx) => {
    if (!clusters[clusterId]) {
      clusters[clusterId] = {
        id: clusterId,
        documents: [],
        tokens: [],
        themes: [],
        keyTerms: []
      };
    }
    
    clusters[clusterId].documents.push(qualitativeTexts[docIdx]);
    clusters[clusterId].tokens.push(...tokenizedDocs[docIdx]);
  });
  
  // Analyze themes for each cluster
  Object.values(clusters).forEach(cluster => {
    cluster.themes = extractThemes(cluster.tokens, tfidf.vocabulary, tfidf.documentFreq);
    cluster.keyTerms = getTopTerms(cluster.tokens, 10);
    cluster.name = generateClusterName(cluster.keyTerms, cluster.themes);
    cluster.description = generateClusterDescription(cluster.documents, cluster.themes);
    cluster.size = cluster.documents.length;
    cluster.timeSpan = getClusterTimeSpan(cluster.documents);
    cluster.somaticPatterns = analyzeSomaticPatterns(cluster.documents);
  });
  
  return {
    clusters: Object.values(clusters).sort((a, b) => b.size - a.size),
    totalDocuments: qualitativeTexts.length,
    vocabulary: tfidf.vocabulary,
    analysisDate: new Date().toISOString(),
    timeRange: { startDate: startDate.toISOString(), endDate: endDate.toISOString() }
  };
}

/**
 * Extract thematic patterns from cluster tokens
 */
function extractThemes(tokens, vocabulary, documentFreq) {
  const termFreq = {};
  tokens.forEach(token => {
    termFreq[token] = (termFreq[token] || 0) + 1;
  });
  
  // Identify theme-relevant terms using TF-IDF-like scoring
  const themes = Object.entries(termFreq)
    .map(([term, freq]) => {
      const tf = freq / tokens.length;
      const idf = Math.log(vocabulary.length / (documentFreq[term] || 1));
      return {
        term,
        frequency: freq,
        score: tf * idf,
        relativeFreq: freq / tokens.length
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);
  
  // Group themes by semantic similarity (simplified)
  const thematicGroups = groupThemesBySimilarity(themes);
  
  return thematicGroups;
}

/**
 * Group similar themes together (simplified semantic grouping)
 */
function groupThemesBySimilarity(themes) {
  const groups = [];
  
  // Define semantic clusters based on common word patterns in somatic-symbolic research
  const semanticCategories = {
    embodied: ['body', 'embodied', 'physical', 'sensation', 'felt', 'somatic', 'grounded', 'presence'],
    energetic: ['energy', 'energetic', 'flow', 'vibration', 'resonance', 'field', 'frequency'],
    emotional: ['feeling', 'emotion', 'mood', 'affect', 'emotional', 'heart', 'love', 'fear', 'joy'],
    cognitive: ['thought', 'thinking', 'mind', 'mental', 'idea', 'concept', 'understanding', 'insight'],
    symbolic: ['symbol', 'metaphor', 'image', 'vision', 'dream', 'archetype', 'meaning', 'representation'],
    relational: ['connection', 'relationship', 'other', 'together', 'shared', 'mutual', 'dialogue'],
    transformational: ['change', 'shift', 'transform', 'emergence', 'breakthrough', 'evolution', 'growth'],
    spiritual: ['spiritual', 'sacred', 'divine', 'transcendent', 'mystical', 'soul', 'consciousness']
  };
  
  Object.entries(semanticCategories).forEach(([category, keywords]) => {
    const categoryThemes = themes.filter(theme => 
      keywords.some(keyword => theme.term.includes(keyword) || keyword.includes(theme.term))
    );
    
    if (categoryThemes.length > 0) {
      groups.push({
        category,
        themes: categoryThemes,
        totalScore: categoryThemes.reduce((sum, theme) => sum + theme.score, 0),
        avgScore: categoryThemes.reduce((sum, theme) => sum + theme.score, 0) / categoryThemes.length
      });
    }
  });
  
  // Add ungrouped themes as miscellaneous
  const groupedTerms = new Set();
  groups.forEach(group => {
    group.themes.forEach(theme => groupedTerms.add(theme.term));
  });
  
  const ungroupedThemes = themes.filter(theme => !groupedTerms.has(theme.term));
  if (ungroupedThemes.length > 0) {
    groups.push({
      category: 'miscellaneous',
      themes: ungroupedThemes,
      totalScore: ungroupedThemes.reduce((sum, theme) => sum + theme.score, 0),
      avgScore: ungroupedThemes.reduce((sum, theme) => sum + theme.score, 0) / ungroupedThemes.length
    });
  }
  
  return groups.sort((a, b) => b.totalScore - a.totalScore);
}

/**
 * Get top terms from a token list
 */
function getTopTerms(tokens, limit = 10) {
  const termFreq = {};
  tokens.forEach(token => {
    termFreq[token] = (termFreq[token] || 0) + 1;
  });
  
  return Object.entries(termFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, limit)
    .map(([term, freq]) => ({ term, frequency: freq }));
}

/**
 * Generate a name for a thematic cluster
 */
function generateClusterName(keyTerms, themes) {
  if (themes.length === 0 || keyTerms.length === 0) return 'Unthemed Cluster';
  
  // Use the dominant theme category
  const dominantTheme = themes[0];
  const topTerms = keyTerms.slice(0, 2).map(t => t.term);
  
  const categoryNames = {
    embodied: 'Somatic Experience',
    energetic: 'Energetic Phenomena', 
    emotional: 'Emotional Processing',
    cognitive: 'Mental Insights',
    symbolic: 'Symbolic Content',
    relational: 'Relational Dynamics',
    transformational: 'Transformative Shifts',
    spiritual: 'Spiritual Experiences',
    miscellaneous: 'Mixed Themes'
  };
  
  const baseName = categoryNames[dominantTheme.category] || 'Thematic Cluster';
  
  if (topTerms.length > 0) {
    return `${baseName} (${topTerms.join(', ')})`;
  }
  
  return baseName;
}

/**
 * Generate description for cluster
 */
function generateClusterDescription(documents, themes) {
  const sessionCount = documents.length;
  const dominantThemes = themes.slice(0, 3);
  
  let description = `Contains ${sessionCount} session${sessionCount > 1 ? 's' : ''} with shared thematic patterns. `;
  
  if (dominantThemes.length > 0) {
    const themeDescriptions = dominantThemes.map(theme => {
      const topTerms = theme.themes.slice(0, 3).map(t => t.term).join(', ');
      return `${theme.category} themes (${topTerms})`;
    });
    
    description += `Primary themes include: ${themeDescriptions.join('; ')}.`;
  }
  
  return description;
}

/**
 * Get time span for cluster documents
 */
function getClusterTimeSpan(documents) {
  const timestamps = documents.map(doc => new Date(doc.timestamp)).sort();
  return {
    earliest: timestamps[0].toISOString(),
    latest: timestamps[timestamps.length - 1].toISOString(),
    span: timestamps.length > 1 ? 
      Math.round((timestamps[timestamps.length - 1] - timestamps[0]) / (1000 * 60 * 60 * 24)) : 0
  };
}

/**
 * Analyze somatic patterns within a cluster
 */
function analyzeSomaticPatterns(documents) {
  const somaticData = documents.map(doc => {
    const somatic = doc.measurement.somatic_coherence;
    if (!somatic) return null;
    
    const pre = somatic.pre_session || {};
    const post = somatic.post_session || {};
    
    return {
      preAvg: (pre.embodied_presence + pre.energetic_resonance + pre.somatic_intelligence + pre.groundedness) / 4 || 0,
      postAvg: (post.embodied_presence + post.energetic_resonance + post.somatic_intelligence + post.groundedness) / 4 || 0,
      shift: ((post.embodied_presence + post.energetic_resonance + post.somatic_intelligence + post.groundedness) / 4) - 
             ((pre.embodied_presence + pre.energetic_resonance + pre.somatic_intelligence + pre.groundedness) / 4) || 0
    };
  }).filter(Boolean);
  
  if (somaticData.length === 0) {
    return { avgPre: null, avgPost: null, avgShift: null, pattern: 'no_data' };
  }
  
  const avgPre = somaticData.reduce((sum, d) => sum + d.preAvg, 0) / somaticData.length;
  const avgPost = somaticData.reduce((sum, d) => sum + d.postAvg, 0) / somaticData.length;
  const avgShift = somaticData.reduce((sum, d) => sum + d.shift, 0) / somaticData.length;
  
  let pattern = 'stable';
  if (avgShift > 0.5) pattern = 'enhancing';
  else if (avgShift < -0.5) pattern = 'depleting';
  
  return {
    avgPre: Math.round(avgPre * 100) / 100,
    avgPost: Math.round(avgPost * 100) / 100,
    avgShift: Math.round(avgShift * 100) / 100,
    pattern,
    sampleSize: somaticData.length
  };
}

/**
 * Analyze metaphor density in AI responses (if available)
 * @param {Array} measurements - Array of measurement entries
 * @returns {Object} - Metaphor analysis results
 */
export function analyzeMetaphorDensity(measurements = null) {
  if (!measurements) {
    measurements = getAllMeasurements(100);
  }
  
  // Extract metaphor-related data
  const metaphorData = measurements.map(measurement => {
    const responseQuality = measurement.response_quality?.assessment || {};
    const meaningMaking = measurement.meaning_making?.post_session || {};
    
    return {
      experiment_id: measurement.experiment_id,
      timestamp: measurement.timestamp,
      metaphorRichness: responseQuality.metaphor_richness || 0,
      symbolicResonance: meaningMaking.symbolic_resonance || 0,
      // Calculate combined metaphor density score
      metaphorDensity: ((responseQuality.metaphor_richness || 0) + (meaningMaking.symbolic_resonance || 0)) / 2
    };
  }).filter(data => data.metaphorRichness > 0 || data.symbolicResonance > 0);
  
  if (metaphorData.length === 0) {
    return {
      analysis: null,
      error: 'No metaphor density data available'
    };
  }
  
  // Calculate statistics
  const densityScores = metaphorData.map(d => d.metaphorDensity);
  const avgDensity = densityScores.reduce((sum, score) => sum + score, 0) / densityScores.length;
  const maxDensity = Math.max(...densityScores);
  const minDensity = Math.min(...densityScores);
  
  // Identify high-density sessions
  const highDensityThreshold = avgDensity + (maxDensity - avgDensity) * 0.5;
  const highDensitySessions = metaphorData.filter(d => d.metaphorDensity >= highDensityThreshold);
  
  return {
    analysis: {
      averageDensity: Math.round(avgDensity * 100) / 100,
      maxDensity: Math.round(maxDensity * 100) / 100,
      minDensity: Math.round(minDensity * 100) / 100,
      highDensityThreshold: Math.round(highDensityThreshold * 100) / 100,
      highDensitySessionCount: highDensitySessions.length,
      highDensitySessionIds: highDensitySessions.map(s => s.experiment_id),
      totalSessions: metaphorData.length,
      densityDistribution: calculateDensityDistribution(densityScores)
    },
    metaphorData,
    analysisDate: new Date().toISOString()
  };
}

/**
 * Calculate density distribution for visualization
 */
function calculateDensityDistribution(scores) {
  const bins = [0, 1, 2, 3, 4, 5];
  const distribution = bins.slice(0, -1).map((binStart, idx) => {
    const binEnd = bins[idx + 1];
    const count = scores.filter(score => score >= binStart && score < binEnd).length;
    return {
      range: `${binStart}-${binEnd}`,
      count,
      percentage: Math.round((count / scores.length) * 100)
    };
  });
  
  return distribution;
}

/**
 * Perform sentiment analysis on qualitative data
 * @param {number} days - Number of days to analyze
 * @returns {Object} - Sentiment analysis results
 */
export function analyzeSentiment(days = 60) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const measurements = getMeasurementsInDateRange(startDate, endDate);
  const qualitativeTexts = extractQualitativeTexts(measurements);
  
  if (qualitativeTexts.length === 0) {
    return {
      sentimentAnalysis: null,
      error: 'No qualitative text data available for sentiment analysis'
    };
  }
  
  // Simple lexicon-based sentiment analysis
  const sentimentResults = qualitativeTexts.map(doc => {
    const sentiment = calculateTextSentiment(doc.combinedText);
    return {
      experiment_id: doc.experiment_id,
      timestamp: doc.timestamp,
      sentiment,
      textLength: doc.combinedText.length
    };
  });
  
  // Aggregate results
  const avgSentiment = sentimentResults.reduce((sum, result) => sum + result.sentiment.score, 0) / sentimentResults.length;
  const positiveSessions = sentimentResults.filter(r => r.sentiment.score > 0.1).length;
  const negativeSessions = sentimentResults.filter(r => r.sentiment.score < -0.1).length;
  const neutralSessions = sentimentResults.length - positiveSessions - negativeSessions;
  
  return {
    sentimentAnalysis: {
      averageSentiment: Math.round(avgSentiment * 1000) / 1000,
      positiveSessions,
      negativeSessions,
      neutralSessions,
      totalSessions: sentimentResults.length,
      sentimentTrend: calculateSentimentTrend(sentimentResults),
      distribution: {
        positive: Math.round((positiveSessions / sentimentResults.length) * 100),
        negative: Math.round((negativeSessions / sentimentResults.length) * 100),
        neutral: Math.round((neutralSessions / sentimentResults.length) * 100)
      }
    },
    sentimentResults,
    analysisDate: new Date().toISOString(),
    timeRange: { startDate: startDate.toISOString(), endDate: endDate.toISOString() }
  };
}

/**
 * Calculate sentiment for a text using simple lexicon approach
 */
function calculateTextSentiment(text) {
  // Simplified sentiment lexicon for somatic-symbolic content
  const positiveWords = new Set([
    'joy', 'peace', 'love', 'harmony', 'flow', 'connection', 'insight', 'clarity', 'breakthrough',
    'expansive', 'grounded', 'centered', 'aligned', 'resonance', 'coherence', 'integration', 'healing',
    'profound', 'beautiful', 'wonder', 'amazing', 'powerful', 'transformative', 'enlightening',
    'comfortable', 'relaxed', 'calm', 'serene', 'vibrant', 'alive', 'energized', 'presence'
  ]);
  
  const negativeWords = new Set([
    'anxiety', 'fear', 'confusion', 'chaos', 'disruption', 'disconnection', 'fragmentation',
    'stuck', 'blocked', 'resistance', 'tension', 'discomfort', 'pain', 'struggle', 'difficult',
    'overwhelming', 'depleted', 'drained', 'scattered', 'ungrounded', 'agitated', 'restless',
    'disturbing', 'concerning', 'frustrating', 'disappointing', 'empty', 'hollow'
  ]);
  
  const tokens = tokenize(text);
  let positiveCount = 0;
  let negativeCount = 0;
  
  tokens.forEach(token => {
    if (positiveWords.has(token)) positiveCount++;
    if (negativeWords.has(token)) negativeCount++;
  });
  
  const totalSentimentWords = positiveCount + negativeCount;
  
  if (totalSentimentWords === 0) {
    return { score: 0, classification: 'neutral', positiveCount: 0, negativeCount: 0 };
  }
  
  const score = (positiveCount - negativeCount) / tokens.length;
  
  let classification = 'neutral';
  if (score > 0.05) classification = 'positive';
  else if (score < -0.05) classification = 'negative';
  
  return {
    score: Math.round(score * 1000) / 1000,
    classification,
    positiveCount,
    negativeCount,
    totalWords: tokens.length
  };
}

/**
 * Calculate sentiment trend over time
 */
function calculateSentimentTrend(sentimentResults) {
  if (sentimentResults.length < 3) return 'insufficient_data';
  
  // Sort by timestamp
  const sortedResults = sentimentResults
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  // Calculate trend using linear regression-like approach
  const n = sortedResults.length;
  const xValues = sortedResults.map((_, idx) => idx);
  const yValues = sortedResults.map(r => r.sentiment.score);
  
  const xSum = xValues.reduce((sum, x) => sum + x, 0);
  const ySum = yValues.reduce((sum, y) => sum + y, 0);
  const xySum = xValues.reduce((sum, x, idx) => sum + (x * yValues[idx]), 0);
  const x2Sum = xValues.reduce((sum, x) => sum + (x * x), 0);
  
  const slope = (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum);
  
  if (Math.abs(slope) < 0.01) return 'stable';
  return slope > 0 ? 'improving' : 'declining';
}

export default {
  performSemanticClustering,
  analyzeMetaphorDensity,
  analyzeSentiment,
  tokenize,
  calculateTFIDF,
  extractQualitativeTexts
};