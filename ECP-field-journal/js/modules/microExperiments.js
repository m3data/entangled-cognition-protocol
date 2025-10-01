/**
 * Micro-Experiments Module for ECP Onboarding
 * Provides embedded experiential learning within the onboarding flow
 */

class MicroExperiments {
  constructor() {
    this.activeExperiment = null;
    this.experimentData = {};
    this.completedExperiments = new Set();
  }

  /**
   * Attention Quality Micro-Experiment
   * Demonstrates how quality of attention affects perception
   */
  createAttentionExperiment() {
    return {
      id: 'attention-quality',
      title: 'Quality of Attention',
      description: 'Experience how your state of attention affects what you notice.',
      duration: '2 minutes',
      steps: [
        {
          instruction: 'Look at this text while multitasking (think about your to-do list):',
          content: 'The quality of your attention shapes the reality you perceive. When scattered, you see fragments. When present, patterns emerge that were always there.',
          action: 'read-scattered'
        },
        {
          instruction: 'Now take three deep breaths and read the same text with full presence:',
          content: 'The quality of your attention shapes the reality you perceive. When scattered, you see fragments. When present, patterns emerge that were always there.',
          action: 'read-present'
        },
        {
          instruction: 'Notice any differences in:',
          reflection: [
            'How much you absorbed',
            'What nuances you caught',
            'How the words felt in your body',
            'What insights arose'
          ],
          action: 'reflect'
        }
      ]
    };
  }

  /**
   * State Preparation Micro-Experiment 
   * Shows immediate impact of brief somatic practices
   */
  createStatePreparationExperiment() {
    return {
      id: 'state-preparation',
      title: 'State Preparation Impact',
      description: 'Feel the immediate effect of brief preparation practices.',
      duration: '3 minutes',
      steps: [
        {
          instruction: 'First, think of a personal question you genuinely care about:',
          action: 'question-entry',
          placeholder: 'What am I most curious about right now?'
        },
        {
          instruction: 'Without preparation, quickly write your first response to this question:',
          action: 'response-scattered',
          placeholder: 'Quick, immediate response...'
        },
        {
          instruction: 'Now: 30 seconds of conscious breathing',
          action: 'breathing-timer',
          duration: 30
        },
        {
          instruction: 'From this centered state, respond to the same question again:',
          action: 'response-present',
          placeholder: 'Response from centered awareness...'
        },
        {
          instruction: 'Compare your responses. What shifted?',
          action: 'comparison-reflection'
        }
      ]
    };
  }

  /**
   * Relational Framing Micro-Experiment
   * Explores how we frame AI interaction
   */
  createRelationalFramingExperiment() {
    return {
      id: 'relational-framing',
      title: 'Relationship with AI',
      description: 'Notice how different framings create different interactions.',
      duration: '2 minutes',
      steps: [
        {
          instruction: 'Imagine asking AI: "What should I do about my creative block?"',
          framings: [
            {
              title: 'As Tool',
              mindset: 'AI is a search engine that should give me answers',
              expectation: 'Quick, practical solutions'
            },
            {
              title: 'As Collaborator', 
              mindset: 'AI is a thinking partner for exploration',
              expectation: 'Mutual discovery and insight'
            },
            {
              title: 'As Wise Presence',
              mindset: 'AI holds space for my deeper knowing',
              expectation: 'Questions that reveal inner wisdom'
            }
          ],
          action: 'framing-exploration'
        },
        {
          instruction: 'Which framing feels most alive to you? Why?',
          action: 'framing-reflection'
        }
      ]
    };
  }

  /**
   * Somatic Awareness Micro-Experiment
   * Builds body awareness in digital interaction
   */
  createSomaticAwarenessExperiment() {
    return {
      id: 'somatic-awareness',
      title: 'Digital Embodiment',
      description: 'Notice your body while engaging with technology.',
      duration: '2 minutes',
      steps: [
        {
          instruction: 'Right now, without changing anything, notice:',
          awareness: [
            'Are your shoulders tense or relaxed?',
            'Is your breathing shallow or deep?',
            'How are you sitting or standing?',
            'Where do you feel aliveness in your body?'
          ],
          action: 'body-scan'
        },
        {
          instruction: 'Make one small adjustment to feel more embodied and present:',
          suggestions: [
            'Soften your shoulders',
            'Take three deeper breaths', 
            'Adjust your posture',
            'Feel your feet on the ground'
          ],
          action: 'embodiment-adjustment'
        },
        {
          instruction: 'From this more embodied state, what do you notice about this onboarding experience?',
          action: 'embodied-reflection'
        }
      ]
    };
  }

