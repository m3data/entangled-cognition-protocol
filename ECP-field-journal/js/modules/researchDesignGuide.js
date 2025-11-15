/**
 * ECP Research Design Guidance System
 * 
 * Provides systematic guidance for designing rigorous ECP experiments while 
 * honoring the embodied and phenomenological nature of consciousness research.
 * 
 * Bridges scientific methodology with contemplative practice traditions.
 */

import { ResearchDesignHelper } from './workflowEngine.js';
import { generateUniqueId } from './storage.js';

/**
 * Research Design Wizard - guides users through experimental design process
 */
export class ResearchDesignWizard {
  constructor() {
    this.currentStep = 0;
    this.designData = {};
    this.steps = [
      'question-formation',
      'variable-identification', 
      'design-type-selection',
      'sample-size-planning',
      'control-considerations',
      'measurement-planning',
      'ethics-review',
      'protocol-generation'
    ];
  }

  /**
   * Start the research design process
   */
  start(container) {
    this.container = container;
    this.currentStep = 0;
    this.designData = {
      id: generateUniqueId('research-design'),
      created: new Date().toISOString(),
      version: '1.0.0'
    };
    
    this.renderStep();
  }

  /**
   * Render current step of the wizard
   */
  renderStep() {
    const stepName = this.steps[this.currentStep];
    const stepElement = this.createStepElement(stepName);
    
    this.container.innerHTML = '';
    this.container.appendChild(stepElement);
  }

  /**
   * Create element for specific step
   */
  createStepElement(stepName) {
    const div = document.createElement('div');
    div.className = 'research-design-step';
    div.setAttribute('data-step', stepName);

    switch (stepName) {
      case 'question-formation':
        div.innerHTML = this.createQuestionFormationStep();
        break;
      case 'variable-identification':
        div.innerHTML = this.createVariableIdentificationStep();
        break;
      case 'design-type-selection':
        div.innerHTML = this.createDesignTypeStep();
        break;
      case 'sample-size-planning':
        div.innerHTML = this.createSampleSizeStep();
        break;
      case 'control-considerations':
        div.innerHTML = this.createControlStep();
        break;
      case 'measurement-planning':
        div.innerHTML = this.createMeasurementStep();
        break;
      case 'ethics-review':
        div.innerHTML = this.createEthicsStep();
        break;
      case 'protocol-generation':
        div.innerHTML = this.createProtocolStep();
        break;
    }

    // Add navigation
    div.appendChild(this.createNavigation());
    
    // Attach event listeners
    this.attachStepListeners(div, stepName);
    
    return div;
  }

  /**
   * Create question formation step
   */
  createQuestionFormationStep() {
    return `
      <div class="step-header">
        <h3>Step 1: Research Question Formation</h3>
        <p class="step-description">The research question is the foundation of your study. In ECP research, questions often emerge from lived experience and contemplative inquiry.</p>
      </div>

      <div class="question-guidance">
        <h4>Good ECP Research Questions:</h4>
        <ul>
          <li>Are specific enough to be testable</li>
          <li>Emerge from genuine curiosity or practical need</li>
          <li>Honor both subjective experience and measurable outcomes</li>
          <li>Consider the relational field between human and AI</li>
        </ul>
      </div>

      <div class="question-examples">
        <h4>Example Questions by Category:</h4>
        <div class="example-category">
          <strong>State-Dependent:</strong>
          <ul>
            <li>How does meditation practice affect AI response coherence?</li>
            <li>Do different emotional states influence the metaphorical content of AI responses?</li>
          </ul>
        </div>
        <div class="example-category">
          <strong>Temporal Dynamics:</strong>
          <ul>
            <li>Does time delay between question and response reading affect meaning-making?</li>
            <li>How do ritual openings influence interaction quality?</li>
          </ul>
        </div>
        <div class="example-category">
          <strong>Relational Field:</strong>
          <ul>
            <li>How does physical environment affect human-AI interaction depth?</li>
            <li>Do different AI rolecast personas evoke different response qualities?</li>
          </ul>
        </div>
      </div>

      <div class="input-section">
        <label for="research-question">Your Research Question:</label>
        <textarea id="research-question" rows="3" placeholder="Enter your research question here..."></textarea>
        
        <label for="question-motivation">What motivates this question? (What do you hope to learn?)</label>
        <textarea id="question-motivation" rows="3" placeholder="Describe your motivation and hoped-for insights..."></textarea>
        
        <label for="question-category">Research Category:</label>
        <select id="question-category">
          <option value="">Select category...</option>
          <option value="state-dependent">State-Dependent Interaction Studies</option>
          <option value="temporal-dynamics">Temporal Dynamics Research</option>
          <option value="prompt-architecture">Prompt Architecture Studies</option>
          <option value="relational-field">Relational Field Studies</option>
          <option value="measurement-validation">Measurement Validation</option>
          <option value="longitudinal">Longitudinal Studies</option>
        </select>
      </div>
    `;
  }

