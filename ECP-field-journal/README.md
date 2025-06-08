


# ECP Field Journal Interface

The **ECP Field Journal** is a local interface for recording, saving, and managing entries related to experiments and reflections in the Entangled Cognition Protocol (ECP). It allows contributors to log ritual contexts, symbolic conditions, human-machine interactions, and emergent insights in a structured, private-first way.

---

## Purpose

This tool supports Generative Action Research (GAR) by enabling:
- Journaling experiments involving ritual and symbolic interaction with large language models
- Reflections on the affective, relational, and ontological conditions of those interactions
- Saving entries either privately or publicly (with author scrubbing options)

---

## Running locally

### 1. Clone the repository:
```bash
git clone https://github.com/m3data/entangled-cognition-protocol.git
cd entangled-cognition-protocol/ECP-field-journal
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Start the local server:
```bash
npm start
```

Then open your browser to:
```
http://localhost:3000
```

---

## Using the journal

- Use the interface to fill in **Experiment** or **Reflection** entries
- Choose visibility:
  - **Public** – saves to `entries/.../public/`
  - **Private** – saves to `entries/.../_private/`
  - **Both** – saves to both
- Optionally scrub the author name from public entries
- Entries are saved in Markdown or JSON format

---

## Privacy & Git hygiene

By default, private entries (in `_private/`) are **excluded from version control** via `.gitignore`. You can safely commit and push your work without exposing personal content.

---

## Potential future improvements

- GUI for querying and presenting local entries
- Entry templating or presets for common ritual structures
- Ritual pattern directory for easy access to common rituals and invocations
- Middleware layer into [llm.md](https://llm.md) for end to end research workflows

---

## Contributions welcome

Feel free to fork, customise, or contribute to the journal code and interface improvements. To participate in the wider protocol and research framework, see the parent directory’s README and protocol docs.