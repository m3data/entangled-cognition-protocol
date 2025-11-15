/**
 * Integration Test Suite for ECP Workflow Template System
 * 
 * Tests the complete workflow template system integration with the Field Journal,
 * ensuring all components work together seamlessly.
 */

import { 
  templateLibrary, 
  getTemplate,
  getAllTemplates,
  searchTemplates 
} from './templateLibrary.js';

import { WorkflowExecutor, ECPWorkflowTemplate } from './workflowEngine.js';
import { MeasurementScheduler, MeasurementWidgetFactory } from './measurementIntegration.js';
import MultiSessionArcCoordinator from './multiSessionCoordinator.js';

class IntegrationTester {
  constructor() {
    this.testResults = [];
    this.executor = new WorkflowExecutor();
    this.coordinator = new MultiSessionArcCoordinator();
    this.measurementScheduler = new MeasurementScheduler();
    this.widgetFactory = new MeasurementWidgetFactory();
  }

  async runAllTests() {
    console.log('🧪 Starting ECP Workflow Template Integration Tests...');
    
    await this.testTemplateLibrary();
    await this.testWorkflowEngine();
    await this.testMeasurementIntegration();
    await this.testMultiSessionCoordination();
    await this.testEndToEndWorkflow();
    
    this.printResults();
    return this.testResults;
  }

  async testTemplateLibrary() {
    console.log('📚 Testing Template Library...');
    
    try {
      // Test template retrieval
      const allTemplates = getAllTemplates();
      this.assert(allTemplates.length > 0, 'Template library should contain templates');
      
      // Test specific template retrieval
      const somaticTemplate = getTemplate('somatic-awareness-response-quality');
      this.assert(somaticTemplate !== undefined, 'Somatic awareness template should be retrievable');
      this.assert(somaticTemplate.name === 'Somatic Awareness and Response Quality', 'Template should have correct name');
      
      // Test template structure
      this.assert(somaticTemplate.phases.length > 0, 'Template should have phases');
      this.assert(somaticTemplate.variables.length > 0, 'Template should have variables');
      this.assert(somaticTemplate.measurements.length > 0, 'Template should have measurements');
      
      // Test template validation
      const validationErrors = somaticTemplate.validate();
      this.assert(validationErrors.length === 0, 'Template should pass validation');
      
      // Test search functionality
      const searchResults = searchTemplates('somatic');
      this.assert(searchResults.length > 0, 'Search should return results');
      this.assert(searchResults.some(t => t.id === 'somatic-awareness-response-quality'), 'Search should find somatic template');
      
      this.pass('Template Library tests completed successfully');
    } catch (error) {
      this.fail('Template Library test failed', error);
    }
  }

  async testWorkflowEngine() {
    console.log('⚙️ Testing Workflow Engine...');
    
    try {
      const template = getTemplate('somatic-awareness-response-quality');
      
      // Test experiment creation
      const experimentId = this.executor.startExperiment(template, {
        title: 'Test Somatic Study',
        customizations: { testMode: true }
      });
      
      this.assert(experimentId !== null, 'Experiment should be created');
      this.assert(this.executor.activeExperiments.has(experimentId), 'Experiment should be tracked');
      
      // Test current step retrieval
      const currentStep = this.executor.getCurrentStep(experimentId);
      this.assert(currentStep !== null, 'Should retrieve current step');
      this.assert(currentStep.step.name === 'Question Formulation', 'Should start with first step');
      
      // Test progress tracking
      const initialProgress = this.executor.getProgress(experimentId);
      this.assert(initialProgress.totalSteps > 0, 'Should have steps to complete');
      this.assert(initialProgress.completedSteps === 0, 'Should start with no completed steps');
      
      // Test step completion
      const stepCompleted = this.executor.completeStep(experimentId, { testData: 'completed' });
      this.assert(stepCompleted, 'Step should be completable');
      
      const updatedProgress = this.executor.getProgress(experimentId);
      this.assert(updatedProgress.completedSteps === 1, 'Completed steps should increment');
      
      this.pass('Workflow Engine tests completed successfully');
    } catch (error) {
      this.fail('Workflow Engine test failed', error);
    }
  }

  async testMeasurementIntegration() {
    console.log('📏 Testing Measurement Integration...');
    
    try {
      const template = getTemplate('emotional-state-modulation');
      const experimentId = 'test-measurement-experiment';
      
      // Test measurement schedule creation
      const schedule = this.measurementScheduler.createScheduleFromTemplate(template, experimentId);
      this.assert(schedule !== null, 'Should create measurement schedule');
      this.assert(schedule.measurements.length > 0, 'Schedule should contain measurements');
      
      // Test measurement retrieval for specific step
      const measurements = this.measurementScheduler.getMeasurementsForStep(experimentId, 0, 0);
      this.assert(Array.isArray(measurements), 'Should return measurements array');
      
      // Test measurement completion
      const measurementId = measurements[0]?.id;
      if (measurementId) {
        const completed = this.measurementScheduler.completeMeasurement(
          experimentId, 
          measurementId, 
          { testValue: 7.5 }
        );
        this.assert(completed, 'Should complete measurement');
      }
      
      // Test completion status
      const status = this.measurementScheduler.getCompletionStatus(experimentId);
      this.assert(status !== null, 'Should provide completion status');
      
      // Test widget factory
      const scaleWidget = this.widgetFactory.createWidget('scale', {
        field: 'test_scale',
        label: 'Test Scale',
        min: 1,
        max: 10
      });
      this.assert(scaleWidget !== null, 'Should create scale widget');
      this.assert(typeof scaleWidget.getData === 'function', 'Widget should have getData method');
      
      const somaticWidget = this.widgetFactory.createWidget('somatic_coherence', { phase: 'pre' });
      this.assert(somaticWidget !== null, 'Should create somatic widget');
      
      this.pass('Measurement Integration tests completed successfully');
    } catch (error) {
      this.fail('Measurement Integration test failed', error);
    }
  }

