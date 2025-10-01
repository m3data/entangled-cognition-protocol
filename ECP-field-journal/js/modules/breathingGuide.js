/**
 * Breathing Guide Module for ECP Onboarding
 * Creates a somatic entry point into the sacred practice
 */

class BreathingGuide {
  constructor(container, onComplete) {
    this.container = container;
    this.onComplete = onComplete;
    this.isActive = false;
    this.currentCycle = 0;
    this.targetCycles = 3;
    this.breathPhases = ['inhale', 'hold', 'exhale', 'rest'];
    this.currentPhase = 0;
    this.phaseTimer = null;
    
    // Timing in seconds for each breath phase
    this.phaseDurations = {
      inhale: 8,
      hold: 5,
      exhale: 11,
      rest: 0  // No rest phase for continuous breathing
    };
    
    this.phaseInstructions = {
      inhale: 'Breathe in slowly...',
      hold: 'Hold gently...',
      exhale: 'Release completely...',
      rest: ''
    };

    this.init();
  }

  init() {
    this.setupUI();
    this.bindEvents();
  }

  setupUI() {
    // Find or create breathing guide elements
    let guide = document.getElementById('breathGuide');
    if (!guide) {
      guide = document.createElement('div');
      guide.id = 'breathGuide';
      guide.className = 'breath-guide hidden';
      this.container.appendChild(guide);
    }

    guide.innerHTML = `
      <div class="breathing-circle-container">
        <svg class="breathing-circle" viewBox="0 0 200 200">
          <circle class="breathing-circle-bg" cx="100" cy="100" r="90" />
          <circle class="breathing-circle-progress" cx="100" cy="100" r="90" />
        </svg>
        <div class="breathing-circle-inner">
          <div class="breath-phase-text" id="breathPhaseText">Ready</div>
          <div class="breath-timer" id="breathTimer"></div>
        </div>
      </div>
      <div class="breath-instruction" id="breathInstruction">Ready to begin...</div>
      <div class="breath-cycle-counter" id="breathCycleCounter">
        Cycle <span id="currentCycleNum">0</span> of <span id="totalCycles">${this.targetCycles}</span>
      </div>
      <button class="breath-pause-btn" id="breathPauseBtn" style="display: none;">Pause</button>
    `;

    this.instructionEl = document.getElementById('breathInstruction');
    this.phaseTextEl = document.getElementById('breathPhaseText');
    this.timerEl = document.getElementById('breathTimer');
    this.circleProgressEl = document.querySelector('.breathing-circle-progress');
    this.cycleCounterEl = document.getElementById('breathCycleCounter');
    this.currentCycleEl = document.getElementById('currentCycleNum');
    this.pauseBtn = document.getElementById('breathPauseBtn');
  }

