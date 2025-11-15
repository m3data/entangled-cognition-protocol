/**
 * ECP Measurement Integration System
 * 
 * Connects workflow templates to the existing measurement framework,
 * providing automated measurement scheduling, data collection workflows,
 * and comparative analysis tools for systematic ECP research.
 */

import { 
  createSomaticCoherenceAssessment,
  createResponseQualityAssessment,
  createMeaningMakingAssessment,
  createEmergencePatternsSection,
  initMeasurementFrameworks
} from './measurementWidgets.js';

import { loadMeasurementData, saveMeasurementData } from './storage.js';

/**
 * Automated measurement scheduler for workflow templates
 */
export class MeasurementScheduler {
  constructor() {
    this.activeSchedules = new Map();
    this.scheduledMeasurements = new Map();
  }

  /**
   * Create measurement schedule from template
   */
  createScheduleFromTemplate(template, experimentId) {
    const schedule = {
      experimentId,
      templateId: template.id,
      measurements: [],
      created: new Date().toISOString()
    };

    // Extract measurements from template phases
    template.phases.forEach((phase, phaseIndex) => {
      phase.steps.forEach((step, stepIndex) => {
        if (step.measurements) {
          step.measurements.forEach(measurement => {
            schedule.measurements.push({
              id: `${experimentId}_${phaseIndex}_${stepIndex}_${measurement.type || measurement}`,
              phase: phaseIndex,
              step: stepIndex,
              type: measurement.type || measurement,
              timing: step.timing || 'during',
              required: measurement.required || false,
              completed: false,
              data: null,
              timestamp: null
            });
          });
        }
      });
    });

    this.activeSchedules.set(experimentId, schedule);
    return schedule;
  }

  /**
   * Get measurements due for current step
   */
  getMeasurementsForStep(experimentId, phaseIndex, stepIndex, timing = 'during') {
    const schedule = this.activeSchedules.get(experimentId);
    if (!schedule) return [];

    return schedule.measurements.filter(m => 
      m.phase === phaseIndex && 
      m.step === stepIndex && 
      m.timing === timing &&
      !m.completed
    );
  }

  /**
   * Complete a measurement
   */
  completeMeasurement(experimentId, measurementId, data) {
    const schedule = this.activeSchedules.get(experimentId);
    if (!schedule) return false;

    const measurement = schedule.measurements.find(m => m.id === measurementId);
    if (!measurement) return false;

    measurement.completed = true;
    measurement.data = data;
    measurement.timestamp = new Date().toISOString();

    // Save to persistent storage
    this.saveMeasurementData(experimentId, measurementId, data);
    
    return true;
  }

  /**
   * Get completion status for experiment
   */
  getCompletionStatus(experimentId) {
    const schedule = this.activeSchedules.get(experimentId);
    if (!schedule) return null;

    const total = schedule.measurements.length;
    const completed = schedule.measurements.filter(m => m.completed).length;
    const required = schedule.measurements.filter(m => m.required).length;
    const requiredCompleted = schedule.measurements.filter(m => m.required && m.completed).length;

    return {
      total,
      completed,
      required,
      requiredCompleted,
      percentComplete: (completed / total) * 100,
      requiredPercentComplete: (requiredCompleted / required) * 100
    };
  }

  /**
   * Save measurement data to storage
   */
  saveMeasurementData(experimentId, measurementId, data) {
    try {
      const existingData = loadMeasurementData() || {};
      
      if (!existingData.experiments) {
        existingData.experiments = {};
      }
      
      if (!existingData.experiments[experimentId]) {
        existingData.experiments[experimentId] = {};
      }
      
      existingData.experiments[experimentId][measurementId] = {
        data,
        timestamp: new Date().toISOString()
      };
      
      saveMeasurementData(existingData);
    } catch (error) {
      console.error('Failed to save measurement data:', error);
    }
  }
}

/**
 * Measurement widget factory for different measurement types
 */
export class MeasurementWidgetFactory {
  constructor() {
    this.widgets = new Map();
  }