  /**
   * Curiosity Cultivation Micro-Experiment
   * Distinguishes genuine from performative inquiry
   */
  createCuriosityExperiment() {
    return {
      id: 'curiosity-cultivation',
      title: 'Authentic Curiosity',
      description: 'Feel the difference between genuine and performative questions.',
      duration: '2 minutes',
      steps: [
        {
          instruction: 'Consider these two questions. Which one feels more alive in you?',
          questions: [
            {
              text: 'What are the best productivity tips for creative work?',
              type: 'performative',
              note: 'Seeking information you think you should want'
            },
            {
              text: 'What is trying to emerge through my creative process right now?',
              type: 'genuine',
              note: 'Following authentic curiosity and felt sense'
            }
          ],
          action: 'question-comparison'
        },
        {
          instruction: 'Notice the felt sense difference:',
          contrasts: [
            'Alive vs. dutiful',
            'Emergent vs. predetermined',
            'Personal vs. generic',
            'Exciting vs. obligatory'
          ],
          action: 'felt-sense-exploration'
        },
        {
          instruction: 'What question is genuinely alive for you right now?',
          action: 'authentic-question-discovery'
        }
      ]
    };
  }

  /**
   * Render a micro-experiment in the DOM
   */
  renderExperiment(experimentId, containerId) {
    const experiments = {
      'attention-quality': this.createAttentionExperiment(),
      'state-preparation': this.createStatePreparationExperiment(),
      'relational-framing': this.createRelationalFramingExperiment(),
      'somatic-awareness': this.createSomaticAwarenessExperiment(),
      'curiosity-cultivation': this.createCuriosityExperiment()
    };

    const experiment = experiments[experimentId];
    if (!experiment) return;

    const container = document.getElementById(containerId);
    if (!container) return;

    this.activeExperiment = experiment;
    this.experimentData[experimentId] = { started: Date.now(), responses: {} };

    container.innerHTML = this.createExperimentHTML(experiment);
    this.bindExperimentEvents(experiment, container);
  }

  createExperimentHTML(experiment) {
    return `
      <div class="micro-experiment" data-experiment="${experiment.id}">
        <div class="experiment-header">
          <h4>${experiment.title}</h4>
          <p class="experiment-description">${experiment.description}</p>
          <div class="experiment-duration">Duration: ${experiment.duration}</div>
        </div>
        
        <div class="experiment-steps">
          ${experiment.steps.map((step, index) => this.createStepHTML(step, index)).join('')}
        </div>
        
        <div class="experiment-completion hidden">
          <p class="completion-message">Micro-experiment complete! Notice what you discovered about your own awareness and presence.</p>
          <button class="experiment-integrate-btn">Integrate & Continue</button>
        </div>
      </div>
    `;
  }