  bindEvents() {
    const startBtn = document.getElementById('startBreathGuide');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.startBreathing();
      });
    }

    if (this.pauseBtn) {
      this.pauseBtn.addEventListener('click', () => {
        this.togglePause();
      });
    }

    // Listen for spacebar to pause/resume
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && this.isActive) {
        e.preventDefault();
        this.togglePause();
      }
    });
  }

  startBreathing() {
    const guide = document.getElementById('breathGuide');
    const startBtn = document.getElementById('startBreathGuide');
    
    if (guide) {
      guide.classList.remove('hidden');
      guide.classList.add('fade-in');
    }
    
    if (startBtn) {
      startBtn.style.display = 'none';
    }

    this.isActive = true;
    this.currentCycle = 1;
    this.currentPhase = 0;
    this.updateCycleDisplay();
    this.startPhase();
    
    if (this.pauseBtn) {
      this.pauseBtn.style.display = 'inline-block';
    }
  }

  startPhase() {
    if (!this.isActive) return;

    const phase = this.breathPhases[this.currentPhase];
    const duration = this.phaseDurations[phase];
    
    // Skip rest phase if duration is 0
    if (duration === 0) {
      this.nextPhase();
      return;
    }
    
    const durationMs = duration * 1000; // Convert to milliseconds
    
    this.instructionEl.textContent = this.phaseInstructions[phase];
    this.phaseTextEl.textContent = phase.charAt(0).toUpperCase() + phase.slice(1);
    
    // Animate the circle and timer
    this.animateCircle(phase, duration);
    this.startTimer(duration);
    
    this.phaseTimer = setTimeout(() => {
      this.nextPhase();
    }, durationMs);
  }

  nextPhase() {
    this.currentPhase++;
    
    if (this.currentPhase >= this.breathPhases.length) {
      // Complete current cycle
      this.currentPhase = 0;
      this.currentCycle++;
      this.updateCycleDisplay();
      
      if (this.currentCycle > this.targetCycles) {
        this.completeBreathing();
        return;
      }
    }
    
    this.startPhase();
  }

  animateCircle(phase, duration) {
    if (!this.circleProgressEl) return;
    
    const circle = this.circleProgressEl;
    const circumference = 2 * Math.PI * 90; // radius is 90
    
    // Reset circle
    circle.style.transition = 'none';
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;
    
    // Force reflow
    circle.getBoundingClientRect();
    
    // Animate circle fill
    circle.style.transition = `stroke-dashoffset ${duration}s linear`;
    circle.style.strokeDashoffset = '0';
    
    // Update circle size based on phase
    const container = document.querySelector('.breathing-circle-container');
    if (container) {
      container.classList.remove('inhale', 'hold', 'exhale');
      container.classList.add(phase);
    }
  }
  
  startTimer(duration) {
    if (!this.timerEl) return;
    
    let timeRemaining = duration;
    this.timerEl.textContent = timeRemaining;
    
    // Clear any existing timer interval
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    
    this.timerInterval = setInterval(() => {
      timeRemaining--;
      if (timeRemaining >= 0) {
        this.timerEl.textContent = timeRemaining;
      } else {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  // Removed updateBreathCircle - functionality moved to animateCircle

  updateCycleDisplay() {
    if (this.currentCycleEl) {
      this.currentCycleEl.textContent = Math.min(this.currentCycle, this.targetCycles);
    }
  }

  togglePause() {
    if (!this.isActive) return;
    
    if (this.phaseTimer) {
      // Currently running - pause
      clearTimeout(this.phaseTimer);
      clearInterval(this.timerInterval);
      this.phaseTimer = null;
      this.instructionEl.textContent = 'Paused - press space or click to resume';
      this.pauseBtn.textContent = 'Resume';
      
      // Stop circle animation
      if (this.circleProgressEl) {
        this.circleProgressEl.style.transition = 'none';
      }
    } else {
      // Currently paused - resume
      this.pauseBtn.textContent = 'Pause';
      this.startPhase();
    }
  }

  completeBreathing() {
    this.isActive = false;
    clearTimeout(this.phaseTimer);
    clearInterval(this.timerInterval);
    
    this.instructionEl.textContent = 'Breathing complete. Notice how you feel.';
    this.phaseTextEl.textContent = 'Complete';
    this.timerEl.textContent = '';
    
    if (this.pauseBtn) {
      this.pauseBtn.style.display = 'none';
    }
    
    // Add completion animation
    const guide = document.getElementById('breathGuide');
    if (guide) {
      guide.classList.add('breath-complete');
    }
    
    // Show completion message after a moment
    setTimeout(() => {
      this.instructionEl.innerHTML = `
        <span class="completion-message">
          Beautiful. You are now present and ready to continue your journey.
        </span>
      `;
      
      // Enable continue button
      if (this.onComplete) {
        this.onComplete(true);
      }
      
      // Auto-fade after a few seconds
      setTimeout(() => {
        if (guide) {
          guide.classList.add('fade-out');
        }
      }, 3000);
    }, 1500);
  }

  reset() {
    this.isActive = false;
    this.currentCycle = 0;
    this.currentPhase = 0;
    clearTimeout(this.phaseTimer);
    
    const guide = document.getElementById('breathGuide');
    if (guide) {
      guide.classList.add('hidden');
      guide.classList.remove('fade-in', 'breath-complete', 'fade-out');
    }
    
    const startBtn = document.getElementById('startBreathGuide');
    if (startBtn) {
      startBtn.style.display = 'inline-block';
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BreathingGuide;
}

// Make available globally for onboarding flow
window.BreathingGuide = BreathingGuide;

// Add CSS for breathing guide phases if not already present
document.addEventListener('DOMContentLoaded', () => {
  const existingStyle = document.getElementById('breathing-guide-styles');
  if (existingStyle) return;
  
  const style = document.createElement('style');
  style.id = 'breathing-guide-styles';
  style.textContent = `
    .breath-pulse {
      transform: scale(var(--breath-scale, 1));
      opacity: var(--breath-opacity, 0.7);
      transition: transform 0.3s ease, opacity 0.3s ease;
    }
    
    /* Breathing Circle Styles */
    .breathing-circle-container {
      width: 160px;
      height: 160px;
      margin: 1rem auto;
      position: relative;
      transition: transform 0.5s ease;
    }
    
    .breathing-circle-container.inhale {
      transform: scale(1.2);
      transition: transform 8s ease-in-out;
    }
    
    .breathing-circle-container.hold {
      transform: scale(1.2);
      transition: transform 0.5s ease;
    }
    
    .breathing-circle-container.exhale {
      transform: scale(0.9);
      transition: transform 11s ease-in-out;
    }
    
    .breathing-circle {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }
    
    .breathing-circle-bg {
      fill: none;
      stroke: rgba(125, 162, 109, 0.1);
      stroke-width: 8;
    }
    
    .breathing-circle-progress {
      fill: none;
      stroke: var(--green-soft);
      stroke-width: 8;
      stroke-linecap: round;
    }
    
    .breathing-circle-inner {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }
    
    .breath-phase-text {
      font-size: 1.2rem;
      font-weight: 500;
      color: var(--green-soft);
      margin-bottom: 0.3rem;
    }
    
    .breath-timer {
      font-size: 1.6rem;
      font-weight: 300;
      color: var(--text-color);
    }
    
    .breath-cycle-counter {
      font-size: 0.9rem;
      color: var(--accent-color);
      margin: 0.5rem 0;
      text-align: center;
    }
    
    .breath-pause-btn {
      background: none !important;
      border: 2px solid var(--accent-color) !important;
      color: var(--accent-color) !important;
      padding: 0.4rem 0.8rem !important;
      border-radius: 15px !important;
      font-size: 0.8rem !important;
      margin: 0.5rem 0 !important;
      cursor: pointer !important;
      transition: all 0.3s ease !important;
    }
    
    .breath-pause-btn:hover {
      background: var(--accent-color) !important;
      color: white !important;
    }
    
    .breath-guide.breath-complete {
      background: linear-gradient(135deg, rgba(125, 162, 109, 0.1), rgba(125, 162, 109, 0.2));
      border-radius: 12px;
      padding: 1rem;
    }
    
    .completion-message {
      color: var(--green-soft);
      font-weight: 500;
      font-style: italic;
    }
    
    .breath-guide.fade-out {
      opacity: 0;
      transition: opacity 1s ease;
    }
  `;
  
  document.head.appendChild(style);
});