<div align="center">
  <a href="https://github.com/Prompthon-IO">
    <img src="https://github.com/Prompthon-IO.png?size=160" alt="Prompthon IO" width="96" height="96" />
  </a>

  <h1>Agent Systems Handbook</h1>

  <p>
    A working handbook repository from <strong>Prompthon IO</strong> for organizing
    practical knowledge about modern agent systems, from core concepts to
    production-minded implementation patterns.
  </p>

  <p>
    <a href="https://github.com/Prompthon-IO">Organization</a>
    ·
    <a href="https://github.com/Prompthon-IO/agent-systems-handbook">Repository</a>
    ·
    <a href="https://github.com/Prompthon-IO/agent-systems-handbook/issues">Issues</a>
  </p>

  <p>
    <img src="https://img.shields.io/github/last-commit/Prompthon-IO/agent-systems-handbook?style=flat-square" alt="Last commit" />
    <img src="https://img.shields.io/github/stars/Prompthon-IO/agent-systems-handbook?style=flat-square" alt="GitHub stars" />
    <img src="https://img.shields.io/github/forks/Prompthon-IO/agent-systems-handbook?style=flat-square" alt="GitHub forks" />
    <img src="https://img.shields.io/github/issues/Prompthon-IO/agent-systems-handbook?style=flat-square" alt="GitHub issues" />
  </p>
</div>

---

## Overview

This repository is a repo-native handbook scaffold for understanding how agent
systems are designed, compared, built, evaluated, and operated in practice.
It is structured as a global field guide rather than a single linear course.

The current repository now separates evergreen handbook content, fast-moving
ecosystem coverage, reader paths, and contributor scaffolding so the project
can grow without collapsing back into one long chapter stream.

## Current Status

- The top-level handbook lanes are now scaffolded in the repository.
- Imported reference material remains available under `references/`.
- Reader paths and contributor templates are in place for future content work.
- Most topic pages are still to be authored.

## What This Handbook Covers

- Agent system fundamentals and terminology
- Reusable agent patterns and workflow mechanisms
- Systems concerns such as context, protocols, evaluation, and reliability
- Ecosystem comparisons across global and Chinese agent tooling
- Story-led case studies for major agent product categories
- Fast-moving radar and publication extensions

## Reading Paths

| Path | Best for | Start |
| --- | --- | --- |
| Conceptual Breadth | Readers who want the big picture first | [`reading-paths/conceptual-breadth.md`](./reading-paths/conceptual-breadth.md) |
| Implementation Depth | Builders who care about patterns and systems design | [`reading-paths/implementation-depth.md`](./reading-paths/implementation-depth.md) |
| Contributor and Curation | Contributors shaping the handbook and its coverage | [`reading-paths/contributor-and-curation.md`](./reading-paths/contributor-and-curation.md) |

## Repository Structure

| Path | Purpose |
| --- | --- |
| `foundations/` | Core concepts, terminology, and mental models |
| `patterns/` | Reusable agent design patterns and mechanisms |
| `systems/` | Production-minded systems topics such as evaluation and interoperability |
| `ecosystem/` | Topic-first comparisons of tools, models, and platforms |
| `case-studies/` | Story-led examples for major agent archetypes |
| `radar/` | Fast-moving market and protocol tracking |
| `reading-paths/` | Guided entry points for different reader types |
| `publications/` | Metadata and structure for external reading extensions |
| `contributor-kit/` | Templates and editorial scaffolding for contributions |
| `references/` | Imported source material and planning documents |

## Editorial Direction

- Path-first, not chapter-first
- Story-led pages that move from problem to architecture to tradeoffs
- Topic-first ecosystem coverage with explicit global and Chinese lanes
- Repo-native content outside `references/`, with source-aware adaptation

## Reference Base And Reuse Boundary

The current reference base includes the upstream `Hello-Agents` materials under
[`references/hello-agents-main/`](./references/hello-agents-main/).

That material is being used here as source input for curation and planning, not
as the final published structure of this repository. The strategy document that
guided this first-pass scaffold lives at
[`references/global-agent-repository-strategy.md`](./references/global-agent-repository-strategy.md).

If content is later adapted from upstream material, attribution and license
constraints should be reviewed before publication.

Upstream source:

- [datawhalechina/Hello-Agents](https://github.com/datawhalechina/Hello-Agents)

## Contributing

Start with the contributor scaffolding in
[`contributor-kit/`](./contributor-kit/) and use the article template before
adding new handbook pages. The immediate contribution surfaces are:

- handbook structure and page proposals
- ecosystem comparison updates
- radar updates for new releases and protocol changes
- refinement of metadata and publication linkage

## Notes

- This repository is still early-stage, but it now has a repo-native structure.
- Most folders currently contain direction-setting `README.md` files rather than
  finished long-form content.