  /**
   * Create measurement widget based on type
   */
  createWidget(measurementType, config = {}) {
    switch (measurementType) {
      case 'somatic_coherence':
        return this.createSomaticWidget(config);
      case 'response_quality':
        return this.createResponseQualityWidget(config);
      case 'meaning_making':
        return this.createMeaningMakingWidget(config);
      case 'emergence_patterns':
        return this.createEmergencePatternsWidget(config);
      case 'scale':
        return this.createScaleWidget(config);
      case 'text':
        return this.createTextWidget(config);
      case 'select':
        return this.createSelectWidget(config);
      case 'number':
        return this.createNumberWidget(config);
      case 'timestamp':
        return this.createTimestampWidget(config);
      default:
        return this.createCustomWidget(measurementType, config);
    }
  }

  /**
   * Create somatic coherence widget
   */
  createSomaticWidget(config) {
    const phase = config.phase || 'pre';
    const widget = createSomaticCoherenceAssessment(phase);
    
    // Add data extraction method
    widget.getData = () => {
      const data = {};
      const scales = widget.querySelectorAll('input[type="range"]');
      scales.forEach(scale => {
        data[scale.name] = parseFloat(scale.value);
      });
      return data;
    };

    return widget;
  }

  /**
   * Create response quality widget
   */
  createResponseQualityWidget(config) {
    const widget = createResponseQualityAssessment();
    
    widget.getData = () => {
      const data = {};
      const scales = widget.querySelectorAll('input[type="range"]');
      scales.forEach(scale => {
        data[scale.name] = parseFloat(scale.value);
      });
      return data;
    };

    return widget;
  }

  /**
   * Create meaning making widget
   */
  createMeaningMakingWidget(config) {
    const widget = createMeaningMakingAssessment();
    
    widget.getData = () => {
      const data = {};
      const scales = widget.querySelectorAll('input[type="range"]');
      const textareas = widget.querySelectorAll('textarea');
      
      scales.forEach(scale => {
        data[scale.name] = parseFloat(scale.value);
      });
      
      textareas.forEach(textarea => {
        data[textarea.name] = textarea.value;
      });
      
      return data;
    };

    return widget;
  }

  /**
   * Create emergence patterns widget
   */
  createEmergencePatternsWidget(config) {
    const widget = createEmergencePatternsSection();
    
    widget.getData = () => {
      const data = {};
      const inputs = widget.querySelectorAll('input, textarea, select');
      
      inputs.forEach(input => {
        if (input.type === 'checkbox') {
          data[input.name] = input.checked;
        } else if (input.type === 'radio' && input.checked) {
          data[input.name] = input.value;
        } else {
          data[input.name] = input.value;
        }
      });
      
      return data;
    };

    return widget;
  }

  /**
   * Create scale widget
   */
  createScaleWidget(config) {
    const widget = document.createElement('div');
    widget.className = 'measurement-scale-widget';
    
    const label = config.label || config.field || 'Rating';
    const min = config.min || 1;
    const max = config.max || 10;
    const step = config.step || 1;
    
    widget.innerHTML = `
      <div class="scale-measurement">
        <label for="${config.field}">${label}:</label>
        <div class="scale-container">
          <span class="scale-min">${min}</span>
          <input type="range" id="${config.field}" name="${config.field}" 
                 min="${min}" max="${max}" step="${step}" value="${min}">
          <span class="scale-max">${max}</span>
        </div>
        <div class="scale-value">${min}</div>
      </div>
    `;
    
    // Update value display
    const slider = widget.querySelector('input[type="range"]');
    const valueDisplay = widget.querySelector('.scale-value');
    
    slider.addEventListener('input', (e) => {
      valueDisplay.textContent = e.target.value;
    });
    
    widget.getData = () => {
      return { [config.field]: parseFloat(slider.value) };
    };
    
    return widget;
  }

