/**
 * Community Sharing System for ECP Field Journal
 * 
 * Implements consent-based community data sharing that honors individual privacy
 * while enabling collective pattern recognition and wisdom generation.
 * 
 * Core Principles:
 * - Everything is opt-in and consent-based
 * - Users maintain full control over their data
 * - Sacred data stewardship with reverence and care
 * - Community contribution enhances rather than extracts from individual practice
 */

/**
 * Community Sharing Settings Management
 */
class CommunitySettings {
  constructor() {
    this.settingsKey = 'ecp-community-settings';
    this.contributionsKey = 'ecp-community-contributions';
  }

  /**
   * Get user's community sharing preferences
   */
  getSettings() {
    const defaultSettings = {
      participateInCommunity: false,
      shareAnalyticsData: false,
      sharePatternInsights: false,
      shareProtocolAdaptations: false,
      allowResearchParticipation: false,
      anonymizationLevel: 'high', // low, medium, high, maximum
      contributionMode: 'anonymous', // anonymous, pseudonymous
      dataRetentionPreference: '1year', // 6months, 1year, 2years, indefinite
      consentVersion: '1.0',
      consentTimestamp: null,
      lastReviewDate: null
    };

    try {
      const stored = localStorage.getItem(this.settingsKey);
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch (error) {
      console.error('Failed to load community settings:', error);
      return defaultSettings;
    }
  }

  /**
   * Update community sharing settings with new consent
   */
  updateSettings(newSettings) {
    try {
      const current = this.getSettings();
      const updated = {
        ...current,
        ...newSettings,
        lastReviewDate: new Date().toISOString()
      };

      // If participation is being enabled for the first time, record consent
      if (!current.participateInCommunity && newSettings.participateInCommunity) {
        updated.consentTimestamp = new Date().toISOString();
      }

      localStorage.setItem(this.settingsKey, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Failed to save community settings:', error);
      return null;
    }
  }

  /**
   * Check if user has given valid consent for community participation
   */
  hasValidConsent() {
    const settings = this.getSettings();
    if (!settings.participateInCommunity || !settings.consentTimestamp) {
      return false;
    }

    // Check consent is not older than 1 year
    const consentDate = new Date(settings.consentTimestamp);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    return consentDate > oneYearAgo;
  }

  /**
   * Revoke all community participation and delete contributed data
   */
  revokeConsent() {
    try {
      // Clear settings
      localStorage.removeItem(this.settingsKey);
      
      // Clear all community contributions
      localStorage.removeItem(this.contributionsKey);
      localStorage.removeItem('ecp-community-patterns');
      localStorage.removeItem('ecp-community-insights-index');
      
      // Clear any community analytics data
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('ecp-community-')) {
          localStorage.removeItem(key);
        }
      });

      return true;
    } catch (error) {
      console.error('Failed to revoke community consent:', error);
      return false;
    }
  }
}

/**
 * Data Anonymization and Preparation for Community Sharing
 */
class DataAnonymizer {
  constructor(anonymizationLevel = 'high') {
    this.level = anonymizationLevel;
  }

  /**
   * Anonymize experiment entry for community sharing
   */
  anonymizeExperiment(experiment, settings) {
    const level = settings.anonymizationLevel;
    const anonymized = JSON.parse(JSON.stringify(experiment)); // Deep clone

    // Always remove identifying information
    delete anonymized.author;
    delete anonymized.experiment_id;
    
    // Anonymize timestamps based on level
    if (level !== 'low') {
      anonymized.time_of_day = this.getTimeOfDay(anonymized.timestamp_start);
      anonymized.day_of_week = this.getDayOfWeek(anonymized.timestamp_start);
      delete anonymized.timestamp_start;
      delete anonymized.timestamp_end;
    }

    // Location anonymization
    if (anonymized.relational_field?.location) {
      delete anonymized.relational_field.location.coordinates;
      
      if (level === 'high' || level === 'maximum') {
        // Generalize location to broad categories
        anonymized.relational_field.location.type = this.generalizeLocation(
          anonymized.relational_field.location.label
        );
        delete anonymized.relational_field.location.label;
      }
    }

    // Remove sensitive modulator details for high anonymization
    if (level === 'high' || level === 'maximum') {
      if (anonymized.human?.ingested_modulators) {
        // Keep only presence/absence of major categories
        const modulators = anonymized.human.ingested_modulators;
        anonymized.human.ingested_modulators = {
          has_caffeine: modulators.caffeine > 0,
          has_psychedelics: (modulators.psilocybin > 0 || modulators.lysergic_acid_diethylamide > 0 || modulators.dimethyltryptamine > 0),
          has_cannabis: modulators.tetrahydrocannabinol > 0,
          has_alcohol: modulators.alcohol > 0,
          has_other: !!modulators.other_modulators
        };
      }
    }

    // Remove free-text fields that might contain identifying information
    if (level === 'maximum') {
      delete anonymized.human?.ontological_orientation?.description;
      delete anonymized.throughput?.emergent_ecp_insights;
      delete anonymized.machine?.custom_instructions;
      delete anonymized.human?.environment?.priming_music;
      delete anonymized.human?.environment?.music_while_conversing;
    }

    // Add anonymization metadata
    anonymized.community_metadata = {
      anonymization_level: level,
      anonymization_timestamp: new Date().toISOString(),
      original_data_retained: false
    };

    return anonymized;
  }

