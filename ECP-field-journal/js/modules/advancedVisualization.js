// js/modules/advancedVisualization.js

/**
 * Advanced visualization components for complex pattern analysis results
 * Creates interactive dashboards and charts for somatic-symbolic research insights
 */

/**
 * Create a comprehensive pattern analysis dashboard
 * @param {Object} analysisResults - Results from performComprehensiveAnalysis
 * @param {HTMLElement} container - Container element for the dashboard
 * @returns {HTMLElement} - Dashboard element
 */
export function createPatternAnalysisDashboard(analysisResults, container) {
  if (!container) {
    container = document.createElement('div');
  }
  
  container.className = 'advanced-pattern-dashboard';
  container.innerHTML = '';
  
  // Dashboard header
  const header = createDashboardHeader(analysisResults);
  container.appendChild(header);
  
  // Executive summary section
  if (analysisResults.executiveSummary) {
    const summarySection = createExecutiveSummarySection(analysisResults.executiveSummary);
    container.appendChild(summarySection);
  }
  
  // Main analysis sections
  const mainContent = document.createElement('div');
  mainContent.className = 'dashboard-main-content';
  
  // Session types visualization
  if (analysisResults.modules?.sessionTypes) {
    const sessionTypesViz = createSessionTypesVisualization(analysisResults.modules.sessionTypes);
    mainContent.appendChild(sessionTypesViz);
  }
  
  // Coherence patterns visualization
  if (analysisResults.modules?.coherencePatterns || analysisResults.modules?.advancedCoherence) {
    const coherenceViz = createCoherenceVisualization(
      analysisResults.modules.coherencePatterns,
      analysisResults.modules.advancedCoherence
    );
    mainContent.appendChild(coherenceViz);
  }
  
  // Semantic clustering visualization
  if (analysisResults.modules?.semanticClusters) {
    const semanticViz = createSemanticVisualization(analysisResults.modules.semanticClusters);
    mainContent.appendChild(semanticViz);
  }
  
  // Temporal patterns visualization
  if (analysisResults.modules?.temporalCycles) {
    const temporalViz = createTemporalVisualization(analysisResults.modules.temporalCycles);
    mainContent.appendChild(temporalViz);
  }
  
  // Insights and recommendations
  if (analysisResults.modules?.personalizedInsights) {
    const insightsViz = createInsightsVisualization(analysisResults.modules.personalizedInsights);
    mainContent.appendChild(insightsViz);
  }
  
  container.appendChild(mainContent);
  
  // Initialize interactive features
  initializeDashboardInteractivity(container);
  
  return container;
}

/**
 * Create dashboard header with overview metrics
 */
function createDashboardHeader(analysisResults) {
  const header = document.createElement('div');
  header.className = 'dashboard-header';
  
  header.innerHTML = `
    <div class="header-content">
      <div class="header-title">
        <h1>ECP Pattern Analysis Dashboard</h1>
        <div class="analysis-metadata">
          <span>Analysis Date: ${new Date(analysisResults.analysisDate).toLocaleDateString()}</span>
          <span>Sessions Analyzed: ${analysisResults.dataOverview?.totalSessions || 0}</span>
          <span>Analysis Depth: ${analysisResults.analysisDepth}</span>
          <span>Completion Time: ${analysisResults.completionTimeFormatted}</span>
        </div>
      </div>
      <div class="header-metrics">
        <div class="metric-card">
          <div class="metric-value">${analysisResults.dataOverview?.dataQuality?.overallQuality || 'Unknown'}</div>
          <div class="metric-label">Data Quality</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${analysisResults.executiveSummary?.overallAssessment || 'Developing'}</div>
          <div class="metric-label">Practice Level</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${analysisResults.executiveSummary?.practiceMaturity?.level || 'Novice'}</div>
          <div class="metric-label">Maturity</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${Object.keys(analysisResults.modules || {}).length}</div>
          <div class="metric-label">Analysis Modules</div>
        </div>
      </div>
    </div>
  `;
  
  return header;
}

/**
 * Create executive summary section
 */
