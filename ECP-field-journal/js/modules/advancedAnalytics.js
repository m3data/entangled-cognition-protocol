// js/modules/advancedAnalytics.js

/**
 * Main integration module for advanced ECP analytics
 * Provides a unified interface to all pattern analysis capabilities
 */

import { performComprehensiveAnalysis } from './advancedPatternAnalysis.js';
import { createPatternAnalysisDashboard, initializeAdvancedVisualizationStyles } from './advancedVisualization.js';
import { generatePersonalizedInsights } from './insightsEngine.js';
import { identifySessionTypes, detectCoherencePatterns, detectAnomalies } from './patternDetection.js';
import { performSemanticClustering, analyzeMetaphorDensity, analyzeSentiment } from './semanticAnalysis.js';
import { analyzeTemporalPatterns, detectCyclesAcrossScales } from './timeSeriesAnalysis.js';

/**
 * Main class for ECP Advanced Analytics
 */
export class ECPAdvancedAnalytics {
  constructor() {
    this.analysisCache = new Map();
    this.isInitialized = false;
    this.defaultConfig = {
      days: 90,
      analysisDepth: 'full', // 'quick', 'standard', 'full'
      cacheDuration: 5 * 60 * 1000, // 5 minutes
      enableVisualization: true,
      autoRefresh: false
    };
  }

  /**
   * Initialize the analytics system
   */
  async initialize(config = {}) {
    if (this.isInitialized) return;

    this.config = { ...this.defaultConfig, ...config };

    // Initialize visualization styles
    if (this.config.enableVisualization) {
      initializeAdvancedVisualizationStyles();
    }

    this.isInitialized = true;
    console.log('ECP Advanced Analytics initialized');
  }

  /**
   * Run comprehensive analysis with caching
   * @param {Object} options - Analysis options
   * @returns {Promise<Object>} - Analysis results
   */
  async runAnalysis(options = {}) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const analysisOptions = { ...this.config, ...options };
    const cacheKey = this.generateCacheKey(analysisOptions);

