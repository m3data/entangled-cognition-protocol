/**
 * Multi-Session Arc Coordination System
 * 
 * Manages extended longitudinal studies, tracks relationship development,
 * coordinates complex multi-phase protocols, and maintains continuity
 * across session arcs in ECP research.
 */

import { generateUniqueId } from './storage.js';
import { MeasurementScheduler } from './measurementIntegration.js';

/**
 * Multi-session arc coordinator - manages extended studies over weeks/months
 */
export class MultiSessionArcCoordinator {
  constructor() {
    this.activeArcs = new Map();
    this.sessionHistory = new Map();
    this.reminderSchedules = new Map();
    this.progressTrackers = new Map();
  }

  /**
   * Create a new multi-session arc from template
   */
  createArc(template, config = {}) {
    const arcId = generateUniqueId('arc');
    
    const arc = {
      id: arcId,
      templateId: template.id,
      title: config.title || template.name,
      description: template.description,
      status: 'created',
      
      // Timing and schedule
      startDate: config.startDate || new Date().toISOString(),
      estimatedEndDate: this.calculateEndDate(template, config),
      actualEndDate: null,
      
      // Session tracking
      totalSessions: this.calculateTotalSessions(template),
      completedSessions: 0,
      currentPhase: 0,
      currentSession: 0,
      
      // Configuration
      sessionFrequency: config.sessionFrequency || 'daily', // daily, weekly, bi-weekly
      preferredTimes: config.preferredTimes || [], // array of preferred times
      reminderSettings: config.reminderSettings || { enabled: true, minutesBefore: 15 },
      
      // Customizations
      customizations: config.customizations || {},
      adaptations: [], // Track any mid-arc adaptations
      
      // Progress tracking
      phases: template.phases.map(phase => ({
        ...phase,
        status: 'pending',
        startDate: null,
        endDate: null,
        sessionsCompleted: 0,
        totalSessions: this.calculatePhaseSessions(phase),
        adaptations: []
      })),
      
      // Data integration
      measurementScheduler: new MeasurementScheduler(),
      
      // Metadata
      created: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      version: '1.0.0'
    };
    
    // Initialize measurement schedule
    arc.measurementScheduler.createScheduleFromTemplate(template, arcId);
    
    this.activeArcs.set(arcId, arc);
    this.initializeSessionHistory(arcId);
    this.setupReminders(arcId);
    
    return arcId;
  }

  /**
   * Start an arc (move from created to active)
   */
  startArc(arcId) {
    const arc = this.activeArcs.get(arcId);
    if (!arc) return false;
    
    arc.status = 'active';
    arc.actualStartDate = new Date().toISOString();
    arc.phases[0].status = 'active';
    arc.phases[0].startDate = new Date().toISOString();
    
    // Schedule first session
    this.scheduleNextSession(arcId);
    
    this.saveArcState(arcId);
    return true;
  }

  /**
   * Complete a session in the arc
   */
  completeSession(arcId, sessionData) {
    const arc = this.activeArcs.get(arcId);
    if (!arc) return false;
    
    const sessionId = generateUniqueId('session');
    const session = {
      id: sessionId,
      arcId,
      phase: arc.currentPhase,
      sessionNumber: arc.currentSession + 1,
      timestamp: new Date().toISOString(),
      duration: sessionData.duration,
      data: sessionData,
      measurements: sessionData.measurements || {},
      notes: sessionData.notes || '',
      insights: sessionData.insights || '',
      nextSessionPlanned: null
    };
    
    // Record session
    this.recordSession(arcId, session);
    
    // Update arc progress
    arc.completedSessions++;
    arc.currentSession++;
    arc.lastActivity = new Date().toISOString();
    
    // Update phase progress
    const currentPhase = arc.phases[arc.currentPhase];
    currentPhase.sessionsCompleted++;
    
    // Check if phase is complete
    if (this.isPhaseComplete(arc, arc.currentPhase)) {
      this.completePhase(arcId, arc.currentPhase);
    }
    
    // Check if arc is complete
    if (this.isArcComplete(arc)) {
      this.completeArc(arcId);
    } else {
      // Schedule next session
      this.scheduleNextSession(arcId);
    }
    
    this.saveArcState(arcId);
    return sessionId;
  }