  async testMultiSessionCoordination() {
    console.log('📅 Testing Multi-Session Coordination...');
    
    try {
      const template = getTemplate('thirty-day-interaction-arc');
      
      // Test arc creation
      const arcId = this.coordinator.createArc(template, {
        title: 'Test 30-Day Arc',
        sessionFrequency: 'daily',
        startDate: new Date().toISOString()
      });
      
      this.assert(arcId !== null, 'Should create arc');
      this.assert(this.coordinator.activeArcs.has(arcId), 'Arc should be tracked');
      
      // Test arc starting
      const started = this.coordinator.startArc(arcId);
      this.assert(started, 'Should start arc');
      
      // Test session requirements retrieval
      const requirements = this.coordinator.getCurrentSessionRequirements(arcId);
      this.assert(requirements !== null, 'Should provide session requirements');
      this.assert(requirements.step !== undefined, 'Should have current step');
      
      // Test session completion
      const sessionId = this.coordinator.completeSession(arcId, {
        duration: 30,
        measurements: { test_measure: 8 },
        notes: 'Test session completed',
        insights: 'Test insights gained'
      });
      
      this.assert(sessionId !== null, 'Should complete session');
      
      // Test progress tracking
      const progress = this.coordinator.getArcProgress(arcId);
      this.assert(progress !== null, 'Should provide progress');
      this.assert(progress.basic.completedSessions === 1, 'Should track completed sessions');
      
      // Test insights generation (with minimal data)
      const insights = this.coordinator.generateArcInsights(arcId);
      this.assert(insights !== null, 'Should generate insights');
      
      this.pass('Multi-Session Coordination tests completed successfully');
    } catch (error) {
      this.fail('Multi-Session Coordination test failed', error);
    }
  }

  async testEndToEndWorkflow() {
    console.log('🔄 Testing End-to-End Workflow...');
    
    try {
      // Test complete workflow for a simple template
      const template = getTemplate('cognitive-mode-simulation');
      
      // 1. Create experiment
      const experimentId = this.executor.startExperiment(template, {
        title: 'E2E Test Study',
        measurementFrequency: 'minimal'
      });
      
      // 2. Set up measurements
      const schedule = this.measurementScheduler.createScheduleFromTemplate(template, experimentId);
      
      // 3. Go through multiple steps
      let stepCount = 0;
      while (stepCount < 3) { // Test first 3 steps
        const currentStep = this.executor.getCurrentStep(experimentId);
        if (!currentStep) break;
        
        // Get measurements for current step
        const measurements = this.measurementScheduler.getMeasurementsForStep(
          experimentId,
          currentStep.phaseIndex,
          currentStep.stepIndex
        );
        
        // Complete any measurements
        for (const measurement of measurements) {
          this.measurementScheduler.completeMeasurement(
            experimentId,
            measurement.id,
            { testValue: Math.random() * 10 }
          );
        }
        
        // Complete the step
        const completed = this.executor.completeStep(experimentId, {
          stepData: { completed: true },
          timestamp: new Date().toISOString()
        });
        
        if (!completed) break;
        stepCount++;
      }
      
      this.assert(stepCount >= 3, 'Should complete multiple steps');
      
      // 4. Check final state
      const finalProgress = this.executor.getProgress(experimentId);
      this.assert(finalProgress.completedSteps >= 3, 'Should track step completion');
      
      const measurementStatus = this.measurementScheduler.getCompletionStatus(experimentId);
      this.assert(measurementStatus.completed >= 0, 'Should track measurement completion');
      
      this.pass('End-to-End Workflow tests completed successfully');
    } catch (error) {
      this.fail('End-to-End Workflow test failed', error);
    }
  }

  // Test utility methods
  assert(condition, message) {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  pass(testName) {
    this.testResults.push({ 
      test: testName, 
      status: 'PASS', 
      timestamp: new Date().toISOString() 
    });
    console.log(`✅ ${testName}`);
  }

  fail(testName, error) {
    this.testResults.push({ 
      test: testName, 
      status: 'FAIL', 
      error: error.message, 
      timestamp: new Date().toISOString() 
    });
    console.error(`❌ ${testName}: ${error.message}`);
  }

  printResults() {
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    
    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📊 Total: ${this.testResults.length}`);
    
    if (failed > 0) {
      console.log('\nFailure Details:');
      this.testResults
        .filter(r => r.status === 'FAIL')
        .forEach(result => {
          console.log(`❌ ${result.test}: ${result.error}`);
        });
    }
    
    console.log(`\n🎯 Success Rate: ${((passed / this.testResults.length) * 100).toFixed(1)}%`);
  }
}

// Export for use in browser or Node.js
export default IntegrationTester;

// Auto-run tests if called directly
if (typeof window !== 'undefined') {
  // Browser environment - expose to global scope
  window.IntegrationTester = IntegrationTester;
  
  // Add test runner function to global scope
  window.runECPIntegrationTests = async function() {
    const tester = new IntegrationTester();
    return await tester.runAllTests();
  };
}