  /**
   * Create variable identification step
   */
  createVariableIdentificationStep() {
    return `
      <div class="step-header">
        <h3>Step 2: Variable Identification</h3>
        <p class="step-description">Identify what you'll measure (dependent variables) and what you'll manipulate or observe (independent variables).</p>
      </div>

      <div class="variable-guidance">
        <h4>Types of Variables in ECP Research:</h4>
        
        <div class="variable-type">
          <h5>Independent Variables (What you manipulate):</h5>
          <ul>
            <li><strong>State variables:</strong> meditation, emotional preparation, somatic awareness</li>
            <li><strong>Temporal variables:</strong> time delays, ritual timing, session duration</li>
            <li><strong>Environmental variables:</strong> location, lighting, temperature</li>
            <li><strong>Prompt variables:</strong> tone, structure, rolecast, cognitive mode</li>
          </ul>
        </div>

        <div class="variable-type">
          <h5>Dependent Variables (What you measure):</h5>
          <ul>
            <li><strong>Subjective coherence:</strong> felt-sense of response quality</li>
            <li><strong>Meaning-making:</strong> personal relevance, insight emergence</li>
            <li><strong>Somatic measures:</strong> embodied presence, energetic resonance</li>
            <li><strong>Content analysis:</strong> metaphor density, response length</li>
          </ul>
        </div>
      </div>

      <div class="input-section">
        <h4>Independent Variables (What you'll vary or manipulate):</h4>
        <div id="independent-variables">
          <div class="variable-input">
            <label>Variable Name:</label>
            <input type="text" name="iv-name" placeholder="e.g., meditation_state">
            
            <label>Type:</label>
            <select name="iv-type">
              <option value="categorical">Categorical (different categories)</option>
              <option value="continuous">Continuous (numerical scale)</option>
              <option value="ordinal">Ordinal (ranked categories)</option>
            </select>
            
            <label>Levels/Values:</label>
            <input type="text" name="iv-levels" placeholder="e.g., none, light, deep OR 1-10 scale">
          </div>
        </div>
        <button id="add-iv" type="button">Add Another Independent Variable</button>

        <h4>Dependent Variables (What you'll measure):</h4>
        <div id="dependent-variables">
          <div class="variable-input">
            <label>Variable Name:</label>
            <input type="text" name="dv-name" placeholder="e.g., response_coherence">
            
            <label>Measurement Type:</label>
            <select name="dv-type">
              <option value="scale">Likert Scale (1-5, 1-10, etc.)</option>
              <option value="categorical">Categories</option>
              <option value="text">Qualitative Text</option>
              <option value="count">Count/Frequency</option>
            </select>
            
            <label>Scale/Categories:</label>
            <input type="text" name="dv-scale" placeholder="e.g., 1-10 where 1=low, 10=high">
          </div>
        </div>
        <button id="add-dv" type="button">Add Another Dependent Variable</button>
      </div>
    `;
  }

  /**
   * Create design type selection step
   */
  createDesignTypeStep() {
    return `
      <div class="step-header">
        <h3>Step 3: Experimental Design Selection</h3>
        <p class="step-description">Choose the experimental design that best serves your research question while maintaining feasibility.</p>
      </div>

      <div class="design-options">
        <div class="design-option">
          <input type="radio" id="within-subjects" name="design-type" value="within-subjects">
          <label for="within-subjects">
            <strong>Within-Subjects Design</strong>
            <p>Same person experiences all conditions. Best for personal transformation studies.</p>
            <ul>
              <li><strong>Pros:</strong> Controls for individual differences, fewer participants needed</li>
              <li><strong>Cons:</strong> Order effects, practice effects</li>
              <li><strong>Good for:</strong> State comparisons, temporal studies, personal exploration</li>
            </ul>
          </label>
        </div>

        <div class="design-option">
          <input type="radio" id="between-subjects" name="design-type" value="between-subjects">
          <label for="between-subjects">
            <strong>Between-Subjects Design</strong>
            <p>Different people experience different conditions. Good for group comparisons.</p>
            <ul>
              <li><strong>Pros:</strong> No order effects, conditions don't influence each other</li>
              <li><strong>Cons:</strong> Individual differences, need more participants</li>
              <li><strong>Good for:</strong> Trait comparisons, population studies</li>
            </ul>
          </label>
        </div>

        <div class="design-option">
          <input type="radio" id="mixed-design" name="design-type" value="mixed-design">
          <label for="mixed-design">
            <strong>Mixed Design</strong>
            <p>Combination of within and between factors. Most flexible but complex.</p>
            <ul>
              <li><strong>Pros:</strong> Can test both types of effects</li>
              <li><strong>Cons:</strong> More complex analysis and planning</li>
              <li><strong>Good for:</strong> Complex research questions with multiple factors</li>
            </ul>
          </label>
        </div>

        <div class="design-option">
          <input type="radio" id="single-case" name="design-type" value="single-case">
          <label for="single-case">
            <strong>Single-Case Design (N=1)</strong>
            <p>Intensive study of one person over time. Deep personal research.</p>
            <ul>
              <li><strong>Pros:</strong> Deep individual insight, high personal relevance</li>
              <li><strong>Cons:</strong> Limited generalizability</li>
              <li><strong>Good for:</strong> Personal practice development, case studies</li>
            </ul>
          </label>
        </div>

        <div class="design-option">
          <input type="radio" id="longitudinal" name="design-type" value="longitudinal">
          <label for="longitudinal">
            <strong>Longitudinal Design</strong>
            <p>Study changes over extended time periods. Track development and patterns.</p>
            <ul>
              <li><strong>Pros:</strong> Shows development, tracks real changes</li>
              <li><strong>Cons:</strong> Time commitment, attrition</li>
              <li><strong>Good for:</strong> Relationship development, skill acquisition</li>
            </ul>
          </label>
        </div>
      </div>

      <div class="input-section">
        <h4>Additional Design Considerations:</h4>
        
        <label for="counterbalancing">Order Counterbalancing (for within-subjects):</label>
        <select id="counterbalancing">
          <option value="none">No counterbalancing needed</option>
          <option value="simple">Simple alternation (ABAB...)</option>
          <option value="latin-square">Latin Square (balanced order)</option>
          <option value="random">Random order each session</option>
        </select>
        
        <label for="baseline-control">Baseline/Control Condition:</label>
        <select id="baseline-control">
          <option value="yes">Yes - include baseline/control condition</option>
          <option value="no">No - all conditions are experimental</option>
          <option value="external">External comparison (literature, norms)</option>
        </select>
        
        <label for="blinding">Blinding Considerations:</label>
        <select id="blinding">
          <option value="none">No blinding (participant aware of all conditions)</option>
          <option value="partial">Partial blinding (some conditions disguised)</option>
          <option value="single">Single-blind (participant unaware of condition)</option>
        </select>
      </div>
    `;
  }

