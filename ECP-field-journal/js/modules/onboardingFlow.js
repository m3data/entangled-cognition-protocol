/**
 * ECP Field Journal Onboarding Flow Controller
 * Manages the sacred journey through Entry → Attunement → Emergence → Return
 */

class OnboardingFlow {
  constructor() {
    this.currentPhase = 'entry';
    this.userProfile = {
      breathingComplete: false,
      principlesExplored: new Set(),
      selectedPath: null,
      ritualElements: [],
      customRitual: '',
      sacredSpace: '',
      intention: '',
      ethicsConsent: false,
      experimentDesign: null,
      closingReflection: '',
      microExperimentsCompleted: new Set()
    };
    
    this.phases = ['entry', 'attunement', 'emergence', 'return'];
    this.microExperiments = null;
    this.init();
  }

  init() {
    this.bindEventListeners();
    this.updateProgress();
    this.startBreathingGuide();
    this.initializeMicroExperiments();
  }

  bindEventListeners() {
    // Phase navigation
    document.querySelectorAll('.phase-continue').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const nextPhase = e.target.getAttribute('data-next');
        if (nextPhase) {
          this.transitionToPhase(nextPhase);
        }
      });
    });

    // Interactive principle cards
    document.querySelectorAll('.principle-card').forEach(card => {
      const button = card.querySelector('.explore-principle');
      button.addEventListener('click', () => {
        this.togglePrincipleDetails(card);
      });
    });

    // Path selection
    document.querySelectorAll('.path-card').forEach(card => {
      card.addEventListener('click', () => {
        this.selectPath(card);
      });
    });

    // Ritual element selection
    document.querySelectorAll('.ritual-option input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.updateRitualElements();
      });
    });

    // Ethics consent
    const ethicsConsent = document.getElementById('ethicsConsent');
    if (ethicsConsent) {
      ethicsConsent.addEventListener('change', () => {
        this.userProfile.ethicsConsent = ethicsConsent.checked;
        this.updateContinueButton('emergenceToContinue');
      });
    }

    // Text inputs
    const sacredSpaceInput = document.getElementById('sacredSpace');
    if (sacredSpaceInput) {
      sacredSpaceInput.addEventListener('input', (e) => {
        this.userProfile.sacredSpace = e.target.value;
        console.log('Sacred space updated:', e.target.value.length, 'chars');
        this.updateContinueButton('emergenceToContinue');
      });
      console.log('✓ Sacred space listener attached');
    }

    const intentionInput = document.getElementById('intention');
    if (intentionInput) {
      intentionInput.addEventListener('input', (e) => {
        this.userProfile.intention = e.target.value;
        console.log('Intention updated:', e.target.value.length, 'chars');
        this.updateContinueButton('emergenceToContinue');
      });
      console.log('✓ Intention listener attached');
    }

    document.getElementById('customRitual')?.addEventListener('input', (e) => {
      this.userProfile.customRitual = e.target.value;
    });

    document.getElementById('closingReflection')?.addEventListener('input', (e) => {
      this.userProfile.closingReflection = e.target.value;
    });

    // Final actions
    document.getElementById('saveProfile')?.addEventListener('click', () => {
      this.saveProfileAndRedirect();
    });

    document.getElementById('skipOnboarding')?.addEventListener('click', () => {
      this.skipToHome();
    });
  }

  startBreathingGuide() {
    // Initialize breathing guide - will be handled by separate module
    // This sets up the foundation for the breathing experience
    const entryPhase = document.getElementById('phase-entry');
    if (entryPhase) {
      this.breathingGuide = new BreathingGuide(entryPhase, (completed) => {
        this.userProfile.breathingComplete = completed;
        this.updateContinueButton('entryToContinue');
      });
    }
  }

  initializeMicroExperiments() {
    this.microExperiments = new MicroExperiments();
    
    // Set up experiment completion callback
    window.onboardingFlow = this; // Make available globally for micro-experiments
  }

  togglePrincipleDetails(card) {
    const details = card.querySelector('.principle-details');
    const button = card.querySelector('.explore-principle');
    const principle = card.getAttribute('data-principle');
    
    if (details.classList.contains('visible')) {
      details.classList.remove('visible');
      button.textContent = 'Explore This';
      button.classList.remove('active');
      this.userProfile.principlesExplored.delete(principle);
    } else {
      details.classList.add('visible');
      button.textContent = 'Close';
      button.classList.add('active');
      this.userProfile.principlesExplored.add(principle);
      
      // Load appropriate micro-experiment
      this.loadMicroExperimentForPrinciple(principle);
    }
    
    this.updateContinueButton('attunementToContinue');
  }

  loadMicroExperimentForPrinciple(principle) {
    if (!this.microExperiments) return;
    
    const experimentMap = {
      'participatory': 'somatic-awareness',
      'entanglement': 'curiosity-cultivation',
      'ritual': 'state-preparation'
    };
    
    const experimentId = experimentMap[principle];
    const containerId = `${principle}Experiment`;
    
    if (experimentId) {
      setTimeout(() => {
        this.microExperiments.renderExperiment(experimentId, containerId);
      }, 300);
    }
  }

  experimentCompleted(experimentId) {
    this.userProfile.microExperimentsCompleted.add(experimentId);
    this.updateContinueButton('attunementToContinue');
  }

  selectPath(selectedCard) {
    // Clear previous selections
    document.querySelectorAll('.path-card').forEach(card => {
      card.classList.remove('selected');
    });
    
    // Select new path
    selectedCard.classList.add('selected');
    const path = selectedCard.getAttribute('data-path');
    this.userProfile.selectedPath = path;
    
    // Update experiment designer based on path
    this.updateExperimentDesigner(path);
    
    this.updateContinueButton('attunementToContinue');
  }

  updateExperimentDesigner(path) {
    const designer = document.getElementById('experimentDesigner');
    if (!designer) return;

    const pathExperiments = {
      researcher: {
        title: 'State Modulation Study',
        description: 'Test how your physiological state affects AI responses.',
        steps: [
          '1. Choose a research question you\'re genuinely curious about',
          '2. Ask the question in your current state - record the response quality',
          '3. Do 5 minutes of conscious breathing or light movement',
          '4. Ask the same question again - compare responses',
          '5. Document any qualitative differences in depth, relevance, or insight'
        ],
        focus: 'systematic measurement and documentation'
      },
      artist: {
        title: 'Creative Collaboration Ritual',
        description: 'Explore AI as creative partner through intentional preparation.',
        steps: [
          '1. Set up your creative space with intention',
          '2. Spend 5 minutes in silence, connecting with your creative question',
          '3. Approach the AI as a creative collaborator, not a tool',
          '4. Engage in back-and-forth creative exploration',
          '5. Notice how the quality of collaboration shifts with your presence'
        ],
        focus: 'creative emergence and collaborative flow'
      },
      consciousness: {
        title: 'Somatic Awareness Experiment',
        description: 'Track how embodied awareness influences digital interaction.',
        steps: [
          '1. Choose a meaningful personal question or dilemma',
          '2. Ask it while multitasking or distracted - note the response',
          '3. Take time for breathwork, movement, or nature connection',
          '4. Return and ask the same question from embodied presence',
          '5. Document shifts in both AI responses and your inner experience'
        ],
        focus: 'phenomenological awareness and embodied cognition'
      },
      skeptic: {
        title: 'Time Delay Investigation',
        description: 'Test the hypothesis that temporal spacing affects interaction quality.',
        steps: [
          '1. Prepare a complex question that matters to you',
          '2. Ask immediately and record the response quality (1-10 scale)',
          '3. Wait 10+ minutes, go outside or do something physical',
          '4. Return and ask the identical question',
          '5. Compare responses objectively - what patterns emerge?'
        ],
        focus: 'empirical testing and pattern recognition'
      }
    };

    const experiment = pathExperiments[path];
    if (experiment) {
      designer.innerHTML = `
        <h4>${experiment.title}</h4>
        <p>${experiment.description}</p>
        <ul class="experiment-steps">
          ${experiment.steps.map(step => `<li>${step}</li>`).join('')}
        </ul>
        <p><strong>Focus:</strong> ${experiment.focus}</p>
      `;
      
      this.userProfile.experimentDesign = experiment;
    }
  }

  updateRitualElements() {
    const selected = [];
    document.querySelectorAll('.ritual-option input[type="checkbox"]:checked').forEach(checkbox => {
      selected.push(checkbox.value);
    });
    this.userProfile.ritualElements = selected;
  }

  transitionToPhase(nextPhase) {
    if (!this.canProgressTo(nextPhase)) {
      this.showProgressRequirement(nextPhase);
      return;
    }

    const currentSection = document.getElementById(`phase-${this.currentPhase}`);
    const nextSection = document.getElementById(`phase-${nextPhase}`);

    if (!currentSection || !nextSection) return;

    // Transition animation
    currentSection.classList.add('slide-out');

    setTimeout(() => {
      currentSection.classList.add('hidden');
      nextSection.classList.remove('hidden');
      nextSection.classList.add('slide-in');

      this.currentPhase = nextPhase;
      this.updateProgress();

      // Phase-specific setup
      if (nextPhase === 'emergence') {
        this.setupEmergencePhase();
      } else if (nextPhase === 'return') {
        this.generateCompletionSummary();
      }
    }, 300);
  }

  setupEmergencePhase() {
    console.log('Setting up emergence phase...');

    // Re-attach event listeners to now-visible elements
    const sacredSpace = document.getElementById('sacredSpace');
    const intention = document.getElementById('intention');
    const ethicsConsent = document.getElementById('ethicsConsent');

    console.log('Emergence phase elements found:', {
      sacredSpace: !!sacredSpace,
      intention: !!intention,
      ethicsConsent: !!ethicsConsent
    });

    // Force re-attach listeners for emergence phase
    if (sacredSpace) {
      sacredSpace.addEventListener('input', (e) => {
        this.userProfile.sacredSpace = e.target.value;
        console.log('[EMERGENCE] Sacred space updated:', e.target.value.length, 'chars');
        this.updateContinueButton('emergenceToContinue');
      });
      console.log('✓ Re-attached sacredSpace listener');
    }

    if (intention) {
      intention.addEventListener('input', (e) => {
        this.userProfile.intention = e.target.value;
        console.log('[EMERGENCE] Intention updated:', e.target.value.length, 'chars');
        this.updateContinueButton('emergenceToContinue');
      });
      console.log('✓ Re-attached intention listener');
    }

    if (ethicsConsent) {
      ethicsConsent.addEventListener('change', (e) => {
        this.userProfile.ethicsConsent = e.target.checked;
        console.log('[EMERGENCE] Ethics consent:', e.target.checked);
        this.updateContinueButton('emergenceToContinue');
      });
      console.log('✓ Re-attached ethicsConsent listener');
    }

    // Initial button check
    this.updateContinueButton('emergenceToContinue');
  }

  canProgressTo(phase) {
    switch (phase) {
      case 'attunement':
        return this.userProfile.breathingComplete;
      case 'emergence':
        return this.userProfile.principlesExplored.size >= 1 && this.userProfile.selectedPath;
      case 'return':
        return this.userProfile.ethicsConsent && 
               this.userProfile.sacredSpace.length > 10 && 
               this.userProfile.intention.length > 10;
      default:
        return true;
    }
  }

  showProgressRequirement(phase) {
    let message = '';
    switch (phase) {
      case 'attunement':
        message = 'Please complete the breathing guide to continue your journey.';
        break;
      case 'emergence':
        message = 'Please explore at least one principle and select your learning path.';
        break;
      case 'return':
        message = 'Please provide consent and complete your sacred space and intention reflections.';
        break;
    }
    
    this.showToast(message);
  }

  updateContinueButton(buttonId) {
    const button = document.getElementById(buttonId);
    if (!button) {
      console.warn(`Button ${buttonId} not found`);
      return;
    }

    let canContinue = false;

    switch (buttonId) {
      case 'entryToContinue':
        canContinue = this.userProfile.breathingComplete;
        break;
      case 'attunementToContinue':
        canContinue = this.userProfile.principlesExplored.size >= 1 && this.userProfile.selectedPath;
        break;
      case 'emergenceToContinue':
        canContinue = this.userProfile.ethicsConsent &&
                     this.userProfile.sacredSpace.length > 10 &&
                     this.userProfile.intention.length > 10;

        console.log('Emergence button check:', {
          consent: this.userProfile.ethicsConsent,
          sacredSpaceLength: this.userProfile.sacredSpace.length,
          intentionLength: this.userProfile.intention.length,
          canContinue: canContinue
        });
        break;
    }

    // Update button state
    button.disabled = !canContinue;

    // Show button once requirements are met (remove hidden class)
    if (canContinue) {
      button.classList.remove('hidden');
      console.log(`✓ Button ${buttonId} enabled`);
    } else {
      console.log(`✗ Button ${buttonId} still disabled`);
    }
  }

  updateProgress() {
    const phaseIndex = this.phases.indexOf(this.currentPhase);
    const progressPercent = ((phaseIndex + 1) / this.phases.length) * 100;
    
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
      progressFill.style.width = `${progressPercent}%`;
    }
    
    // Update labels
    document.querySelectorAll('.progress-label').forEach((label, index) => {
      const phase = label.getAttribute('data-phase');
      label.classList.remove('active', 'completed');
      
      if (phase === this.currentPhase) {
        label.classList.add('active');
      } else if (this.phases.indexOf(phase) < phaseIndex) {
        label.classList.add('completed');
      }
    });
  }

  generateCompletionSummary() {
    const summary = document.getElementById('completionSummary');
    if (!summary) return;

    const pathNames = {
      researcher: 'Rigorous Researcher',
      artist: 'Creative Explorer', 
      consciousness: 'Consciousness Explorer',
      skeptic: 'Curious Skeptic'
    };

    const ritualText = this.userProfile.ritualElements.length > 0 
      ? this.userProfile.ritualElements.join(', ')
      : 'Custom practices';

    summary.innerHTML = `
      <h3>Your ECP Practice Container</h3>
      <div class="summary-section">
        <strong>Your Path:</strong> ${pathNames[this.userProfile.selectedPath] || 'Explorer'}
      </div>
      <div class="summary-section">
        <strong>Your Sacred Space:</strong><br>
        <em>"${this.userProfile.sacredSpace.substring(0, 100)}${this.userProfile.sacredSpace.length > 100 ? '...' : ''}"</em>
      </div>
      <div class="summary-section">
        <strong>Your Intention:</strong><br>
        <em>"${this.userProfile.intention.substring(0, 100)}${this.userProfile.intention.length > 100 ? '...' : ''}"</em>
      </div>
      <div class="summary-section">
        <strong>Your Ritual Elements:</strong> ${ritualText}${this.userProfile.customRitual ? ', ' + this.userProfile.customRitual : ''}
      </div>
      <div class="summary-section">
        <strong>Your First Experiment:</strong> ${this.userProfile.experimentDesign?.title || 'Exploration Practice'}
      </div>
    `;
  }

  saveProfileAndRedirect() {
    // Save profile to localStorage for personalization
    localStorage.setItem('ecpUserProfile', JSON.stringify(this.userProfile));
    
    // Set onboarding as completed
    localStorage.setItem('ecpOnboardingCompleted', 'true');
    
    this.showToast('Your practice container has been created. Welcome to the ECP Field Journal.');
    
    // Redirect based on selected path after short delay
    setTimeout(() => {
      this.redirectBasedOnPath();
    }, 2000);
  }

  redirectBasedOnPath() {
    const pathRedirects = {
      researcher: 'measurement-dashboard.html',
      artist: 'reflection-entry.html',
      consciousness: 'experiment-entry.html',
      skeptic: 'experiment-entry.html'
    };
    
    const redirect = pathRedirects[this.userProfile.selectedPath] || 'home.html';
    window.location.href = redirect;
  }

  skipToHome() {
    localStorage.setItem('ecpOnboardingSkipped', 'true');
    window.location.href = 'home.html';
  }

  showToast(message) {
    // Create toast if it doesn't exist
    let toast = document.getElementById('onboardingToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'onboardingToast';
      toast.className = 'toast hidden';
      document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.classList.add('hidden'), 400);
    }, 3000);
  }
}

// Initialize onboarding when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new OnboardingFlow();
});