  createStepHTML(step, index) {
    let stepContent = `
      <div class="experiment-step" data-step="${index}">
        <div class="step-instruction">${step.instruction}</div>
    `;

    // Different step types
    if (step.action === 'read-scattered' || step.action === 'read-present') {
      stepContent += `
        <div class="reading-content ${step.action}">
          "${step.content}"
        </div>
        <button class="step-complete-btn" data-step="${index}">I've read this</button>
      `;
    } else if (step.action === 'question-entry') {
      stepContent += `
        <textarea class="experiment-input" placeholder="${step.placeholder}" data-field="question"></textarea>
        <button class="step-complete-btn" data-step="${index}" disabled>Continue</button>
      `;
    } else if (step.action === 'response-scattered' || step.action === 'response-present') {
      stepContent += `
        <textarea class="experiment-input" placeholder="${step.placeholder}" data-field="${step.action}"></textarea>
        <button class="step-complete-btn" data-step="${index}" disabled>Continue</button>
      `;
    } else if (step.action === 'breathing-timer') {
      stepContent += `
        <div class="breathing-timer">
          <div class="timer-circle">
            <div class="timer-progress"></div>
            <div class="timer-text">30</div>
          </div>
          <button class="start-timer-btn" data-duration="${step.duration}">Begin Breathing</button>
        </div>
      `;
    } else if (step.reflection) {
      stepContent += `
        <ul class="reflection-points">
          ${step.reflection.map(point => `<li>${point}</li>`).join('')}
        </ul>
        <button class="step-complete-btn" data-step="${index}">I notice these differences</button>
      `;
    } else if (step.framings) {
      stepContent += `
        <div class="framing-options">
          ${step.framings.map((framing, i) => `
            <div class="framing-card" data-framing="${i}">
              <h5>${framing.title}</h5>
              <p class="framing-mindset">${framing.mindset}</p>
              <p class="framing-expectation"><em>${framing.expectation}</em></p>
            </div>
          `).join('')}
        </div>
        <button class="step-complete-btn" data-step="${index}">Continue</button>
      `;
    } else if (step.awareness) {
      stepContent += `
        <ul class="awareness-checklist">
          ${step.awareness.map(item => `
            <li class="awareness-item">
              <span class="awareness-text">${item}</span>
              <button class="awareness-noticed" data-item="${item}">Noticed</button>
            </li>
          `).join('')}
        </ul>
      `;
    } else if (step.suggestions) {
      stepContent += `
        <div class="adjustment-suggestions">
          ${step.suggestions.map(suggestion => `
            <button class="adjustment-btn" data-adjustment="${suggestion}">${suggestion}</button>
          `).join('')}
        </div>
        <button class="step-complete-btn" data-step="${index}">I've made an adjustment</button>
      `;
    } else if (step.questions) {
      stepContent += `
        <div class="question-comparison">
          ${step.questions.map((q, i) => `
            <div class="question-card" data-question="${i}">
              <div class="question-text">"${q.text}"</div>
              <div class="question-note">${q.note}</div>
              <button class="question-select" data-type="${q.type}">This feels more alive</button>
            </div>
          `).join('')}
        </div>
      `;
    } else if (step.contrasts) {
      stepContent += `
        <div class="contrast-pairs">
          ${step.contrasts.map(contrast => `
            <div class="contrast-pair">${contrast}</div>
          `).join('')}
        </div>
        <button class="step-complete-btn" data-step="${index}">I notice these differences</button>
      `;
    } else {
      stepContent += `
        <textarea class="experiment-input" placeholder="Your reflection..."></textarea>
        <button class="step-complete-btn" data-step="${index}" disabled>Continue</button>
      `;
    }

    stepContent += '</div>';
    return stepContent;
  }

