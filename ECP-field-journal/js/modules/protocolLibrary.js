/**
 * Protocol Library for ECP Field Journal
 * 
 * Enables community members to share, adapt, and collaborate on research protocols,
 * measurement frameworks, and methodological innovations while maintaining
 * version control and attribution.
 */

/**
 * Protocol Template Structure
 */
class ProtocolTemplate {
  constructor(templateData) {
    this.id = templateData.id || this.generateId();
    this.title = templateData.title;
    this.description = templateData.description;
    this.category = templateData.category; // measurement, cognitive, environmental, analysis
    this.version = templateData.version || '1.0';
    this.author = templateData.author || 'community';
    this.created_at = templateData.created_at || new Date().toISOString();
    this.updated_at = templateData.updated_at || new Date().toISOString();
    this.tags = templateData.tags || [];
    this.usage_count = templateData.usage_count || 0;
    this.rating = templateData.rating || 0;
    this.rating_count = templateData.rating_count || 0;
    
    // Protocol specification
    this.protocol = {
      measurement_frameworks: templateData.protocol?.measurement_frameworks || [],
      cognitive_preparation: templateData.protocol?.cognitive_preparation || {},
      environmental_setup: templateData.protocol?.environmental_setup || {},
      interaction_parameters: templateData.protocol?.interaction_parameters || {},
      analysis_methods: templateData.protocol?.analysis_methods || [],
      expected_outcomes: templateData.protocol?.expected_outcomes || []
    };
    
    // Metadata
    this.metadata = {
      difficulty_level: templateData.metadata?.difficulty_level || 'beginner', // beginner, intermediate, advanced
      session_duration: templateData.metadata?.session_duration || 30, // minutes
      required_sessions: templateData.metadata?.required_sessions || 1,
      privacy_level: templateData.metadata?.privacy_level || 'high',
      research_context: templateData.metadata?.research_context || 'individual'
    };
  }

  generateId() {
    return 'protocol_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      category: this.category,
      version: this.version,
      author: this.author,
      created_at: this.created_at,
      updated_at: this.updated_at,
      tags: this.tags,
      usage_count: this.usage_count,
      rating: this.rating,
      rating_count: this.rating_count,
      protocol: this.protocol,
      metadata: this.metadata
    };
  }
}

/**
 * Protocol Library Manager
 */
class ProtocolLibrary {
  constructor() {
    this.libraryKey = 'ecp-protocol-library';
    this.usageKey = 'ecp-protocol-usage';
    this.adaptationsKey = 'ecp-protocol-adaptations';
  }

  /**
   * Initialize library with default protocols
   */
  initializeDefaultProtocols() {
    const existing = this.getAllProtocols();
    if (existing.length > 0) return; // Already initialized

    const defaultProtocols = this.createDefaultProtocols();
    defaultProtocols.forEach(protocol => this.storeProtocol(protocol));
  }

