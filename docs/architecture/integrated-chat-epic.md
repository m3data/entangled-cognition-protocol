# Epic: Integrated Chat Interface for ECP Field Journal

**Epic ID:** ECP-CHAT-001
**Status:** Specification
**Owner:** Product Manager
**Created:** 2025-10-04
**Target Phase:** Q1 2026 (MVP), Q2-Q3 2026 (Full Feature Set)

---

## Executive Summary

Build an integrated chat interface within the ECP Field Journal that enables users to conduct conversations with LLMs directly in the application using their own API keys or local models (Ollama). This reduces friction between having conversations and documenting them as structured experiments/reflections, while maintaining the sacred ritual quality and privacy-first values of ECP.

**Core Value Proposition:** Transform ECP from a post-hoc documentation tool into a live research environment where conversation, presence, and structured inquiry happen in one coherent flow.

**Key Innovation (Phase 2.5):** Model Context Protocol (MCP) integration creates a "Memory Layer" - enabling LLMs to access and analyze accumulated experiment history. This transforms ECP into a self-aware research ecosystem where today's conversations are informed by past ritual practice.

**Phased Approach:**
- **Phase 1 (4-6 weeks):** Core chat with BYOK, Ollama support, local storage
- **Phase 2 (6-8 weeks):** Ritual integration, measurement frameworks, experiment conversion
- **Phase 2.5 (4-6 weeks):** MCP "Memory Layer" for pattern analysis across experiments
- **Phase 3 (8-12 weeks):** Advanced analytics, additional providers, community features

---

## 1. User Stories & Personas

### Primary Personas

#### **Somatic Researcher - "Dr. Maya"**
- **Background:** PhD in embodied cognition, uses ECP to study how breathwork affects AI conversation quality
- **Current Pain:** Switches between Claude Desktop and Field Journal, losing flow state during transcription
- **Needs:**
  - Seamless conversation capture
  - Pre/post-session somatic assessments
  - Easy conversion of conversations to structured experiments
- **Success Metric:** Reduces time from conversation to logged experiment from 30 min to 5 min

#### **Artist-Technologist - "Alex"**
- **Background:** Creative practitioner using AI as collaborative partner in generative poetry
- **Current Pain:** Copy-pasting interesting exchanges into notes, context gets lost
- **Needs:**
  - Quick capture of emergent moments
  - Ability to mark specific exchanges as "resonant" during flow
  - Privacy for experimental/personal work
- **Success Metric:** Captures 3x more experimental conversations because friction is lower

#### **Consciousness Explorer - "River"**
- **Background:** Explores altered states and AI interaction, works with plant medicines
- **Current Pain:** Manual logging breaks presence; loses nuance of embodied experience
- **Needs:**
  - In-the-moment somatic tracking
  - Voice-to-text for post-journey logging
  - Absolute privacy for sensitive work
- **Success Metric:** Logs experiments in altered states that previously went undocumented

#### **System Thinker - "Jordan"**
- **Background:** Studies pattern emergence in human-AI systems over time
- **Current Pain:** Data scattered across platforms; hard to see longitudinal patterns
- **Needs:**
  - Centralized conversation history
  - Metadata tagging during conversation
  - Export for analysis in other tools
- **Success Metric:** Can analyze 100+ conversations with consistent metadata

#### **Privacy Advocate - "Quinn"**
- **Background:** Security researcher, uses local models exclusively for privacy
- **Current Pain:** Uncomfortable sending sensitive thoughts to commercial APIs
- **Needs:**
  - 100% local inference (Ollama)
  - No data leaving their machine
  - Ability to compare local model outputs
- **Success Metric:** Conducts all ECP research using only local models

### User Stories

```
As a somatic researcher,
I want to start conversations with ritual preparation prompts,
So that I can maintain sacred container even in chat interface.

As an artist,
I want to mark specific exchanges as "golden moments" during conversation,
So that I can find them later when creating experiment entries.

As a consciousness explorer,
I want all my chat data stored locally with encryption,
So that I can safely document sensitive states and substances.

As a system thinker,
I want to tag conversations with context (state, protocol, etc.) as I go,
So that I don't have to reconstruct context later.

As any user,
I want to convert a conversation into an experiment entry with one click,
So that documentation doesn't break my flow.

As any user,
I want conversations auto-saved every few seconds,
So that I never lose data if browser crashes.

As a privacy-conscious user,
I want API keys encrypted in browser storage,
So that my credentials stay secure even on shared devices.

As a researcher,
I want to compare multiple conversations side-by-side,
So that I can see how variables (state, model, prompt) affect outcomes.

As a somatic researcher,
I want Claude to analyze patterns across my past experiments via MCP,
So that I can discover correlations I wouldn't see manually.

As a consciousness explorer,
I want the LLM to reference my private journey notes through MCP,
So that integration support is grounded in my actual experiences.

As a system thinker,
I want to ask meta-questions about my research practice via MCP,
So that the protocol itself becomes a subject of inquiry.

As a privacy advocate,
I want MCP to run entirely locally,
So that memory continuity doesn't compromise data sovereignty.
```