  bindExperimentEvents(experiment, container) {
    // Step completion buttons
    container.querySelectorAll('.step-complete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const stepIndex = parseInt(e.target.dataset.step);
        this.completeStep(experiment, stepIndex, container);
      });
    });

    // Input field validation
    container.querySelectorAll('.experiment-input').forEach(input => {
      input.addEventListener('input', (e) => {
        const btn = e.target.parentElement.querySelector('.step-complete-btn');
        if (btn) {
          btn.disabled = e.target.value.trim().length < 10;
        }
      });
    });

    // Breathing timer
    container.querySelectorAll('.start-timer-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const duration = parseInt(e.target.dataset.duration);
        this.startBreathingTimer(e.target.parentElement, duration);
      });
    });

    // Awareness notifications
    container.querySelectorAll('.awareness-noticed').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.target.classList.add('noticed');
        e.target.textContent = '✓';
        
        // Check if all noticed
        const allButtons = container.querySelectorAll('.awareness-noticed');
        const noticedButtons = container.querySelectorAll('.awareness-noticed.noticed');
        if (allButtons.length === noticedButtons.length) {
          this.showContinueButton(container, 'All awareness points noticed');
        }
      });
    });

    // Adjustment buttons
    container.querySelectorAll('.adjustment-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.target.classList.add('selected');
        const stepBtn = container.querySelector('.step-complete-btn');
        if (stepBtn) stepBtn.disabled = false;
      });
    });

    // Question selection
    container.querySelectorAll('.question-select').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = e.target.dataset.type;
        this.recordResponse(experiment.id, 'questionType', type);
        this.showContinueButton(container, `You selected the ${type} question`);
      });
    });

    // Framing cards
    container.querySelectorAll('.framing-card').forEach(card => {
      card.addEventListener('click', (e) => {
        container.querySelectorAll('.framing-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const btn = container.querySelector('.step-complete-btn');
        if (btn) btn.disabled = false;
      });
    });

    // Integration button
    container.querySelector('.experiment-integrate-btn')?.addEventListener('click', () => {
      this.integrateExperiment(experiment);
      container.classList.add('integrated');
    });
  }

  completeStep(experiment, stepIndex, container) {
    const step = container.querySelector(`[data-step="${stepIndex}"]`);
    step.classList.add('completed');
    
    // Show next step or completion
    const nextStep = container.querySelector(`[data-step="${stepIndex + 1}"]`);
    if (nextStep) {
      nextStep.classList.add('active');
      nextStep.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      this.completeExperiment(experiment, container);
    }
  }

  startBreathingTimer(timerContainer, duration) {
    const progressEl = timerContainer.querySelector('.timer-progress');
    const textEl = timerContainer.querySelector('.timer-text');
    const btnEl = timerContainer.querySelector('.start-timer-btn');
    
    btnEl.style.display = 'none';
    
    let timeLeft = duration;
    textEl.textContent = timeLeft;
    
    const interval = setInterval(() => {
      timeLeft--;
      textEl.textContent = timeLeft;
      
      const progress = ((duration - timeLeft) / duration) * 100;
      progressEl.style.width = `${progress}%`;
      
      if (timeLeft <= 0) {
        clearInterval(interval);
        textEl.textContent = '✓';
        progressEl.style.width = '100%';
        this.showContinueButton(timerContainer.parentElement, 'Breathing complete');
      }
    }, 1000);
  }

  showContinueButton(container, message) {
    const existingBtn = container.querySelector('.dynamic-continue-btn');
    if (existingBtn) return;
    
    const btn = document.createElement('button');
    btn.className = 'step-complete-btn dynamic-continue-btn';
    btn.textContent = 'Continue';
    btn.addEventListener('click', () => {
      const stepIndex = Array.from(container.parentElement.children).indexOf(container);
      this.completeStep(this.activeExperiment, stepIndex, container.closest('.micro-experiment'));
    });
    
    container.appendChild(btn);
  }

  completeExperiment(experiment, container) {
    const completion = container.querySelector('.experiment-completion');
    completion.classList.remove('hidden');
    completion.scrollIntoView({ behavior: 'smooth' });
    
    this.completedExperiments.add(experiment.id);
    this.recordCompletion(experiment);
  }

  integrateExperiment(experiment) {
    // Mark as integrated and enable further onboarding progression
    this.experimentData[experiment.id].completed = Date.now();
    this.experimentData[experiment.id].integrated = true;
    
    // Trigger onboarding flow continuation if needed
    if (typeof onboardingFlow !== 'undefined') {
      onboardingFlow.experimentCompleted(experiment.id);
    }
  }

  recordResponse(experimentId, field, value) {
    if (!this.experimentData[experimentId]) {
      this.experimentData[experimentId] = { responses: {} };
    }
    this.experimentData[experimentId].responses[field] = value;
  }

  recordCompletion(experiment) {
    this.experimentData[experiment.id].completed = Date.now();
    
    // Save to localStorage
    const existingData = JSON.parse(localStorage.getItem('ecpMicroExperiments') || '{}');
    existingData[experiment.id] = this.experimentData[experiment.id];
    localStorage.setItem('ecpMicroExperiments', JSON.stringify(existingData));
  }

  getCompletedExperiments() {
    return Array.from(this.completedExperiments);
  }

  getExperimentData(experimentId) {
    return this.experimentData[experimentId] || null;
  }
}