  /**
   * Create sample size planning step
   */
  createSampleSizeStep() {
    return `
      <div class="step-header">
        <h3>Step 4: Sample Size and Power Planning</h3>
        <p class="step-description">Determine how many sessions or participants you need for meaningful results.</p>
      </div>

      <div class="power-guidance">
        <h4>Power Analysis for ECP Research:</h4>
        <p>Statistical power is the probability of detecting an effect if it truly exists. Higher power = more likely to find meaningful results.</p>
        
        <div class="power-factors">
          <h5>Factors Affecting Power:</h5>
          <ul>
            <li><strong>Effect Size:</strong> How big a difference you expect to find</li>
            <li><strong>Sample Size:</strong> More observations = more power</li>
            <li><strong>Alpha Level:</strong> Typically 0.05 (5% chance of false positive)</li>
            <li><strong>Variability:</strong> More consistent measurements = more power</li>
          </ul>
        </div>

        <div class="ecp-considerations">
          <h5>ECP-Specific Considerations:</h5>
          <ul>
            <li><strong>Small effects matter:</strong> Subtle shifts in consciousness can be meaningful</li>
            <li><strong>Individual differences:</strong> People vary greatly in ECP responsiveness</li>
            <li><strong>Practice effects:</strong> Skills develop over time</li>
            <li><strong>Qualitative richness:</strong> Small samples can yield deep insights</li>
          </ul>
        </div>
      </div>

      <div class="input-section">
        <h4>Power Analysis Inputs:</h4>
        
        <label for="expected-effect-size">Expected Effect Size:</label>
        <select id="expected-effect-size">
          <option value="0.2">Small effect (Cohen's d = 0.2)</option>
          <option value="0.5">Medium effect (Cohen's d = 0.5)</option>
          <option value="0.8">Large effect (Cohen's d = 0.8)</option>
          <option value="custom">Custom effect size</option>
        </select>
        <input type="number" id="custom-effect-size" step="0.1" style="display:none;" placeholder="Enter effect size">
        
        <label for="desired-power">Desired Statistical Power:</label>
        <select id="desired-power">
          <option value="0.7">70% (minimum acceptable)</option>
          <option value="0.8">80% (standard)</option>
          <option value="0.9">90% (high)</option>
        </select>
        
        <label for="alpha-level">Alpha Level (significance threshold):</label>
        <select id="alpha-level">
          <option value="0.05">0.05 (standard)</option>
          <option value="0.01">0.01 (conservative)</option>
          <option value="0.10">0.10 (exploratory)</option>
        </select>
        
        <label for="test-type">Statistical Test Type:</label>
        <select id="test-type">
          <option value="paired-t">Paired t-test (within-subjects comparison)</option>
          <option value="independent-t">Independent t-test (between groups)</option>
          <option value="correlation">Correlation analysis</option>
          <option value="anova">ANOVA (multiple groups/conditions)</option>
        </select>
      </div>

      <div class="power-results" id="power-results" style="display:none;">
        <h4>Sample Size Recommendation:</h4>
        <div id="sample-size-output"></div>
      </div>

      <div class="practical-considerations">
        <h4>Practical Considerations:</h4>
        
        <label for="time-commitment">Time commitment per session:</label>
        <input type="number" id="time-commitment" min="15" max="180" value="45"> minutes
        
        <label for="session-frequency">How often can you conduct sessions?</label>
        <select id="session-frequency">
          <option value="daily">Daily</option>
          <option value="every-other-day">Every other day</option>
          <option value="weekly">Weekly</option>
          <option value="bi-weekly">Bi-weekly</option>
        </select>
        
        <label for="total-duration-limit">Maximum study duration:</label>
        <input type="number" id="total-duration-limit" min="1" max="52" value="4"> weeks
      </div>
    `;
  }