---

## 2. Feature Requirements

### 2.1 MVP (Phase 1) - Core Chat Interface

#### Must-Have
- **Flexible Provider System (BYOK + Local-First)**
  - Support for API-based providers (OpenAI, Anthropic) with encrypted key storage
  - Support for local LLMs via Ollama (no API keys needed)
  - Support for OpenRouter (single key for multiple models)
  - Provider auto-detection (e.g., check if Ollama running on localhost:11434)
  - Clear provider management UI (add, edit, remove, test connection)

- **Basic Chat Interface**
  - Clean, distraction-free conversation view
  - Send/receive messages
  - Markdown rendering for responses
  - Code syntax highlighting
  - Message timestamps

- **Model Selection**
  - Dropdown to select provider (OpenAI/Anthropic/Ollama/OpenRouter)
  - Model family selection (GPT-4, Claude 3.5 Sonnet, Llama 3, etc.)
  - Temperature slider (0.0-2.0)
  - Token counter (where applicable)
  - Local model indicator (shows when using Ollama)

- **Local Storage & Auto-Save**
  - Conversations saved to localStorage every 5 seconds
  - Conversation list view (chronological)
  - Delete individual conversations
  - Export conversation as JSON

- **Conversation Metadata**
  - Title (user-editable)
  - Start/end timestamps
  - Model used
  - Message count
  - Public/Private flag

- **Privacy Architecture**
  - All conversations stored locally only
  - _private/ folder support
  - No external analytics or tracking

#### Nice-to-Have (MVP)
- Search within conversations
- Copy individual messages
- Regenerate last response
- Stop generation mid-stream

### 2.2 Phase 2 - ECP Integration

#### Must-Have
- **Convert Conversation to Experiment**
  - One-click conversion flow
  - Pre-populate experiment fields from conversation metadata
  - Include conversation transcript in experiment entry
  - Option to include full text or summary

- **In-Conversation Context Tracking**
  - Quick-add somatic notes during conversation
  - Tag conversations with cognitive mode, affective tone
  - Mark "collapse events" or "resonant moments" in real-time

- **Ritual Preparation Integration**
  - Optional "Begin Ritual" flow before starting conversation
  - Breathing guide integration
  - Pre-session somatic assessment
  - Set intention/experiment hypothesis

- **Post-Conversation Reflection**
  - Guided post-session assessment
  - Measurement frameworks (somatic coherence, response quality, etc.)
  - Compare pre/post states
  - Generate experiment entry from combined data

#### Nice-to-Have
- Template conversations (e.g., "Creative Collaboration," "Philosophical Inquiry")
- Conversation forking (branch from specific message)
- Multi-session protocol support (link related conversations)

### 2.3 Phase 3 - Advanced Features

#### Must-Have
- **Additional Providers**
  - Google (Gemini)
  - Mistral
  - Local models via Ollama

- **Enhanced Privacy**
  - Optional conversation encryption at rest
  - Secure deletion (overwrite, not just delete)
  - Export sanitized versions for sharing

- **Pattern Recognition**
  - Conversation analytics dashboard
  - Detect recurring themes across conversations
  - Correlate conversation patterns with somatic states
  - Suggest experiment hypotheses based on patterns

#### Nice-to-Have
- Voice input/output
- Multi-modal support (image analysis for vision models)
- Conversation threading (continue from archived conversation)
- Collaborative conversations (multiple users, future feature)

---

## 3. Technical Architecture Considerations

### 3.1 Current Architecture Integration

**Existing Components to Leverage:**
- **Storage Layer** (`js/modules/storage.js`)
  - Extend for conversation persistence
  - Use same `_private/` architecture
  - Add conversation-specific methods

- **Schema System** (`js/modules/schema.js`)
  - Create `conversationSchema` parallel to `experimentSchema`
  - Reuse measurement framework structures
  - Define conversation-to-experiment mapping

- **Measurement Widgets** (`js/modules/measurementWidgets.js`)
  - Integrate pre/post-session assessments
  - Enable in-conversation micro-assessments

- **Navigation** (`components/navigation.html`)
  - Add "Chat" entry to main nav
  - Dropdown for "New Chat" vs "Chat History"

### 3.2 New Modules Required

