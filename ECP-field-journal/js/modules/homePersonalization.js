/**
 * Home Personalization Module for ECP Field Journal
 * Personalizes the home experience based on onboarding completion and user profile
 */

class HomePersonalization {
  constructor() {
    this.userProfile = null;
    this.isOnboarded = false;
    this.init();
  }

  init() {
    console.log('[HomePersonalization] Initializing...');
    this.loadUserProfile();
    this.determineUserState();
    this.personalizeInterface();
  }

  loadUserProfile() {
    try {
      const profileData = localStorage.getItem('ecpUserProfile');
      const onboardingCompleted = localStorage.getItem('ecpOnboardingCompleted');

      console.log('[HomePersonalization] Profile data exists:', !!profileData);
      console.log('[HomePersonalization] Onboarding completed:', onboardingCompleted);

      if (profileData) {
        this.userProfile = JSON.parse(profileData);
        console.log('[HomePersonalization] Parsed profile:', this.userProfile);
      }

      this.isOnboarded = onboardingCompleted === 'true';
      console.log('[HomePersonalization] isOnboarded:', this.isOnboarded);
    } catch (error) {
      console.log('No user profile found, showing default interface');
    }
  }

  determineUserState() {
    // Check if user has completed onboarding
    console.log('[HomePersonalization] Determining state - isOnboarded:', this.isOnboarded, 'hasProfile:', !!this.userProfile);

    if (this.isOnboarded && this.userProfile) {
      console.log('[HomePersonalization] Showing personalized welcome');
      this.showPersonalizedWelcome();
    } else {
      console.log('[HomePersonalization] Showing default welcome');
      this.showDefaultWelcome();
    }
  }

  showDefaultWelcome() {
    const newUserWelcome = document.getElementById('newUserWelcome');
    const returningUserWelcome = document.getElementById('returningUserWelcome');
    
    if (newUserWelcome) newUserWelcome.classList.remove('hidden');
    if (returningUserWelcome) returningUserWelcome.classList.add('hidden');
    
    this.enhanceOnboardingInvitation();
  }

  showPersonalizedWelcome() {
    const newUserWelcome = document.getElementById('newUserWelcome');
    const returningUserWelcome = document.getElementById('returningUserWelcome');

    console.log('[HomePersonalization] Elements found:', {
      newUserWelcome: !!newUserWelcome,
      returningUserWelcome: !!returningUserWelcome
    });

    if (newUserWelcome) {
      newUserWelcome.classList.add('hidden');
      newUserWelcome.style.display = 'none'; // Force hide with inline style
      console.log('[HomePersonalization] Hidden newUserWelcome');
    }

    if (returningUserWelcome) {
      returningUserWelcome.classList.remove('hidden');
      returningUserWelcome.style.display = 'block';
      this.populatePersonalizedContent();
      console.log('[HomePersonalization] Showed returningUserWelcome');
    }
  }

  enhanceOnboardingInvitation() {
    // Add subtle animations and improvements to onboarding invitation
    const invitation = document.querySelector('.onboarding-invitation');
    if (invitation) {
      invitation.classList.add('fade-in');
      
      // Add breathing pulse to onboarding button
      const onboardingBtn = document.querySelector('.onboarding-btn');
      if (onboardingBtn) {
        setInterval(() => {
          onboardingBtn.classList.add('pulse');
          setTimeout(() => onboardingBtn.classList.remove('pulse'), 2000);
        }, 8000);
      }
    }
  }

  populatePersonalizedContent() {
    this.createPersonalizedGreeting();
    this.generatePracticeSuggestions();
    this.setSuggestedAction();
  }

  createPersonalizedGreeting() {
    const greetingEl = document.getElementById('personalizedGreeting');
    if (!greetingEl || !this.userProfile) return;

    const pathNames = {
      researcher: 'Rigorous Researcher',
      artist: 'Creative Explorer',
      consciousness: 'Consciousness Explorer',
      skeptic: 'Curious Skeptic'
    };

    const pathName = pathNames[this.userProfile.selectedPath] || 'Explorer';
    
    greetingEl.innerHTML = `
      <div class="personalized-greeting">
        <p class="path-welcome">Welcome back, <strong>${pathName}</strong></p>
        <div class="practice-reminder">
          <p class="sacred-space-reminder">
            <em>Sacred Space:</em> ${this.getTruncatedText(this.userProfile.sacredSpace, 60)}
          </p>
          <div class="ritual-elements">
            <em>Your Ritual Elements:</em> ${this.formatRitualElements()}
          </div>
        </div>
      </div>
    `;
  }

