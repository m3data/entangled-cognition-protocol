// js/modules/trendVisualization.js

/**
 * Visualization components for measurement framework trend analysis
 * Creates charts and dashboards using vanilla JavaScript and CSS
 */

import { 
  getAllMeasurements, 
  getMeasurementsInDateRange, 
  calculateScaleTrends, 
  analyzeScaleCorrelation 
} from './storage.js';

/**
 * Creates a simple line chart using SVG
 * @param {Array} data - Array of {x, y, label} points
 * @param {Object} config - Chart configuration
 * @returns {HTMLElement} - SVG chart element
 */
export function createLineChart(data, config = {}) {
  const {
    width = 400,
    height = 200,
    margin = { top: 20, right: 30, bottom: 40, left: 40 },
    xLabel = 'Time',
    yLabel = 'Value',
    title = '',
    strokeColor = '#007acc',
    fillColor = 'rgba(0, 122, 204, 0.1)'
  } = config;

  if (!data || data.length === 0) {
    const placeholder = document.createElement('div');
    placeholder.className = 'chart-placeholder';
    placeholder.textContent = 'No data available for visualization';
    return placeholder;
  }

  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Create SVG container
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.setAttribute('class', 'trend-chart');

  // Calculate scales
  const xValues = data.map(d => new Date(d.x));
  const yValues = data.map(d => d.y);
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);

  const xScale = (x) => margin.left + ((new Date(x) - xMin) / (xMax - xMin)) * chartWidth;
  const yScale = (y) => margin.top + chartHeight - ((y - yMin) / (yMax - yMin)) * chartHeight;

  // Create chart group
  const chartGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  // Add title
  if (title) {
    const titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    titleElement.setAttribute('x', width / 2);
    titleElement.setAttribute('y', 15);
    titleElement.setAttribute('text-anchor', 'middle');
    titleElement.setAttribute('class', 'chart-title');
    titleElement.textContent = title;
    chartGroup.appendChild(titleElement);
  }

  // Create line path
  const pathData = data.map((d, i) => {
    const x = xScale(d.x);
    const y = yScale(d.y);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathData);
  path.setAttribute('stroke', strokeColor);
  path.setAttribute('stroke-width', '2');
  path.setAttribute('fill', 'none');
  path.setAttribute('class', 'trend-line');
  chartGroup.appendChild(path);

  // Add data points
  data.forEach(d => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', xScale(d.x));
    circle.setAttribute('cy', yScale(d.y));
    circle.setAttribute('r', '4');
    circle.setAttribute('fill', strokeColor);
    circle.setAttribute('class', 'data-point');
    
    // Add tooltip data
    circle.setAttribute('data-value', d.y);
    circle.setAttribute('data-date', d.x);
    circle.setAttribute('data-label', d.label || '');
    
    chartGroup.appendChild(circle);
  });

  // Add axes
  const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  xAxis.setAttribute('x1', margin.left);
  xAxis.setAttribute('y1', margin.top + chartHeight);
  xAxis.setAttribute('x2', margin.left + chartWidth);
  xAxis.setAttribute('y2', margin.top + chartHeight);
  xAxis.setAttribute('stroke', '#ccc');
  xAxis.setAttribute('class', 'axis');
  chartGroup.appendChild(xAxis);

  const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  yAxis.setAttribute('x1', margin.left);
  yAxis.setAttribute('y1', margin.top);
  yAxis.setAttribute('x2', margin.left);
  yAxis.setAttribute('y2', margin.top + chartHeight);
  yAxis.setAttribute('stroke', '#ccc');
  yAxis.setAttribute('class', 'axis');
  chartGroup.appendChild(yAxis);

  // Add axis labels
  const xLabelElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  xLabelElement.setAttribute('x', margin.left + chartWidth / 2);
  xLabelElement.setAttribute('y', height - 5);
  xLabelElement.setAttribute('text-anchor', 'middle');
  xLabelElement.setAttribute('class', 'axis-label');
  xLabelElement.textContent = xLabel;
  chartGroup.appendChild(xLabelElement);

  const yLabelElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  yLabelElement.setAttribute('x', 15);
  yLabelElement.setAttribute('y', margin.top + chartHeight / 2);
  yLabelElement.setAttribute('text-anchor', 'middle');
  yLabelElement.setAttribute('transform', `rotate(-90, 15, ${margin.top + chartHeight / 2})`);
  yLabelElement.setAttribute('class', 'axis-label');
  yLabelElement.textContent = yLabel;
  chartGroup.appendChild(yLabelElement);

  svg.appendChild(chartGroup);
  return svg;
}