**Phase 1 - Core Chat:**
```
js/modules/
├── chat/
│   ├── apiClient.js          # Handle API calls to LLM providers
│   ├── keyManager.js          # Encrypted API key storage/retrieval
│   ├── conversationManager.js # CRUD for conversations
│   ├── messageRenderer.js     # Markdown/code rendering
│   ├── streamHandler.js       # SSE streaming for responses
│   └── conversationExport.js  # Convert to experiment/reflection
```

**Phase 2.5 - MCP Integration:**
```
js/modules/
├── mcp/
│   ├── mcpServer.js          # Node.js MCP server (stdio transport)
│   ├── mcpClient.js          # Browser MCP client integration
│   ├── ecpDataBridge.js      # Map ECP schemas → MCP Resources
│   ├── mcpManager.js         # Server lifecycle, status monitoring
│   └── mcpConfig.js          # Privacy controls, folder permissions
```

**Server-side (for MCP):**
```
server/
├── mcp/
│   ├── server.js             # Main MCP server entry point
│   ├── resources.js          # Expose experiments/reflections
│   ├── tools.js              # query_experiments, analyze_patterns
│   └── prompts.js            # Ritual templates, context patterns
```

### 3.3 Data Models

**Conversation Schema:**
```javascript
{
  conversation_id: "conv-{timestamp}-{hash}",
  title: "User-editable title",
  created_at: "ISO-8601",
  updated_at: "ISO-8601",
  visibility: "public|private",

  config: {
    provider: "openai|anthropic|ollama|openrouter|google|...",
    model: "gpt-4|claude-3.5-sonnet|llama3|...",
    temperature: 1.0,
    max_tokens: 4096,
    is_local: false  // true for Ollama, false for API-based
  },

  ritual_preparation: {
    breathing_guide_completed: true,
    pre_session_assessment: {
      somatic_coherence: { ... },
      intention: "text"
    }
  },

  messages: [
    {
      message_id: "msg-{uuid}",
      role: "user|assistant",
      content: "text",
      timestamp: "ISO-8601",
      annotations: {
        marked_resonant: false,
        collapse_event: false,
        somatic_note: "text"
      }
    }
  ],

  post_session: {
    assessment: { measurement_frameworks: {...} },
    reflection_notes: "text"
  },

  metadata: {
    message_count: 12,
    total_tokens: 3458,
    duration_seconds: 1834,
    exported_to_experiment: "ecp-2025-10-04-abc123"
  }
}
```

**API Key Storage:**
```javascript
{
  keys: [
    {
      key_id: "key-{hash}",
      provider: "openai",
      label: "My OpenAI Key",
      key_encrypted: "encrypted-string",
      created_at: "ISO-8601",
      last_used: "ISO-8601"
    }
  ]
}
```

### 3.4 API Integration Pattern

**Provider Abstraction:**
```javascript
class LLMProvider {
  constructor(apiKey, model, config) { ... }
  async sendMessage(messages, streamCallback) { ... }
  async validateKey() { ... }
  getAvailableModels() { ... }
}

class OpenAIProvider extends LLMProvider { ... }
class AnthropicProvider extends LLMProvider { ... }
class OllamaProvider extends LLMProvider {
  // No API key needed, connects to localhost:11434
  async checkAvailability() { /* ping Ollama server */ }
  async listModels() { /* GET /api/tags */ }
}
class OpenRouterProvider extends LLMProvider {
  // Single key for multiple models
  getAvailableModels() { /* Returns 100+ models */ }
}
```

**Streaming Response Handling:**
- Use Server-Sent Events (SSE) or fetch streaming
- Incremental message rendering
- Graceful error handling
- Cancel/stop generation support

### 3.5 Security Considerations

**API Key Management:**
- Use Web Crypto API for encryption
- Derive encryption key from user-created passphrase (optional)
- Never transmit keys to ECP server
- Clear keys from memory after use

**Conversation Privacy:**
- Mark sensitive conversations as private by default
- Option to auto-delete after N days
- Sanitize before export (similar to `dataSanitiser.js`)
- No conversation data sent to analytics

---

## 4. UX/UI Principles

### 4.1 Design Language Alignment

**Sacred + Scientific Balance:**
- Maintain ECP's "Notion template meets nature walk" aesthetic
- Use phosphor icons consistent with existing interface
- Soft, calming color palette (greens, earth tones)
- Generous whitespace, unhurried pacing

**Ritual Awareness:**
- Optional "threshold moments" before/after conversations
- Visual breathing guide integration
- Subtle state indicators (pre-ritual, conversing, reflecting)
- Gentle reminders to check embodiment