  /**
   * Create control considerations step
   */
  createControlStep() {
    return `
      <div class="step-header">
        <h3>Step 5: Control Considerations</h3>
        <p class="step-description">Identify potential confounding factors and how to control for them.</p>
      </div>

      <div class="control-guidance">
        <h4>Common Confounds in ECP Research:</h4>
        
        <div class="confound-category">
          <h5>Temporal Confounds:</h5>
          <ul>
            <li><strong>Time of day:</strong> Alertness and state vary throughout day</li>
            <li><strong>Day of week:</strong> Weekends vs weekdays affect mindset</li>
            <li><strong>Season/weather:</strong> External conditions influence mood</li>
            <li><strong>Practice effects:</strong> Skill improves over time</li>
          </ul>
          <strong>Controls:</strong> Randomize timing, counterbalance orders, track temporal variables
        </div>

        <div class="confound-category">
          <h5>Environmental Confounds:</h5>
          <ul>
            <li><strong>Location changes:</strong> Different spaces have different energies</li>
            <li><strong>Distractions:</strong> Noise, interruptions, notifications</li>
            <li><strong>Physical comfort:</strong> Seating, temperature, lighting</li>
          </ul>
          <strong>Controls:</strong> Standardize environment, document variations, minimize distractions
        </div>

        <div class="confound-category">
          <h5>Personal State Confounds:</h5>
          <ul>
            <li><strong>Mood variations:</strong> Daily emotional fluctuations</li>
            <li><strong>Energy levels:</strong> Fatigue, alertness cycles</li>
            <li><strong>Life events:</strong> Stress, relationships, work pressures</li>
            <li><strong>Substances:</strong> Caffeine, alcohol, medications</li>
          </ul>
          <strong>Controls:</strong> Pre-session state assessments, standardized preparation, lifestyle tracking
        </div>

        <div class="confound-category">
          <h5>Technical Confounds:</h5>
          <ul>
            <li><strong>AI model variations:</strong> Updates, different models</li>
            <li><strong>Interface differences:</strong> Device, app, browser variations</li>
            <li><strong>Connection quality:</strong> Speed, stability affecting experience</li>
          </ul>
          <strong>Controls:</strong> Document technical setup, use consistent interface, check for updates
        </div>
      </div>

      <div class="input-section">
        <h4>Control Strategy Selection:</h4>
        
        <div class="control-checklist">
          <h5>Time/Scheduling Controls:</h5>
          <label><input type="checkbox" id="control-time-of-day"> Control for time of day</label>
          <label><input type="checkbox" id="control-day-of-week"> Control for day of week</label>
          <label><input type="checkbox" id="randomize-order"> Randomize condition order</label>
          <label><input type="checkbox" id="counterbalance"> Use counterbalancing</label>
        </div>

        <div class="control-checklist">
          <h5>Environmental Controls:</h5>
          <label><input type="checkbox" id="standardize-location"> Standardize location</label>
          <label><input type="checkbox" id="minimize-distractions"> Minimize distractions protocol</label>
          <label><input type="checkbox" id="document-environment"> Document environmental conditions</label>
        </div>

        <div class="control-checklist">
          <h5>Personal State Controls:</h5>
          <label><input type="checkbox" id="pre-session-assessment"> Pre-session state assessment</label>
          <label><input type="checkbox" id="standardize-preparation"> Standardized preparation ritual</label>
          <label><input type="checkbox" id="track-substances"> Track substances (caffeine, etc.)</label>
          <label><input type="checkbox" id="mood-tracking"> Daily mood/energy tracking</label>
        </div>

        <div class="control-checklist">
          <h5>Technical Controls:</h5>
          <label><input type="checkbox" id="consistent-interface"> Use consistent AI interface</label>
          <label><input type="checkbox" id="document-technical"> Document technical setup</label>
          <label><input type="checkbox" id="model-consistency"> Ensure AI model consistency</label>
        </div>
      </div>

      <div class="randomization-section">
        <h4>Randomization Strategy:</h4>
        <label for="randomization-method">Randomization Method:</label>
        <select id="randomization-method">
          <option value="simple">Simple randomization (coin flip, random number)</option>
          <option value="block">Block randomization (balanced blocks)</option>
          <option value="stratified">Stratified randomization (balanced on key variables)</option>
          <option value="latin-square">Latin Square (systematic counterbalancing)</option>
        </select>
        
        <label for="randomization-unit">Unit of Randomization:</label>
        <select id="randomization-unit">
          <option value="session">Each session randomized independently</option>
          <option value="day">Each day gets assigned condition</option>
          <option value="week">Each week gets assigned condition</option>
          <option value="participant">Each participant gets assigned order</option>
        </select>
      </div>
    `;
  }