    // Check cache
    if (this.analysisCache.has(cacheKey)) {
      const cached = this.analysisCache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.config.cacheDuration) {
        console.log('Returning cached analysis results');
        return cached.results;
      }
    }

    console.log('Running fresh comprehensive analysis...');
    
    try {
      const results = await performComprehensiveAnalysis(analysisOptions);
      
      // Cache results
      this.analysisCache.set(cacheKey, {
        results,
        timestamp: Date.now()
      });

      return results;
    } catch (error) {
      console.error('Analysis failed:', error);
      throw new AnalysisError('Comprehensive analysis failed', error);
    }
  }

  /**
   * Create and display the analysis dashboard
   * @param {HTMLElement} container - Container element
   * @param {Object} options - Analysis options
   * @returns {Promise<HTMLElement>} - Dashboard element
   */
  async createDashboard(container, options = {}) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.config.enableVisualization) {
      throw new Error('Visualization is disabled in configuration');
    }

    try {
      const analysisResults = await this.runAnalysis(options);
      const dashboard = createPatternAnalysisDashboard(analysisResults, container);
      
      // Add refresh functionality
      if (this.config.autoRefresh) {
        this.setupAutoRefresh(dashboard, options);
      }

      return dashboard;
    } catch (error) {
      console.error('Dashboard creation failed:', error);
      this.displayError(container, 'Failed to create analysis dashboard', error);
      throw error;
    }
  }

  /**
   * Get quick insights without full analysis
   * @param {number} days - Number of days to analyze
   * @returns {Promise<Object>} - Quick insights
   */
  async getQuickInsights(days = 30) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const insights = await generatePersonalizedInsights(days);
      return {
        type: 'quick_insights',
        data: insights,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Quick insights failed:', error);
      throw new AnalysisError('Quick insights generation failed', error);
    }
  }

  /**
   * Run specific analysis modules individually
   * @param {string} moduleName - Name of the analysis module
   * @param {Object} options - Module-specific options
   * @returns {Promise<Object>} - Module results
   */
  async runModule(moduleName, options = {}) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const { days = 90 } = options;

    try {
      switch (moduleName) {
        case 'sessionTypes':
          return await identifySessionTypes(days, options.clusters || 4);
        
        case 'coherencePatterns':
          return await detectCoherencePatterns(days);
        
        case 'anomalies':
          return await detectAnomalies(days);
        
        case 'semanticClustering':
          return await performSemanticClustering(days, options.clusters || 5);
        
        case 'metaphorAnalysis':
          return await analyzeMetaphorDensity(options.measurements || null);
        
        case 'sentimentAnalysis':
          return await analyzeSentiment(days);
        
        case 'temporalPatterns':
          if (options.scalePath) {
            return await analyzeTemporalPatterns(options.scalePath, days);
          }
          return await detectCyclesAcrossScales(days);
        
        case 'personalizedInsights':
          return await generatePersonalizedInsights(days);
        
        default:
          throw new Error(`Unknown analysis module: ${moduleName}`);
      }
    } catch (error) {
      console.error(`Module ${moduleName} failed:`, error);
      throw new AnalysisError(`${moduleName} analysis failed`, error);
    }
  }

  /**
   * Export analysis results
   * @param {Object} analysisResults - Results to export
   * @param {string} format - Export format ('json', 'csv', 'summary')
   * @returns {string|Object} - Exported data
   */
  async exportResults(analysisResults, format = 'json') {
    try {
      switch (format) {
        case 'json':
          return JSON.stringify(analysisResults, null, 2);
        
        case 'csv':
          return this.convertToCSV(analysisResults);
        
        case 'summary':
          return this.generateSummaryReport(analysisResults);
        
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      throw new AnalysisError(`Export in ${format} format failed`, error);
    }
  }

  /**
   * Get analysis status and system health
   * @returns {Object} - Status information
   */
  getStatus() {
    return {
      initialized: this.isInitialized,
      cacheSize: this.analysisCache.size,
      config: this.config,
      availableModules: [
        'sessionTypes', 'coherencePatterns', 'anomalies', 'semanticClustering',
        'metaphorAnalysis', 'sentimentAnalysis', 'temporalPatterns', 'personalizedInsights'
      ],
      systemHealth: this.checkSystemHealth()
    };
  }

  /**
   * Clear analysis cache
   */
  clearCache() {
    this.analysisCache.clear();
    console.log('Analysis cache cleared');
  }

  /**
   * Update configuration
   * @param {Object} newConfig - New configuration options
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    console.log('Configuration updated:', newConfig);
  }

  /**
   * Private helper methods
   */

  generateCacheKey(options) {
    const keyObj = {
      days: options.days,
      depth: options.analysisDepth,
      semantic: options.includeSemanticAnalysis,
      temporal: options.includeTemporalAnalysis,
      coherence: options.includeCoherenceAnalysis,
      insights: options.includeInsights
    };
    return JSON.stringify(keyObj);
  }

  setupAutoRefresh(dashboard, options) {
    const refreshInterval = this.config.refreshInterval || 60000; // 1 minute default
    
    setInterval(async () => {
      try {
        console.log('Auto-refreshing dashboard...');
        const newResults = await this.runAnalysis({ ...options, bypassCache: true });
        const newDashboard = createPatternAnalysisDashboard(newResults, dashboard.parentElement);
        dashboard.parentElement.replaceChild(newDashboard, dashboard);
      } catch (error) {
        console.error('Auto-refresh failed:', error);
      }
    }, refreshInterval);
  }

  displayError(container, message, error) {
    if (!container) return;
    
    container.innerHTML = `
      <div class="analytics-error">
        <div class="error-header">
          <h2>Analysis Error</h2>
        </div>
        <div class="error-content">
          <div class="error-message">${message}</div>
          <div class="error-details">
            <details>
              <summary>Technical Details</summary>
              <pre>${error.stack || error.message || 'Unknown error'}</pre>
            </details>
          </div>
          <div class="error-actions">
            <button onclick="location.reload()" class="retry-btn">Retry</button>
          </div>
        </div>
      </div>
    `;
  }

  convertToCSV(analysisResults) {
    // Simplified CSV conversion - would need more sophisticated implementation
    const data = [];
    
    if (analysisResults.modules?.sessionTypes?.sessionTypes) {
      data.push(['Session Type Analysis']);
      data.push(['Type', 'Name', 'Sessions', 'Description']);
      
      analysisResults.modules.sessionTypes.sessionTypes.forEach(type => {
        data.push([
          type.id,
          type.name,
          type.sessionCount,
          type.description.substring(0, 100) + '...'
        ]);
      });
    }

    return data.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  }

  generateSummaryReport(analysisResults) {
    const summary = {
      analysisDate: analysisResults.analysisDate,
      dataOverview: analysisResults.dataOverview,
      executiveSummary: analysisResults.executiveSummary,
      keyInsights: [],
      primaryRecommendations: []
    };

    // Extract key insights
    if (analysisResults.modules?.personalizedInsights?.insights) {
      summary.keyInsights = analysisResults.modules.personalizedInsights.insights
        .filter(insight => insight.priority === 'high')
        .slice(0, 5)
        .map(insight => ({
          title: insight.title,
          description: insight.description,
          confidence: insight.confidence
        }));
    }

    // Extract primary recommendations
    if (analysisResults.modules?.personalizedInsights?.recommendations) {
      summary.primaryRecommendations = analysisResults.modules.personalizedInsights.recommendations
        .slice(0, 5)
        .map(rec => ({
          title: rec.title,
          description: rec.description,
          priority: rec.priority,
          category: rec.category
        }));
    }

    return summary;
  }

  checkSystemHealth() {
    const health = {
      status: 'healthy',
      issues: [],
      recommendations: []
    };

    // Check cache size
    if (this.analysisCache.size > 50) {
      health.issues.push('Large cache size may impact performance');
      health.recommendations.push('Consider clearing cache or reducing cache duration');
    }

    // Check configuration
    if (this.config.days > 180) {
      health.issues.push('Very long analysis periods may be slow');
      health.recommendations.push('Consider reducing analysis period for better performance');
    }

    if (health.issues.length > 0) {
      health.status = 'warning';
    }

    return health;
  }
}