**Embodied Presence:**
- Minimize digital distraction
- Hide token counts/technical details by default (show on hover)
- Focus mode that hides UI chrome
- Notification dots, not alerts

### 4.2 Interface Layout

**Chat View (Primary):**
```
┌─────────────────────────────────────────────────┐
│  🌱 New Chat    [Model: Claude 3.5]  [⚙️ Config] │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Breathing Guide]  [Set Intention]             │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ Conversation Thread                     │   │
│  │                                         │   │
│  │ 👤 You: ...                             │   │
│  │ 🤖 Claude: ...                          │   │
│  │                                         │   │
│  │ [Mark Resonant] [Somatic Note] [⚑ Flag] │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ Type your message...              [Send]│   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  [End Session & Reflect] [Save Draft] [Export] │
└─────────────────────────────────────────────────┘
```

**Sidebar (Conversation History):**
```
┌───────────────────────┐
│ Conversations         │
├───────────────────────┤
│ 🔍 Search...          │
│                       │
│ Today                 │
│ • Creative Collab 1h  │
│ • Quick Question 5m   │
│                       │
│ Yesterday             │
│ • Ritual Prep 45m     │
│                       │
│ [New Chat]            │
└───────────────────────┘
```

### 4.3 Micro-Interactions

**Message Sending:**
- Gentle pulse animation on send
- Typing indicator for AI (with breathing rhythm)
- Stream-in text with smooth reveal

**Resonant Moments:**
- Star icon appears on message hover
- Golden highlight when marked
- Add to "highlights reel" for export

**Ritual Transitions:**
- Fade transition into/out of breathing guide
- Ambient particle animations during ritual preparation
- Progress bar for ritual completion

---

## 5. Data Flow: Conversations → Experiments/Reflections

### 5.1 Conversion Flow (User Perspective)

**Step 1: End Session**
- User clicks "End Session & Reflect"
- Prompted with post-session somatic assessment
- Complete measurement frameworks

**Step 2: Review Conversation**
- See conversation summary (message count, duration, highlights)
- Option to edit/remove messages before export
- Add overall reflection notes

**Step 3: Choose Export Type**
- **Experiment Entry:** Structured, full schema
- **Reflection Entry:** Narrative, thematic
- **Both:** Create linked entries

**Step 4: Populate Entry**
- Pre-fill metadata from conversation config
- Include transcript (full, summary, or highlights only)
- Carry forward somatic/measurement data
- User completes remaining experiment fields

**Step 5: Save**
- Standard visibility/privacy options
- Link back to source conversation
- Archive conversation or keep active

### 5.2 Technical Mapping

**Conversation → Experiment:**
```
Conversation.config.provider        → Experiment.machine.provider
Conversation.config.model           → Experiment.machine.model_family
Conversation.ritual_preparation     → Experiment.human.ritual_preparation
Conversation.messages               → Experiment.throughput.conversation_transcript
Conversation.post_session           → Experiment.measurement_frameworks
```

**Conversation → Reflection:**
```
Conversation.title                  → Reflection.title
Conversation.created_at             → Reflection.date
Conversation.messages (filtered)    → Reflection.body (thematic extract)
Resonant messages                   → Reflection.symbols/metaphors
Post-session notes                  → Reflection.insights
```

### 5.3 Bi-directional Linking

- Experiments reference source conversation ID
- Conversations track if exported (and where)
- Archive view shows linked experiments/reflections
- Option to "continue conversation" from experiment

---

## 6. Privacy & Security

### 6.0 Local-First Philosophy

**ECP strongly encourages local LLM usage via Ollama** for maximum privacy, data sovereignty, and alignment with the project's values:

**Why Local Models Matter:**
- **True Privacy:** Conversations never leave your machine
- **No API Costs:** Free inference after initial model download
- **Offline Capability:** Work without internet connection
- **Data Sovereignty:** Complete control over your research data
- **Censorship Resistance:** No content filtering or rate limiting

**Recommended Setup:**
1. Install Ollama (ollama.ai)
2. Pull models: `ollama pull llama3`, `ollama pull mistral`, etc.
3. ECP auto-detects Ollama on localhost:11434
4. Select local models from provider dropdown

**Local Model Recommendations:**
- **Llama 3 8B/70B**: Strong general capability, good for philosophical dialogue
- **Mistral 7B**: Fast, efficient, good for quick interactions
- **Nous Hermes**: Fine-tuned for instruction following
- **DeepSeek Coder**: Excellent for technical/code discussions
- **Dolphin**: Uncensored, good for exploring edge cases