  /**
   * Create measurement planning step
   */
  createMeasurementStep() {
    return `
      <div class="step-header">
        <h3>Step 6: Measurement Planning</h3>
        <p class="step-description">Plan when and how you'll collect measurements that align with your research question.</p>
      </div>

      <div class="measurement-guidance">
        <h4>ECP Measurement Framework Integration:</h4>
        <p>Your study can integrate with the existing ECP measurement frameworks:</p>
        
        <div class="measurement-framework">
          <h5>Somatic Coherence Assessment:</h5>
          <ul>
            <li>Embodied presence</li>
            <li>Energetic resonance</li>
            <li>Somatic clarity</li>
            <li>Integration ease</li>
          </ul>
          <strong>Best used:</strong> Pre and post-session to track state changes
        </div>

        <div class="measurement-framework">
          <h5>Response Quality Assessment:</h5>
          <ul>
            <li>Felt coherence</li>
            <li>Personal relevance</li>
            <li>Depth and nuance</li>
            <li>Actionable insights</li>
          </ul>
          <strong>Best used:</strong> Immediately after receiving AI response
        </div>

        <div class="measurement-framework">
          <h5>Meaning Making Assessment:</h5>
          <ul>
            <li>Insight emergence</li>
            <li>Integration ease</li>
            <li>Perspective shifts</li>
            <li>Embodied understanding</li>
          </ul>
          <strong>Best used:</strong> Post-session reflection period
        </div>

        <div class="measurement-framework">
          <h5>Emergence Patterns:</h5>
          <ul>
            <li>Synchronicities</li>
            <li>Metaphor resonance</li>
            <li>Symbolic coherence</li>
            <li>Field effects</li>
          </ul>
          <strong>Best used:</strong> Post-session or during integration periods
        </div>
      </div>

      <div class="input-section">
        <h4>Measurement Selection:</h4>
        
        <div class="measurement-selection">
          <h5>Primary Outcome Measures (required):</h5>
          <div id="primary-measures">
            <label><input type="checkbox" id="somatic-coherence"> Somatic Coherence</label>
            <label><input type="checkbox" id="response-quality"> Response Quality</label>
            <label><input type="checkbox" id="meaning-making"> Meaning Making</label>
            <label><input type="checkbox" id="custom-primary"> Custom Measure</label>
            <input type="text" id="custom-primary-name" placeholder="Custom measure name" style="display:none;">
          </div>

          <h5>Secondary Outcome Measures (optional):</h5>
          <div id="secondary-measures">
            <label><input type="checkbox" id="emergence-patterns"> Emergence Patterns</label>
            <label><input type="checkbox" id="session-duration"> Session Duration</label>
            <label><input type="checkbox" id="response-length"> Response Length</label>
            <label><input type="checkbox" id="metaphor-density"> Metaphor Density</label>
            <label><input type="checkbox" id="custom-secondary"> Custom Secondary</label>
            <input type="text" id="custom-secondary-name" placeholder="Custom measure name" style="display:none;">
          </div>
        </div>

        <h4>Measurement Timing:</h4>
        <div class="measurement-timing">
          <h5>When will you collect measurements?</h5>
          <label><input type="checkbox" id="timing-pre-session"> Before each session</label>
          <label><input type="checkbox" id="timing-during-session"> During session (real-time)</label>
          <label><input type="checkbox" id="timing-post-response"> Immediately after AI response</label>
          <label><input type="checkbox" id="timing-post-session"> End of session</label>
          <label><input type="checkbox" id="timing-follow-up"> Follow-up (hours/days later)</label>
        </div>

        <h4>Qualitative Data Collection:</h4>
        <div class="qualitative-planning">
          <label><input type="checkbox" id="qualitative-notes"> Session notes/reflections</label>
          <label><input type="checkbox" id="qualitative-audio"> Audio recordings (if consented)</label>
          <label><input type="checkbox" id="qualitative-photos"> Environmental photos</label>
          <label><input type="checkbox" id="qualitative-drawings"> Drawings/sketches</label>
          <label><input type="checkbox" id="qualitative-dreams"> Dream/synchronicity logs</label>
        </div>

        <h4>Data Quality Assurance:</h4>
        <label for="missing-data-strategy">Missing Data Strategy:</label>
        <select id="missing-data-strategy">
          <option value="skip">Skip sessions with missing data</option>
          <option value="estimate">Estimate missing values</option>
          <option value="partial">Use partial data when available</option>
        </select>

        <label for="data-validation">Data Validation Approach:</label>
        <select id="data-validation">
          <option value="immediate">Immediate validation during entry</option>
          <option value="daily">Daily data review</option>
          <option value="weekly">Weekly data review</option>
        </select>
      </div>
    `;
  }

