/**
 * ECP Workflow Template Engine
 * 
 * Core system for creating, managing, and executing guided experimental workflows
 * that bridge rigorous scientific methodology with embodied ECP practices.
 * 
 * This engine transforms the use cases documented in the protocol into systematic,
 * step-by-step templates that maintain both experimental rigor and the sacred
 * nature of consciousness research.
 */

import { generateUniqueId } from './storage.js';

/**
 * Base template class for all ECP workflow templates
 */
export class ECPWorkflowTemplate {
  constructor(config) {
    this.id = config.id || generateUniqueId('template');
    this.name = config.name;
    this.description = config.description;
    this.category = config.category;
    this.researchQuestion = config.researchQuestion;
    this.expectedDuration = config.expectedDuration;
    this.difficulty = config.difficulty || 'beginner';
    
    // Experimental design elements
    this.variables = config.variables || [];
    this.conditions = config.conditions || [];
    this.measurements = config.measurements || [];
    
    // Workflow steps
    this.phases = config.phases || [];
    this.prerequisites = config.prerequisites || [];
    this.materials = config.materials || [];
    
    // Ethics and safety
    this.ethicalConsiderations = config.ethicalConsiderations || [];
    this.safetyGuidelines = config.safetyGuidelines || [];
    
    // Metadata
    this.created = new Date().toISOString();
    this.version = config.version || '1.0.0';
    this.tags = config.tags || [];
  }

  /**
   * Validate template configuration
   */
  validate() {
    const errors = [];
    
    if (!this.name) errors.push('Template name is required');
    if (!this.researchQuestion) errors.push('Research question is required');
    if (!this.phases || this.phases.length === 0) errors.push('At least one phase is required');
    
    // Validate phases
    this.phases.forEach((phase, index) => {
      if (!phase.name) errors.push(`Phase ${index + 1} missing name`);
      if (!phase.steps || phase.steps.length === 0) {
        errors.push(`Phase ${index + 1} missing steps`);
      }
    });
    
    return errors;
  }

  /**
   * Generate experiment configuration from template
   */
  generateExperimentConfig(customizations = {}) {
    return {
      templateId: this.id,
      templateVersion: this.version,
      researchQuestion: customizations.researchQuestion || this.researchQuestion,
      phases: this.phases.map(phase => ({
        ...phase,
        status: 'pending',
        startTime: null,
        endTime: null,
        data: {},
        notes: ''
      })),
      variables: this.variables,
      measurements: this.measurements,
      conditions: customizations.conditions || this.conditions,
      customizations,
      created: new Date().toISOString(),
      status: 'created'
    };
  }

  /**
   * Get recommended measurement schedule for this template
   */
  getMeasurementSchedule() {
    const schedule = [];
    
    this.phases.forEach((phase, phaseIndex) => {
      phase.steps.forEach((step, stepIndex) => {
        if (step.measurements) {
          step.measurements.forEach(measurement => {
            schedule.push({
              phase: phaseIndex,
              step: stepIndex,
              measurement,
              timing: step.timing || 'during',
              required: measurement.required || false
            });
          });
        }
      });
    });
    
    return schedule;
  }

  /**
   * Estimate sample size needed for statistical power
   */
  estimateSampleSize(effectSize = 0.5, power = 0.8, alpha = 0.05) {
    // Cohen's d calculation for paired t-test (most common ECP design)
    const z_alpha = 1.96; // for alpha = 0.05, two-tailed
    const z_beta = 0.84;  // for power = 0.8
    
    const n = Math.pow((z_alpha + z_beta) / effectSize, 2) * 2;
    
    return {
      minimumSessions: Math.ceil(n),
      recommendedSessions: Math.ceil(n * 1.2), // 20% buffer for dropouts
      powerAnalysis: {
        effectSize,
        power,
        alpha,
        testType: 'paired_t_test'
      }
    };
  }
}

/**
 * Template execution engine - manages running experiments from templates
 */
export class WorkflowExecutor {
  constructor() {
    this.activeExperiments = new Map();
    this.eventListeners = new Map();
  }

  /**
   * Start a new experiment from a template
   */
  startExperiment(template, customizations = {}) {
    const experimentId = generateUniqueId('experiment');
    const experiment = {
      id: experimentId,
      config: template.generateExperimentConfig(customizations),
      currentPhase: 0,
      currentStep: 0,
      data: {},
      startTime: new Date().toISOString(),
      status: 'active'
    };
    
    this.activeExperiments.set(experimentId, experiment);
    this._emitEvent('experiment:started', { experimentId, experiment });
    
    return experimentId;
  }

  /**
   * Get current step for an active experiment
   */
  getCurrentStep(experimentId) {
    const experiment = this.activeExperiments.get(experimentId);
    if (!experiment) return null;
    
    const currentPhase = experiment.config.phases[experiment.currentPhase];
    if (!currentPhase) return null;
    
    const currentStep = currentPhase.steps[experiment.currentStep];
    return {
      phase: currentPhase,
      step: currentStep,
      phaseIndex: experiment.currentPhase,
      stepIndex: experiment.currentStep,
      isLastStep: this._isLastStep(experiment),
      isLastPhase: this._isLastPhase(experiment)
    };
  }

  /**
   * Complete current step and move to next
   */
  completeStep(experimentId, stepData = {}) {
    const experiment = this.activeExperiments.get(experimentId);
    if (!experiment) return false;
    
    // Record step completion
    const phaseKey = `phase_${experiment.currentPhase}`;
    const stepKey = `step_${experiment.currentStep}`;
    
    if (!experiment.data[phaseKey]) experiment.data[phaseKey] = {};
    experiment.data[phaseKey][stepKey] = {
      ...stepData,
      completedAt: new Date().toISOString()
    };
    
    // Move to next step
    const moved = this._advanceStep(experiment);
    
    this._emitEvent('step:completed', { 
      experimentId, 
      completedStep: { phase: experiment.currentPhase, step: experiment.currentStep - 1 },
      stepData 
    });
    
    return moved;
  }

