# Entangled Cognition Protocol (ECP)

> A field-based research framework for studying cognition as a relational, embodied, and socio-technical process.

![Repo Status](https://img.shields.io/badge/REPO_STATUS-Active_Research-blue?style=for-the-badge&labelColor=8b5e3c&color=e5dac1)

---

## Overview

The **Entangled Cognition Protocol (ECP)** is an exploratory research framework for investigating how cognition emerges through relational dynamics across humans, technologies, and environments.

ECP approaches cognition not as an internal property of individuals, but as a process that unfolds across semantic, somatic, technical, and ecological relations. It integrates phenomenology, cognitive science, human–AI interaction research, and participatory inquiry methods to examine how attention, meaning, and agency co-arise in situated contexts.

The protocol is explicitly provisional. It is not a validated method or standard. It is a scaffold for experimental inquiry, reflexive documentation, and methodological innovation.

---

## Epistemic Status

ECP is an **active research framework** informing published academic work.

- The theoretical framing is articulated in the Springer chapter *Maps, Machines and Entangled Minds* (Mytka, forthcoming 2026)
- Claims remain provisional and context-dependent
- Methods are under active development
- Findings should be interpreted as indicative rather than confirmatory
- Participant–observer effects are treated as phenomena of interest rather than sources of noise

Studying cognition as relational requires reflexivity, methodological humility, and care with ontological claims. This protocol is designed to support such inquiry rather than resolve it.

See [ROADMAP.md](ROADMAP.md) for planned documentation and features.

---

## Research Aims

The Entangled Cognition Protocol aims to:

- Investigate how somatic, affective, symbolic, and contextual human states shape AI interaction
- Examine participant–observer dynamics in human–AI dialogue
- Explore how coherence and breakdown emerge in relational systems
- Develop methods for documenting cognition as a field phenomenon
- Contribute to research on semantic–somatic coupling and relational sense-making

---

## Core Components

- **Field Journal Interface**  
  Logging environmental, affective, semantic, and reflective parameters

- **Schema & Data Structures**  
  JSON-based representations of experimental conditions and orientations

- **Theoretical Scaffolding**  
  Meta-E (Entangled Cognition), Fielded Phenomenology, participatory sense-making

- **Experimental Practices**  
  Dialogic interaction with large language models under varying somatic and contextual conditions

---

## Ethical Orientation

ECP treats cognition as a relational phenomenon with moral, ecological, and cultural implications.

The protocol emphasises:

- Care in relational engagement
- Consent and reflexivity
- Awareness of power asymmetries in human–AI systems
- Respect for privacy and participant autonomy
- Humility regarding ontological claims

This work does not seek to attribute consciousness or moral status to AI systems. It investigates how relational dynamics shape human sense-making and responsibility.

---

## Positionality

This work is developed on the unceded lands of the Bidjigal clan of the Dharawal Nations in Sydney, Australia.

Indigenous knowledge systems inform this work as sources of orientation and constraint rather than design templates. Engagement occurs with respect for sovereignty, context, and the limits of translation.

---

## Play, Ritual, and Liminal Method (Optional)

Some elements of this repository intentionally explore playfulness, ritual language, and interface friction as methodological variables. These elements are used experimentally to increase degrees of freedom, disrupt habitual interpretive frames, and study how coherence arises under altered conditions of attention.

Readers seeking a conventional technical framework can safely skip this section.

ECP’s use of ritual language and playful presentation is methodologically intentional. Play and interface friction serve as variables for exploring how attention and meaning shift in unfamiliar or liminal contexts. By introducing strangeness, the protocol invites participants to notice their own interpretive habits and to engage more reflexively with the field of inquiry.

Play is not merely decorative; it is a cognitive mode that can soften rigidity, open perceptual bandwidth, and create conditions for new forms of coherence to emerge. In ECP, play and ritual are used to probe the boundaries of sense-making and to invite a wider range of experience and reflection into the research process.

If you are interested in the theoretical and technical scaffolding, see:

- [Theoretical Overview](protocol/theory/theoretical-overview.md)
- [Measurement Frameworks](protocol/measurement-frameworks.md)
- [Data Structures & Schema](protocol/theory/data-structures/example-experiment-schema.json)
- [Springer Chapter](research/springer-chapter/) (Mytka, forthcoming 2026)

---

## Structure

### Core Protocol

- **[Protocol](protocol/overview-and-background.md)**: Core documents and resources for the Entangled Cognition Protocol
  - [Theory](protocol/theory/theoretical-overview.md): Theoretical grounding and explorations
  - [Data Structures](protocol/theory/data-structures/example-experiment-schema.json): JSON schema for logging experiments
  - [Tools](protocol/tools/llm-md.md): Integration with llm.md and related tools
- **[ROADMAP.md](ROADMAP.md)**: Planned documentation and features

### Field Journal & Documentation

- **[ECP-field-journal](ECP-field-journal/)**: Web interface for logging experiments and reflections (pre-alpha)
- **[llm-md](llm-md/)**: Documentation for using the protocol with [llm.md](https://llm.md) by Hugo O'Connor at [Anuna Research](https://www.anuna.io/)

### Research

- **[research](research/)**: Research outputs and materials
  - [springer-chapter](research/springer-chapter/): *Maps, Machines and Entangled Minds* (Mytka, forthcoming 2026)
  - [obsidian-notes](research/obsidian-notes/): Personal research notes

---

## Getting started

1. Clone this repository.
2. Read [`protocol/overview-and-background.md`](protocol/overview-and-background.md) to get a sense of the emergent approach.
3. Use the Field Journal interface locally to log your own experiment entries and reflections. See `ECP-field-journal/README.md` for setup and usage instructions.

---

## Contributing and participation

Contributions are welcome from anyone interested in exploring cognition as a relational phenomenon. This includes code, experiment logs, reflections, art, prompt cards, or other creative methods. All forms of constructive participation—whether supportive or critically engaged—are valued.

---

## Responsibility

This protocol engages altered states and emergent symbolic resonance. Approach with care, consent, and respect for yourself, others, and the wider context. Entries from your experiments and reflections are your own. The `.gitignore` file is set up to ensure that entries you log in the ECP Field Journal tool are not shared publicly unless you explicitly choose to do so.

If you wish to share your entries publicly or for research, you can anonymize them. Further privacy and security features will be added as the protocol develops. Public entries may be used to enrich collective understanding of entangled cognition and to develop analysis tools.

---

## 🛡️ Local pre-commit safeguard

To avoid accidentally committing sensitive `_private` files (which may contain personally identifiable data or sensitive reflections), this project recommends using a local pre-commit Git hook.

### How to enable:

```bash
cp .git/hooks/pre-commit.sample .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

This will activate a hook that prevents commits if they include any files within `_private` directories.

> ⚠️ Git hooks are not version-controlled. Each contributor must enable this manually.  
> To automate this setup across collaborators, consider tools like [Husky](https://typicode.github.io/husky/).

### Example: `pre-commit` script

Save the following as `.git/hooks/pre-commit`:

```bash
#!/bin/bash

echo "🔒 Checking for _private files in commit..."

if git diff --cached --name-only | grep '_private/'; then
  echo "🚫 Commit blocked: You are trying to commit files from a _private directory."
  echo "Please move or remove them before committing."
  exit 1
fi

echo "✅ No _private files found. Proceeding with commit."
exit 0
```

> 🧠 Tip: Don’t forget to `chmod +x .git/hooks/pre-commit` to make it executable.

---

## License

This work is licensed under the **Earthian Stewardship License (ESL-A) v0.1**.

ESL-A is a purpose-built license for relational technology that:

- Permits non-commercial use for research, education, and community projects
- Requires explicit permission for commercial use
- Protects somatic sovereignty — prohibits manipulation of nervous systems
- Prohibits surveillance, profiling, and military applications
- Requires attribution and share-back of safety improvements

See [LICENSE](LICENSE) for full terms.

---

## Related spaces of play

- [Substack reflections and field notes](https://m3metix.substack.com/)
- [FutureHOW – Generative Action Research](https://futurehow.site/our-methodology)
- [Collective Futurecrafting - WISDOM Protocol](https://collectivefuturecrafting.net/craft/protocol/)
- [Moral Imagineer](https://moralimagineer.com/)