  /**
   * Create default community protocols
   */
  createDefaultProtocols() {
    return [
      // Measurement Framework Protocols
      new ProtocolTemplate({
        title: 'Somatic Coherence Baseline Assessment',
        description: 'Establishes baseline measurements for embodied presence, energetic coherence, and somatic awareness before ECP sessions.',
        category: 'measurement',
        tags: ['somatic', 'baseline', 'embodiment'],
        protocol: {
          measurement_frameworks: [
            {
              framework_name: 'somatic_coherence',
              pre_session: {
                embodied_presence: { scale: '1-10', description: 'Feeling of being present in your body' },
                energetic_coherence: { scale: '1-10', description: 'Sense of internal energy alignment' },
                nervous_system_state: { scale: '1-10', description: 'Calm, regulated nervous system state' }
              },
              post_session: {
                embodied_presence: { scale: '1-10', description: 'Feeling of being present in your body' },
                energetic_coherence: { scale: '1-10', description: 'Sense of internal energy alignment' },
                somatic_insights: { type: 'text', description: 'Bodily felt insights or changes' }
              }
            }
          ],
          analysis_methods: [
            'Pre/post comparison analysis',
            'Trend tracking over multiple sessions',
            'Correlation with response quality'
          ]
        },
        metadata: {
          difficulty_level: 'beginner',
          session_duration: 5,
          required_sessions: 1,
          research_context: 'individual'
        }
      }),

      new ProtocolTemplate({
        title: 'Meaning-Making Depth Assessment',
        description: 'Measures the depth and quality of meaning-making processes during ECP interactions.',
        category: 'measurement',
        tags: ['meaning-making', 'depth', 'symbolic'],
        protocol: {
          measurement_frameworks: [
            {
              framework_name: 'meaning_making_depth',
              during_session: {
                conceptual_emergence: { scale: '1-10', description: 'New concepts or frameworks arising' },
                symbolic_resonance: { scale: '1-10', description: 'Symbolic/metaphorical richness' },
                integration_capacity: { scale: '1-10', description: 'Ability to integrate new insights' }
              },
              post_session: {
                insight_durability: { scale: '1-10', description: 'Lasting quality of insights gained' },
                practical_applicability: { scale: '1-10', description: 'Real-world applicability of insights' },
                meaning_shift: { type: 'text', description: 'Shifts in personal meaning-making' }
              }
            }
          ],
          analysis_methods: [
            'Semantic analysis of meaning shift descriptions',
            'Correlation with symbolic density scores',
            'Longitudinal meaning evolution tracking'
          ]
        },
        metadata: {
          difficulty_level: 'intermediate',
          session_duration: 10,
          required_sessions: 3
        }
      }),

      // Cognitive Mode Protocols
      new ProtocolTemplate({
        title: 'Contemplative Inquiry Mode',
        description: 'Deep contemplative preparation for philosophical and existential inquiry with AI systems.',
        category: 'cognitive',
        tags: ['contemplative', 'philosophy', 'depth'],
        protocol: {
          cognitive_preparation: {
            pre_session_practice: [
              '5 minutes mindfulness meditation',
              'Set intention for deep inquiry',
              'Ground in present moment awareness'
            ],
            cognitive_stance: 'Open, curious, non-grasping awareness',
            inquiry_approach: 'Patient, contemplative, allowing emergence',
            attention_quality: 'Soft, spacious, receptive'
          },
          interaction_parameters: {
            conversation_pace: 'slow',
            response_depth: 'maximum',
            allow_silence: true,
            encourage_metaphor: true
          }
        },
        metadata: {
          difficulty_level: 'intermediate',
          session_duration: 45,
          research_context: 'contemplative_practice'
        }
      }),

      new ProtocolTemplate({
        title: 'Creative Collaboration Mode',
        description: 'Optimal cognitive preparation for creative co-creation and artistic exploration with AI.',
        category: 'cognitive',
        tags: ['creative', 'collaboration', 'artistic'],
        protocol: {
          cognitive_preparation: {
            pre_session_practice: [
              'Free movement or dance for 3 minutes',
              'Engage in play or improvisation',
              'Set intention for creative surprise'
            ],
            cognitive_stance: 'Playful, experimental, risk-taking',
            inquiry_approach: 'Improvisational, yes-and mentality',
            attention_quality: 'Dynamic, fluid, generative'
          },
          interaction_parameters: {
            conversation_style: 'collaborative',
            encourage_experimentation: true,
            build_on_ideas: true,
            embrace_tangents: true
          }
        },
        metadata: {
          difficulty_level: 'beginner',
          session_duration: 30,
          research_context: 'creative_practice'
        }
      }),

      // Environmental Setup Protocols
      new ProtocolTemplate({
        title: 'Natural Light Sacred Space',
        description: 'Optimized environmental setup using natural light and sacred space principles.',
        category: 'environmental',
        tags: ['natural-light', 'sacred-space', 'ambiance'],
        protocol: {
          environmental_setup: {
            lighting: {
              primary: 'Natural daylight from windows',
              supplementary: 'Warm LED (2700K) if needed',
              avoid: 'Harsh fluorescent or blue light'
            },
            space_preparation: [
              'Clear and clean the practice space',
              'Place meaningful objects nearby',
              'Ensure comfortable seating',
              'Remove distracting elements'
            ],
            sensory_environment: {
              sound: 'Quiet or gentle ambient sounds',
              scent: 'Natural scents or none',
              temperature: 'Comfortable room temperature',
              air_quality: 'Fresh air circulation'
            }
          }
        },
        metadata: {
          difficulty_level: 'beginner',
          session_duration: 10,
          research_context: 'sacred_practice'
        }
      }),

      // Analysis Method Protocols
      new ProtocolTemplate({
        title: 'Qualitative Insight Tracking',
        description: 'Systematic approach to tracking and analyzing qualitative insights over time.',
        category: 'analysis',
        tags: ['qualitative', 'insight-tracking', 'longitudinal'],
        protocol: {
          analysis_methods: [
            {
              method: 'Insight Journaling',
              description: 'Write 2-3 sentences capturing the essence of key insights',
              frequency: 'After each session',
              format: 'Free-form text with date/time stamps'
            },
            {
              method: 'Pattern Recognition Review',
              description: 'Weekly review looking for recurring themes and patterns',
              frequency: 'Weekly',
              format: 'Structured reflection template'
            },
            {
              method: 'Meaning Evolution Mapping',
              description: 'Monthly mapping of how insights connect and build over time',
              frequency: 'Monthly',
              format: 'Visual map or narrative summary'
            }
          ],
          data_collection: {
            insight_categories: ['conceptual', 'practical', 'relational', 'existential'],
            depth_indicators: ['novelty', 'personal_relevance', 'integration_potential'],
            evolution_markers: ['builds_on_previous', 'contradicts_previous', 'synthesizes_themes']
          }
        },
        metadata: {
          difficulty_level: 'intermediate',
          session_duration: 15,
          required_sessions: 4,
          research_context: 'longitudinal_study'
        }
      })
    ];
  }