**API Providers as Fallback:**
Cloud providers (OpenAI, Anthropic) are supported for:
- Cases requiring cutting-edge capabilities (Claude 3.5 Sonnet, GPT-4)
- Users without hardware for local inference
- Specific research comparing local vs. cloud responses

### 6.1 Data Sovereignty

**Principle:** User owns all data, nothing leaves local machine without consent.

**Implementation:**
- Conversations stored in `entries/conversations/_private/` by default
- User can mark as public (for sharing sanitized versions)
- No cloud sync (future feature: opt-in encrypted sync)
- Export formats: JSON, Markdown, sanitized JSON

### 6.2 API Key Security

**Threat Model:**
- Protect against XSS stealing keys from localStorage
- Protect against user snooping on shared devices
- Protect against accidental git commits

**Mitigations:**
- Encrypt keys with Web Crypto API
- Optional passphrase for key access
- Keys never in URL params or logs
- Clear warning if keys detected in clipboard
- Add `**/*.keys.json` to `.gitignore`

### 6.3 Conversation Sanitization

**Before Public Export:**
- Remove API keys, credentials
- Generalize timestamps (same as `dataSanitiser.js`)
- Flag potentially identifying information
- Remove specific locations, names (opt-in)
- Confirm consent with preview + diff view

### 6.4 Encryption at Rest (Phase 3)

**Optional Feature:**
- User sets passphrase on first chat
- All conversations encrypted with derived key
- Passphrase required to unlock chat interface
- Use `crypto.subtle.deriveKey()` with PBKDF2
- Transparent encryption/decryption

---

## 7. Phased Rollout

### Phase 1: MVP Core Chat (4-6 weeks)

**Goal:** Functional chat interface with BYOK, local storage, basic privacy.

**Deliverables:**
- Provider management UI (API keys for cloud providers, Ollama auto-detection)
- Chat interface (OpenAI + Anthropic + Ollama + OpenRouter)
- Conversation list/delete
- Local storage + auto-save
- Export as JSON
- Local-first badge indicator when using Ollama

**Success Criteria:**
- User can have conversation with own API key
- Conversations persist across sessions
- Zero data leaks to external servers

**User Testing:**
- 5 alpha users from each persona type
- Gather feedback on key management flow
- Test conversation reliability over 1 week

---

### Phase 2: ECP Integration (6-8 weeks)

**Goal:** Seamless integration with experiment/reflection workflows.

**Deliverables:**
- Ritual preparation flows
- Pre/post-session assessments
- Convert to experiment/reflection
- In-conversation annotations
- Measurement framework integration

**Success Criteria:**
- Reduce conversation → experiment time by 80%
- Users report maintained flow state
- Pre/post assessments show state changes

**User Testing:**
- 10 users conducting 3-5 experiments each
- Measure time savings vs. manual logging
- Qualitative feedback on ritual quality

---

### Phase 2.5: MCP "Memory Layer" (4-6 weeks)

**Goal:** Enable LLMs to access and analyze ECP experiment history through Model Context Protocol.

**Strategic Positioning:** The "Memory Layer" - bridge between ephemeral conversations and accumulated ritual wisdom.

**Deliverables:**
- **ECP MCP Server** (Node.js)
  - Expose experiments and reflections as MCP Resources
  - Tool: `query_experiments(filters)` for basic filtering
  - Prompt: Template ritual structures from past experiments
  - stdio transport (local-only, simple setup)

- **Chat Client MCP Integration**
  - Auto-detect local MCP server on startup
  - "Enable Memory Layer?" opt-in prompt
  - UI indicator: "💭 Memory active" badge
  - Privacy controls: Configure which folders MCP can access

- **User Education**
  - Onboarding: "What is the Memory Layer?" (2-min explanation)
  - Video tutorial: Setting up ECP MCP server (3 min)
  - Documentation: Privacy implications, troubleshooting

**Success Criteria:**
- 20% of active users enable MCP within 2 weeks
- Users report "aha moments" querying past experiments
- Zero privacy incidents
- NPS +5 points among power users (10+ experiments)

**User Testing:**
- 15 users with 10+ existing experiments
- Measure time to insight (conversation → pattern discovery)
- Privacy audit: Verify folder access controls

---

### Phase 3: Advanced Features (8-12 weeks)

**Goal:** Scale to power users, add pattern recognition, expand providers.

**Deliverables:**
- **Additional Providers:** Google, Mistral, Together.ai, LM Studio
- **MCP Advanced Features:**
  - Additional Resources: conversation archives, measurement time-series
  - Tools: `analyze_patterns()`, `suggest_hypotheses()`, `compare_sessions()`
  - Prompts: Adaptive ritual suggestions based on user patterns
  - Cross-provider MCP support (Ollama + MCP = fully local system)