/**
 * Custom error class for analysis errors
 */
class AnalysisError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = 'AnalysisError';
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Factory function to create analytics instance
 * @param {Object} config - Configuration options
 * @returns {ECPAdvancedAnalytics} - Analytics instance
 */
export function createECPAnalytics(config = {}) {
  return new ECPAdvancedAnalytics(config);
}

/**
 * Convenience functions for quick access
 */

/**
 * Quick analysis dashboard creation
 * @param {HTMLElement} container - Container element
 * @param {Object} options - Analysis options
 * @returns {Promise<HTMLElement>} - Dashboard element
 */
export async function createQuickDashboard(container, options = {}) {
  const analytics = createECPAnalytics();
  return await analytics.createDashboard(container, options);
}

/**
 * Get basic insights
 * @param {number} days - Number of days to analyze
 * @returns {Promise<Object>} - Basic insights
 */
export async function getBasicInsights(days = 30) {
  const analytics = createECPAnalytics();
  return await analytics.getQuickInsights(days);
}

/**
 * Run lightweight analysis for preview
 * @param {Object} options - Analysis options
 * @returns {Promise<Object>} - Preview results
 */
export async function getAnalysisPreview(options = {}) {
  const analytics = createECPAnalytics();
  return await analytics.runAnalysis({
    ...options,
    analysisDepth: 'quick',
    includeSemanticAnalysis: false,
    includeTemporalAnalysis: false
  });
}

// Add error styling if not already present
function addErrorStyles() {
  if (document.querySelector('#analytics-error-styles')) return;
  
  const styleElement = document.createElement('style');
  styleElement.id = 'analytics-error-styles';
  styleElement.textContent = `
    .analytics-error {
      max-width: 800px;
      margin: 2rem auto;
      padding: 2rem;
      background: #fff5f5;
      border: 1px solid #feb2b2;
      border-radius: 8px;
    }
    
    .error-header h2 {
      color: #c53030;
      margin: 0 0 1rem 0;
    }
    
    .error-message {
      color: #2d3748;
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }
    
    .error-details {
      margin: 1rem 0;
    }
    
    .error-details pre {
      background: #f7fafc;
      padding: 1rem;
      border-radius: 4px;
      border-left: 4px solid #c53030;
      overflow-x: auto;
      font-size: 0.8rem;
      color: #4a5568;
    }
    
    .error-actions {
      margin-top: 1.5rem;
    }
    
    .retry-btn {
      background: #3182ce;
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }
    
    .retry-btn:hover {
      background: #2c5aa0;
    }
  `;
  
  document.head.appendChild(styleElement);
}

