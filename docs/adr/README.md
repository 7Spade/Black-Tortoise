# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records documenting significant architectural decisions made in the Black Tortoise project.

## ADR Format

Each ADR follows this structure:
- **Status**: Proposed, Accepted, Deprecated, Superseded
- **Date**: Decision date (YYYY-MM-DD)
- **Context**: Background and problem statement
- **Options Considered**: Alternative approaches with pros/cons
- **Decision**: Chosen option with rationale
- **Consequences**: Positive, negative, and mitigation strategies
- **Review Trigger**: Conditions that warrant re-evaluation

## Index of ADRs

### [ADR 0001: Router Usage in Presentation Components](./0001-router-in-presentation-components.md)
**Status**: Accepted  
**Date**: 2024-01-22  
**Summary**: Justifies Angular Router injection in presentation layer as a framework-level UI concern. Documents testing strategy with Router mocks and provides guidelines for when to abstract navigation logic.

**Key Decision**: Router is permitted in presentation components as it's a presentation framework service, not domain logic. Business logic must remain in application stores.

---

### [ADR 0002: WorkspaceContextStore Architecture](./0002-workspace-context-store-architecture.md)
**Status**: Accepted with Recommendations  
**Date**: 2024-01-22  
**Summary**: Analysis of WorkspaceContextStore compliance with @ngrx/signals patterns and DDD principles. Documents direct domain service exposure and recommends Command/Facade pattern for future growth.

**Key Decision**: Current implementation is correct and requires no modifications. Store properly uses `signalStore()`, `patchState()`, computed signals, and is zone-less compatible. Direct use case injection is acceptable at current scale.

**Recommendation**: Migrate to Command/Facade pattern when store methods exceed 10-15 lines or when orchestration logic needs reuse.

---

### [ADR 0003: Module Migration Strategy](./0003-module-migration-strategy.md)
**Status**: Proposed  
**Date**: 2024-01-22  
**Summary**: Documents dual architectural patterns for workspace modules: event-driven (production modules) vs. direct store access (demo features). Proposes hybrid approach for future migration.

**Key Decision**: Maintain both patterns for now. Document clear decision criteria:
- **Event-driven**: For complex cross-module coordination, loose coupling
- **Direct Store Access**: For read-only modules, simple dashboards, standalone features

**Future**: Evaluate hybrid approach allowing modules to inject store for reads while using events for writes/coordination.

---

## Creating New ADRs

When creating a new ADR:

1. Use sequential numbering: `NNNN-descriptive-title.md` (e.g., `0004-authentication-strategy.md`)
2. Follow the standard format (see existing ADRs as templates)
3. Update this README.md index with a summary
4. Link to ADRs from relevant code and documentation
5. Date format: YYYY-MM-DD
6. Keep ADRs focused on single decisions
7. Include code examples where helpful
8. Define clear review triggers

## ADR Statuses

- **Proposed**: Under discussion, not yet implemented
- **Accepted**: Decision made and being followed
- **Deprecated**: No longer relevant or replaced by newer decision
- **Superseded**: Replaced by a newer ADR (link to replacement)

## References

- [Architecture Decision Records (ADRs) - Michael Nygard](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [ADR GitHub Organization](https://adr.github.io/)
- [Markdown Architectural Decision Records (MADR)](https://adr.github.io/madr/)