/**
 * Creates a trend dashboard for a specific measurement scale
 * @param {string} scalePath - Dot notation path to the scale
 * @param {number} days - Number of days to analyze
 * @returns {HTMLElement} - Dashboard element
 */
export function createTrendDashboard(scalePath, days = 30) {
  const dashboard = document.createElement('div');
  dashboard.className = 'trend-dashboard';
  dashboard.id = `dashboard-${scalePath.replace(/\./g, '-')}`;

  const trends = calculateScaleTrends(scalePath, days);
  
  dashboard.innerHTML = `
    <div class="dashboard-header">
      <h3>${formatScalePath(scalePath)} - ${days} Day Trend</h3>
    </div>
    <div class="dashboard-content">
      <div class="trend-stats">
        <div class="stat-item">
          <div class="stat-label">Sessions</div>
          <div class="stat-value">${trends.count}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Average</div>
          <div class="stat-value">${trends.mean || 'N/A'}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Trend</div>
          <div class="stat-value trend-${trends.trend}">${formatTrend(trends.trend)}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">Range</div>
          <div class="stat-value">${trends.min || 'N/A'} - ${trends.max || 'N/A'}</div>
        </div>
      </div>
      <div class="trend-chart-container">
      </div>
    </div>
  `;

  // Add chart if we have data
  if (trends.values && trends.values.length > 0) {
    const chartData = trends.values.map(item => ({
      x: item.timestamp,
      y: item.value,
      label: `${item.value} (${new Date(item.timestamp).toLocaleDateString()})`
    }));

    const chart = createLineChart(chartData, {
      title: `${formatScalePath(scalePath)} Over Time`,
      width: 500,
      height: 250,
      xLabel: 'Date',
      yLabel: 'Scale Value'
    });

    dashboard.querySelector('.trend-chart-container').appendChild(chart);
  }

  return dashboard;
}

/**
 * Creates a correlation matrix visualization
 * @param {Array} scalePaths - Array of scale paths to correlate
 * @param {number} days - Number of days to analyze
 * @returns {HTMLElement} - Correlation matrix element
 */
export function createCorrelationMatrix(scalePaths, days = 30) {
  const matrix = document.createElement('div');
  matrix.className = 'correlation-matrix';

  matrix.innerHTML = `
    <div class="matrix-header">
      <h3>Scale Correlations (${days} days)</h3>
    </div>
    <div class="matrix-grid">
    </div>
  `;

  const grid = matrix.querySelector('.matrix-grid');
  
  // Create grid structure
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = `150px repeat(${scalePaths.length}, 1fr)`;
  grid.style.gap = '2px';

  // Add header row
  const headerCell = document.createElement('div');
  headerCell.className = 'matrix-cell header-cell';
  headerCell.textContent = '';
  grid.appendChild(headerCell);

  scalePaths.forEach(path => {
    const headerCell = document.createElement('div');
    headerCell.className = 'matrix-cell header-cell';
    headerCell.textContent = formatScalePath(path, true);
    grid.appendChild(headerCell);
  });

  // Add data rows
  scalePaths.forEach((rowPath, rowIndex) => {
    // Row header
    const rowHeaderCell = document.createElement('div');
    rowHeaderCell.className = 'matrix-cell row-header-cell';
    rowHeaderCell.textContent = formatScalePath(rowPath, true);
    grid.appendChild(rowHeaderCell);

    // Correlation cells
    scalePaths.forEach((colPath, colIndex) => {
      const cell = document.createElement('div');
      cell.className = 'matrix-cell correlation-cell';

      if (rowIndex === colIndex) {
        cell.textContent = '1.00';
        cell.style.backgroundColor = '#007acc';
        cell.style.color = 'white';
      } else if (rowIndex > colIndex) {
        // Only calculate correlations for upper triangle to avoid duplication
        const correlation = analyzeScaleCorrelation(rowPath, colPath, days);
        const corrValue = correlation.correlation;
        
        if (corrValue !== null) {
          cell.textContent = corrValue.toFixed(2);
          const intensity = Math.abs(corrValue);
          const color = corrValue > 0 ? 'green' : 'red';
          cell.style.backgroundColor = `${color}`;
          cell.style.opacity = intensity * 0.7 + 0.3;
          cell.style.color = intensity > 0.5 ? 'white' : 'black';
          cell.setAttribute('title', `${correlation.strength} correlation (n=${correlation.count})`);
        } else {
          cell.textContent = 'N/A';
          cell.style.backgroundColor = '#f0f0f0';
        }
      } else {
        cell.style.backgroundColor = '#f9f9f9';
      }

      grid.appendChild(cell);
    });
  });

  return matrix;
}

/**
 * Creates an overview dashboard with multiple visualizations
 * @param {Object} config - Configuration options
 * @returns {HTMLElement} - Complete dashboard
 */