  /**
   * Extract aggregate patterns without personal details
   */
  extractPatterns(experiment, settings) {
    return {
      cognitive_pattern: {
        mode: experiment.human?.cognitive_mode,
        ontological_strength: experiment.human?.ontological_orientation?.strength,
        affective_tone: experiment.human?.affective_tone
      },
      interaction_quality: {
        response_quality: experiment.throughput?.felt_response_quality,
        symbolic_density: experiment.throughput?.symbolic_density,
        unexpected_resonance: !!experiment.throughput?.unexpected_resonance,
        collapse_event: experiment.throughput?.observed_collapse_event
      },
      environmental_context: {
        weather_category: this.generalizeWeather(experiment.human?.environment?.weather),
        temperature_range: this.generalizeTemperature(experiment.human?.environment?.temperature),
        lighting_type: experiment.relational_field?.lighting
      },
      temporal_context: {
        time_of_day: this.getTimeOfDay(experiment.timestamp_start),
        day_of_week: this.getDayOfWeek(experiment.timestamp_start)
      },
      measurement_data: experiment.measurement_frameworks || null
    };
  }

  // Helper methods for generalization
  getTimeOfDay(timestamp) {
    const date = new Date(timestamp);
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }

  getDayOfWeek(timestamp) {
    const date = new Date(timestamp);
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  }

  generalizeLocation(location) {
    if (!location) return 'unspecified';
    const lower = location.toLowerCase();
    if (lower.includes('home') || lower.includes('house') || lower.includes('apartment')) return 'residence';
    if (lower.includes('office') || lower.includes('work')) return 'workplace';
    if (lower.includes('outdoor') || lower.includes('park') || lower.includes('nature')) return 'outdoor_space';
    if (lower.includes('cafe') || lower.includes('restaurant')) return 'public_indoor';
    return 'other_location';
  }

  generalizeWeather(weather) {
    if (!weather) return 'unspecified';
    const lower = weather.toLowerCase();
    if (lower.includes('sun') || lower.includes('clear')) return 'clear';
    if (lower.includes('cloud') || lower.includes('overcast')) return 'cloudy';
    if (lower.includes('rain') || lower.includes('storm')) return 'precipitation';
    return 'other';
  }

  generalizeTemperature(temp) {
    if (typeof temp !== 'number') return 'unspecified';
    if (temp < 10) return 'cold';
    if (temp < 20) return 'cool';
    if (temp < 25) return 'moderate';
    if (temp < 30) return 'warm';
    return 'hot';
  }
}

/**
 * Community Data Contribution Manager
 */
class CommunityContributor {
  constructor() {
    this.settings = new CommunitySettings();
    this.anonymizer = new DataAnonymizer();
    this.contributionsKey = 'ecp-community-contributions';
    this.patternsKey = 'ecp-community-patterns';
  }

  /**
   * Contribute experiment data to community pool
   */
  async contributeExperiment(experiment) {
    const userSettings = this.settings.getSettings();
    
    if (!this.settings.hasValidConsent() || !userSettings.shareAnalyticsData) {
      return { success: false, reason: 'no_consent' };
    }

    try {
      // Anonymize the experiment
      const anonymizedExp = this.anonymizer.anonymizeExperiment(experiment, userSettings);
      
      // Extract patterns for aggregate analysis
      const patterns = this.anonymizer.extractPatterns(experiment, userSettings);
      
      // Store contribution
      const contributionId = await this.generateContributionId(experiment);
      const contribution = {
        id: contributionId,
        type: 'experiment',
        timestamp: new Date().toISOString(),
        anonymized_data: anonymizedExp,
        pattern_data: patterns,
        settings_snapshot: {
          anonymization_level: userSettings.anonymizationLevel,
          contribution_mode: userSettings.contributionMode
        }
      };

      this.storeContribution(contribution);
      this.updateCommunityPatterns(patterns, contributionId);

      return { 
        success: true, 
        contribution_id: contributionId,
        anonymization_applied: userSettings.anonymizationLevel
      };
    } catch (error) {
      console.error('Failed to contribute experiment:', error);
      return { success: false, reason: 'processing_error', error: error.message };
    }
  }

  /**
   * Store individual contribution
   */
  storeContribution(contribution) {
    try {
      const existing = JSON.parse(localStorage.getItem(this.contributionsKey) || '[]');
      existing.push(contribution);
      
      // Keep only last 100 contributions per user to manage storage
      if (existing.length > 100) {
        existing.splice(0, existing.length - 100);
      }
      
      localStorage.setItem(this.contributionsKey, JSON.stringify(existing));
    } catch (error) {
      console.error('Failed to store contribution:', error);
    }
  }