// Add CSS for micro-experiments
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    .micro-experiment {
      background: rgba(255, 255, 255, 0.9);
      border-radius: 12px;
      padding: 2rem;
      margin: 2rem 0;
      border: 2px solid var(--accent-color);
    }
    
    .experiment-header h4 {
      font-family: var(--font-title);
      color: var(--accent-color);
      margin-bottom: 0.5rem;
    }
    
    .experiment-description {
      font-style: italic;
      margin-bottom: 1rem;
    }
    
    .experiment-duration {
      font-size: 0.9rem;
      color: var(--green-soft);
      font-weight: 500;
    }
    
    .experiment-step {
      margin: 2rem 0;
      padding: 1.5rem;
      background: rgba(245, 240, 235, 0.5);
      border-radius: 8px;
      opacity: 0.6;
      transition: all 0.3s ease;
    }
    
    .experiment-step:first-child,
    .experiment-step.active {
      opacity: 1;
    }
    
    .experiment-step.completed {
      background: rgba(125, 162, 109, 0.1);
      border-left: 4px solid var(--green-soft);
    }
    
    .step-instruction {
      font-weight: 500;
      margin-bottom: 1rem;
      color: var(--text-color);
    }
    
    .reading-content {
      font-style: italic;
      font-size: 1.1rem;
      padding: 1.5rem;
      background: white;
      border-radius: 8px;
      margin: 1rem 0;
      border-left: 4px solid var(--accent-color);
    }
    
    .experiment-input {
      width: 100%;
      min-height: 80px;
      padding: 1rem;
      border-radius: 8px;
      border: 2px solid #e0e0e0;
      font-family: var(--font-body);
      margin: 1rem 0;
      transition: border-color 0.3s ease;
    }
    
    .experiment-input:focus {
      border-color: var(--accent-color);
      outline: none;
    }
    
    .step-complete-btn, .dynamic-continue-btn {
      background: var(--green-soft);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: 1rem;
    }
    
    .step-complete-btn:hover:not(:disabled) {
      background: var(--accent-color);
      transform: translateY(-2px);
    }
    
    .step-complete-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    
    .breathing-timer {
      text-align: center;
      margin: 2rem 0;
    }
    
    .timer-circle {
      width: 100px;
      height: 100px;
      border: 4px solid var(--accent-color);
      border-radius: 50%;
      margin: 0 auto 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      background: white;
    }
    
    .timer-progress {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background: linear-gradient(90deg, var(--accent-color), var(--green-soft));
      border-radius: 50px;
      width: 0%;
      transition: width 1s linear;
    }
    
    .timer-text {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--accent-color);
      z-index: 10;
    }
    
    .start-timer-btn {
      background: var(--accent-color);
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 25px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .framing-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin: 1rem 0;
    }
    
    .framing-card {
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .framing-card:hover {
      border-color: var(--accent-color);
      transform: translateY(-2px);
    }
    
    .framing-card.selected {
      border-color: var(--green-soft);
      background: rgba(125, 162, 109, 0.1);
    }
    
    .framing-card h5 {
      font-family: var(--font-title);
      color: var(--accent-color);
      margin-bottom: 0.5rem;
    }
    
    .awareness-checklist {
      list-style: none;
      padding: 0;
    }
    
    .awareness-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .awareness-noticed {
      background: var(--accent-color);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 15px;
      cursor: pointer;
      font-size: 0.9rem;
    }
    
    .awareness-noticed.noticed {
      background: var(--green-soft);
    }
    
    .adjustment-suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin: 1rem 0;
    }
    
    .adjustment-btn {
      background: white;
      border: 2px solid var(--accent-color);
      color: var(--accent-color);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .adjustment-btn:hover,
    .adjustment-btn.selected {
      background: var(--accent-color);
      color: white;
    }
    
    .question-comparison {
      display: grid;
      gap: 1rem;
      margin: 1rem 0;
    }
    
    .question-card {
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
      transition: all 0.3s ease;
    }
    
    .question-text {
      font-size: 1.1rem;
      margin-bottom: 1rem;
      font-weight: 500;
    }
    
    .question-note {
      font-size: 0.9rem;
      font-style: italic;
      color: rgba(58, 58, 58, 0.7);
      margin-bottom: 1rem;
    }
    
    .question-select {
      background: var(--accent-color);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 15px;
      cursor: pointer;
    }
    
    .contrast-pairs {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 0.5rem;
      margin: 1rem 0;
    }
    
    .contrast-pair {
      background: var(--highlight-color);
      padding: 0.75rem;
      border-radius: 8px;
      text-align: center;
      font-weight: 500;
    }
    
    .experiment-completion {
      background: rgba(125, 162, 109, 0.1);
      border: 2px solid var(--green-soft);
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
      margin-top: 2rem;
    }
    
    .completion-message {
      font-style: italic;
      margin-bottom: 1.5rem;
      color: var(--text-color);
    }
    
    .experiment-integrate-btn {
      background: var(--green-soft);
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 25px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    
    .experiment-integrate-btn:hover {
      background: var(--accent-color);
      transform: translateY(-2px);
    }
    
    .micro-experiment.integrated {
      opacity: 0.8;
      transform: scale(0.98);
    }
  `;
  
  document.head.appendChild(style);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MicroExperiments;
}

// Make available globally
window.MicroExperiments = MicroExperiments;