  /**
   * Create text widget
   */
  createTextWidget(config) {
    const widget = document.createElement('div');
    widget.className = 'measurement-text-widget';
    
    const label = config.label || config.field || 'Text Input';
    const placeholder = config.placeholder || '';
    const rows = config.rows || 3;
    
    widget.innerHTML = `
      <div class="text-measurement">
        <label for="${config.field}">${label}:</label>
        <textarea id="${config.field}" name="${config.field}" 
                  rows="${rows}" placeholder="${placeholder}"></textarea>
      </div>
    `;
    
    widget.getData = () => {
      const textarea = widget.querySelector('textarea');
      return { [config.field]: textarea.value };
    };
    
    return widget;
  }

  /**
   * Create select widget
   */
  createSelectWidget(config) {
    const widget = document.createElement('div');
    widget.className = 'measurement-select-widget';
    
    const label = config.label || config.field || 'Selection';
    const options = config.options || [];
    
    let optionsHtml = '';
    options.forEach(option => {
      optionsHtml += `<option value="${option}">${option}</option>`;
    });
    
    widget.innerHTML = `
      <div class="select-measurement">
        <label for="${config.field}">${label}:</label>
        <select id="${config.field}" name="${config.field}">
          <option value="">Select...</option>
          ${optionsHtml}
        </select>
      </div>
    `;
    
    widget.getData = () => {
      const select = widget.querySelector('select');
      return { [config.field]: select.value };
    };
    
    return widget;
  }

  /**
   * Create number widget
   */
  createNumberWidget(config) {
    const widget = document.createElement('div');
    widget.className = 'measurement-number-widget';
    
    const label = config.label || config.field || 'Number';
    const min = config.min !== undefined ? `min="${config.min}"` : '';
    const max = config.max !== undefined ? `max="${config.max}"` : '';
    const step = config.step !== undefined ? `step="${config.step}"` : '';
    
    widget.innerHTML = `
      <div class="number-measurement">
        <label for="${config.field}">${label}:</label>
        <input type="number" id="${config.field}" name="${config.field}" 
               ${min} ${max} ${step}>
      </div>
    `;
    
    widget.getData = () => {
      const input = widget.querySelector('input');
      return { [config.field]: parseFloat(input.value) || 0 };
    };
    
    return widget;
  }

  /**
   * Create timestamp widget (auto-captures current time)
   */
  createTimestampWidget(config) {
    const widget = document.createElement('div');
    widget.className = 'measurement-timestamp-widget';
    widget.style.display = 'none'; // Hidden widget
    
    const timestamp = new Date().toISOString();
    
    widget.getData = () => {
      return { [config.field]: timestamp };
    };
    
    return widget;
  }

  /**
   * Create custom widget for undefined types
   */
  createCustomWidget(type, config) {
    const widget = document.createElement('div');
    widget.className = 'measurement-custom-widget';
    
    widget.innerHTML = `
      <div class="custom-measurement">
        <label>Custom Measurement: ${type}</label>
        <textarea name="custom_${type}" placeholder="Enter measurement data..."></textarea>
      </div>
    `;
    
    widget.getData = () => {
      const textarea = widget.querySelector('textarea');
      return { [`custom_${type}`]: textarea.value };
    };
    
    return widget;
  }
}

/**
 * Comparative analysis tools for template-based studies
 */
export class ComparativeAnalyzer {
  constructor() {
    this.analysisCache = new Map();
  }

  /**
   * Analyze before/after measurements
   */
  analyzeBeforeAfter(experimentId, measurementType) {
    const data = this.getMeasurementDataForExperiment(experimentId);
    
    const beforeMeasurements = data.filter(d => 
      d.type === measurementType && d.timing === 'before'
    );
    
    const afterMeasurements = data.filter(d => 
      d.type === measurementType && d.timing === 'after'
    );
    
    if (beforeMeasurements.length === 0 || afterMeasurements.length === 0) {
      return null;
    }
    
    // Calculate paired differences
    const pairs = this.matchBeforeAfterPairs(beforeMeasurements, afterMeasurements);
    const differences = pairs.map(pair => pair.after - pair.before);
    
    return {
      beforeMean: this.calculateMean(beforeMeasurements.map(d => d.value)),
      afterMean: this.calculateMean(afterMeasurements.map(d => d.value)),
      meanDifference: this.calculateMean(differences),
      standardDeviation: this.calculateStandardDeviation(differences),
      effectSize: this.calculateCohenD(differences),
      pairedTTest: this.pairedTTest(differences),
      interpretation: this.interpretChange(differences)
    };
  }

