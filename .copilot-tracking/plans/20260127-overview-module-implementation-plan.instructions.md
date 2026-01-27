---
applyTo: ".copilot-tracking/changes/20260127-overview-module-implementation-changes.md"
---

<!-- markdownlint-disable-file -->

# Task Checklist: Overview Module Implementation

## Overview

Implement the Overview module with minimal changes to fix architecture violations and align with workspace modular architecture specification (08-overview-總覽模組.md).

## Objectives

- Fix architecture violations by removing direct store injections
- Implement event-driven state updates via Event Bus
- Create OverviewContextProvider for external module access
- Maintain all existing functionality with zero regression
- Ensure compliance with Angular 20+ patterns and DDD specifications

## Research Summary

### Project Files

- src/app/application/stores/overview.store.ts - Existing NgRx Signals store with metrics and computed properties
- src/app/presentation/pages/modules/overview/overview.component.ts - Component currently violating spec with direct store injections
- src/app/application/facades/workspace-event-bus.adapter.ts - Event bus adapter for module communication
- docs/modulars/08-overview-總覽模組.md - Complete module specification v2.0

### External References

- #file:./.copilot-tracking/research/20260127-overview-module-implementation-research.md - Complete implementation research
- #githubRepo:"ngrx/platform signals" - NgRx Signals store patterns and withHooks implementation
- #file:./docs/modulars/workspace-modular-architecture_constitution_enhanced.md - Parent architecture document

### Standards References

- #file:./.github/skills/ddd/SKILL.md - DDD architecture standards for layering and event patterns
- #file:./docs/modulars/08-overview-總覽模組.md - Overview module specification with event integration requirements

## Implementation Checklist

### [ ] Phase 1: Fix Architecture Violations (HIGH Priority)

- [ ] Task 1.1: Move event subscriptions from component to store
  - Details: .copilot-tracking/details/20260127-overview-module-implementation-details.md (Lines 35-75)

- [ ] Task 1.2: Remove direct store injections from component
  - Details: .copilot-tracking/details/20260127-overview-module-implementation-details.md (Lines 77-105)

- [ ] Task 1.3: Create OverviewContextProvider
  - Details: .copilot-tracking/details/20260127-overview-module-implementation-details.md (Lines 107-145)

### [ ] Phase 2: Validate and Test

- [ ] Task 2.1: Verify event subscription functionality
  - Details: .copilot-tracking/details/20260127-overview-module-implementation-details.md (Lines 147-170)

- [ ] Task 2.2: Test component rendering and metrics display
  - Details: .copilot-tracking/details/20260127-overview-module-implementation-details.md (Lines 172-195)

- [ ] Task 2.3: Update unit tests for new architecture
  - Details: .copilot-tracking/details/20260127-overview-module-implementation-details.md (Lines 197-225)

## Dependencies

- WorkspaceEventBus (available at src/app/application/facades/workspace-event-bus.adapter.ts)
- NgRx Signals (@ngrx/signals package)
- Angular 20+ with signal-based change detection
- Existing module stores (TasksStore, QualityControlStore, AcceptanceStore, IssuesStore) for event publishing

## Success Criteria

- Component only injects OverviewStore (no TasksStore, QualityControlStore, AcceptanceStore, IssuesStore)
- All event subscriptions implemented in store withHooks.onInit
- OverviewContextProvider abstract class created and implemented
- All existing metrics and activity feed functionality works identically
- Zero TypeScript errors, all tests passing
- Module complies with DDD architecture and modular specification