function createExecutiveSummarySection(summary) {
  const section = document.createElement('div');
  section.className = 'dashboard-section executive-summary';
  
  section.innerHTML = `
    <div class="section-header">
      <h2>Executive Summary</h2>
      <div class="section-controls">
        <button class="expand-btn">Expand</button>
      </div>
    </div>
    <div class="section-content">
      <div class="summary-overview">
        <div class="assessment-card ${summary.overallAssessment}">
          <h3>Overall Assessment: ${summary.overallAssessment.toUpperCase()}</h3>
          <div class="practice-maturity">
            <div class="maturity-level">Practice Maturity: ${summary.practiceMaturity?.level}</div>
            <div class="maturity-score">Score: ${summary.practiceMaturity?.score}/100</div>
            <div class="maturity-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${summary.practiceMaturity?.score || 0}%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="key-findings">
        <h3>Key Findings</h3>
        <div class="findings-list">
          ${(summary.keyFindings || []).map(finding => `
            <div class="finding-item">
              <div class="finding-title">${finding.finding}</div>
              <div class="finding-description">${finding.description}</div>
              <div class="finding-confidence">Confidence: ${finding.confidence}</div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="primary-recommendations">
        <h3>Primary Recommendations</h3>
        <div class="recommendations-list">
          ${(summary.primaryRecommendations || []).map(rec => `
            <div class="recommendation-item priority-${rec.priority}">
              <div class="recommendation-title">${rec.action}</div>
              <div class="recommendation-description">${rec.description}</div>
              <div class="recommendation-meta">
                <span class="priority">Priority: ${rec.priority}</span>
                <span class="category">Category: ${rec.category}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  
  return section;
}

/**
 * Create session types visualization
 */
function createSessionTypesVisualization(sessionTypesData) {
  const section = document.createElement('div');
  section.className = 'dashboard-section session-types';
  
  if (sessionTypesData.error) {
    section.innerHTML = `
      <div class="section-header">
        <h2>Session Types Analysis</h2>
      </div>
      <div class="error-message">${sessionTypesData.error}</div>
    `;
    return section;
  }
  
  const sessionTypes = sessionTypesData.sessionTypes || [];
  
  section.innerHTML = `
    <div class="section-header">
      <h2>Session Types Analysis</h2>
      <div class="section-subtitle">Identified ${sessionTypes.length} distinct session patterns</div>
    </div>
    <div class="section-content">
      <div class="session-types-overview">
        <div class="types-chart-container">
          <canvas id="session-types-chart" width="400" height="300"></canvas>
        </div>
        <div class="types-legend">
          ${sessionTypes.map(type => `
            <div class="legend-item" data-type-id="${type.id}">
              <div class="legend-color" style="background-color: ${getSessionTypeColor(type.id)}"></div>
              <div class="legend-info">
                <div class="legend-name">${type.name}</div>
                <div class="legend-stats">${type.sessionCount} sessions (${Math.round(type.sessionCount / sessionTypesData.totalSessions * 100)}%)</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="session-types-details">
        ${sessionTypes.map(type => `
          <div class="session-type-card" data-type-id="${type.id}">
            <div class="type-header">
              <h3>${type.name}</h3>
              <div class="type-stats">
                <span>${type.sessionCount} sessions</span>
                <span>Variance: ${type.variance?.toFixed(3)}</span>
              </div>
            </div>
            <div class="type-description">${type.description}</div>
            
            <div class="type-characteristics">
              <h4>Characteristics</h4>
              <div class="characteristics-grid">
                <div class="characteristic-item">
                  <label>Somatic Profile</label>
                  <div class="somatic-indicators">
                    <span>Pre: ${type.characteristics?.somaticProfile?.avgPre?.toFixed(1) || 'N/A'}</span>
                    <span>Post: ${type.characteristics?.somaticProfile?.avgPost?.toFixed(1) || 'N/A'}</span>
                    <span>Shift: ${type.characteristics?.somaticProfile?.avgShift?.toFixed(1) || 'N/A'}</span>
                  </div>
                </div>
                <div class="characteristic-item">
                  <label>Response Quality</label>
                  <div class="response-quality">${type.characteristics?.responseProfile?.average?.toFixed(1) || 'N/A'}/5</div>
                </div>
                <div class="characteristic-item">
                  <label>Meaning Making</label>
                  <div class="meaning-making">${type.characteristics?.meaningMakingProfile?.average?.toFixed(1) || 'N/A'}/7</div>
                </div>
                <div class="characteristic-item">
                  <label>Emergence</label>
                  <div class="emergence">${type.characteristics?.emergenceProfile?.average?.toFixed(1) || 'N/A'}/7</div>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  // Draw the pie chart
  setTimeout(() => drawSessionTypesChart(sessionTypes, sessionTypesData.totalSessions), 100);
  
  return section;
}

/**
 * Create coherence visualization
 */
function createCoherenceVisualization(coherencePatterns, advancedCoherence) {
  const section = document.createElement('div');
  section.className = 'dashboard-section coherence-analysis';
  
  section.innerHTML = `
    <div class="section-header">
      <h2>Coherence Patterns Analysis</h2>
    </div>
    <div class="section-content">
      <div class="coherence-overview">
        ${coherencePatterns?.summary ? `
          <div class="coherence-summary">
            <div class="summary-metric">
              <div class="metric-value">${(coherencePatterns.summary.averageOverallCoherence * 100).toFixed(1)}%</div>
              <div class="metric-label">Average Coherence</div>
            </div>
            <div class="summary-metric">
              <div class="metric-value">${coherencePatterns.summary.highCoherenceSessions}</div>
              <div class="metric-label">High Coherence Sessions</div>
            </div>
            <div class="summary-metric">
              <div class="metric-value">${coherencePatterns.summary.lowCoherenceSessions}</div>
              <div class="metric-label">Low Coherence Sessions</div>
            </div>
          </div>
        ` : ''}
        
        ${advancedCoherence?.coherenceEvolution ? `
          <div class="coherence-evolution">
            <h3>Coherence Evolution</h3>
            <div class="evolution-chart-container">
              <canvas id="coherence-evolution-chart" width="600" height="300"></canvas>
            </div>
            ${advancedCoherence.coherenceEvolution.phases?.length > 0 ? `
              <div class="coherence-phases">
                <h4>Identified Phases</h4>
                <div class="phases-list">
                  ${advancedCoherence.coherenceEvolution.phases.map(phase => `
                    <div class="phase-item">
                      <div class="phase-header">
                        <span class="phase-number">Phase ${phase.phaseNumber}</span>
                        <span class="phase-trend trend-${phase.trend}">${phase.trend}</span>
                      </div>
                      <div class="phase-details">
                        <span>Avg: ${(phase.average * 100).toFixed(1)}%</span>
                        <span>${phase.sessionCount} sessions</span>
                        <span>${phase.duration} days</span>
                        <span>${phase.startDate} to ${phase.endDate}</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        ` : ''}
      </div>
      
      ${coherencePatterns?.patterns?.length > 0 ? `
        <div class="coherence-patterns">
          <h3>Detected Patterns</h3>
          <div class="patterns-list">
            ${coherencePatterns.patterns.map(pattern => `
              <div class="pattern-item">
                <div class="pattern-header">
                  <h4>${pattern.name}</h4>
                  <div class="confidence-badge">${Math.round(pattern.confidence * 100)}% confidence</div>
                </div>
                <div class="pattern-description">${pattern.description}</div>
                <div class="pattern-evidence">${pattern.evidence}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
  
  // Draw coherence evolution chart if data available
  if (advancedCoherence?.coherenceEvolution?.timeSeries) {
    setTimeout(() => drawCoherenceEvolutionChart(advancedCoherence.coherenceEvolution), 100);
  }
  
  return section;
}

/**
 * Create semantic analysis visualization
 */
function createSemanticVisualization(semanticData) {
  const section = document.createElement('div');
  section.className = 'dashboard-section semantic-analysis';
  
  if (semanticData.error) {
    section.innerHTML = `
      <div class="section-header">
        <h2>Semantic Analysis</h2>
      </div>
      <div class="error-message">${semanticData.error}</div>
    `;
    return section;
  }
  
  const clusters = semanticData.clusters || [];
  
  section.innerHTML = `
    <div class="section-header">
      <h2>Semantic Analysis</h2>
      <div class="section-subtitle">${clusters.length} thematic clusters identified from ${semanticData.totalDocuments} documents</div>
    </div>
    <div class="section-content">
      <div class="semantic-overview">
        <div class="clusters-distribution">
          <canvas id="semantic-clusters-chart" width="400" height="300"></canvas>
        </div>
        <div class="clusters-summary">
          <h3>Thematic Distribution</h3>
          ${clusters.map((cluster, idx) => `
            <div class="cluster-summary-item" data-cluster-id="${cluster.id}">
              <div class="cluster-color" style="background-color: ${getClusterColor(idx)}"></div>
              <div class="cluster-info">
                <div class="cluster-name">${cluster.name}</div>
                <div class="cluster-size">${cluster.size} sessions</div>
                <div class="cluster-timespan">${cluster.timeSpan?.span} days</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="semantic-clusters-details">
        ${clusters.map((cluster, idx) => `
          <div class="semantic-cluster-card" data-cluster-id="${cluster.id}">
            <div class="cluster-header">
              <h3>${cluster.name}</h3>
              <div class="cluster-stats">
                <span>${cluster.size} sessions</span>
                <span>Span: ${cluster.timeSpan?.span || 0} days</span>
                ${cluster.somaticPatterns?.pattern ? `<span class="somatic-pattern ${cluster.somaticPatterns.pattern}">Somatic: ${cluster.somaticPatterns.pattern}</span>` : ''}
              </div>
            </div>
            <div class="cluster-description">${cluster.description}</div>
            
            ${cluster.themes && cluster.themes.length > 0 ? `
              <div class="cluster-themes">
                <h4>Primary Themes</h4>
                <div class="themes-container">
                  ${cluster.themes.slice(0, 3).map(theme => `
                    <div class="theme-group">
                      <div class="theme-category">${theme.category}</div>
                      <div class="theme-terms">
                        ${theme.themes.slice(0, 5).map(term => `
                          <span class="theme-term">${term.term} (${term.frequency})</span>
                        `).join('')}
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            
            ${cluster.somaticPatterns && cluster.somaticPatterns.avgPre !== null ? `
              <div class="cluster-somatic-analysis">
                <h4>Somatic Patterns</h4>
                <div class="somatic-metrics">
                  <span>Pre-Session: ${cluster.somaticPatterns.avgPre}</span>
                  <span>Post-Session: ${cluster.somaticPatterns.avgPost}</span>
                  <span>Average Shift: ${cluster.somaticPatterns.avgShift}</span>
                  <span class="pattern-type ${cluster.somaticPatterns.pattern}">${cluster.somaticPatterns.pattern}</span>
                </div>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  // Draw semantic clusters chart
  setTimeout(() => drawSemanticClustersChart(clusters), 100);
  
  return section;
}

/**
 * Create temporal patterns visualization
 */
function createTemporalVisualization(temporalData) {
  const section = document.createElement('div');
  section.className = 'dashboard-section temporal-analysis';
  
  section.innerHTML = `
    <div class="section-header">
      <h2>Temporal Patterns Analysis</h2>
    </div>
    <div class="section-content">
      ${temporalData.dominantPatterns ? `
        <div class="temporal-overview">
          <h3>Dominant Patterns</h3>
          <div class="patterns-grid">
            <div class="pattern-category">
              <h4>Trends</h4>
              <div class="trend-distribution">
                ${Object.entries(temporalData.dominantPatterns.trends).map(([trend, count]) => `
                  <div class="trend-item">
                    <span class="trend-name">${trend}</span>
                    <span class="trend-count">${count} scales</span>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div class="pattern-category">
              <h4>Weekly Patterns</h4>
              <div class="weekly-patterns">
                ${Object.entries(temporalData.dominantPatterns.weeklyPatterns).map(([pattern, count]) => `
                  <div class="weekly-item">
                    <span class="pattern-name">${pattern.replace(/_/g, ' ')}</span>
                    <span class="pattern-count">${count} scales</span>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div class="pattern-category">
              <h4>Volatility</h4>
              <div class="volatility-distribution">
                ${Object.entries(temporalData.dominantPatterns.volatility).map(([vol, count]) => `
                  <div class="volatility-item">
                    <span class="volatility-name">${vol}</span>
                    <span class="volatility-count">${count} scales</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      ` : ''}
      
      ${temporalData.crossScaleCycles && temporalData.crossScaleCycles.length > 0 ? `
        <div class="cross-scale-cycles">
          <h3>Cross-Scale Cycles</h3>
          <div class="cycles-list">
            ${temporalData.crossScaleCycles.map(cycle => `
              <div class="cycle-item">
                <div class="cycle-period">${cycle.period} sessions</div>
                <div class="cycle-info">
                  <div class="cycle-strength">Strength: ${(cycle.strength * 100).toFixed(1)}%</div>
                  <div class="cycle-scales">Appears in ${cycle.scaleCount} scales</div>
                  <div class="cycle-correlation">Avg correlation: ${cycle.averageCorrelation.toFixed(3)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      <div class="temporal-controls">
        <button id="show-individual-temporal" class="temporal-control-btn">Show Individual Scale Analysis</button>
      </div>
      
      <div id="individual-temporal-container" class="individual-temporal-analysis" style="display: none;">
        <!-- Individual temporal analysis will be populated when requested -->
      </div>
    </div>
  `;
  
  return section;
}

/**
 * Create insights and recommendations visualization
 */
function createInsightsVisualization(insightsData) {
  const section = document.createElement('div');
  section.className = 'dashboard-section insights-recommendations';
  
  if (insightsData.error) {
    section.innerHTML = `
      <div class="section-header">
        <h2>Personalized Insights</h2>
      </div>
      <div class="error-message">${insightsData.error}</div>
    `;
    return section;
  }
  
  const insights = insightsData.insights || [];
  const recommendations = insightsData.recommendations || [];
  
  section.innerHTML = `
    <div class="section-header">
      <h2>Personalized Insights & Recommendations</h2>
      <div class="section-subtitle">${insights.length} insights identified, ${recommendations.length} recommendations generated</div>
    </div>
    <div class="section-content">
      <div class="insights-overview">
        <div class="insights-by-priority">
          <div class="priority-group high-priority">
            <h3>High Priority Insights</h3>
            <div class="insights-list">
              ${insights.filter(insight => insight.priority === 'high').map(insight => `
                <div class="insight-card priority-${insight.priority}">
                  <div class="insight-header">
                    <h4>${insight.title}</h4>
                    <div class="insight-type">${insight.type.replace(/_/g, ' ')}</div>
                  </div>
                  <div class="insight-description">${insight.description}</div>
                  <div class="insight-evidence">${insight.evidence}</div>
                  ${insight.confidence ? `<div class="insight-confidence">Confidence: ${Math.round(insight.confidence * 100)}%</div>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="priority-group medium-priority">
            <h3>Medium Priority Insights</h3>
            <div class="insights-list">
              ${insights.filter(insight => insight.priority === 'medium').slice(0, 5).map(insight => `
                <div class="insight-card priority-${insight.priority}">
                  <div class="insight-header">
                    <h4>${insight.title}</h4>
                    <div class="insight-type">${insight.type.replace(/_/g, ' ')}</div>
                  </div>
                  <div class="insight-description">${insight.description}</div>
                  <div class="insight-evidence">${insight.evidence}</div>
                  ${insight.confidence ? `<div class="insight-confidence">Confidence: ${Math.round(insight.confidence * 100)}%</div>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
      
      <div class="recommendations-section">
        <h3>Actionable Recommendations</h3>
        <div class="recommendations-by-category">
          ${getRecommendationCategories(recommendations).map(category => `
            <div class="recommendation-category">
              <h4>${category.name}</h4>
              <div class="category-recommendations">
                ${category.recommendations.map(rec => `
                  <div class="recommendation-card priority-${rec.priority}">
                    <div class="recommendation-header">
                      <h5>${rec.title}</h5>
                      <div class="recommendation-priority">Priority: ${rec.priority}</div>
                    </div>
                    <div class="recommendation-description">${rec.description}</div>
                    ${rec.specific_actions && rec.specific_actions.length > 0 ? `
                      <div class="specific-actions">
                        <div class="actions-label">Specific Actions:</div>
                        <ul class="actions-list">
                          ${rec.specific_actions.map(action => `<li>${action}</li>`).join('')}
                        </ul>
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      ${insightsData.coherenceForecast?.forecast ? `
        <div class="coherence-forecast">
          <h3>Coherence Forecast</h3>
          <div class="forecast-card">
            <div class="forecast-header">
              <div class="forecast-direction ${insightsData.coherenceForecast.forecast.direction}">
                ${insightsData.coherenceForecast.forecast.direction.toUpperCase()}
              </div>
              <div class="forecast-confidence">${Math.round(insightsData.coherenceForecast.forecast.confidence * 100)}% confidence</div>
            </div>
            <div class="forecast-details">
              <div class="forecast-current">Current: ${insightsData.coherenceForecast.forecast.currentCoherence}%</div>
              <div class="forecast-predicted">Forecasted: ${insightsData.coherenceForecast.forecast.forecastedCoherence}%</div>
              <div class="forecast-timeframe">Timeframe: ${insightsData.coherenceForecast.forecast.timeframe}</div>
            </div>
            ${insightsData.coherenceForecast.forecast.factors && insightsData.coherenceForecast.forecast.factors.length > 0 ? `
              <div class="forecast-factors">
                <div class="factors-label">Contributing Factors:</div>
                <ul class="factors-list">
                  ${insightsData.coherenceForecast.forecast.factors.map(factor => `
                    <li class="factor-${factor.type}">${factor.description}</li>
                  `).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        </div>
      ` : ''}
    </div>
  `;
  
  return section;
}

/**
 * Initialize dashboard interactivity
 */
function initializeDashboardInteractivity(container) {
  // Expandable sections
  container.querySelectorAll('.expand-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const section = this.closest('.dashboard-section');
      section.classList.toggle('expanded');
      this.textContent = section.classList.contains('expanded') ? 'Collapse' : 'Expand';
    });
  });
  
  // Session type hover interactions
  container.querySelectorAll('.legend-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
      const typeId = this.dataset.typeId;
      container.querySelectorAll(`[data-type-id="${typeId}"]`).forEach(el => {
        el.classList.add('highlighted');
      });
    });
    
    item.addEventListener('mouseleave', function() {
      container.querySelectorAll('.highlighted').forEach(el => {
        el.classList.remove('highlighted');
      });
    });
  });
  
  // Temporal analysis controls
  const showTemporalBtn = container.querySelector('#show-individual-temporal');
  if (showTemporalBtn) {
    showTemporalBtn.addEventListener('click', function() {
      const temporalContainer = container.querySelector('#individual-temporal-container');
      const isVisible = temporalContainer.style.display !== 'none';
      
      if (isVisible) {
        temporalContainer.style.display = 'none';
        this.textContent = 'Show Individual Scale Analysis';
      } else {
        temporalContainer.style.display = 'block';
        this.textContent = 'Hide Individual Scale Analysis';
        // Load individual temporal analysis if not already loaded
        if (!temporalContainer.innerHTML.trim()) {
          loadIndividualTemporalAnalysis(temporalContainer);
        }
      }
    });
  }
}

/**
 * Drawing functions for charts
 */

function drawSessionTypesChart(sessionTypes, totalSessions) {
  const canvas = document.getElementById('session-types-chart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 20;
  
  let currentAngle = 0;
  
  sessionTypes.forEach((type, idx) => {
    const sliceAngle = (type.sessionCount / totalSessions) * 2 * Math.PI;
    const color = getSessionTypeColor(type.id);
    
    // Draw slice
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    currentAngle += sliceAngle;
  });
}

function drawCoherenceEvolutionChart(coherenceEvolution) {
  const canvas = document.getElementById('coherence-evolution-chart');
  if (!canvas || !coherenceEvolution.timeSeries) return;
  
  const ctx = canvas.getContext('2d');
  const timeSeries = coherenceEvolution.timeSeries;
  
  if (timeSeries.length < 2) return;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const padding = 40;
  const chartWidth = canvas.width - 2 * padding;
  const chartHeight = canvas.height - 2 * padding;
  
  // Find data ranges
  const minCoherence = Math.min(...timeSeries.map(item => item.coherence));
  const maxCoherence = Math.max(...timeSeries.map(item => item.coherence));
  const minTime = timeSeries[0].timestamp.getTime();
  const maxTime = timeSeries[timeSeries.length - 1].timestamp.getTime();
  
  // Draw axes
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, canvas.height - padding);
  ctx.lineTo(canvas.width - padding, canvas.height - padding);
  ctx.strokeStyle = '#ccc';
  ctx.stroke();
  
  // Draw coherence line
  ctx.beginPath();
  timeSeries.forEach((item, idx) => {
    const x = padding + ((item.timestamp.getTime() - minTime) / (maxTime - minTime)) * chartWidth;
    const y = canvas.height - padding - ((item.coherence - minCoherence) / (maxCoherence - minCoherence)) * chartHeight;
    
    if (idx === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  
  ctx.strokeStyle = '#007acc';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Draw data points
  timeSeries.forEach(item => {
    const x = padding + ((item.timestamp.getTime() - minTime) / (maxTime - minTime)) * chartWidth;
    const y = canvas.height - padding - ((item.coherence - minCoherence) / (maxCoherence - minCoherence)) * chartHeight;
    
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#007acc';
    ctx.fill();
  });
}

function drawSemanticClustersChart(clusters) {
  const canvas = document.getElementById('semantic-clusters-chart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 20;
  
  const totalSessions = clusters.reduce((sum, cluster) => sum + cluster.size, 0);
  let currentAngle = 0;
  
  clusters.forEach((cluster, idx) => {
    const sliceAngle = (cluster.size / totalSessions) * 2 * Math.PI;
    const color = getClusterColor(idx);
    
    // Draw slice
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    currentAngle += sliceAngle;
  });
}

/**
 * Utility functions
 */

function getSessionTypeColor(typeId) {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD'];
  return colors[typeId % colors.length];
}

function getClusterColor(index) {
  const colors = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C', '#E67E22', '#34495E'];
  return colors[index % colors.length];
}

function getRecommendationCategories(recommendations) {
  const categories = {};
  
  recommendations.forEach(rec => {
    const category = rec.category || 'general';
    if (!categories[category]) {
      categories[category] = {
        name: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        recommendations: []
      };
    }
    categories[category].recommendations.push(rec);
  });
  
  return Object.values(categories);
}

function loadIndividualTemporalAnalysis(container) {
  // This would load individual temporal analysis for specific scales
  // For now, show a placeholder
  container.innerHTML = `
    <div class="individual-temporal-placeholder">
      <p>Individual temporal analysis would be loaded here for specific measurement scales.</p>
      <p>This would show detailed time series analysis, autocorrelation, and cycle detection for each scale individually.</p>
    </div>
  `;
}

/**
 * Initialize styles if not already present
 */
export function initializeAdvancedVisualizationStyles() {
  if (document.querySelector('#advanced-visualization-styles')) return;
  
  const styleElement = document.createElement('style');
  styleElement.id = 'advanced-visualization-styles';
  styleElement.textContent = `
    .advanced-pattern-dashboard {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1rem;
      background: #f8f9fa;
      min-height: 100vh;
    }
    
    .dashboard-header {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    
    .header-title h1 {
      margin: 0 0 1rem 0;
      color: #2c3e50;
    }
    
    .analysis-metadata {
      display: flex;
      gap: 2rem;
      color: #7f8c8d;
      font-size: 0.9rem;
    }
    
    .header-metrics {
      display: flex;
      gap: 1rem;
    }
    
    .metric-card {
      text-align: center;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 6px;
      min-width: 100px;
    }
    
    .metric-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: #2c3e50;
      text-transform: capitalize;
    }
    
    .metric-label {
      font-size: 0.8rem;
      color: #7f8c8d;
      margin-top: 0.5rem;
    }
    
    .dashboard-section {
      background: white;
      border-radius: 8px;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .section-header {
      padding: 1.5rem 2rem 1rem 2rem;
      border-bottom: 1px solid #ecf0f1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .section-header h2 {
      margin: 0;
      color: #2c3e50;
    }
    
    .section-subtitle {
      color: #7f8c8d;
      font-size: 0.9rem;
      margin-top: 0.5rem;
    }
    
    .section-content {
      padding: 2rem;
    }
    
    .expand-btn {
      padding: 0.5rem 1rem;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .expand-btn:hover {
      background: #2980b9;
    }
    
    /* Executive Summary Styles */
    .executive-summary .section-content {
      display: none;
    }
    
    .executive-summary.expanded .section-content {
      display: block;
    }
    
    .assessment-card {
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }
    
    .assessment-card.developing { background: #fff3cd; border-left: 4px solid #ffc107; }
    .assessment-card.established { background: #d4edda; border-left: 4px solid #28a745; }
    .assessment-card.advanced { background: #cce7ff; border-left: 4px solid #007bff; }
    
    .assessment-card h3 {
      margin: 0 0 1rem 0;
    }
    
    .practice-maturity {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .progress-bar {
      width: 200px;
      height: 20px;
      background: #ecf0f1;
      border-radius: 10px;
      overflow: hidden;
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1);
      transition: width 0.3s ease;
    }
    
    .key-findings, .primary-recommendations {
      margin: 2rem 0;
    }
    
    .finding-item, .recommendation-item {
      padding: 1rem;
      border-left: 4px solid #3498db;
      background: #f8f9fa;
      margin-bottom: 1rem;
      border-radius: 0 4px 4px 0;
    }
    
    .recommendation-item.priority-high { border-left-color: #e74c3c; }
    .recommendation-item.priority-medium { border-left-color: #f39c12; }
    .recommendation-item.priority-low { border-left-color: #27ae60; }
    
    .finding-title, .recommendation-title {
      font-weight: bold;
      margin-bottom: 0.5rem;
    }
    
    .finding-confidence, .recommendation-meta {
      font-size: 0.8rem;
      color: #7f8c8d;
      margin-top: 0.5rem;
    }
    
    /* Session Types Styles */
    .session-types-overview {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    
    .types-legend {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.5rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.2s ease;
    }
    
    .legend-item:hover, .legend-item.highlighted {
      background: #f8f9fa;
    }
    
    .legend-color {
      width: 16px;
      height: 16px;
      border-radius: 50%;
    }
    
    .legend-name {
      font-weight: bold;
    }
    
    .legend-stats {
      font-size: 0.8rem;
      color: #7f8c8d;
    }
    
    .session-types-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
    }
    
    .session-type-card {
      border: 1px solid #ecf0f1;
      border-radius: 6px;
      padding: 1.5rem;
      transition: box-shadow 0.2s ease;
    }
    
    .session-type-card:hover, .session-type-card.highlighted {
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .type-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }
    
    .type-header h3 {
      margin: 0;
    }
    
    .type-stats {
      text-align: right;
      font-size: 0.8rem;
      color: #7f8c8d;
    }
    
    .type-description {
      color: #34495e;
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }
    
    .characteristics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }
    
    .characteristic-item {
      text-align: center;
    }
    
    .characteristic-item label {
      display: block;
      font-weight: bold;
      font-size: 0.8rem;
      color: #7f8c8d;
      margin-bottom: 0.5rem;
    }
    
    .somatic-indicators {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.9rem;
    }
    
    .response-quality, .meaning-making, .emergence {
      font-size: 1.2rem;
      font-weight: bold;
      color: #2c3e50;
    }
    
    /* Coherence Analysis Styles */
    .coherence-summary {
      display: flex;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    
    .summary-metric {
      text-align: center;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 6px;
      flex: 1;
    }
    
    .coherence-phases {
      margin-top: 1rem;
    }
    
    .phases-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }
    
    .phase-item {
      border: 1px solid #ecf0f1;
      border-radius: 4px;
      padding: 1rem;
    }
    
    .phase-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    
    .phase-number {
      font-weight: bold;
    }
    
    .phase-trend {
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.8rem;
      color: white;
    }
    
    .trend-increasing { background: #27ae60; }
    .trend-decreasing { background: #e74c3c; }
    .trend-stable { background: #7f8c8d; }
    
    .phase-details {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: #7f8c8d;
    }
    
    .coherence-patterns {
      margin-top: 2rem;
    }
    
    .patterns-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .pattern-item {
      padding: 1.5rem;
      border-left: 4px solid #3498db;
      background: #f8f9fa;
      border-radius: 0 4px 4px 0;
    }
    
    .pattern-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .pattern-header h4 {
      margin: 0;
    }
    
    .confidence-badge {
      background: #3498db;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.8rem;
    }
    
    .pattern-evidence {
      font-style: italic;
      color: #7f8c8d;
      margin-top: 0.5rem;
    }
    
    /* Semantic Analysis Styles */
    .semantic-overview {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    
    .cluster-summary-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      border-radius: 4px;
      transition: background 0.2s ease;
    }
    
    .cluster-summary-item:hover {
      background: #f8f9fa;
    }
    
    .cluster-color {
      width: 16px;
      height: 16px;
      border-radius: 50%;
    }
    
    .cluster-info {
      flex: 1;
    }
    
    .cluster-name {
      font-weight: bold;
      margin-bottom: 0.25rem;
    }
    
    .cluster-size, .cluster-timespan {
      font-size: 0.8rem;
      color: #7f8c8d;
    }
    
    .semantic-clusters-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 2rem;
    }
    
    .semantic-cluster-card {
      border: 1px solid #ecf0f1;
      border-radius: 6px;
      padding: 1.5rem;
    }
    
    .cluster-header {
      margin-bottom: 1rem;
    }
    
    .cluster-header h3 {
      margin: 0 0 0.5rem 0;
    }
    
    .cluster-stats {
      display: flex;
      gap: 1rem;
      font-size: 0.8rem;
      color: #7f8c8d;
    }
    
    .somatic-pattern {
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      color: white;
      font-size: 0.7rem;
    }
    
    .somatic-pattern.enhancing { background: #27ae60; }
    .somatic-pattern.depleting { background: #e74c3c; }
    .somatic-pattern.stable { background: #7f8c8d; }
    
    .cluster-themes {
      margin: 1.5rem 0;
    }
    
    .themes-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .theme-group {
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 4px;
    }
    
    .theme-category {
      font-weight: bold;
      color: #2c3e50;
      margin-bottom: 0.5rem;
      text-transform: capitalize;
    }
    
    .theme-terms {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .theme-term {
      background: #e9ecef;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.8rem;
    }
    
    .cluster-somatic-analysis {
      margin-top: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 4px;
    }
    
    .somatic-metrics {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      font-size: 0.9rem;
    }
    
    .pattern-type {
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      color: white;
      font-weight: bold;
      text-transform: capitalize;
    }
    
    /* Temporal Analysis Styles */
    .temporal-overview {
      margin-bottom: 2rem;
    }
    
    .patterns-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
    }
    
    .pattern-category h4 {
      margin: 0 0 1rem 0;
      color: #2c3e50;
    }
    
    .trend-item, .weekly-item, .volatility-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem;
      background: #f8f9fa;
      border-radius: 4px;
      margin-bottom: 0.5rem;
    }
    
    .trend-name, .pattern-name, .volatility-name {
      text-transform: capitalize;
    }
    
    .trend-count, .pattern-count, .volatility-count {
      font-weight: bold;
      color: #3498db;
    }
    
    .cross-scale-cycles {
      margin: 2rem 0;
    }
    
    .cycles-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }
    
    .cycle-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid #ecf0f1;
      border-radius: 4px;
    }
    
    .cycle-period {
      font-size: 1.5rem;
      font-weight: bold;
      color: #2c3e50;
      min-width: 80px;
    }
    
    .cycle-info {
      flex: 1;
      font-size: 0.9rem;
      color: #7f8c8d;
    }
    
    .temporal-control-btn {
      padding: 0.75rem 1.5rem;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin: 1rem 0;
    }
    
    .temporal-control-btn:hover {
      background: #2980b9;
    }
    
    .individual-temporal-analysis {
      margin-top: 2rem;
      padding: 2rem;
      background: #f8f9fa;
      border-radius: 4px;
    }
    
    .individual-temporal-placeholder {
      text-align: center;
      color: #7f8c8d;
      font-style: italic;
    }
    
    /* Insights and Recommendations Styles */
    .insights-by-priority {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    
    .priority-group h3 {
      margin: 0 0 1rem 0;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      color: white;
    }
    
    .high-priority h3 { background: #e74c3c; }
    .medium-priority h3 { background: #f39c12; }
    
    .insight-card {
      padding: 1.5rem;
      border-radius: 6px;
      margin-bottom: 1rem;
      border-left: 4px solid;
    }
    
    .insight-card.priority-high { 
      border-left-color: #e74c3c;
      background: #fdf2f2;
    }
    
    .insight-card.priority-medium { 
      border-left-color: #f39c12;
      background: #fef9f2;
    }
    
    .insight-card.priority-low { 
      border-left-color: #27ae60;
      background: #f2fdf7;
    }
    
    .insight-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }
    
    .insight-header h4 {
      margin: 0;
      color: #2c3e50;
    }
    
    .insight-type {
      background: #ecf0f1;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.7rem;
      text-transform: uppercase;
      color: #7f8c8d;
    }
    
    .insight-evidence, .insight-confidence {
      font-size: 0.8rem;
      color: #7f8c8d;
      margin-top: 0.5rem;
    }
    
    .recommendations-by-category {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    
    .recommendation-category h4 {
      margin: 0 0 1rem 0;
      color: #2c3e50;
      padding: 0.5rem 1rem;
      background: #f8f9fa;
      border-radius: 4px;
    }
    
    .category-recommendations {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1rem;
    }
    
    .recommendation-card {
      padding: 1.5rem;
      border: 1px solid #ecf0f1;
      border-radius: 6px;
      border-left: 4px solid;
    }
    
    .recommendation-card.priority-high { border-left-color: #e74c3c; }
    .recommendation-card.priority-medium { border-left-color: #f39c12; }
    .recommendation-card.priority-low { border-left-color: #27ae60; }
    
    .recommendation-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }
    
    .recommendation-header h5 {
      margin: 0;
      color: #2c3e50;
    }
    
    .recommendation-priority {
      background: #ecf0f1;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.7rem;
      text-transform: capitalize;
    }
    
    .specific-actions {
      margin-top: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 4px;
    }
    
    .actions-label {
      font-weight: bold;
      margin-bottom: 0.5rem;
    }
    
    .actions-list {
      margin: 0;
      padding-left: 1.5rem;
    }
    
    .actions-list li {
      margin-bottom: 0.5rem;
      line-height: 1.4;
    }
    
    /* Coherence Forecast Styles */
    .coherence-forecast {
      margin-top: 2rem;
    }
    
    .forecast-card {
      padding: 2rem;
      border: 2px solid #ecf0f1;
      border-radius: 8px;
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    }
    
    .forecast-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .forecast-direction {
      font-size: 1.5rem;
      font-weight: bold;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      color: white;
    }
    
    .forecast-direction.improving { background: #27ae60; }
    .forecast-direction.declining { background: #e74c3c; }
    .forecast-direction.stable { background: #7f8c8d; }
    
    .forecast-confidence {
      font-size: 1.1rem;
      color: #2c3e50;
    }
    
    .forecast-details {
      display: flex;
      gap: 2rem;
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }
    
    .forecast-current, .forecast-predicted, .forecast-timeframe {
      color: #2c3e50;
    }
    
    .factors-list {
      margin: 0;
      padding-left: 1.5rem;
    }
    
    .factors-list li {
      margin-bottom: 0.5rem;
      line-height: 1.4;
    }
    
    .factor-positive { color: #27ae60; }
    .factor-negative { color: #e74c3c; }
    
    /* Responsive Design */
    @media (max-width: 768px) {
      .advanced-pattern-dashboard {
        padding: 0.5rem;
      }
      
      .header-content {
        flex-direction: column;
        gap: 1rem;
      }
      
      .header-metrics {
        flex-wrap: wrap;
      }
      
      .session-types-overview,
      .semantic-overview,
      .insights-by-priority {
        grid-template-columns: 1fr;
      }
      
      .session-types-details,
      .semantic-clusters-details,
      .category-recommendations {
        grid-template-columns: 1fr;
      }
      
      .analysis-metadata {
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .characteristics-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .patterns-grid {
        grid-template-columns: 1fr;
      }
    }
  `;
  
  document.head.appendChild(styleElement);
}

export default {
  createPatternAnalysisDashboard,
  initializeAdvancedVisualizationStyles
};