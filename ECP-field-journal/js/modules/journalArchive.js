// js/modules/journalArchive.js
/**
 * Journal Archive Module
 * Loads and displays experiment and reflection entries with filtering and search
 */

class JournalArchive {
  constructor() {
    this.entries = [];
    this.filteredEntries = [];
    this.filters = {
      type: 'all',
      privacy: 'all',
      timerange: 'all',
      search: ''
    };

    this.timeline = document.getElementById('archiveTimeline');
    this.searchBox = document.getElementById('searchBox');
    this.modal = document.getElementById('entryModal');
    this.modalTitle = document.getElementById('modalTitle');
    this.modalBody = document.getElementById('modalBody');
    this.modalClose = document.getElementById('modalClose');

    this.init();
  }

  async init() {
    this.setupEventListeners();
    await this.loadEntries();
    this.applyFilters();
    this.renderTimeline();
  }

  setupEventListeners() {
    // Filter dropdowns
    const typeFilter = document.getElementById('typeFilter');
    const privacyFilter = document.getElementById('privacyFilter');
    const timeFilter = document.getElementById('timeFilter');

    typeFilter.addEventListener('change', (e) => {
      this.filters.type = e.target.value;
      this.applyFilters();
      this.renderTimeline();
    });

    privacyFilter.addEventListener('change', (e) => {
      this.filters.privacy = e.target.value;
      this.applyFilters();
      this.renderTimeline();
    });

    timeFilter.addEventListener('change', (e) => {
      this.filters.timerange = e.target.value;
      this.applyFilters();
      this.renderTimeline();
    });

    // Search box
    this.searchBox.addEventListener('input', (e) => {
      this.filters.search = e.target.value.toLowerCase();
      this.applyFilters();
      this.renderTimeline();
    });

    // Modal close
    this.modalClose.addEventListener('click', () => {
      this.closeModal();
    });

    // Close modal on background click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.closeModal();
      }
    });
  }

  async loadEntries() {
    try {
      // Load experiments and reflections
      const experiments = await this.loadEntriesFromDirectory('experiments');
      const reflections = await this.loadEntriesFromDirectory('reflections');

      this.entries = [...experiments, ...reflections];

      // Sort by date (newest first)
      this.entries.sort((a, b) => {
        const dateA = new Date(a.data.timestamp_start || a.data.timestamp || 0);
        const dateB = new Date(b.data.timestamp_start || b.data.timestamp || 0);
        return dateB - dateA;
      });

      console.log(`Loaded ${this.entries.length} total entries`);
    } catch (error) {
      console.error('Error loading entries:', error);
      this.showError('Failed to load journal entries');
    }
  }

  async loadEntriesFromDirectory(type) {
    const entries = [];

    // Try to load from both public and private directories
    for (const privacy of ['public', '_private']) {
      try {
        const path = `entries/${type}/${privacy}/`;
        const files = await this.listJSONFiles(path);

        for (const file of files) {
          try {
            const response = await fetch(`${path}${file}`);
            if (response.ok) {
              const data = await response.json();
              entries.push({
                filename: file,
                type: type === 'experiments' ? 'experiment' : 'reflection',
                privacy: privacy === '_private' ? 'private' : 'public',
                data: data,
                path: `${path}${file}`
              });
            }
          } catch (err) {
            console.warn(`Failed to load ${path}${file}:`, err);
          }
        }
      } catch (err) {
        console.warn(`Could not access ${type}/${privacy}:`, err);
      }
    }

    return entries;
  }

  async listJSONFiles(directory) {
    // Use server API to list directory contents
    // directory format: "entries/experiments/public/"
    const parts = directory.split('/').filter(p => p);
    if (parts.length < 3) return [];

    const type = parts[1]; // experiments or reflections
    const privacy = parts[2]; // public or _private

    try {
      const response = await fetch(`/api/entries/${type}/${privacy}`);
      if (response.ok) {
        const data = await response.json();
        return data.files || [];
      }
    } catch (err) {
      console.error(`Failed to list entries from ${directory}:`, err);
    }

    return [];
  }

  applyFilters() {
    this.filteredEntries = this.entries.filter(entry => {
      // Type filter
      if (this.filters.type !== 'all' && entry.type !== this.filters.type) {
        return false;
      }

      // Privacy filter
      if (this.filters.privacy !== 'all' && entry.privacy !== this.filters.privacy) {
        return false;
      }

      // Time range filter
      if (this.filters.timerange !== 'all') {
        const entryDate = new Date(entry.data.timestamp_start || entry.data.timestamp);
        const now = new Date();
        const daysDiff = Math.floor((now - entryDate) / (1000 * 60 * 60 * 24));

        if (daysDiff > parseInt(this.filters.timerange)) {
          return false;
        }
      }

      // Search filter
      if (this.filters.search) {
        const searchText = this.getSearchableText(entry).toLowerCase();
        if (!searchText.includes(this.filters.search)) {
          return false;
        }
      }

      return true;
    });
  }

  getSearchableText(entry) {
    const data = entry.data;
    const parts = [
      data.experiment_id || '',
      data.author || '',
      data.throughput?.emergent_ecp_insights || '',
      data.throughput?.unexpected_resonance || '',
      data.human?.ritual_preparation?.join(' ') || '',
      data.machine?.model || '',
      data.relational_field?.location?.label || '',
      JSON.stringify(data.measurement_frameworks || '')
    ];
    return parts.join(' ');
  }

  renderTimeline() {
    if (this.filteredEntries.length === 0) {
      this.renderEmptyState();
      return;
    }

    this.timeline.innerHTML = this.filteredEntries.map(entry =>
      this.renderEntryCard(entry)
    ).join('');

    // Add click handlers to cards
    this.timeline.querySelectorAll('.entry-card').forEach((card, index) => {
      card.addEventListener('click', () => {
        this.showEntryDetail(this.filteredEntries[index]);
      });
    });
  }

  renderEntryCard(entry) {
    const data = entry.data;
    const date = new Date(data.timestamp_start || data.timestamp || Date.now());
    const dateStr = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const icon = entry.type === 'experiment' ? 'flask' : 'notebook';
    const privacyIcon = entry.privacy === 'private' ? 'lock' : 'globe';

    // Extract preview text
    const preview = data.throughput?.emergent_ecp_insights ||
                   data.throughput?.unexpected_resonance ||
                   data.reflection_text ||
                   'No insights recorded';

    const previewText = preview.substring(0, 150) + (preview.length > 150 ? '...' : '');

    // Get metadata
    const model = data.machine?.model || 'Unknown';
    const thinkingMode = data.machine?.thinking_mode === 'enabled' ? 'Thinking Mode' : '';

    return `
      <div class="entry-card" data-entry-id="${entry.filename}">
        <div class="entry-header">
          <div>
            <div class="entry-type">
              <i class="ph ph-${icon}"></i>
              ${entry.type === 'experiment' ? 'Experiment' : 'Reflection'}
            </div>
            <div class="entry-date">${dateStr}</div>
          </div>
          <div class="entry-privacy ${entry.privacy}">
            <i class="ph ph-${privacyIcon}"></i>
            ${entry.privacy === 'private' ? 'Private' : 'Public'}
          </div>
        </div>

        ${data.experiment_id ? `<div style="font-weight: 600; margin-bottom: 0.5rem;">ID: ${data.experiment_id}</div>` : ''}

        <div class="entry-preview">"${previewText}"</div>

        <div class="entry-metadata">
          ${model ? `<div class="metadata-item"><i class="ph ph-cpu"></i> ${model}</div>` : ''}
          ${thinkingMode ? `<div class="metadata-item"><i class="ph ph-brain"></i> ${thinkingMode}</div>` : ''}
          ${data.throughput?.felt_response_quality ?
            `<div class="metadata-item"><i class="ph ph-chat-circle-dots"></i> Quality: ${data.throughput.felt_response_quality}/10</div>` : ''}
          ${data.throughput?.symbolic_density ?
            `<div class="metadata-item"><i class="ph ph-sparkle"></i> Density: ${data.throughput.symbolic_density}/10</div>` : ''}
        </div>

        ${this.renderEntryTags(data)}
      </div>
    `;
  }

  renderEntryTags(data) {
    const tags = [];

    if (data.human?.ritual_preparation?.length > 0) {
      tags.push(...data.human.ritual_preparation.slice(0, 3));
    }

    if (data.human?.ontological_orientation?.label) {
      tags.push(data.human.ontological_orientation.label);
    }

    if (tags.length === 0) return '';

    return `
      <div class="entry-tags">
        ${tags.map(tag => `<span class="entry-tag"><i class="ph ph-tag"></i> ${tag}</span>`).join('')}
      </div>
    `;
  }

  renderEmptyState() {
    this.timeline.innerHTML = `
      <div class="empty-state">
        <div><i class="ph ph-archive"></i></div>
        <h3>No entries found</h3>
        <p>Try adjusting your filters or search terms</p>
      </div>
    `;
  }

  showEntryDetail(entry) {
    const data = entry.data;
    const date = new Date(data.timestamp_start || data.timestamp || Date.now());
    const dateStr = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    this.modalTitle.innerHTML = `
      <i class="ph ph-${entry.type === 'experiment' ? 'flask' : 'notebook'}"></i>
      ${entry.type === 'experiment' ? 'Experiment' : 'Reflection'}: ${data.experiment_id || 'Untitled'}
    `;

    this.modalBody.innerHTML = `
      <div class="detail-section">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong>${dateStr}</strong>
            ${data.timestamp_end ? ` to ${new Date(data.timestamp_end).toLocaleTimeString()}` : ''}
          </div>
          <div class="entry-privacy ${entry.privacy}">
            <i class="ph ph-${entry.privacy === 'private' ? 'lock' : 'globe'}"></i>
            ${entry.privacy === 'private' ? 'Private Entry' : 'Public Entry'}
          </div>
        </div>
      </div>

      ${this.renderHumanContext(data)}
      ${this.renderMachineContext(data)}
      ${this.renderRelationalField(data)}
      ${this.renderThroughput(data)}
      ${this.renderMeasurements(data)}
    `;

    this.modal.classList.add('active');
  }

  renderHumanContext(data) {
    if (!data.human) return '';

    const items = [];

    if (data.human.cognitive_mode) {
      items.push({ label: 'Cognitive Mode', value: data.human.cognitive_mode });
    }

    if (data.human.ontological_orientation?.label) {
      items.push({
        label: 'Ontological Orientation',
        value: `${data.human.ontological_orientation.label} (${data.human.ontological_orientation.strength}/10)`
      });
    }

    if (data.human.affective_tone) {
      items.push({ label: 'Affective Tone', value: data.human.affective_tone });
    }

    if (data.human.ritual_preparation?.length > 0) {
      items.push({ label: 'Ritual Preparation', value: data.human.ritual_preparation.join(', ') });
    }

    if (items.length === 0) return '';

    return `
      <div class="detail-section">
        <h3><i class="ph ph-user"></i> Human Context</h3>
        <div class="detail-grid">
          ${items.map(item => `
            <div class="detail-item">
              <div class="detail-label">${item.label}</div>
              <div class="detail-value">${item.value}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderMachineContext(data) {
    if (!data.machine) return '';

    const items = [];

    if (data.machine.model) {
      items.push({ label: 'Model', value: data.machine.model });
    }

    if (data.machine.thinking_mode) {
      items.push({ label: 'Thinking Mode', value: data.machine.thinking_mode });
    }

    if (data.machine.conversation_style) {
      items.push({ label: 'Conversation Style', value: data.machine.conversation_style });
    }

    if (data.machine.user_interface) {
      items.push({ label: 'Interface', value: data.machine.user_interface });
    }

    if (items.length === 0) return '';

    return `
      <div class="detail-section">
        <h3><i class="ph ph-cpu"></i> Machine Context</h3>
        <div class="detail-grid">
          ${items.map(item => `
            <div class="detail-item">
              <div class="detail-label">${item.label}</div>
              <div class="detail-value">${item.value}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderRelationalField(data) {
    if (!data.relational_field) return '';

    const items = [];

    if (data.relational_field.location?.label) {
      items.push({ label: 'Location', value: data.relational_field.location.label });
    }

    if (data.relational_field.lighting) {
      items.push({ label: 'Lighting', value: data.relational_field.lighting });
    }

    if (data.relational_field.interaction_pace) {
      items.push({ label: 'Interaction Pace', value: data.relational_field.interaction_pace });
    }

    if (data.relational_field.noted_presence_of_earthian_kin?.length > 0) {
      items.push({
        label: 'Earthian Kin Present',
        value: data.relational_field.noted_presence_of_earthian_kin.join(', ')
      });
    }

    if (items.length === 0) return '';

    return `
      <div class="detail-section">
        <h3><i class="ph ph-globe"></i> Relational Field</h3>
        <div class="detail-grid">
          ${items.map(item => `
            <div class="detail-item">
              <div class="detail-label">${item.label}</div>
              <div class="detail-value">${item.value}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderThroughput(data) {
    if (!data.throughput) return '';

    return `
      <div class="detail-section">
        <h3><i class="ph ph-lightbulb"></i> Emergent Insights & Throughput</h3>

        ${data.throughput.emergent_ecp_insights ? `
          <div style="margin-bottom: 1.5rem;">
            <div class="detail-label">Insights</div>
            <div style="padding: 1rem; background: var(--background-light); border-radius: 5px; white-space: pre-wrap;">
              ${data.throughput.emergent_ecp_insights}
            </div>
          </div>
        ` : ''}

        ${data.throughput.unexpected_resonance ? `
          <div style="margin-bottom: 1.5rem;">
            <div class="detail-label">Unexpected Resonance</div>
            <div style="padding: 1rem; background: var(--background-light); border-radius: 5px;">
              ${data.throughput.unexpected_resonance}
            </div>
          </div>
        ` : ''}

        <div class="detail-grid">
          ${data.throughput.felt_response_quality ? `
            <div class="detail-item">
              <div class="detail-label">Response Quality</div>
              <div class="detail-value">${data.throughput.felt_response_quality}/10</div>
            </div>
          ` : ''}
          ${data.throughput.symbolic_density ? `
            <div class="detail-item">
              <div class="detail-label">Symbolic Density</div>
              <div class="detail-value">${data.throughput.symbolic_density}/10</div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  renderMeasurements(data) {
    if (!data.measurement_frameworks) return '';

    return `
      <div class="detail-section">
        <h3><i class="ph ph-chart-line"></i> Measurements</h3>
        <p style="font-style: italic; color: #666;">
          Measurement data available. View in
          <a href="measurement-dashboard.html" style="color: var(--accent-color);">Measurement Dashboard</a>
          for full analysis.
        </p>
      </div>
    `;
  }

  closeModal() {
    this.modal.classList.remove('active');
  }

  showError(message) {
    this.timeline.innerHTML = `
      <div class="empty-state">
        <div><i class="ph ph-warning"></i></div>
        <h3>Error</h3>
        <p>${message}</p>
      </div>
    `;
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  new JournalArchive();
});