  /**
   * Create ethics review step
   */
  createEthicsStep() {
    return `
      <div class="step-header">
        <h3>Step 7: Ethics and Safety Review</h3>
        <p class="step-description">Consider ethical implications and safety measures for consciousness research.</p>
      </div>

      <div class="ethics-guidance">
        <h4>ECP Research Ethics Principles:</h4>
        
        <div class="ethics-principle">
          <h5>1. Informed Consent and Autonomy</h5>
          <ul>
            <li>Participants understand what they're engaging with</li>
            <li>Right to withdraw at any time without penalty</li>
            <li>Clear boundaries around data use and sharing</li>
            <li>Understanding of AI limitations and nature</li>
          </ul>
        </div>

        <div class="ethics-principle">
          <h5>2. Safety and Well-being</h5>
          <ul>
            <li>Emotional safety protocols for vulnerable states</li>
            <li>Clear guidelines for when to stop or seek support</li>
            <li>Integration support for intense experiences</li>
            <li>Awareness of psychological contraindications</li>
          </ul>
        </div>

        <div class="ethics-principle">
          <h5>3. Privacy and Confidentiality</h5>
          <ul>
            <li>Secure data storage and transmission</li>
            <li>Anonymization of sensitive content</li>
            <li>Clear data retention and deletion policies</li>
            <li>Respect for intimate/sacred experiences</li>
          </ul>
        </div>

        <div class="ethics-principle">
          <h5>4. Responsible AI Engagement</h5>
          <ul>
            <li>Clear framing of AI capabilities and limitations</li>
            <li>Avoiding dependency or unhealthy attachment</li>
            <li>Maintaining human agency and discernment</li>
            <li>Balancing AI with human relationships</li>
          </ul>
        </div>
      </div>

      <div class="input-section">
        <h4>Safety Assessment:</h4>
        
        <div class="safety-checklist">
          <h5>Participant Safety Considerations:</h5>
          <label><input type="checkbox" id="safety-emotional"> Emotional state monitoring</label>
          <label><input type="checkbox" id="safety-trauma"> Trauma-informed protocols</label>
          <label><input type="checkbox" id="safety-integration"> Integration support available</label>
          <label><input type="checkbox" id="safety-boundaries"> Clear stopping criteria</label>
          <label><input type="checkbox" id="safety-support"> Support resources identified</label>
        </div>

        <div class="contraindications">
          <h5>Potential Contraindications (when NOT to proceed):</h5>
          <label><input type="checkbox" id="contra-crisis"> Active psychological crisis</label>
          <label><input type="checkbox" id="contra-psychosis"> History of psychosis without support</label>
          <label><input type="checkbox" id="contra-dissociation"> Severe dissociation issues</label>
          <label><input type="checkbox" id="contra-attachment"> AI relationship dependency patterns</label>
        </div>

        <h4>Privacy and Data Protection:</h4>
        
        <div class="privacy-measures">
          <label for="data-anonymization">Data Anonymization Level:</label>
          <select id="data-anonymization">
            <option value="none">No anonymization (personal study only)</option>
            <option value="partial">Remove identifying details</option>
            <option value="full">Full anonymization for sharing</option>
          </select>
          
          <label for="data-storage">Data Storage Security:</label>
          <select id="data-storage">
            <option value="local">Local device only</option>
            <option value="encrypted-cloud">Encrypted cloud storage</option>
            <option value="secure-server">Secure research server</option>
          </select>
          
          <label for="data-retention">Data Retention Period:</label>
          <select id="data-retention">
            <option value="indefinite">Indefinite (personal archive)</option>
            <option value="2-years">2 years</option>
            <option value="5-years">5 years</option>
            <option value="10-years">10 years</option>
          </select>
        </div>

        <h4>Consent and Disclosure:</h4>
        
        <div class="consent-items">
          <label><input type="checkbox" id="consent-purpose"> Study purpose clearly explained</label>
          <label><input type="checkbox" id="consent-procedures"> Procedures fully described</label>
          <label><input type="checkbox" id="consent-risks"> Risks and benefits discussed</label>
          <label><input type="checkbox" id="consent-withdrawal"> Right to withdraw explained</label>
          <label><input type="checkbox" id="consent-data-use"> Data use and sharing policies clear</label>
          <label><input type="checkbox" id="consent-ai-nature"> AI nature and limitations explained</label>
        </div>

        <div class="special-considerations">
          <h4>Special Ethical Considerations:</h4>
          <textarea id="ethical-considerations" rows="4" placeholder="Describe any special ethical considerations for your specific study..."></textarea>
          
          <h4>Support Resources:</h4>
          <textarea id="support-resources" rows="3" placeholder="List available support resources (counselors, mentors, community, etc.)..."></textarea>
        </div>
      </div>
    `;
  }