// Initialize error styles
addErrorStyles();

// Export everything
export default {
  ECPAdvancedAnalytics,
  createECPAnalytics,
  createQuickDashboard,
  getBasicInsights,
  getAnalysisPreview,
  AnalysisError
};

/**
 * Integration helper for existing ECP field journal
 * Call this function to add analytics capabilities to the existing system
 */
export function integrateWithECPJournal() {
  // Add analytics button to existing UI
  const addAnalyticsButton = () => {
    const existingControls = document.querySelector('.measurement-sections-container') || 
                            document.querySelector('#throughput')?.parentElement;
    
    if (existingControls && !document.querySelector('#ecp-analytics-btn')) {
      const analyticsButton = document.createElement('button');
      analyticsButton.id = 'ecp-analytics-btn';
      analyticsButton.textContent = 'Advanced Analytics';
      analyticsButton.className = 'analytics-trigger-btn';
      analyticsButton.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        margin: 1rem 0;
        transition: transform 0.2s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      `;
      
      analyticsButton.addEventListener('mouseenter', () => {
        analyticsButton.style.transform = 'translateY(-2px)';
      });
      
      analyticsButton.addEventListener('mouseleave', () => {
        analyticsButton.style.transform = 'translateY(0)';
      });
      
      analyticsButton.addEventListener('click', async () => {
        try {
          analyticsButton.textContent = 'Loading Analytics...';
          analyticsButton.disabled = true;
          
          // Create modal for analytics dashboard
          const modal = createAnalyticsModal();
          document.body.appendChild(modal);
          
          // Create analytics dashboard
          const analytics = createECPAnalytics();
          await analytics.createDashboard(modal.querySelector('.modal-content'));
          
          modal.style.display = 'block';
          
        } catch (error) {
          console.error('Analytics integration failed:', error);
          alert('Failed to load analytics dashboard. Please check the console for details.');
        } finally {
          analyticsButton.textContent = 'Advanced Analytics';
          analyticsButton.disabled = false;
        }
      });
      
      existingControls.appendChild(analyticsButton);
    }
  };

  // Create analytics modal
  const createAnalyticsModal = () => {
    const modal = document.createElement('div');
    modal.className = 'analytics-modal';
    modal.style.cssText = `
      display: none;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.5);
      overflow: auto;
    `;
    
    modal.innerHTML = `
      <div class="modal-content" style="
        background: white;
        margin: 2% auto;
        width: 95%;
        max-width: 1400px;
        border-radius: 8px;
        position: relative;
        max-height: 90vh;
        overflow-y: auto;
      ">
        <div class="modal-header" style="
          padding: 1rem 2rem;
          border-bottom: 1px solid #ecf0f1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          background: white;
          z-index: 10;
        ">
          <h2 style="margin: 0; color: #2c3e50;">ECP Advanced Analytics</h2>
          <span class="close-modal" style="
            font-size: 28px;
            font-weight: bold;
            color: #aaa;
            cursor: pointer;
          ">&times;</span>
        </div>
        <div class="modal-body">
          <!-- Analytics dashboard will be loaded here -->
        </div>
      </div>
    `;
    
    // Close modal functionality
    modal.querySelector('.close-modal').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    return modal;
  };

  // Try to add button when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addAnalyticsButton);
  } else {
    addAnalyticsButton();
  }
  
  // Also try periodically in case elements are added dynamically
  let attempts = 0;
  const maxAttempts = 10;
  const addButtonInterval = setInterval(() => {
    attempts++;
    addAnalyticsButton();
    if (attempts >= maxAttempts || document.querySelector('#ecp-analytics-btn')) {
      clearInterval(addButtonInterval);
    }
  }, 1000);
  
  console.log('ECP Advanced Analytics integration initialized');
}