  generatePracticeSuggestions() {
    const suggestionsEl = document.getElementById('practiceSuggestions');
    if (!suggestionsEl || !this.userProfile) return;

    const suggestions = this.getSuggestionsForPath(this.userProfile.selectedPath);
    
    suggestionsEl.innerHTML = `
      <div class="practice-suggestions-content">
        <h3>Suggested for Your Practice</h3>
        <div class="suggestion-cards">
          ${suggestions.map(suggestion => this.createSuggestionCard(suggestion)).join('')}
        </div>
      </div>
    `;
  }

  getSuggestionsForPath(path) {
    const suggestions = {
      researcher: [
        {
          title: 'Continue State Studies',
          description: 'Build on your baseline experiment with variable controls',
          action: 'experiment-entry.html',
          icon: '🔬'
        },
        {
          title: 'Analyze Patterns',
          description: 'Review your experimental data for emerging insights',
          action: 'measurement-dashboard.html',
          icon: '📊'
        },
        {
          title: 'Expand Methodology',
          description: 'Explore advanced measurement frameworks',
          action: 'workflow-templates.html',
          icon: '🧪'
        }
      ],
      artist: [
        {
          title: 'Creative Collaboration',
          description: 'Engage in a new co-creative session with ritual preparation',
          action: 'reflection-entry.html',
          icon: '🎨'
        },
        {
          title: 'Document Process',
          description: 'Reflect on your recent creative emergences',
          action: 'reflection-entry.html',
          icon: '📝'
        },
        {
          title: 'Explore Templates',
          description: 'Discover new creative workflow patterns',
          action: 'workflow-templates.html',
          icon: '🌟'
        }
      ],
      consciousness: [
        {
          title: 'Embodied Inquiry',
          description: 'Deepen your somatic awareness experiments',
          action: 'experiment-entry.html',
          icon: '🧘'
        },
        {
          title: 'Phenomenological Reflection',
          description: 'Document shifts in your awareness and presence',
          action: 'reflection-entry.html',
          icon: '🌸'
        },
        {
          title: 'Pattern Recognition',
          description: 'Track your state-response correlations',
          action: 'measurement-dashboard.html',
          icon: '🔮'
        }
      ],
      skeptic: [
        {
          title: 'Expand Testing',
          description: 'Design new experiments to validate or challenge findings',
          action: 'experiment-entry.html',
          icon: '🤔'
        },
        {
          title: 'Data Analysis',
          description: 'Examine your experimental results critically',
          action: 'measurement-dashboard.html',
          icon: '📈'
        },
        {
          title: 'Systematic Protocols',
          description: 'Explore structured experimental templates',
          action: 'workflow-templates.html',
          icon: '⚗️'
        }
      ]
    };

    return suggestions[path] || suggestions.researcher;
  }

  createSuggestionCard(suggestion) {
    return `
      <div class="suggestion-card" data-action="${suggestion.action}">
        <div class="suggestion-icon">${suggestion.icon}</div>
        <div class="suggestion-content">
          <h4>${suggestion.title}</h4>
          <p>${suggestion.description}</p>
        </div>
      </div>
    `;
  }

  setSuggestedAction() {
    const suggestedActionLink = document.getElementById('suggestedAction');
    const suggestedActionBtn = document.getElementById('suggestedActionBtn');
    
    if (!this.userProfile || !suggestedActionLink || !suggestedActionBtn) return;

    const pathActions = {
      researcher: {
        text: 'Continue Research',
        href: 'experiment-entry.html'
      },
      artist: {
        text: 'Create & Reflect', 
        href: 'reflection-entry.html'
      },
      consciousness: {
        text: 'Deepen Practice',
        href: 'experiment-entry.html'
      },
      skeptic: {
        text: 'Test & Analyze',
        href: 'experiment-entry.html'
      }
    };

    const action = pathActions[this.userProfile.selectedPath] || pathActions.researcher;
    
    suggestedActionLink.href = action.href;
    suggestedActionBtn.textContent = action.text;
  }

  formatRitualElements() {
    if (!this.userProfile.ritualElements || this.userProfile.ritualElements.length === 0) {
      return this.userProfile.customRitual || 'Personal practices';
    }
    
    let elements = this.userProfile.ritualElements.join(', ');
    if (this.userProfile.customRitual) {
      elements += ', ' + this.userProfile.customRitual;
    }
    
    return elements;
  }