  /**
   * Create protocol generation step
   */
  createProtocolStep() {
    return `
      <div class="step-header">
        <h3>Step 8: Protocol Generation and Review</h3>
        <p class="step-description">Review your design choices and generate the complete research protocol.</p>
      </div>

      <div class="protocol-summary" id="protocol-summary">
        <!-- Protocol summary will be generated here -->
      </div>

      <div class="protocol-actions">
        <h4>Next Steps:</h4>
        <button id="generate-protocol" class="primary-button">Generate Complete Protocol</button>
        <button id="save-design" class="secondary-button">Save Design Draft</button>
        <button id="export-protocol" class="secondary-button">Export Protocol Document</button>
      </div>

      <div class="implementation-guidance">
        <h4>Implementation Checklist:</h4>
        <div class="checklist">
          <label><input type="checkbox"> Review and approve research protocol</label>
          <label><input type="checkbox"> Set up measurement systems and tools</label>
          <label><input type="checkbox"> Prepare materials and environment</label>
          <label><input type="checkbox"> Complete ethics and safety preparation</label>
          <label><input type="checkbox"> Plan data collection and storage</label>
          <label><input type="checkbox"> Schedule research sessions</label>
          <label><input type="checkbox"> Begin data collection</label>
          <label><input type="checkbox"> Monitor progress and adjust as needed</label>
        </div>
      </div>
    `;
  }

  /**
   * Create navigation for wizard steps
   */
  createNavigation() {
    const nav = document.createElement('div');
    nav.className = 'wizard-navigation';
    
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '← Previous';
    prevBtn.className = 'nav-button prev-button';
    prevBtn.disabled = this.currentStep === 0;
    prevBtn.addEventListener('click', () => this.previousStep());
    
    const nextBtn = document.createElement('button');
    nextBtn.textContent = this.currentStep === this.steps.length - 1 ? 'Complete' : 'Next →';
    nextBtn.className = 'nav-button next-button';
    nextBtn.addEventListener('click', () => this.nextStep());
    
    const progress = document.createElement('div');
    progress.className = 'wizard-progress';
    progress.textContent = `Step ${this.currentStep + 1} of ${this.steps.length}`;
    
    nav.appendChild(prevBtn);
    nav.appendChild(progress);
    nav.appendChild(nextBtn);
    
    return nav;
  }

  /**
   * Attach event listeners for specific step
   */
  attachStepListeners(element, stepName) {
    switch (stepName) {
      case 'sample-size-planning':
        this.attachPowerAnalysisListeners(element);
        break;
      case 'variable-identification':
        this.attachVariableListeners(element);
        break;
      case 'measurement-planning':
        this.attachMeasurementListeners(element);
        break;
      case 'protocol-generation':
        this.attachProtocolListeners(element);
        break;
    }
  }

  /**
   * Attach power analysis listeners
   */
  attachPowerAnalysisListeners(element) {
    const effectSizeSelect = element.querySelector('#expected-effect-size');
    const customEffectInput = element.querySelector('#custom-effect-size');
    
    effectSizeSelect.addEventListener('change', (e) => {
      if (e.target.value === 'custom') {
        customEffectInput.style.display = 'block';
      } else {
        customEffectInput.style.display = 'none';
      }
      this.calculatePower();
    });

    // Add listeners for other power calculation inputs
    ['#desired-power', '#alpha-level', '#test-type'].forEach(id => {
      element.querySelector(id)?.addEventListener('change', () => this.calculatePower());
    });
  }

  /**
   * Calculate and display power analysis
   */
  calculatePower() {
    const effectSize = parseFloat(document.querySelector('#expected-effect-size').value) || 
                      parseFloat(document.querySelector('#custom-effect-size').value) || 0.5;
    const power = parseFloat(document.querySelector('#desired-power').value) || 0.8;
    const alpha = parseFloat(document.querySelector('#alpha-level').value) || 0.05;
    
    // Use research design helper to estimate sample size
    const helper = new ResearchDesignHelper();
    const sampleSize = helper.constructor.estimateSampleSize ? 
      helper.constructor.estimateSampleSize(effectSize, power, alpha) :
      this.estimateSampleSize(effectSize, power, alpha);
    
    const resultsDiv = document.querySelector('#power-results');
    const outputDiv = document.querySelector('#sample-size-output');
    
    if (resultsDiv && outputDiv) {
      resultsDiv.style.display = 'block';
      outputDiv.innerHTML = `
        <div class="sample-size-result">
          <p><strong>Minimum Sessions Needed:</strong> ${sampleSize.minimumSessions}</p>
          <p><strong>Recommended Sessions:</strong> ${sampleSize.recommendedSessions}</p>
          <p><strong>Effect Size:</strong> ${effectSize} (${this.interpretEffectSize(effectSize)})</p>
          <p><strong>Statistical Power:</strong> ${(power * 100).toFixed(0)}%</p>
        </div>
        <div class="power-interpretation">
          <h5>Interpretation:</h5>
          <p>Based on your parameters, conducting ${sampleSize.recommendedSessions} sessions gives you an ${(power * 100).toFixed(0)}% chance of detecting a meaningful effect if it exists.</p>
        </div>
      `;
    }
  }