  /**
   * Compare across conditions
   */
  compareConditions(experimentId, measurementType, conditions) {
    const data = this.getMeasurementDataForExperiment(experimentId);
    
    const conditionData = {};
    conditions.forEach(condition => {
      conditionData[condition] = data.filter(d => 
        d.type === measurementType && d.condition === condition
      );
    });
    
    const comparison = {
      conditions: {},
      anova: null,
      pairwiseComparisons: {}
    };
    
    // Calculate descriptives for each condition
    Object.keys(conditionData).forEach(condition => {
      const values = conditionData[condition].map(d => d.value);
      comparison.conditions[condition] = {
        n: values.length,
        mean: this.calculateMean(values),
        standardDeviation: this.calculateStandardDeviation(values),
        standardError: this.calculateStandardError(values)
      };
    });
    
    // Simple ANOVA calculation (for 2+ groups)
    if (conditions.length >= 2) {
      comparison.anova = this.oneWayANOVA(conditionData);
    }
    
    // Pairwise comparisons (t-tests)
    for (let i = 0; i < conditions.length; i++) {
      for (let j = i + 1; j < conditions.length; j++) {
        const condition1 = conditions[i];
        const condition2 = conditions[j];
        
        const values1 = conditionData[condition1].map(d => d.value);
        const values2 = conditionData[condition2].map(d => d.value);
        
        comparison.pairwiseComparisons[`${condition1}_vs_${condition2}`] = 
          this.independentTTest(values1, values2);
      }
    }
    
    return comparison;
  }

  /**
   * Analyze longitudinal trends
   */
  analyzeLongitudinalTrends(experimentId, measurementType) {
    const data = this.getMeasurementDataForExperiment(experimentId)
      .filter(d => d.type === measurementType)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    if (data.length < 3) {
      return null; // Need at least 3 points for trend analysis
    }
    
    const values = data.map(d => d.value);
    const timePoints = data.map((d, index) => index + 1);
    
    return {
      dataPoints: data.length,
      timeSpan: this.calculateTimeSpan(data),
      linearTrend: this.calculateLinearRegression(timePoints, values),
      correlation: this.calculateCorrelation(timePoints, values),
      changeOverTime: {
        total: values[values.length - 1] - values[0],
        percent: ((values[values.length - 1] - values[0]) / values[0]) * 100
      },
      volatility: this.calculateVolatility(values),
      interpretation: this.interpretTrend(timePoints, values)
    };
  }

  /**
   * Generate insights from measurement patterns
   */
  generateInsights(experimentId, analysisResults) {
    const insights = [];
    
    // Before/after insights
    if (analysisResults.beforeAfter) {
      analysisResults.beforeAfter.forEach((analysis, measurementType) => {
        if (analysis.effectSize > 0.5) {
          insights.push({
            type: 'significant_change',
            measurement: measurementType,
            description: `Large effect size (${analysis.effectSize.toFixed(2)}) indicates meaningful change in ${measurementType}`,
            recommendation: 'This suggests the intervention had a substantial impact'
          });
        }
        
        if (analysis.meanDifference > 0 && analysis.pairedTTest.pValue < 0.05) {
          insights.push({
            type: 'positive_improvement',
            measurement: measurementType,
            description: `Significant improvement in ${measurementType} (p = ${analysis.pairedTTest.pValue.toFixed(3)})`,
            recommendation: 'Continue with this approach as it shows measurable benefits'
          });
        }
      });
    }
    
    // Condition comparison insights
    if (analysisResults.conditionComparisons) {
      analysisResults.conditionComparisons.forEach((comparison, measurementType) => {
        if (comparison.anova && comparison.anova.pValue < 0.05) {
          insights.push({
            type: 'condition_differences',
            measurement: measurementType,
            description: `Significant differences found between conditions in ${measurementType}`,
            recommendation: 'Explore which specific conditions produce the best outcomes'
          });
        }
      });
    }
    
    // Longitudinal insights
    if (analysisResults.longitudinal) {
      analysisResults.longitudinal.forEach((trend, measurementType) => {
        if (Math.abs(trend.correlation) > 0.7) {
          const direction = trend.correlation > 0 ? 'increasing' : 'decreasing';
          insights.push({
            type: 'strong_trend',
            measurement: measurementType,
            description: `Strong ${direction} trend in ${measurementType} over time (r = ${trend.correlation.toFixed(2)})`,
            recommendation: `Consider factors that may be driving this ${direction} pattern`
          });
        }
      });
    }
    
    return insights;
  }