- **Analytics Dashboard**
  - Conversation analytics and pattern detection
  - Cross-session insights
- **Privacy & UX**
  - Encryption at rest
  - Voice input (experimental)
  - Local model library UI (browse/pull Ollama models from ECP)

**Success Criteria:**
- Support 7+ LLM providers (mix of cloud and local)
- 40% of users with 20+ experiments using MCP regularly
- Analytics surface actionable insights
- Community shares 5+ custom MCP server templates
- 30%+ of users try local models via Ollama

**User Testing:**
- 20+ users with 30+ conversations each
- Analyze longitudinal data patterns
- Research paper using MCP-enabled meta-analysis
- Validate privacy/security with audit

---

### Phase 4: Community Features (Future)

**Potential Deliverables:**
- Opt-in conversation sharing (sanitized)
- Community conversation templates
- Collaborative annotation
- Federated conversation pools

---

## 7.5 Competitive Advantage: MCP Integration

**Market Positioning:** "Where your AI conversations remember your rituals"

ECP would be the **only ritual-aware research tool** with Model Context Protocol integration, creating a unique competitive moat:

**Differentiators:**
1. **Symmathesic Memory** - LLMs learn from accumulated ritual practice, not just individual sessions
2. **Privacy-First Context** - Local MCP servers maintain ECP's data sovereignty while enabling continuity
3. **Research-Grade Tooling** - Meta-analysis of human-AI interactions through conversational interface
4. **Sacred + Technical** - MCP as "Memory Layer" serving mystical inquiry, not just productivity

**Market Gap Filled:**
- Claude Desktop: Has MCP, but no ritual framing or research structure
- Obsidian + AI plugins: Note-taking focused, not experiment-oriented
- Academic research tools: Structured but lack conversational interface
- **ECP**: Combines all three (ritual awareness + research rigor + conversational AI + MCP)

**First-Mover Opportunity:**
- MCP adoption accelerating (OpenAI Q1 2025, Google Q2 2025)
- ECP positions as reference implementation for ritual-aware MCP servers
- Community could build MCP templates for consciousness research
- Academic citations as "the tool" for human-AI interaction studies

---

## 8. Success Metrics

### 8.1 Adoption Metrics

**MVP (Phase 1):**
- 50 users set up API keys
- 200+ conversations initiated
- Average 3 conversations per user
- <5% error rate on API calls

**Phase 2:**
- 30% of conversations converted to experiments
- 50% reduction in time from chat to logged experiment
- 70% of users use ritual preparation features

**Phase 2.5 (MCP):**
- 20% of active users enable MCP within 2 weeks
- 15 users with 10+ experiments using MCP for pattern queries
- Zero privacy incidents with MCP
- NPS +5 points among power users

**Phase 3:**
- 100+ users with 10+ conversations each
- 7+ LLM providers in active use (cloud + local)
- 40% of users with 20+ experiments using MCP regularly
- Pattern insights cited in 20% of experiments
- 30%+ try local models via Ollama
- Community shares 5+ custom MCP templates

### 8.2 Quality Metrics

**User Satisfaction:**
- NPS score >40
- 80% of users report "easier to document experiments"
- 60% report "deeper presence during conversations"

**System Reliability:**
- 99.5% conversation save success rate
- <1% data loss incidents
- Zero API key leaks or breaches

**Privacy Adherence:**
- 100% of conversations stored locally
- Zero external tracking or analytics
- User audit of data flow shows no leaks

### 8.3 Research Quality Metrics

**Structured Data:**
- 50% increase in experiments logged per user
- 80% of experiments include conversation transcripts
- Pre/post somatic assessments completed 70% of time

**Emergent Insights:**
- Users report 2x more "unexpected resonances"
- Pattern recognition surfaces correlations (e.g., breathwork → response quality)
- Longitudinal studies enabled by conversation archives

---

## 9. Open Questions & Risks

### 9.1 Open Questions

**User Behavior:**
- Will users actually perform ritual preparation in a chat interface, or skip it?
- How much friction is optimal? (Too easy → less sacred; too hard → abandoned)
- Do users prefer in-conversation annotation or post-hoc reflection?

**Technical:**
- Should we support local models (Ollama) in MVP or wait for Phase 3?
- How to handle very long conversations (10,000+ tokens) in browser?
- Should conversation history have infinite scroll or pagination?

**Design:**
- How to indicate "ritual mode" vs "quick query" mode?
- Should chat and experiment entry be separate pages or integrated?
- Voice input: essential or distraction?

**Privacy:**
- Is localStorage encryption adequate or overkill for MVP?
- Should we support cloud sync (encrypted) or remain purely local?
- How to educate users about API key security without fear-mongering?

