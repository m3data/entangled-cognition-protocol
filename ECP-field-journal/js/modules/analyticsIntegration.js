// js/modules/analyticsIntegration.js

/**
 * Simple integration script for adding advanced analytics to existing ECP field journal
 * Include this in main.js to enable advanced pattern analysis capabilities
 */

import { integrateWithECPJournal, createECPAnalytics } from './advancedAnalytics.js';

/**
 * Initialize analytics integration
 * Call this function after the main ECP journal is loaded
 */
export function initializeAnalyticsIntegration() {
  console.log('Initializing ECP Advanced Analytics integration...');
  
  // Integrate with existing journal
  integrateWithECPJournal();
  
  // Add global analytics object for console access
  window.ECPAnalytics = createECPAnalytics();
  
  // Initialize the analytics system
  window.ECPAnalytics.initialize().then(() => {
    console.log('🎯 ECP Advanced Analytics ready!');
    console.log('💡 Access analytics programmatically via window.ECPAnalytics');
    console.log('📊 Click "Advanced Analytics" button to view dashboard');
    console.log('🔧 Available methods:', window.ECPAnalytics.getStatus().availableModules);
  }).catch(error => {
    console.error('❌ Analytics initialization failed:', error);
  });
  
  // Add keyboard shortcut for power users
  document.addEventListener('keydown', (e) => {
    // Ctrl+Alt+A to open analytics
    if (e.ctrlKey && e.altKey && e.key === 'a') {
      const analyticsBtn = document.querySelector('#ecp-analytics-btn');
      if (analyticsBtn) {
        analyticsBtn.click();
      }
    }
  });
}

/**
 * Quick utility functions for console access
 */
export const AnalyticsUtils = {
  /**
   * Quick insights for the last 30 days
   */
  async quickInsights() {
    if (!window.ECPAnalytics) {
      console.error('Analytics not initialized');
      return;
    }
    
    try {
      const insights = await window.ECPAnalytics.getQuickInsights(30);
      console.log('📈 Quick Insights (Last 30 days):');
      console.table(insights.data.insights?.slice(0, 5) || []);
      return insights;
    } catch (error) {
      console.error('Failed to get insights:', error);
    }
  },

  /**
   * Run specific analysis module
   * @param {string} module - Module name
   * @param {Object} options - Module options
   */
  async runModule(module, options = {}) {
    if (!window.ECPAnalytics) {
      console.error('Analytics not initialized');
      return;
    }
    
    try {
      console.log(`🔬 Running ${module} analysis...`);
      const result = await window.ECPAnalytics.runModule(module, options);
      console.log(`✅ ${module} completed:`, result);
      return result;
    } catch (error) {
      console.error(`❌ ${module} failed:`, error);
    }
  },

  /**
   * Get system status
   */
  getStatus() {
    if (!window.ECPAnalytics) {
      console.error('Analytics not initialized');
      return;
    }
    
    const status = window.ECPAnalytics.getStatus();
    console.log('📊 Analytics System Status:');
    console.log('Initialized:', status.initialized ? '✅' : '❌');
    console.log('Cache entries:', status.cacheSize);
    console.log('Available modules:', status.availableModules.join(', '));
    console.log('System health:', status.systemHealth.status);
    
    if (status.systemHealth.issues.length > 0) {
      console.warn('⚠️ Issues:', status.systemHealth.issues);
      console.log('💡 Recommendations:', status.systemHealth.recommendations);
    }
    
    return status;
  },

  /**
   * Export current analysis
   * @param {string} format - Export format ('json', 'csv', 'summary')
   */
  async export(format = 'summary') {
    if (!window.ECPAnalytics) {
      console.error('Analytics not initialized');
      return;
    }
    
    try {
      console.log(`📤 Running analysis for export...`);
      const analysis = await window.ECPAnalytics.runAnalysis({ analysisDepth: 'standard' });
      const exported = await window.ECPAnalytics.exportResults(analysis, format);
      
      if (format === 'json') {
        console.log('📄 Analysis exported as JSON');
        const blob = new Blob([exported], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ecp-analysis-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        console.log(`📄 Analysis exported as ${format}:`, exported);
      }
      
      return exported;
    } catch (error) {
      console.error('Export failed:', error);
    }
  },

  /**
   * Clear analytics cache
   */
  clearCache() {
    if (!window.ECPAnalytics) {
      console.error('Analytics not initialized');
      return;
    }
    
    window.ECPAnalytics.clearCache();
    console.log('🧹 Analytics cache cleared');
  },

  /**
   * Show help
   */
  help() {
    console.log(`
🎯 ECP Advanced Analytics - Console Commands

📊 Basic Operations:
  AnalyticsUtils.quickInsights()     - Get quick insights for last 30 days
  AnalyticsUtils.getStatus()         - Check system status
  AnalyticsUtils.clearCache()        - Clear analysis cache
  
🔬 Analysis Modules:
  AnalyticsUtils.runModule('sessionTypes')         - Identify session patterns
  AnalyticsUtils.runModule('coherencePatterns')   - Detect coherence patterns
  AnalyticsUtils.runModule('semanticClustering')  - Analyze themes in reflections
  AnalyticsUtils.runModule('temporalPatterns')    - Find cycles and trends
  AnalyticsUtils.runModule('personalizedInsights')- Get personalized recommendations
  
📤 Export:
  AnalyticsUtils.export('summary')   - Export summary report
  AnalyticsUtils.export('json')      - Export full analysis as JSON
  
⚡ Quick Access:
  Ctrl+Alt+A                         - Open analytics dashboard
  
💡 Advanced:
  window.ECPAnalytics.runAnalysis()  - Run full comprehensive analysis
  window.ECPAnalytics.createDashboard(container) - Create dashboard in container
  
🔗 Example Usage:
  // Get insights for last 60 days
  await AnalyticsUtils.quickInsights()
  
  // Analyze session types with 6 clusters
  await AnalyticsUtils.runModule('sessionTypes', { days: 90, clusters: 6 })
  
  // Export analysis summary
  await AnalyticsUtils.export('summary')
    `);
  }
};

// Make utils available globally for console access
window.AnalyticsUtils = AnalyticsUtils;

// Auto-show help on first load
setTimeout(() => {
  if (typeof window !== 'undefined' && window.ECPAnalytics) {
    console.log('🎯 ECP Advanced Analytics loaded! Type AnalyticsUtils.help() for commands');
  }
}, 2000);

export default {
  initializeAnalyticsIntegration,
  AnalyticsUtils
};