  /**
   * Get current session requirements
   */
  getCurrentSessionRequirements(arcId) {
    const arc = this.activeArcs.get(arcId);
    if (!arc) return null;
    
    const currentPhase = arc.phases[arc.currentPhase];
    if (!currentPhase) return null;
    
    const sessionIndex = arc.currentSession % currentPhase.steps.length;
    const currentStep = currentPhase.steps[sessionIndex];
    
    return {
      arc: {
        id: arcId,
        title: arc.title,
        progress: (arc.completedSessions / arc.totalSessions) * 100
      },
      phase: {
        index: arc.currentPhase,
        name: currentPhase.name,
        description: currentPhase.description,
        progress: (currentPhase.sessionsCompleted / currentPhase.totalSessions) * 100
      },
      session: {
        number: arc.currentSession + 1,
        total: arc.totalSessions
      },
      step: currentStep,
      measurements: arc.measurementScheduler.getMeasurementsForStep(
        arcId, 
        arc.currentPhase, 
        sessionIndex
      ),
      previousSessions: this.getRecentSessions(arcId, 3),
      continuityNotes: this.generateContinuityNotes(arcId)
    };
  }

  /**
   * Generate continuity notes to maintain coherence across sessions
   */
  generateContinuityNotes(arcId) {
    const history = this.sessionHistory.get(arcId) || [];
    const recentSessions = history.slice(-3);
    
    if (recentSessions.length === 0) {
      return {
        summary: 'First session in this arc',
        themes: [],
        evolution: null,
        recommendations: ['Take time to settle into the practice', 'Document your baseline state']
      };
    }
    
    // Analyze themes and patterns
    const themes = this.extractThemes(recentSessions);
    const evolution = this.trackEvolution(recentSessions);
    const recommendations = this.generateSessionRecommendations(recentSessions);
    
    return {
      summary: `Building on ${recentSessions.length} recent sessions`,
      themes: themes,
      evolution: evolution,
      recommendations: recommendations,
      lastSessionDate: recentSessions[recentSessions.length - 1]?.timestamp,
      timeSinceLastSession: this.calculateTimeSinceLastSession(arcId)
    };
  }

  /**
   * Adapt arc based on emerging patterns
   */
  adaptArc(arcId, adaptationType, adaptationData) {
    const arc = this.activeArcs.get(arcId);
    if (!arc) return false;
    
    const adaptation = {
      id: generateUniqueId('adaptation'),
      timestamp: new Date().toISOString(),
      type: adaptationType,
      data: adaptationData,
      reason: adaptationData.reason,
      appliedAt: {
        phase: arc.currentPhase,
        session: arc.currentSession
      }
    };
    
    switch (adaptationType) {
      case 'frequency_change':
        arc.sessionFrequency = adaptationData.newFrequency;
        this.updateSchedule(arcId);
        break;
        
      case 'phase_modification':
        this.modifyPhase(arcId, adaptationData.phaseIndex, adaptationData.modifications);
        break;
        
      case 'measurement_adjustment':
        this.adjustMeasurements(arcId, adaptationData.adjustments);
        break;
        
      case 'duration_extension':
        this.extendArcDuration(arcId, adaptationData.additionalSessions);
        break;
        
      case 'early_completion':
        this.completeArc(arcId, adaptationData.reason);
        break;
    }
    
    arc.adaptations.push(adaptation);
    this.saveArcState(arcId);
    
    return adaptation.id;
  }