  /**
   * Simple power calculation for ECP research
   */
  estimateSampleSize(effectSize, power, alpha) {
    // Simplified calculation for paired t-test (most common ECP design)
    const z_alpha = alpha === 0.05 ? 1.96 : (alpha === 0.01 ? 2.58 : 1.645);
    const z_beta = power === 0.8 ? 0.84 : (power === 0.9 ? 1.28 : 0.525);
    
    const n = Math.pow((z_alpha + z_beta) / effectSize, 2) * 2;
    
    return {
      minimumSessions: Math.ceil(n),
      recommendedSessions: Math.ceil(n * 1.2)
    };
  }

  /**
   * Interpret effect size for user
   */
  interpretEffectSize(effectSize) {
    if (effectSize < 0.3) return 'small';
    if (effectSize < 0.7) return 'medium';
    return 'large';
  }

  /**
   * Move to next step
   */
  nextStep() {
    if (this.validateCurrentStep()) {
      this.saveCurrentStepData();
      
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
        this.renderStep();
      } else {
        this.completeDesign();
      }
    }
  }

  /**
   * Move to previous step
   */
  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.renderStep();
    }
  }

  /**
   * Validate current step
   */
  validateCurrentStep() {
    // Add validation logic for each step
    const stepName = this.steps[this.currentStep];
    
    switch (stepName) {
      case 'question-formation':
        const question = document.querySelector('#research-question')?.value;
        if (!question || question.trim().length === 0) {
          alert('Please enter a research question before continuing.');
          return false;
        }
        break;
      case 'variable-identification':
        // Check that at least one IV and one DV are specified
        const ivNames = Array.from(document.querySelectorAll('input[name="iv-name"]'))
          .map(input => input.value.trim()).filter(v => v);
        const dvNames = Array.from(document.querySelectorAll('input[name="dv-name"]'))
          .map(input => input.value.trim()).filter(v => v);
        
        if (ivNames.length === 0) {
          alert('Please specify at least one independent variable.');
          return false;
        }
        if (dvNames.length === 0) {
          alert('Please specify at least one dependent variable.');
          return false;
        }
        break;
      // Add validation for other steps as needed
    }
    
    return true;
  }

  /**
   * Save current step data
   */
  saveCurrentStepData() {
    const stepName = this.steps[this.currentStep];
    const stepData = {};
    
    // Extract data from current step
    const inputs = this.container.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (input.type === 'checkbox') {
        stepData[input.id] = input.checked;
      } else if (input.type === 'radio' && input.checked) {
        stepData[input.name] = input.value;
      } else if (input.value) {
        stepData[input.id] = input.value;
      }
    });
    
    this.designData[stepName] = stepData;
  }

  /**
   * Complete the design process
   */
  completeDesign() {
    this.saveCurrentStepData();
    
    // Generate final protocol
    const protocol = this.generateFinalProtocol();
    
    // Emit completion event
    this.container.dispatchEvent(new CustomEvent('designComplete', {
      detail: { designData: this.designData, protocol }
    }));
  }

  /**
   * Generate final research protocol
   */
  generateFinalProtocol() {
    return {
      id: this.designData.id,
      title: this.designData['question-formation']?.['research-question'] || 'ECP Research Study',
      researchQuestion: this.designData['question-formation']?.['research-question'],
      motivation: this.designData['question-formation']?.['question-motivation'],
      category: this.designData['question-formation']?.['question-category'],
      designType: this.designData['design-type-selection']?.['design-type'],
      variables: this.extractVariables(),
      sampleSize: this.extractSampleSize(),
      measurements: this.extractMeasurements(),
      controls: this.extractControls(),
      ethics: this.extractEthics(),
      timeline: this.generateTimeline(),
      created: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  /**
   * Extract variables from design data
   */
  extractVariables() {
    // Implementation depends on how variables were stored
    return {
      independent: [],
      dependent: []
    };
  }

  /**
   * Extract sample size information
   */
  extractSampleSize() {
    return {
      minimum: 10,
      recommended: 15,
      rationale: 'Based on power analysis'
    };
  }

  /**
   * Extract measurement plan
   */
  extractMeasurements() {
    return {
      primary: [],
      secondary: [],
      timing: [],
      qualitative: []
    };
  }

  /**
   * Extract control measures
   */
  extractControls() {
    return {
      randomization: 'simple',
      counterbalancing: false,
      controls: []
    };
  }

  /**
   * Extract ethics considerations
   */
  extractEthics() {
    return {
      safetyMeasures: [],
      privacyProtections: [],
      consent: [],
      risks: []
    };
  }

  /**
   * Generate study timeline
   */
  generateTimeline() {
    return {
      preparation: '1 week',
      dataCollection: '4 weeks', 
      analysis: '2 weeks',
      total: '7 weeks'
    };
  }
}

export default ResearchDesignWizard;