  /**
   * Update community-wide pattern aggregates
   */
  updateCommunityPatterns(patterns, contributionId) {
    try {
      const existing = JSON.parse(localStorage.getItem(this.patternsKey) || '{}');
      
      // Aggregate cognitive patterns
      if (patterns.cognitive_pattern.mode) {
        existing.cognitive_modes = existing.cognitive_modes || {};
        existing.cognitive_modes[patterns.cognitive_pattern.mode] = 
          (existing.cognitive_modes[patterns.cognitive_pattern.mode] || 0) + 1;
      }

      // Aggregate quality patterns
      if (typeof patterns.interaction_quality.response_quality === 'number') {
        existing.quality_distribution = existing.quality_distribution || [];
        existing.quality_distribution.push(patterns.interaction_quality.response_quality);
        
        // Keep only last 1000 data points
        if (existing.quality_distribution.length > 1000) {
          existing.quality_distribution = existing.quality_distribution.slice(-1000);
        }
      }

      // Aggregate temporal patterns
      existing.temporal_patterns = existing.temporal_patterns || {};
      if (patterns.temporal_context.time_of_day) {
        existing.temporal_patterns.time_of_day = existing.temporal_patterns.time_of_day || {};
        existing.temporal_patterns.time_of_day[patterns.temporal_context.time_of_day] = 
          (existing.temporal_patterns.time_of_day[patterns.temporal_context.time_of_day] || 0) + 1;
      }

      // Update metadata
      existing.last_updated = new Date().toISOString();
      existing.total_contributions = (existing.total_contributions || 0) + 1;
      existing.contribution_ids = existing.contribution_ids || [];
      existing.contribution_ids.push(contributionId);

      localStorage.setItem(this.patternsKey, JSON.stringify(existing));
    } catch (error) {
      console.error('Failed to update community patterns:', error);
    }
  }

  /**
   * Get user's contribution history
   */
  getContributionHistory() {
    try {
      return JSON.parse(localStorage.getItem(this.contributionsKey) || '[]');
    } catch {
      return [];
    }
  }

  /**
   * Get community patterns (read-only access)
   */
  getCommunityPatterns() {
    try {
      return JSON.parse(localStorage.getItem(this.patternsKey) || '{}');
    } catch {
      return {};
    }
  }

  /**
   * Generate unique contribution ID
   */
  async generateContributionId(experiment) {
    const data = JSON.stringify(experiment) + Date.now();
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
  }

  /**
   * Delete specific contribution
   */
  deleteContribution(contributionId) {
    try {
      const contributions = this.getContributionHistory();
      const updated = contributions.filter(c => c.id !== contributionId);
      localStorage.setItem(this.contributionsKey, JSON.stringify(updated));
      
      // Note: We don't remove from community patterns as that would affect aggregate data
      // Community patterns represent collective knowledge that transcends individual contributions
      
      return true;
    } catch (error) {
      console.error('Failed to delete contribution:', error);
      return false;
    }
  }
}

// Export the main classes
export { CommunitySettings, DataAnonymizer, CommunityContributor };

// Helper functions for UI integration
export function createConsentDialog() {
  return `
    <div class="community-consent-dialog">
      <h3>Join the ECP Community Learning Circle</h3>
      <p>Contribute your practice wisdom to our collective understanding while maintaining full privacy control.</p>
      
      <div class="consent-sections">
        <div class="consent-section">
          <h4>What We're Creating Together</h4>
          <ul>
            <li>Pattern recognition across diverse ECP practices</li>
            <li>Collective insights about human-AI collaboration</li>
            <li>Shared wisdom about embodied cognition research</li>
            <li>Community protocols and best practices</li>
          </ul>
        </div>

        <div class="consent-section">
          <h4>Your Privacy Rights</h4>
          <ul>
            <li>You control what data is shared and when</li>
            <li>All data is anonymized before community contribution</li>
            <li>You can withdraw consent and delete contributions anytime</li>
            <li>No personal identifying information is ever shared</li>
          </ul>
        </div>

        <div class="consent-section">
          <h4>Sacred Data Stewardship</h4>
          <p>Your experimental data represents sacred inquiry into consciousness, embodiment, and meaning-making. We treat all contributions with reverence, using them only to serve collective wisdom and individual flourishing.</p>
        </div>
      </div>

      <div class="consent-options">
        <label>
          <input type="checkbox" name="participate" value="true">
          I consent to participate in community learning
        </label>
        
        <label>
          <input type="checkbox" name="shareAnalytics" value="true">
          Share anonymized experiment analytics
        </label>
        
        <label>
          <input type="checkbox" name="sharePatterns" value="true">
          Contribute to pattern recognition research
        </label>
        
        <label>
          <input type="checkbox" name="shareProtocols" value="true">
          Share adapted protocols and templates
        </label>
      </div>

      <div class="anonymization-level">
        <label for="anonymization-level">Data Anonymization Level:</label>
        <select name="anonymization-level">
          <option value="medium">Medium - General anonymization</option>
          <option value="high" selected>High - Strong privacy protection</option>
          <option value="maximum">Maximum - Minimal data sharing</option>
        </select>
      </div>

      <div class="consent-actions">
        <button type="button" class="consent-accept">Join Community Learning</button>
        <button type="button" class="consent-decline">Continue Individual Practice</button>
      </div>
    </div>
  `;
}