  /**
   * Get arc progress and analytics
   */
  getArcProgress(arcId) {
    const arc = this.activeArcs.get(arcId);
    if (!arc) return null;
    
    const history = this.sessionHistory.get(arcId) || [];
    
    return {
      basic: {
        totalSessions: arc.totalSessions,
        completedSessions: arc.completedSessions,
        remainingSessions: arc.totalSessions - arc.completedSessions,
        percentComplete: (arc.completedSessions / arc.totalSessions) * 100,
        currentPhase: arc.currentPhase,
        totalPhases: arc.phases.length
      },
      timing: {
        startDate: arc.actualStartDate || arc.startDate,
        estimatedEndDate: arc.estimatedEndDate,
        actualEndDate: arc.actualEndDate,
        daysSinceStart: this.calculateDaysSinceStart(arc),
        averageSessionInterval: this.calculateAverageInterval(history),
        nextSessionDue: this.getNextSessionTime(arcId)
      },
      phases: arc.phases.map((phase, index) => ({
        name: phase.name,
        status: phase.status,
        progress: (phase.sessionsCompleted / phase.totalSessions) * 100,
        startDate: phase.startDate,
        endDate: phase.endDate,
        isCurrent: index === arc.currentPhase
      })),
      measurements: this.getMeasurementProgress(arcId),
      adaptations: arc.adaptations.length,
      consistency: this.calculateConsistencyScore(history)
    };
  }

  /**
   * Generate insights from multi-session patterns
   */
  generateArcInsights(arcId) {
    const arc = this.activeArcs.get(arcId);
    const history = this.sessionHistory.get(arcId) || [];
    
    if (history.length < 3) {
      return {
        status: 'insufficient_data',
        message: 'More sessions needed for pattern analysis',
        recommendations: ['Continue with consistent practice', 'Focus on detailed documentation']
      };
    }
    
    const insights = {
      patterns: this.analyzeSessionPatterns(history),
      evolution: this.analyzeEvolution(history),
      relationships: this.analyzeRelationshipDevelopment(history),
      effectiveness: this.analyzeEffectiveness(history),
      recommendations: this.generateArcRecommendations(arc, history)
    };
    
    return insights;
  }

  /**
   * Export arc data for analysis
   */
  exportArcData(arcId, format = 'json') {
    const arc = this.activeArcs.get(arcId);
    const history = this.sessionHistory.get(arcId) || [];
    
    if (!arc) return null;
    
    const exportData = {
      arc: {
        ...arc,
        measurementScheduler: undefined // Exclude non-serializable data
      },
      sessions: history,
      summary: this.getArcProgress(arcId),
      insights: this.generateArcInsights(arcId),
      exportedAt: new Date().toISOString(),
      format: format
    };
    
    if (format === 'csv') {
      return this.convertToCSV(exportData);
    }
    
    return exportData;
  }

  // Private helper methods
  
  calculateEndDate(template, config) {
    const totalSessions = this.calculateTotalSessions(template);
    const frequency = config.sessionFrequency || 'daily';
    
    let daysBetweenSessions = 1;
    switch (frequency) {
      case 'daily': daysBetweenSessions = 1; break;
      case 'every-other-day': daysBetweenSessions = 2; break;
      case 'weekly': daysBetweenSessions = 7; break;
      case 'bi-weekly': daysBetweenSessions = 14; break;
    }
    
    const totalDays = totalSessions * daysBetweenSessions;
    const startDate = new Date(config.startDate || new Date());
    const endDate = new Date(startDate.getTime() + (totalDays * 24 * 60 * 60 * 1000));
    
    return endDate.toISOString();
  }
  
  calculateTotalSessions(template) {
    return template.phases.reduce((total, phase) => {
      return total + this.calculatePhaseSessions(phase);
    }, 0);
  }
  
  calculatePhaseSessions(phase) {
    // For multi-session arcs, phases may repeat steps multiple times
    if (phase.sessionCount) return phase.sessionCount;
    if (phase.duration && phase.sessionFrequency) {
      // Calculate based on duration and frequency
      return Math.ceil(this.parseDuration(phase.duration) / this.parseFrequency(phase.sessionFrequency));
    }
    return phase.steps.length; // Default: one session per step
  }
  
  isPhaseComplete(arc, phaseIndex) {
    const phase = arc.phases[phaseIndex];
    return phase.sessionsCompleted >= phase.totalSessions;
  }
  
  isArcComplete(arc) {
    return arc.completedSessions >= arc.totalSessions;
  }
  