  getTruncatedText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  personalizeInterface() {
    // Add suggestion card click handlers
    document.addEventListener('click', (e) => {
      const suggestionCard = e.target.closest('.suggestion-card');
      if (suggestionCard) {
        const action = suggestionCard.getAttribute('data-action');
        if (action) {
          window.location.href = action;
        }
      }
    });

    // Add navigation menu enhancement for personalized users
    if (this.isOnboarded && this.userProfile) {
      this.enhanceNavigationForUser();
    }
  }

  enhanceNavigationForUser() {
    // Add subtle indication that user has completed onboarding
    const siteMenu = document.querySelector('.site-menu');
    if (siteMenu) {
      siteMenu.classList.add('personalized-user');
    }
    
    // Could add user indicator or other enhancements here
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new HomePersonalization();
});

// Add styles for personalized elements
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    .onboarding-invitation {
      background: rgba(255, 255, 255, 0.6);
      border-radius: 12px;
      padding: 2rem;
      margin-top: 2rem;
      backdrop-filter: blur(5px);
      border: 1px dashed var(--accent-color);
    }
    
    .sacred-invitation {
      font-size: 1.1rem;
      font-style: italic;
      margin-bottom: 1.5rem;
      color: var(--text-color);
    }
    
    .primary-cta {
      text-decoration: none;
      display: block;
      margin-bottom: 2rem;
    }
    
    .onboarding-btn {
      background: linear-gradient(45deg, var(--accent-color), var(--green-soft));
      color: white;
      border: none;
      padding: 1rem 2.5rem;
      border-radius: 25px;
      font-size: 1.2rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      width: 100%;
      max-width: 400px;
      margin: 0 auto;
      display: block;
    }
    
    .onboarding-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    }
    
    .onboarding-btn.pulse {
      animation: gentlePulse 2s ease-in-out;
    }
    
    @keyframes gentlePulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    .alternative-entry {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(139, 94, 60, 0.3);
    }
    
    .alternative-entry p {
      font-size: 0.95rem;
      color: rgba(58, 58, 58, 0.8);
      margin-bottom: 1rem;
    }
    
    .personalized-greeting {
      text-align: left;
      margin-bottom: 2rem;
    }
    
    .path-welcome {
      font-size: 1.1rem;
      margin-bottom: 1rem;
      color: var(--accent-color);
    }
    
    .practice-reminder {
      background: rgba(125, 162, 109, 0.1);
      border-radius: 8px;
      padding: 1.5rem;
      border: 2px solid var(--green-soft);
    }
    
    .sacred-space-reminder {
      margin-bottom: 1rem;
      font-size: 0.95rem;
    }
    
    .ritual-elements {
      font-size: 0.95rem;
      color: var(--text-color);
    }
    
    .practice-suggestions-content h3 {
      font-family: var(--font-title);
      color: var(--accent-color);
      margin-bottom: 1.5rem;
      text-align: center;
    }
    
    .suggestion-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    
    .suggestion-card {
      background: rgba(255, 255, 255, 0.8);
      border-radius: 10px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .suggestion-card:hover {
      background: rgba(255, 255, 255, 0.95);
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.1);
      border-color: var(--accent-color);
    }
    
    .suggestion-icon {
      font-size: 2rem;
      min-width: 50px;
      text-align: center;
    }
    
    .suggestion-content h4 {
      font-family: var(--font-title);
      color: var(--accent-color);
      margin-bottom: 0.5rem;
      font-size: 1.1rem;
    }
    
    .suggestion-content p {
      color: var(--text-color);
      font-size: 0.9rem;
      margin: 0;
      line-height: 1.3;
    }
    
    .fade-in {
      opacity: 0;
      animation: fadeIn 0.8s ease-in forwards;
    }
    
    @keyframes fadeIn {
      to { opacity: 1; }
    }
    
    .site-menu.personalized-user {
      background: linear-gradient(135deg, rgba(245, 240, 235, 0.9), rgba(244, 241, 238, 0.9));
    }
    
    @media (max-width: 768px) {
      .suggestion-cards {
        grid-template-columns: 1fr;
      }
      
      .suggestion-card {
        flex-direction: column;
        text-align: center;
      }
      
      .onboarding-btn {
        font-size: 1.1rem;
        padding: 0.875rem 2rem;
      }
    }
  `;
  
  document.head.appendChild(style);
});