  /**
   * Get all protocols from storage
   */
  getAllProtocols() {
    try {
      const stored = localStorage.getItem(this.libraryKey);
      if (!stored) return [];
      
      const protocols = JSON.parse(stored);
      return protocols.map(data => new ProtocolTemplate(data));
    } catch (error) {
      console.error('Failed to load protocol library:', error);
      return [];
    }
  }

  /**
   * Get protocols by category
   */
  getProtocolsByCategory(category) {
    return this.getAllProtocols().filter(protocol => protocol.category === category);
  }

  /**
   * Search protocols by tags or text
   */
  searchProtocols(query) {
    const protocols = this.getAllProtocols();
    const queryLower = query.toLowerCase();
    
    return protocols.filter(protocol => {
      return protocol.title.toLowerCase().includes(queryLower) ||
             protocol.description.toLowerCase().includes(queryLower) ||
             protocol.tags.some(tag => tag.toLowerCase().includes(queryLower));
    });
  }

  /**
   * Get a specific protocol by ID
   */
  getProtocol(id) {
    const protocols = this.getAllProtocols();
    return protocols.find(protocol => protocol.id === id);
  }

  /**
   * Store a protocol in the library
   */
  storeProtocol(protocol) {
    try {
      const protocols = this.getAllProtocols();
      const existingIndex = protocols.findIndex(p => p.id === protocol.id);
      
      if (existingIndex >= 0) {
        protocols[existingIndex] = protocol;
      } else {
        protocols.push(protocol);
      }
      
      const protocolsData = protocols.map(p => p.toJSON());
      localStorage.setItem(this.libraryKey, JSON.stringify(protocolsData));
      
      return true;
    } catch (error) {
      console.error('Failed to store protocol:', error);
      return false;
    }
  }

  /**
   * Create a new protocol template
   */
  createProtocol(protocolData) {
    const protocol = new ProtocolTemplate(protocolData);
    if (this.storeProtocol(protocol)) {
      return protocol;
    }
    return null;
  }