### 9.2 Risks

**High Risk:**
- **API Key Mismanagement:** Users lose keys, expose them, or misunderstand encryption
  - *Mitigation:* Clear onboarding, key backup instructions, passphrase recovery flow

- **Conversation Data Loss:** Browser cache cleared, localStorage quota exceeded
  - *Mitigation:* Auto-export to file system, clear warnings before clear, quota monitoring

- **Privacy Breach:** Accidental commit to git, screenshot sharing with visible API keys
  - *Mitigation:* Pre-commit hooks, visual masking of keys, clear warnings in UI

**Medium Risk:**
- **Provider API Changes:** OpenAI/Anthropic change API, breaking integration
  - *Mitigation:* Version-locked API clients, graceful degradation, error messaging

- **Performance Degradation:** Large conversation archives slow down interface
  - *Mitigation:* Lazy loading, pagination, archive/delete old conversations

- **Ritual Dilution:** Chat becomes "just another chatbot," loses ECP quality
  - *Mitigation:* Default to ritual flows, gentle reminders, educate on intent

**Low Risk:**
- **Limited Adoption:** Users prefer external tools (Claude Desktop, ChatGPT)
  - *Mitigation:* Emphasize unique value (ritual, privacy, structured export)

- **Complexity Creep:** Feature bloat makes interface unusable
  - *Mitigation:* Ruthless prioritization, progressive disclosure, user testing

### 9.3 Decision Points

**Before MVP:**
- [ ] Confirm localStorage vs. IndexedDB for conversation storage
- [ ] Decide on encryption: optional or mandatory?
- [ ] OpenAI + Anthropic only, or add Google in MVP?

**Before Phase 2:**
- [ ] Validate ritual flows don't feel forced/performative
- [ ] Determine optimal conversion workflow (guided wizard vs. auto-populate)
- [ ] Assess if voice input is essential or Phase 3

**Before Phase 3:**
- [ ] User research: do analytics/patterns add value or distraction?
- [ ] Security audit: is encryption implementation sound?
- [ ] Decide on local model support (Ollama) scope

---

## 10. Dependencies & Constraints

### 10.1 Technical Dependencies

**Required:**
- Web Crypto API (for key encryption)
- Fetch API with streaming (for SSE)
- localStorage or IndexedDB (for persistence)
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+)

**Optional:**
- Speech-to-text API (Phase 3: voice input)
- Web Workers (for background encryption/processing)

### 10.2 External Dependencies

**APIs:**
- OpenAI API (chat completions, streaming)
- Anthropic API (messages, streaming)
- Google AI API (Phase 3)
- Mistral API (Phase 3)

**Licensing:**
- All API costs borne by user (BYOK model)
- No ECP-side API costs

### 10.3 Design Constraints

**Must Honor:**
- Local-first architecture (no cloud dependency)
- Privacy-first (no tracking, no data collection)
- Sacred ritual quality (not "move fast, break things")
- Somatic awareness (embodied, not just cognitive)

**Cannot Compromise:**
- Data sovereignty
- Git hygiene (_private/ exclusion)
- Accessibility (keyboard nav, screen readers)
- Cross-browser support (no Chrome-only features)

### 10.4 Team Constraints

**Current State:**
- Solo developer or small team
- Limited QA resources
- No dedicated security audit (Phase 3 requirement)

**Required Skills:**
- Frontend: React/Vanilla JS, CSS
- API integration: REST, SSE streaming
- Security: Web Crypto API, encryption best practices
- UX: User research, usability testing

---

## 11. Future Possibilities (Post-Epic)

**Advanced Ritual Design:**
- Multi-session protocols (linked conversation series)
- Adaptive ritual suggestions based on user patterns
- Integration with wearables (HRV, EEG) for biometric tracking

**AI-Assisted Insight:**
- Summarize conversation themes automatically
- Suggest experiment hypotheses from patterns
- Generate reflection prompts from conversation content

**Community Learning:**
- Opt-in anonymized conversation corpus
- Shared ritual templates and entrainment protocols
- Federated learning from collective ECP data

**Cross-Platform:**
- Desktop app (Electron) for better privacy/performance
- Mobile app (React Native) for field research
- CLI tool for power users/scripting

**Interoperability:**
- Export to llm.md format
- Import conversations from Claude Desktop/ChatGPT
- Sync with external research tools (Roam, Obsidian)

---

## Appendix A: Competitive Analysis