  /**
   * Get experiment progress
   */
  getProgress(experimentId) {
    const experiment = this.activeExperiments.get(experimentId);
    if (!experiment) return null;
    
    let totalSteps = 0;
    let completedSteps = 0;
    
    experiment.config.phases.forEach((phase, phaseIndex) => {
      totalSteps += phase.steps.length;
      if (phaseIndex < experiment.currentPhase) {
        completedSteps += phase.steps.length;
      } else if (phaseIndex === experiment.currentPhase) {
        completedSteps += experiment.currentStep;
      }
    });
    
    return {
      totalSteps,
      completedSteps,
      percentComplete: (completedSteps / totalSteps) * 100,
      currentPhase: experiment.currentPhase,
      currentStep: experiment.currentStep,
      status: experiment.status
    };
  }

  /**
   * Randomize conditions for controlled studies
   */
  randomizeConditions(conditions) {
    const shuffled = [...conditions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Generate balanced Latin Square for counterbalancing
   */
  generateLatinSquare(conditions) {
    const n = conditions.length;
    const square = [];
    
    for (let i = 0; i < n; i++) {
      const row = [];
      for (let j = 0; j < n; j++) {
        row.push(conditions[(i + j) % n]);
      }
      square.push(row);
    }
    
    return square;
  }

  // Private methods
  _advanceStep(experiment) {
    experiment.currentStep++;
    
    // Check if we've completed the current phase
    const currentPhase = experiment.config.phases[experiment.currentPhase];
    if (experiment.currentStep >= currentPhase.steps.length) {
      experiment.currentPhase++;
      experiment.currentStep = 0;
      
      // Check if experiment is complete
      if (experiment.currentPhase >= experiment.config.phases.length) {
        experiment.status = 'completed';
        experiment.endTime = new Date().toISOString();
        this._emitEvent('experiment:completed', { experimentId: experiment.id, experiment });
        return false;
      }
      
      this._emitEvent('phase:completed', { 
        experimentId: experiment.id, 
        completedPhase: experiment.currentPhase - 1 
      });
    }
    
    return true;
  }

  _isLastStep(experiment) {
    const currentPhase = experiment.config.phases[experiment.currentPhase];
    return experiment.currentStep === currentPhase.steps.length - 1;
  }

  _isLastPhase(experiment) {
    return experiment.currentPhase === experiment.config.phases.length - 1;
  }

  _emitEvent(eventType, data) {
    const listeners = this.eventListeners.get(eventType) || [];
    listeners.forEach(callback => callback(data));
  }

  /**
   * Add event listener for workflow events
   */
  addEventListener(eventType, callback) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType).push(callback);
  }
}

/**
 * Research design utilities for ECP experiments
 */
export class ResearchDesignHelper {
  /**
   * Generate randomization schedule for within-subjects design
   */
  static createWithinSubjectsDesign(conditions, sessions) {
    const design = [];
    const conditionsPerSession = Math.ceil(conditions.length / sessions);
    
    // Create balanced blocks
    for (let session = 0; session < sessions; session++) {
      const sessionConditions = [];
      const startIndex = (session * conditionsPerSession) % conditions.length;
      
      for (let i = 0; i < conditionsPerSession && sessionConditions.length < conditions.length; i++) {
        const conditionIndex = (startIndex + i) % conditions.length;
        sessionConditions.push(conditions[conditionIndex]);
      }
      
      // Randomize order within session
      design.push({
        session: session + 1,
        conditions: this.shuffle(sessionConditions),
        date: null // To be filled when scheduled
      });
    }
    
    return design;
  }

  /**
   * Generate time-delay randomization
   */
  static createTimeDelaySchedule(baseDurations, sessions) {
    const schedule = [];
    
    for (let i = 0; i < sessions; i++) {
      const randomizedDurations = baseDurations.map(duration => ({
        condition: duration.condition,
        duration: duration.baseMinutes + (Math.random() - 0.5) * duration.variabilityMinutes,
        originalBase: duration.baseMinutes
      }));
      
      schedule.push({
        session: i + 1,
        timeDelays: this.shuffle(randomizedDurations)
      });
    }
    
    return schedule;
  }

  /**
   * Fisher-Yates shuffle
   */
  static shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Calculate minimum sessions for crossover design
   */
  static calculateCrossoverSessions(conditions, washoutPeriods = true) {
    const base = conditions.length;
    const washout = washoutPeriods ? conditions.length - 1 : 0;
    return base + washout;
  }

  /**
   * Validate experimental design for statistical power
   */
  static validateDesign(design) {
    const validation = {
      valid: true,
      warnings: [],
      recommendations: []
    };
    
    // Check for adequate sample size
    if (design.sessions < 10) {
      validation.warnings.push('Sample size below 10 sessions may limit statistical power');
      validation.recommendations.push('Consider increasing to 15-20 sessions for better power');
    }
    
    // Check for balance
    const conditionCounts = {};
    design.conditions?.forEach(condition => {
      conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
    });
    
    const counts = Object.values(conditionCounts);
    const maxCount = Math.max(...counts);
    const minCount = Math.min(...counts);
    
    if (maxCount - minCount > 1) {
      validation.warnings.push('Unbalanced design may introduce bias');
      validation.recommendations.push('Ensure equal repetitions of each condition');
    }
    
    return validation;
  }
}

// Default export for the main workflow engine
export default {
  ECPWorkflowTemplate,
  WorkflowExecutor,
  ResearchDesignHelper
};