  /**
   * Create an adaptation of an existing protocol
   */
  adaptProtocol(originalId, adaptationData) {
    const original = this.getProtocol(originalId);
    if (!original) return null;

    // Create adapted version
    const adaptedData = {
      ...original.toJSON(),
      ...adaptationData,
      id: undefined, // Generate new ID
      title: adaptationData.title || `${original.title} (Adapted)`,
      version: '1.0', // Reset version for adaptation
      author: 'community_adaptation',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      adapted_from: originalId
    };

    const adapted = this.createProtocol(adaptedData);
    
    if (adapted) {
      // Record the adaptation relationship
      this.recordAdaptation(originalId, adapted.id, adaptationData.adaptation_notes || '');
    }
    
    return adapted;
  }

  /**
   * Record protocol usage
   */
  recordUsage(protocolId, usageData = {}) {
    try {
      // Update usage count on protocol
      const protocol = this.getProtocol(protocolId);
      if (protocol) {
        protocol.usage_count++;
        protocol.updated_at = new Date().toISOString();
        this.storeProtocol(protocol);
      }

      // Store detailed usage record
      const usage = {
        protocol_id: protocolId,
        used_at: new Date().toISOString(),
        session_id: usageData.session_id || null,
        user_feedback: usageData.feedback || null,
        effectiveness_rating: usageData.rating || null
      };

      const usageHistory = JSON.parse(localStorage.getItem(this.usageKey) || '[]');
      usageHistory.push(usage);
      
      // Keep only last 1000 usage records
      if (usageHistory.length > 1000) {
        usageHistory.splice(0, usageHistory.length - 1000);
      }
      
      localStorage.setItem(this.usageKey, JSON.stringify(usageHistory));
      
      return true;
    } catch (error) {
      console.error('Failed to record protocol usage:', error);
      return false;
    }
  }

  /**
   * Rate a protocol
   */
  rateProtocol(protocolId, rating, feedback = '') {
    const protocol = this.getProtocol(protocolId);
    if (!protocol || rating < 1 || rating > 5) return false;

    // Update protocol rating
    const totalRating = (protocol.rating * protocol.rating_count) + rating;
    protocol.rating_count++;
    protocol.rating = Math.round((totalRating / protocol.rating_count) * 10) / 10;
    protocol.updated_at = new Date().toISOString();

    return this.storeProtocol(protocol);
  }

  /**
   * Get popular protocols
   */
  getPopularProtocols(limit = 10) {
    return this.getAllProtocols()
      .sort((a, b) => b.usage_count - a.usage_count)
      .slice(0, limit);
  }