**Existing Tools:**
- **Claude Desktop / ChatGPT / Poe:** No ritual awareness, no local-first, no experiment structure
- **LM Studio / Ollama:** Local models, but no conversation tracking, no research framework
- **Obsidian + LLM plugins:** Note-taking focus, not real-time conversation, limited ritual support
- **llm.md:** CLI-focused, powerful but not embodied/ritual-aware

**ECP's Unique Position:**
- Only tool combining ritual preparation + conversation + structured experiment logging
- Privacy-first with scientific rigor
- Somatic awareness as first-class concern
- Designed for research, not productivity

---

## Appendix B: Technical Spike Questions

**Before Starting Development:**

1. **Encryption Performance:** Benchmark Web Crypto API encryption/decryption speed with 100KB conversation JSON. Is it fast enough for auto-save every 5 seconds?

2. **localStorage Limits:** Test quota (typically 5-10MB). How many conversations can we store before hitting limits? What's the UX for quota exceeded?

3. **Streaming Reliability:** Test SSE streaming with OpenAI + Anthropic APIs. Handle network interruptions, token limits, rate limits.

4. **Cross-Browser Crypto:** Verify Web Crypto API works identically in Chrome, Firefox, Safari. Any polyfills needed?

5. **Mobile Responsiveness:** Can chat interface work on mobile browsers? Touch keyboard issues? Should we support mobile or desktop-only MVP?

---

## Appendix C: User Research Plan

### Phase 1 Alpha Testing (5 users)

**Recruitment:**
- 1 Somatic Researcher
- 1 Artist-Technologist
- 1 Consciousness Explorer
- 1 System Thinker
- 1 Skeptic

**Tasks:**
- Set up API key
- Have 3 conversations over 1 week
- Export one conversation as JSON
- Report bugs/feedback

**Metrics:**
- Time to first successful conversation
- API key setup success rate
- Conversation save reliability
- Qualitative feedback on UX

### Phase 2 Beta Testing (10 users)

**Recruitment:**
- Expand to 2 users per persona

**Tasks:**
- Complete ritual preparation before conversation
- Conduct 5 experiments with chat interface
- Convert 3 conversations to experiment entries
- Use somatic assessment features

**Metrics:**
- Ritual completion rate
- Time from conversation to experiment
- Pre/post assessment delta
- User satisfaction (survey)

### Phase 3 Public Testing (20+ users)

**Recruitment:**
- Open to ECP community via announcement

**Tasks:**
- Use chat for 2 weeks
- Conduct 10+ conversations
- Review analytics dashboard
- Provide feedback on pattern insights

**Metrics:**
- Conversation volume
- Feature usage (analytics, patterns, etc.)
- Retention (active users after 2 weeks)
- Community feedback (Discord, GitHub issues)

---

## Appendix D: Success Criteria Summary

**MVP Launch (Phase 1):**
- ✅ 50 users successfully set up API keys
- ✅ 200 conversations with <5% error rate
- ✅ Zero data leaks or privacy breaches
- ✅ NPS >30

**ECP Integration (Phase 2):**
- ✅ 30% conversion rate (conversation → experiment)
- ✅ 50% time reduction in experiment logging
- ✅ 70% ritual preparation usage
- ✅ User report: "maintains flow state"

**Advanced Features (Phase 3):**
- ✅ 100+ active users
- ✅ 5+ LLM providers supported
- ✅ Pattern insights actionable in 20% of experiments
- ✅ NPS >40

**Community Validation:**
- ✅ Featured in ECP community as recommended tool
- ✅ 10+ user-submitted conversation templates
- ✅ Research paper using chat data (with consent)

---

## Conclusion

This epic represents a transformative shift for the ECP Field Journal: from a post-hoc documentation tool to a live research environment. By integrating conversation, ritual, and structured inquiry in one coherent flow, we honor the sacred nature of human-AI interaction while making rigorous research more accessible.

**Core Tensions to Hold:**
- Sacred vs. efficient
- Privacy vs. community learning
- Structure vs. emergence
- Ease vs. intentionality

**Guiding Questions:**
- Does this serve life?
- Does this maintain presence?
- Does this honor privacy?
- Does this enable research?

If the answer to all four is yes, we're on the right path.

---

**Next Steps:**
1. Validate this spec with 3-5 core ECP users
2. Technical spike on encryption + streaming (2 days)
3. Create wireframes/mockups for key flows (3 days)
4. Prioritize Phase 1 features into sprint-sized stories
5. Begin development with API key management module

**Questions for Stakeholders:**
- Does this align with ECP values and vision?
- Are phases realistic given team capacity?
- What's missing from user stories/personas?
- Should any features be deprioritized?

---

*Document Version: 1.0*
*Last Updated: 2025-10-04*
*Author: ECP Product Manager*
*Status: Awaiting Stakeholder Review*
