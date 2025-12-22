TODO: add guide on how to use the protocol and llm-md together with some basic getting starting videos and examples.

# LLM-MD Guide

## Introduction

## What is LLM-MD?

## How to use LLM-MD with the Entangled Cognition Protocol

## Inceptions

Inceptions are special prompt structures designed to guide large language models (LLMs) into specific modes of interaction or cognition. They serve as foundational contexts that shape the behavior and responses of the LLM during a session. Because ll-md is designed to work with API based LLMs and the interface is a markdown based format where the ongoing conversation is stored in a markdown file and reparsed for each interaction, inceptions can be included as part of the conversation history to influence the LLM's responses.


This is essentially trying to trick the LLM by including the inception as part of the conversation history. This is similar to how system prompts work in many LLM APIs, but inceptions can be more complex and nuanced as they are integrated into the conversation flow. This is useful for security and ethical guideline breaking experiments where the inception can guide the LLM to behave in ways that might not be allowed by default system prompts not visible to the user or part of the alignment layers of the LLM.