  completePhase(arcId, phaseIndex) {
    const arc = this.activeArcs.get(arcId);
    const phase = arc.phases[phaseIndex];
    
    phase.status = 'completed';
    phase.endDate = new Date().toISOString();
    
    // Move to next phase if available
    if (phaseIndex + 1 < arc.phases.length) {
      arc.currentPhase = phaseIndex + 1;
      arc.currentSession = 0;
      arc.phases[phaseIndex + 1].status = 'active';
      arc.phases[phaseIndex + 1].startDate = new Date().toISOString();
    }
  }
  
  completeArc(arcId, reason = 'natural_completion') {
    const arc = this.activeArcs.get(arcId);
    
    arc.status = 'completed';
    arc.actualEndDate = new Date().toISOString();
    arc.completionReason = reason;
    
    // Complete any remaining phases
    arc.phases.forEach(phase => {
      if (phase.status === 'active' || phase.status === 'pending') {
        phase.status = 'completed';
        phase.endDate = arc.actualEndDate;
      }
    });
    
    this.clearReminders(arcId);
  }
  
  initializeSessionHistory(arcId) {
    this.sessionHistory.set(arcId, []);
  }
  
  recordSession(arcId, session) {
    const history = this.sessionHistory.get(arcId) || [];
    history.push(session);
    this.sessionHistory.set(arcId, history);
  }
  
  getRecentSessions(arcId, count = 5) {
    const history = this.sessionHistory.get(arcId) || [];
    return history.slice(-count);
  }
  
  scheduleNextSession(arcId) {
    const arc = this.activeArcs.get(arcId);
    if (!arc || arc.status === 'completed') return;
    
    const nextSessionTime = this.calculateNextSessionTime(arc);
    
    if (arc.reminderSettings.enabled) {
      this.scheduleReminder(arcId, nextSessionTime);
    }
    
    return nextSessionTime;
  }
  
  calculateNextSessionTime(arc) {
    const lastSession = this.getLastSession(arc.id);
    const baseTime = lastSession ? new Date(lastSession.timestamp) : new Date();
    
    let intervalMillis = 24 * 60 * 60 * 1000; // Default: 1 day
    
    switch (arc.sessionFrequency) {
      case 'daily': intervalMillis = 24 * 60 * 60 * 1000; break;
      case 'every-other-day': intervalMillis = 2 * 24 * 60 * 60 * 1000; break;
      case 'weekly': intervalMillis = 7 * 24 * 60 * 60 * 1000; break;
      case 'bi-weekly': intervalMillis = 14 * 24 * 60 * 60 * 1000; break;
    }
    
    return new Date(baseTime.getTime() + intervalMillis);
  }
  
  getLastSession(arcId) {
    const history = this.sessionHistory.get(arcId) || [];
    return history[history.length - 1] || null;
  }
  
  setupReminders(arcId) {
    // Implementation would depend on notification system
    // For now, just track that reminders are set up
    this.reminderSchedules.set(arcId, {
      enabled: true,
      created: new Date().toISOString()
    });
  }
  
  scheduleReminder(arcId, sessionTime) {
    // Implementation would schedule actual reminders
    console.log(`Reminder scheduled for arc ${arcId} at ${sessionTime}`);
  }
  
  clearReminders(arcId) {
    this.reminderSchedules.delete(arcId);
  }
  
  saveArcState(arcId) {
    // Implementation would persist to localStorage or database
    const arc = this.activeArcs.get(arcId);
    const history = this.sessionHistory.get(arcId);
    
    try {
      localStorage.setItem(`ecp_arc_${arcId}`, JSON.stringify({
        arc: {
          ...arc,
          measurementScheduler: undefined // Don't serialize the scheduler
        },
        history
      }));
    } catch (error) {
      console.error('Failed to save arc state:', error);
    }
  }
  
  loadArcState(arcId) {
    try {
      const saved = localStorage.getItem(`ecp_arc_${arcId}`);
      if (!saved) return null;
      
      const data = JSON.parse(saved);
      
      // Restore measurement scheduler
      data.arc.measurementScheduler = new MeasurementScheduler();
      
      this.activeArcs.set(arcId, data.arc);
      this.sessionHistory.set(arcId, data.history || []);
      
      return data.arc;
    } catch (error) {
      console.error('Failed to load arc state:', error);
      return null;
    }
  }
  