export function createOverviewDashboard(config = {}) {
  const {
    days = 30,
    primaryScales = [
      'somatic_coherence.pre_session.embodied_presence',
      'somatic_coherence.post_session.embodied_presence',
      'response_quality.assessment.felt_coherence',
      'meaning_making.post_session.insight_emergence'
    ]
  } = config;

  const dashboard = document.createElement('div');
  dashboard.className = 'measurement-overview-dashboard';
  dashboard.id = 'measurement-overview';

  dashboard.innerHTML = `
    <div class="dashboard-header">
      <h2>Measurement Framework Dashboard</h2>
      <div class="dashboard-controls">
        <label for="dashboard-days">Time Period:</label>
        <select id="dashboard-days">
          <option value="7">Last 7 days</option>
          <option value="30" selected>Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
        <button id="refresh-dashboard">Refresh</button>
      </div>
    </div>
    <div class="dashboard-content">
      <div class="dashboard-section summary-section">
        <h3>Summary Statistics</h3>
        <div class="summary-stats">
        </div>
      </div>
      <div class="dashboard-section trends-section">
        <h3>Trend Analysis</h3>
        <div class="trends-container">
        </div>
      </div>
      <div class="dashboard-section correlations-section">
        <h3>Scale Correlations</h3>
        <div class="correlations-container">
        </div>
      </div>
    </div>
  `;

  // Populate with initial data
  refreshDashboard(dashboard, primaryScales, days);

  // Add event listeners
  const daysSelect = dashboard.querySelector('#dashboard-days');
  const refreshButton = dashboard.querySelector('#refresh-dashboard');

  daysSelect.addEventListener('change', () => {
    refreshDashboard(dashboard, primaryScales, parseInt(daysSelect.value));
  });

  refreshButton.addEventListener('click', () => {
    refreshDashboard(dashboard, primaryScales, parseInt(daysSelect.value));
  });

  return dashboard;
}

/**
 * Refreshes dashboard content with current data
 * @param {HTMLElement} dashboard - Dashboard element
 * @param {Array} scales - Array of scale paths
 * @param {number} days - Number of days to analyze
 */
function refreshDashboard(dashboard, scales, days) {
  const summaryContainer = dashboard.querySelector('.summary-stats');
  const trendsContainer = dashboard.querySelector('.trends-container');
  const correlationsContainer = dashboard.querySelector('.correlations-container');

  // Clear existing content
  summaryContainer.innerHTML = '';
  trendsContainer.innerHTML = '';
  correlationsContainer.innerHTML = '';

  // Get all measurements for summary
  const measurements = getAllMeasurements(100);
  const recentMeasurements = measurements.slice(0, Math.min(measurements.length, 20));

  // Create summary statistics
  summaryContainer.innerHTML = `
    <div class="summary-item">
      <div class="summary-label">Total Sessions</div>
      <div class="summary-value">${measurements.length}</div>
    </div>
    <div class="summary-item">
      <div class="summary-label">Recent Sessions</div>
      <div class="summary-value">${recentMeasurements.length}</div>
    </div>
    <div class="summary-item">
      <div class="summary-label">Last Session</div>
      <div class="summary-value">
        ${measurements.length > 0 
          ? new Date(measurements[0].timestamp).toLocaleDateString()
          : 'Never'
        }
      </div>
    </div>
  `;

  // Create trend dashboards for each primary scale
  scales.forEach(scalePath => {
    const trendDashboard = createTrendDashboard(scalePath, days);
    trendsContainer.appendChild(trendDashboard);
  });

  // Create correlation matrix
  if (scales.length > 1) {
    const correlationMatrix = createCorrelationMatrix(scales, days);
    correlationsContainer.appendChild(correlationMatrix);
  }
}

/**
 * Format scale path for display
 * @param {string} scalePath - Dot notation scale path
 * @param {boolean} abbreviated - Whether to use abbreviated form
 * @returns {string} - Formatted display name
 */
