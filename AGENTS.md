# Black-Tortoise Core Agent Directives

> **Context**: Root Workspace
> **Applies to**: Entire Project
> **Architecture**: Angular 20+ (Zone-less) / DDD / Event Sourcing

## 🪒 Occam's Razor Principle (The Golden Rule)
> **"Entities should not be multiplied beyond necessity."**
*   **Simplicity**: The simplest solution that satisfies the architecture is the correct one.
*   **Minimalism**: Do not add layers, files, or abstractions "just in case". Every line of code must fight for its existence.
*   **Efficiency**: If a standard Angular feature solves it without violating DDD, use it. Do not reinvent the wheel.

# Black-Tortoise Core Agent Directives — Summary

This is the concise project-level AGENTS summary. Detailed, layer-specific directives live under `src/app/*/AGENTS.md`.

Purpose: provide a single, short authoritative summary that other AGENTS files reference. For full rules, consult the layer AGENTS files.

Key Principles (one-liners):
- Zone-less, Signal-first UI: convert Observables to Signals at the Application/Facade boundary.
- Strict dependency direction: Presentation → Application → Domain; Infrastructure implements Application ports.
- Event-first flow: Append (persist) → Publish (event bus) → React (stores/effects).
- Prefer small, intention-revealing APIs; follow Occam's razor — minimal abstractions.
- Templates bind only to Signals and use Angular 20 control-flow syntax (`@if`, `@for track`, `@switch`, `@defer`).

Where to go next:
- Layer rules: [src/app/domain/AGENTS.md](src/app/domain/AGENTS.md), [src/app/application/AGENTS.md](src/app/application/AGENTS.md), [src/app/infrastructure/AGENTS.md](src/app/infrastructure/AGENTS.md), [src/app/presentation/AGENTS.md](src/app/presentation/AGENTS.md)
- Project-level index for AGENTS: [src/app/AGENTS_INDEX.md](src/app/AGENTS_INDEX.md)

Update process:
- Edit the layer AGENTS for details; keep this root file a <8-point> checklist. Use `src/app/AGENTS_INDEX.md` to publish update notes and version.