  // Statistical helper methods
  calculateMean(values) {
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  }

  calculateStandardDeviation(values) {
    const mean = this.calculateMean(values);
    const squaredDifferences = values.map(value => Math.pow(value - mean, 2));
    const variance = this.calculateMean(squaredDifferences);
    return Math.sqrt(variance);
  }

  calculateStandardError(values) {
    return this.calculateStandardDeviation(values) / Math.sqrt(values.length);
  }

  calculateCohenD(differences) {
    const mean = this.calculateMean(differences);
    const sd = this.calculateStandardDeviation(differences);
    return sd > 0 ? mean / sd : 0;
  }

  pairedTTest(differences) {
    const n = differences.length;
    const mean = this.calculateMean(differences);
    const se = this.calculateStandardError(differences);
    const tStatistic = se > 0 ? mean / se : 0;
    
    // Simplified p-value estimation (not exact)
    const df = n - 1;
    const pValue = this.estimatePValue(tStatistic, df);
    
    return {
      tStatistic,
      degreesOfFreedom: df,
      pValue,
      significant: pValue < 0.05
    };
  }

  independentTTest(values1, values2) {
    const mean1 = this.calculateMean(values1);
    const mean2 = this.calculateMean(values2);
    const sd1 = this.calculateStandardDeviation(values1);
    const sd2 = this.calculateStandardDeviation(values2);
    const n1 = values1.length;
    const n2 = values2.length;
    
    // Pooled standard deviation
    const pooledSD = Math.sqrt(((n1 - 1) * sd1 * sd1 + (n2 - 1) * sd2 * sd2) / (n1 + n2 - 2));
    const standardError = pooledSD * Math.sqrt(1/n1 + 1/n2);
    
    const tStatistic = standardError > 0 ? (mean1 - mean2) / standardError : 0;
    const df = n1 + n2 - 2;
    const pValue = this.estimatePValue(tStatistic, df);
    
    return {
      mean1,
      mean2,
      meanDifference: mean1 - mean2,
      tStatistic,
      degreesOfFreedom: df,
      pValue,
      significant: pValue < 0.05
    };
  }