function formatScalePath(scalePath, abbreviated = false) {
  const pathMap = {
    'somatic_coherence.pre_session.embodied_presence': abbreviated ? 'Pre-Embodied' : 'Pre-Session Embodied Presence',
    'somatic_coherence.post_session.embodied_presence': abbreviated ? 'Post-Embodied' : 'Post-Session Embodied Presence',
    'somatic_coherence.pre_session.energetic_resonance': abbreviated ? 'Pre-Energy' : 'Pre-Session Energetic Resonance',
    'somatic_coherence.post_session.energetic_resonance': abbreviated ? 'Post-Energy' : 'Post-Session Energetic Resonance',
    'somatic_coherence.pre_session.somatic_intelligence': abbreviated ? 'Pre-Somatic' : 'Pre-Session Somatic Intelligence',
    'somatic_coherence.post_session.somatic_intelligence': abbreviated ? 'Post-Somatic' : 'Post-Session Somatic Intelligence',
    'somatic_coherence.pre_session.groundedness': abbreviated ? 'Pre-Ground' : 'Pre-Session Groundedness',
    'somatic_coherence.post_session.groundedness': abbreviated ? 'Post-Ground' : 'Post-Session Groundedness',
    'response_quality.assessment.metaphor_richness': abbreviated ? 'Metaphors' : 'Metaphor Richness',
    'response_quality.assessment.personal_relevance': abbreviated ? 'Relevance' : 'Personal Relevance',
    'response_quality.assessment.depth_vs_surface': abbreviated ? 'Depth' : 'Depth vs Surface',
    'response_quality.assessment.novelty_factor': abbreviated ? 'Novelty' : 'Novelty Factor',
    'response_quality.assessment.felt_coherence': abbreviated ? 'Coherence' : 'Felt Coherence',
    'meaning_making.post_session.insight_emergence': abbreviated ? 'Insights' : 'Insight Emergence',
    'meaning_making.post_session.integration_ease': abbreviated ? 'Integration' : 'Integration Ease',
    'meaning_making.post_session.practical_relevance': abbreviated ? 'Practical' : 'Practical Relevance',
    'meaning_making.post_session.symbolic_resonance': abbreviated ? 'Symbolic' : 'Symbolic Resonance'
  };

  return pathMap[scalePath] || scalePath.replace(/\./g, ' ').replace(/_/g, ' ');
}

/**
 * Format trend direction for display
 * @param {string} trend - Trend direction ('increasing', 'decreasing', 'stable')
 * @returns {string} - Formatted trend with icon
 */
function formatTrend(trend) {
  const trendMap = {
    'increasing': '↗ Rising',
    'decreasing': '↘ Declining', 
    'stable': '→ Stable',
    null: '– Unknown'
  };
  
  return trendMap[trend] || '– Unknown';
}

/**
 * Initialize trend visualization CSS if not already present
 */
export function initTrendVisualizationStyles() {
  if (document.querySelector('#trend-visualization-styles')) return;

  const styleElement = document.createElement('style');
  styleElement.id = 'trend-visualization-styles';
  styleElement.textContent = `
    .measurement-overview-dashboard {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 1rem;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #eee;
    }

    .dashboard-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .dashboard-section {
      margin: 2rem 0;
      padding: 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
    }

    .summary-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .summary-item {
      text-align: center;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 4px;
    }

    .summary-label {
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 0.5rem;
    }

    .summary-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: #007acc;
    }

    .trend-dashboard {
      margin: 1.5rem 0;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: #fafafa;
    }

    .trend-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .stat-item {
      text-align: center;
    }

    .stat-label {
      font-size: 0.8rem;
      color: #666;
      margin-bottom: 0.25rem;
    }

    .stat-value {
      font-weight: bold;
      font-size: 1.1rem;
    }

    .trend-increasing {
      color: #28a745;
    }

    .trend-decreasing {
      color: #dc3545;
    }

    .trend-stable {
      color: #6c757d;
    }

    .trend-chart {
      max-width: 100%;
      height: auto;
    }

    .chart-title {
      font-size: 14px;
      font-weight: bold;
      fill: #333;
    }

    .trend-line {
      stroke-width: 2;
    }

    .data-point:hover {
      r: 6;
      cursor: pointer;
    }

    .axis {
      stroke: #ccc;
      stroke-width: 1;
    }

    .axis-label {
      font-size: 12px;
      fill: #666;
    }

    .correlation-matrix {
      margin: 1rem 0;
    }

    .matrix-grid {
      font-size: 0.9rem;
    }

    .matrix-cell {
      padding: 0.5rem;
      text-align: center;
      border: 1px solid #ddd;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .header-cell {
      background: #f8f9fa;
      font-weight: bold;
    }

    .row-header-cell {
      background: #f8f9fa;
      font-weight: bold;
      text-align: right;
    }

    .correlation-cell {
      font-family: monospace;
      transition: all 0.2s ease;
    }

    .correlation-cell:hover {
      transform: scale(1.05);
      z-index: 10;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .chart-placeholder {
      padding: 2rem;
      text-align: center;
      color: #666;
      font-style: italic;
      background: #f8f9fa;
      border-radius: 4px;
    }

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        gap: 1rem;
      }

      .summary-stats {
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      }

      .trend-stats {
        grid-template-columns: repeat(2, 1fr);
      }

      .matrix-grid {
        font-size: 0.8rem;
      }
    }
  `;
  
  document.head.appendChild(styleElement);
}