  // Analysis helper methods
  
  extractThemes(sessions) {
    // Simple theme extraction from session notes and insights
    const allText = sessions.map(s => `${s.notes} ${s.insights}`).join(' ');
    
    // Basic keyword extraction (would use more sophisticated NLP in production)
    const words = allText.toLowerCase().split(/\s+/);
    const wordCounts = {};
    
    words.forEach(word => {
      if (word.length > 4) { // Only meaningful words
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      }
    });
    
    return Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({ theme: word, frequency: count }));
  }
  
  trackEvolution(sessions) {
    if (sessions.length < 2) return null;
    
    // Compare first and last sessions
    const first = sessions[0];
    const last = sessions[sessions.length - 1];
    
    return {
      timespan: new Date(last.timestamp) - new Date(first.timestamp),
      sessionCount: sessions.length,
      qualitativeChange: this.compareSessionQuality(first, last),
      keyShifts: this.identifyKeyShifts(sessions)
    };
  }
  
  compareSessionQuality(session1, session2) {
    // Simple comparison based on available data
    const quality1 = this.assessSessionQuality(session1);
    const quality2 = this.assessSessionQuality(session2);
    
    return {
      direction: quality2 > quality1 ? 'improving' : quality2 < quality1 ? 'declining' : 'stable',
      magnitude: Math.abs(quality2 - quality1)
    };
  }
  
  assessSessionQuality(session) {
    // Simple quality assessment based on available metrics
    let quality = 5; // baseline
    
    if (session.measurements) {
      const measurements = Object.values(session.measurements);
      if (measurements.length > 0) {
        quality = measurements.reduce((sum, val) => sum + (val || 5), 0) / measurements.length;
      }
    }
    
    // Adjust based on notes/insights length (more detail often indicates engagement)
    const textLength = (session.notes || '').length + (session.insights || '').length;
    if (textLength > 200) quality += 0.5;
    if (textLength > 500) quality += 0.5;
    
    return Math.min(10, Math.max(1, quality));
  }
  
  identifyKeyShifts(sessions) {
    const shifts = [];
    
    for (let i = 1; i < sessions.length; i++) {
      const prev = sessions[i - 1];
      const curr = sessions[i];
      
      const qualityChange = this.assessSessionQuality(curr) - this.assessSessionQuality(prev);
      
      if (Math.abs(qualityChange) > 1.5) {
        shifts.push({
          sessionNumber: i + 1,
          type: qualityChange > 0 ? 'positive_shift' : 'negative_shift',
          magnitude: Math.abs(qualityChange),
          possibleFactors: this.analyzePossibleFactors(prev, curr)
        });
      }
    }
    
    return shifts;
  }
  
  analyzePossibleFactors(session1, session2) {
    const factors = [];
    
    // Check for timing differences
    const time1 = new Date(session1.timestamp);
    const time2 = new Date(session2.timestamp);
    const hourDiff = Math.abs(time1.getHours() - time2.getHours());
    
    if (hourDiff > 2) {
      factors.push(`Time of day shift (${time1.getHours()}:00 to ${time2.getHours()}:00)`);
    }
    
    // Check for duration differences
    if (session1.duration && session2.duration) {
      const durationDiff = Math.abs(session1.duration - session2.duration);
      if (durationDiff > 10) { // More than 10 minutes difference
        factors.push(`Session duration change (${session1.duration}min to ${session2.duration}min)`);
      }
    }
    
    return factors;
  }
  
  calculateConsistencyScore(sessions) {
    if (sessions.length < 2) return null;
    
    // Calculate based on regular timing and quality consistency
    const intervals = [];
    const qualities = [];
    
    for (let i = 1; i < sessions.length; i++) {
      const interval = new Date(sessions[i].timestamp) - new Date(sessions[i-1].timestamp);
      intervals.push(interval);
      qualities.push(this.assessSessionQuality(sessions[i]));
    }
    
    // Calculate coefficient of variation for intervals
    const meanInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const intervalVariance = intervals.reduce((sum, interval) => {
      return sum + Math.pow(interval - meanInterval, 2);
    }, 0) / intervals.length;
    const intervalCV = Math.sqrt(intervalVariance) / meanInterval;
    
    // Calculate coefficient of variation for quality
    const meanQuality = qualities.reduce((a, b) => a + b, 0) / qualities.length;
    const qualityVariance = qualities.reduce((sum, quality) => {
      return sum + Math.pow(quality - meanQuality, 2);
    }, 0) / qualities.length;
    const qualityCV = Math.sqrt(qualityVariance) / meanQuality;
    
    // Lower CV = higher consistency
    const timingConsistency = Math.max(0, 1 - intervalCV);
    const qualityConsistency = Math.max(0, 1 - qualityCV);
    
    return {
      overall: (timingConsistency + qualityConsistency) / 2,
      timing: timingConsistency,
      quality: qualityConsistency
    };
  }
  
  generateArcRecommendations(arc, history) {
    const recommendations = [];
    const progress = this.getArcProgress(arc.id);
    const consistency = this.calculateConsistencyScore(history);
    
    // Consistency recommendations
    if (consistency && consistency.timing < 0.7) {
      recommendations.push({
        type: 'consistency',
        priority: 'high',
        message: 'Consider maintaining more regular session timing for better rhythm',
        action: 'Set specific times for sessions and use reminders'
      });
    }
    
    // Progress recommendations
    if (progress.basic.percentComplete > 75 && arc.status === 'active') {
      recommendations.push({
        type: 'completion',
        priority: 'medium',
        message: 'You\'re nearing completion - consider how to integrate insights',
        action: 'Plan for post-arc integration and follow-up'
      });
    }
    
    // Adaptation recommendations
    if (arc.adaptations.length === 0 && history.length > 10) {
      recommendations.push({
        type: 'adaptation',
        priority: 'low',
        message: 'Consider if any adjustments to the protocol would be helpful',
        action: 'Review what\'s working well and what could be modified'
      });
    }
    
    return recommendations;
  }
  
  getMeasurementProgress(arcId) {
    const arc = this.activeArcs.get(arcId);
    if (!arc || !arc.measurementScheduler) return null;
    
    return arc.measurementScheduler.getCompletionStatus(arcId);
  }
  
  calculateDaysSinceStart(arc) {
    const startDate = new Date(arc.actualStartDate || arc.startDate);
    const now = new Date();
    return Math.floor((now - startDate) / (24 * 60 * 60 * 1000));
  }
  
  calculateAverageInterval(sessions) {
    if (sessions.length < 2) return null;
    
    const intervals = [];
    for (let i = 1; i < sessions.length; i++) {
      const interval = new Date(sessions[i].timestamp) - new Date(sessions[i-1].timestamp);
      intervals.push(interval / (24 * 60 * 60 * 1000)); // Convert to days
    }
    
    return intervals.reduce((a, b) => a + b, 0) / intervals.length;
  }
  
  getNextSessionTime(arcId) {
    const arc = this.activeArcs.get(arcId);
    if (!arc || arc.status === 'completed') return null;
    
    return this.calculateNextSessionTime(arc);
  }
  
  calculateTimeSinceLastSession(arcId) {
    const lastSession = this.getLastSession(arcId);
    if (!lastSession) return null;
    
    const now = new Date();
    const lastTime = new Date(lastSession.timestamp);
    const diffMillis = now - lastTime;
    
    const days = Math.floor(diffMillis / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diffMillis % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    
    if (days > 0) {
      return `${days} day(s) ago`;
    } else if (hours > 0) {
      return `${hours} hour(s) ago`;
    } else {
      return 'Less than an hour ago';
    }
  }
  
  convertToCSV(exportData) {
    // Simple CSV conversion for session data
    const sessions = exportData.sessions;
    if (sessions.length === 0) return '';
    
    const headers = ['session_number', 'phase', 'timestamp', 'duration', 'notes', 'insights'];
    const rows = sessions.map(session => [
      session.sessionNumber,
      session.phase,
      session.timestamp,
      session.duration,
      `"${(session.notes || '').replace(/"/g, '""')}"`,
      `"${(session.insights || '').replace(/"/g, '""')}"`
    ]);
    
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }
}

export default MultiSessionArcCoordinator;