  calculateLinearRegression(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.map((xi, i) => xi * y[i]).reduce((a, b) => a + b, 0);
    const sumXX = x.map(xi => xi * xi).reduce((a, b) => a + b, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return { slope, intercept };
  }

  calculateCorrelation(x, y) {
    const n = x.length;
    const meanX = this.calculateMean(x);
    const meanY = this.calculateMean(y);
    
    const numerator = x.map((xi, i) => (xi - meanX) * (y[i] - meanY)).reduce((a, b) => a + b, 0);
    const denominator = Math.sqrt(
      x.map(xi => Math.pow(xi - meanX, 2)).reduce((a, b) => a + b, 0) *
      y.map(yi => Math.pow(yi - meanY, 2)).reduce((a, b) => a + b, 0)
    );
    
    return denominator > 0 ? numerator / denominator : 0;
  }

  // Simplified p-value estimation (for demonstration - use proper statistical libraries in production)
  estimatePValue(tStatistic, df) {
    // Very simplified - would need proper t-distribution tables/functions
    const absTStat = Math.abs(tStatistic);
    if (absTStat > 3) return 0.001;
    if (absTStat > 2.5) return 0.01;
    if (absTStat > 2) return 0.05;
    if (absTStat > 1.5) return 0.1;
    return 0.2;
  }

  // Helper methods
  getMeasurementDataForExperiment(experimentId) {
    const allData = loadMeasurementData();
    return allData?.experiments?.[experimentId] || [];
  }

  matchBeforeAfterPairs(beforeMeasurements, afterMeasurements) {
    // Simple matching by index - could be more sophisticated
    const pairs = [];
    const minLength = Math.min(beforeMeasurements.length, afterMeasurements.length);
    
    for (let i = 0; i < minLength; i++) {
      pairs.push({
        before: beforeMeasurements[i].value,
        after: afterMeasurements[i].value
      });
    }
    
    return pairs;
  }

  calculateTimeSpan(data) {
    if (data.length < 2) return 0;
    
    const firstTime = new Date(data[0].timestamp);
    const lastTime = new Date(data[data.length - 1].timestamp);
    
    return lastTime - firstTime; // milliseconds
  }

  calculateVolatility(values) {
    if (values.length < 2) return 0;
    
    const changes = [];
    for (let i = 1; i < values.length; i++) {
      changes.push(Math.abs(values[i] - values[i-1]));
    }
    
    return this.calculateMean(changes);
  }

  interpretChange(differences) {
    const meanChange = this.calculateMean(differences);
    const effectSize = this.calculateCohenD(differences);
    
    if (Math.abs(effectSize) < 0.2) {
      return 'No meaningful change detected';
    } else if (effectSize >= 0.2 && effectSize < 0.5) {
      return meanChange > 0 ? 'Small positive improvement' : 'Small decline';
    } else if (effectSize >= 0.5 && effectSize < 0.8) {
      return meanChange > 0 ? 'Moderate positive improvement' : 'Moderate decline';
    } else {
      return meanChange > 0 ? 'Large positive improvement' : 'Large decline';
    }
  }

  interpretTrend(timePoints, values) {
    const correlation = this.calculateCorrelation(timePoints, values);
    
    if (Math.abs(correlation) < 0.3) {
      return 'No clear trend over time';
    } else if (correlation >= 0.3 && correlation < 0.7) {
      return 'Moderate upward trend';
    } else if (correlation >= 0.7) {
      return 'Strong upward trend';
    } else if (correlation <= -0.3 && correlation > -0.7) {
      return 'Moderate downward trend';
    } else {
      return 'Strong downward trend';
    }
  }

  oneWayANOVA(conditionData) {
    // Simplified ANOVA calculation
    const conditions = Object.keys(conditionData);
    const allValues = [];
    const groupMeans = {};
    let totalN = 0;
    
    conditions.forEach(condition => {
      const values = conditionData[condition].map(d => d.value);
      allValues.push(...values);
      groupMeans[condition] = this.calculateMean(values);
      totalN += values.length;
    });
    
    const grandMean = this.calculateMean(allValues);
    
    // Between-group sum of squares
    let betweenSS = 0;
    conditions.forEach(condition => {
      const n = conditionData[condition].length;
      const groupMean = groupMeans[condition];
      betweenSS += n * Math.pow(groupMean - grandMean, 2);
    });
    
    // Within-group sum of squares
    let withinSS = 0;
    conditions.forEach(condition => {
      const values = conditionData[condition].map(d => d.value);
      const groupMean = groupMeans[condition];
      values.forEach(value => {
        withinSS += Math.pow(value - groupMean, 2);
      });
    });
    
    const betweenDF = conditions.length - 1;
    const withinDF = totalN - conditions.length;
    
    const betweenMS = betweenSS / betweenDF;
    const withinMS = withinSS / withinDF;
    
    const fStatistic = withinMS > 0 ? betweenMS / withinMS : 0;
    const pValue = this.estimatePValue(Math.sqrt(fStatistic), betweenDF); // Simplified
    
    return {
      fStatistic,
      betweenDF,
      withinDF,
      pValue,
      significant: pValue < 0.05
    };
  }
}

// Export main classes
export default {
  MeasurementScheduler,
  MeasurementWidgetFactory,
  ComparativeAnalyzer
};