  /**
   * Get highest rated protocols
   */
  getTopRatedProtocols(limit = 10, minRatings = 3) {
    return this.getAllProtocols()
      .filter(protocol => protocol.rating_count >= minRatings)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  /**
   * Record protocol adaptation
   */
  recordAdaptation(originalId, adaptedId, notes) {
    try {
      const adaptations = JSON.parse(localStorage.getItem(this.adaptationsKey) || '[]');
      adaptations.push({
        original_id: originalId,
        adapted_id: adaptedId,
        adaptation_notes: notes,
        created_at: new Date().toISOString()
      });
      
      localStorage.setItem(this.adaptationsKey, JSON.stringify(adaptations));
      return true;
    } catch (error) {
      console.error('Failed to record adaptation:', error);
      return false;
    }
  }

  /**
   * Get adaptations of a protocol
   */
  getProtocolAdaptations(protocolId) {
    try {
      const adaptations = JSON.parse(localStorage.getItem(this.adaptationsKey) || '[]');
      return adaptations.filter(adaptation => adaptation.original_id === protocolId);
    } catch {
      return [];
    }
  }

  /**
   * Export protocol library for backup/sharing
   */
  exportLibrary() {
    return {
      protocols: this.getAllProtocols().map(p => p.toJSON()),
      usage_history: JSON.parse(localStorage.getItem(this.usageKey) || '[]'),
      adaptations: JSON.parse(localStorage.getItem(this.adaptationsKey) || '[]'),
      export_date: new Date().toISOString(),
      version: '1.0'
    };
  }

  /**
   * Import protocol library from backup
   */
  importLibrary(libraryData, mergeMode = false) {
    try {
      if (!mergeMode) {
        // Clear existing library
        localStorage.removeItem(this.libraryKey);
        localStorage.removeItem(this.usageKey);
        localStorage.removeItem(this.adaptationsKey);
      }

      // Import protocols
      if (libraryData.protocols) {
        libraryData.protocols.forEach(protocolData => {
          const protocol = new ProtocolTemplate(protocolData);
          this.storeProtocol(protocol);
        });
      }

      // Import usage history
      if (libraryData.usage_history) {
        const existing = mergeMode ? JSON.parse(localStorage.getItem(this.usageKey) || '[]') : [];
        const merged = [...existing, ...libraryData.usage_history];
        localStorage.setItem(this.usageKey, JSON.stringify(merged));
      }

      // Import adaptations
      if (libraryData.adaptations) {
        const existing = mergeMode ? JSON.parse(localStorage.getItem(this.adaptationsKey) || '[]') : [];
        const merged = [...existing, ...libraryData.adaptations];
        localStorage.setItem(this.adaptationsKey, JSON.stringify(merged));
      }

      return true;
    } catch (error) {
      console.error('Failed to import library:', error);
      return false;
    }
  }

  /**
   * Generate protocol statistics
   */
  getLibraryStatistics() {
    const protocols = this.getAllProtocols();
    const usageHistory = JSON.parse(localStorage.getItem(this.usageKey) || '[]');
    
    const stats = {
      total_protocols: protocols.length,
      by_category: {},
      by_difficulty: {},
      total_usage: usageHistory.length,
      average_rating: 0,
      most_popular: null,
      newest_protocol: null
    };

    // Calculate category distribution
    protocols.forEach(protocol => {
      stats.by_category[protocol.category] = (stats.by_category[protocol.category] || 0) + 1;
      stats.by_difficulty[protocol.metadata.difficulty_level] = (stats.by_difficulty[protocol.metadata.difficulty_level] || 0) + 1;
    });

    // Calculate average rating
    const ratedProtocols = protocols.filter(p => p.rating_count > 0);
    if (ratedProtocols.length > 0) {
      stats.average_rating = Math.round((ratedProtocols.reduce((sum, p) => sum + p.rating, 0) / ratedProtocols.length) * 10) / 10;
    }

    // Find most popular and newest
    if (protocols.length > 0) {
      stats.most_popular = protocols.reduce((prev, current) => 
        current.usage_count > prev.usage_count ? current : prev
      ).title;
      
      stats.newest_protocol = protocols.reduce((prev, current) => 
        new Date(current.created_at) > new Date(prev.created_at) ? current : prev
      ).title;
    }

    return stats;
  }
}

// Export the main classes
export { ProtocolTemplate, ProtocolLibrary };

/**
 * Initialize protocol library with defaults
 */
export function initializeProtocolLibrary() {
  const library = new ProtocolLibrary();
  library.initializeDefaultProtocols();
  return library;
}

/**
 * Helper function to apply protocol to experiment setup
 */
export function applyProtocolToExperiment(protocolId, experimentSetup = {}) {
  const library = new ProtocolLibrary();
  const protocol = library.getProtocol(protocolId);
  
  if (!protocol) return experimentSetup;

  // Record usage
  library.recordUsage(protocolId, { session_id: experimentSetup.experiment_id });

  // Apply protocol settings to experiment
  const appliedSetup = {
    ...experimentSetup,
    protocol_applied: {
      id: protocol.id,
      title: protocol.title,
      version: protocol.version
    }
  };

  // Apply measurement frameworks
  if (protocol.protocol.measurement_frameworks) {
    appliedSetup.measurement_frameworks = {
      ...(appliedSetup.measurement_frameworks || {}),
      ...protocol.protocol.measurement_frameworks.reduce((acc, framework) => {
        acc[framework.framework_name] = framework;
        return acc;
      }, {})
    };
  }

  // Apply cognitive preparation notes
  if (protocol.protocol.cognitive_preparation) {
    appliedSetup.cognitive_preparation_notes = protocol.protocol.cognitive_preparation;
  }

  // Apply environmental setup notes
  if (protocol.protocol.environmental_setup) {
    appliedSetup.environmental_setup_notes = protocol.protocol.environmental_setup;
  }

  return appliedSetup;
}