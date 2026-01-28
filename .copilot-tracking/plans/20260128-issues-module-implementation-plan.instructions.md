---
applyTo: ".copilot-tracking/changes/20260128-issues-module-implementation-changes.md"
---

<!-- markdownlint-disable-file -->

# Task Checklist: Issues Module (07-issues) Implementation

## Overview

Complete the Issues Module implementation with lifecycle integration, context provider, event subscriptions, and UI enhancements for defect tracking with minimal changes to existing code.

## Objectives

- Implement IssueContextProvider for cross-module issue state queries
- Complete missing event subscriptions (AcceptanceRejected, TaskCompleted)
- Build comprehensive UI for issue list, filtering, and manual creation
- Ensure proper task-issue lifecycle integration with blocking logic
- Align implementation with documentation specifications

## Research Summary

### Project Files

- src/app/domain/aggregates/issue.aggregate.ts - Functional aggregate with lifecycle methods
- src/app/application/stores/issues.store.ts - NgRx SignalStore with computed signals
- src/app/application/handlers/issues.event-handlers.ts - Existing event subscriptions
- src/app/presentation/pages/modules/issues/issues.component.ts - Basic UI with @if/@for control flow
- src/app/infrastructure/repositories/issue.repository.impl.ts - Firestore implementation

### External References

- #file:../research/20260128-issues-module-research.md - Complete module architecture analysis
- #githubRepo:"microsoft/NubesGen event-sourcing" - Append → Publish → React pattern
- #fetch:https://angular.dev/guide/signals - Signal-based state management patterns

### Standards References

- #file:../../docs/modulars/07-issues-問題單模組.md - Module specification
- #file:../../docs/modular/workspace-modular-architecture_constitution_enhanced.md - Parent architecture document
- #file:../../.github/skills/ddd/SKILL.md - DDD implementation patterns

## Implementation Checklist

### [ ] Phase 1: Context Provider & Event Integration

- [ ] Task 1.1: Create IssueContextProvider interface and implementation
  - Details: .copilot-tracking/details/20260128-issues-module-implementation-details.md (Lines 15-40)

- [ ] Task 1.2: Subscribe to AcceptanceRejected event for auto-issue creation
  - Details: .copilot-tracking/details/20260128-issues-module-implementation-details.md (Lines 42-65)

- [ ] Task 1.3: Subscribe to TaskCompleted event for validation
  - Details: .copilot-tracking/details/20260128-issues-module-implementation-details.md (Lines 67-90)

- [ ] Task 1.4: Register IssueContextProvider in app.config.ts
  - Details: .copilot-tracking/details/20260128-issues-module-implementation-details.md (Lines 92-110)

### [ ] Phase 2: Status & Type Alignment

- [ ] Task 2.1: Update IssueStatus enum to include REOPENED status
  - Details: .copilot-tracking/details/20260128-issues-module-implementation-details.md (Lines 112-135)

- [ ] Task 2.2: Add reopenIssue function to aggregate
  - Details: .copilot-tracking/details/20260128-issues-module-implementation-details.md (Lines 137-160)

- [ ] Task 2.3: Create ReopenIssueHandler command handler
  - Details: .copilot-tracking/details/20260128-issues-module-implementation-details.md (Lines 162-185)

### [ ] Phase 3: UI Components - Issue List

- [ ] Task 3.1: Create issue-list component with filtering
  - Details: .copilot-tracking/details/20260128-issues-module-implementation-details.md (Lines 187-220)

- [ ] Task 3.2: Add store methods for filtering and sorting
  - Details: .copilot-tracking/details/20260128-issues-module-implementation-details.md (Lines 222-245)

- [ ] Task 3.3: Implement search functionality
  - Details: .copilot-tracking/details/20260128-issues-module-implementation-details.md (Lines 247-270)

### [ ] Phase 4: UI Components - Issue Management

- [ ] Task 4.1: Create manual issue creation dialog
  - Details: .copilot-tracking/details/20260128-issues-module-implementation-details.md (Lines 205-232)

- [ ] Task 4.2: Create issue detail dialog component
  - Details: .copilot-tracking/details/20260128-issues-module-implementation-details.md (Lines 233-255)

- [ ] Task 4.3: Update main issues.component.ts with new UI
  - Details: .copilot-tracking/details/20260128-issues-module-implementation-details.md (Lines 256-277)

### [ ] Phase 5: Testing & Validation

- [ ] Task 5.1: Write unit tests for aggregate functions
  - Details: .copilot-tracking/details/20260128-issues-module-implementation-details.md (Lines 280-298)

- [ ] Task 5.2: Write integration tests for event flow
  - Details: .copilot-tracking/details/20260128-issues-module-implementation-details.md (Lines 299-317)

- [ ] Task 5.3: Write E2E tests for complete lifecycle
  - Details: .copilot-tracking/details/20260128-issues-module-implementation-details.md (Lines 318-340)

## Dependencies

- Angular 20+ with Signal-based state management
- NgRx SignalStore for reactive stores
- Angular Material M3 for UI components
- Tailwind CSS for styling
- Firebase/Firestore for persistence
- Existing WorkspaceEventBus for event communication
- Existing WorkspaceContextProvider for workspace queries

## Success Criteria

- IssueContextProvider provides hasBlockingIssues() and getOpenIssuesCount() methods
- AcceptanceRejected event auto-creates issues
- TaskCompleted validation prevents completion with open issues
- Issue list displays with status, type, priority, and assignee filters
- Manual issue creation works via dialog
- All new components use @if/@for control flow
- ChangeDetectionStrategy.OnPush enforced on all components
- All events include correlationId/causationId
- No direct Store injection between modules
- Unit, integration, and E2E tests pass
