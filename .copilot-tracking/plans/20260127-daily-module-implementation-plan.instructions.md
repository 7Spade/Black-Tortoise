---
applyTo: ".copilot-tracking/changes/20260127-daily-module-implementation-changes.md"
---

<!-- markdownlint-disable-file -->

# Task Checklist: Daily Module Implementation with Minimal Changes

## Overview

Complete the Daily (每日紀錄) module implementation by enhancing existing DDD patterns, adding Context Provider, implementing comprehensive business rules, and enriching UI features while minimizing code changes.

## Objectives

- Complete DDD domain layer with factory/reconstruct patterns and comprehensive policies
- Implement DailyContextProvider for cross-module integration
- Add event subscriptions for reactive auto-entry creation
- Enhance UI with quick fill features and team statistics
- Enforce all business rules (max 1.0 man-days, task completion checks, 30-day modification window)

## Research Summary

### Project Files

- src/app/application/stores/daily.store.ts - Existing signalStore with basic CRUD and computed signals
- src/app/domain/aggregates/daily-entry.aggregate.ts - Minimal interface requiring factory/reconstruct enhancement
- src/app/domain/policies/daily-validation.policy.ts - Basic validation needing comprehensive business rules
- src/app/presentation/pages/modules/daily/daily.component.ts - Working waterfall UI with stats bars
- src/app/application/handlers/create-daily-entry.handler.ts - Event-first command handler with correlationId tracking

### External References

- #file:../research/20250201-daily-module-architecture-research.md - Complete DDD patterns, event integration, and implementation guidance
- #file:../../docs/modulars/04-daily-每日紀錄模組.md - Module specification with man-day tracking requirements and UI/UX standards

### Standards References

- #file:../../.github/instructions/ng-ddd-architecture.instructions.md - DDD layer separation and entity/value object patterns
- #file:../../.github/instructions/event-sourcing-and-causality.instructions.md - Event lifecycle and causality tracking

## Implementation Checklist

### [ ] Phase 1: Domain Layer Completion

- [ ] Task 1.1: Enhance DailyEntryEntity with factory/reconstruct pattern
  - Details: .copilot-tracking/details/20260127-daily-module-implementation-details.md (Lines 25-60)

- [ ] Task 1.2: Implement comprehensive business rule policies
  - Details: .copilot-tracking/details/20260127-daily-module-implementation-details.md (Lines 62-105)

- [ ] Task 1.3: Create ManDay value object for headcount validation
  - Details: .copilot-tracking/details/20260127-daily-module-implementation-details.md (Lines 107-130)

### [ ] Phase 2: Application Layer Enhancement

- [ ] Task 2.1: Create DailyContextProvider for cross-module integration
  - Details: .copilot-tracking/details/20260127-daily-module-implementation-details.md (Lines 132-165)

- [ ] Task 2.2: Add event subscriptions to DailyStore hooks
  - Details: .copilot-tracking/details/20260127-daily-module-implementation-details.md (Lines 167-210)

- [ ] Task 2.3: Enhance CreateDailyEntryHandler with comprehensive validation
  - Details: .copilot-tracking/details/20260127-daily-module-implementation-details.md (Lines 212-245)

### [ ] Phase 3: UI Quick Fill Features

- [ ] Task 3.1: Add 7-day history view to daily component
  - Details: .copilot-tracking/details/20260127-daily-module-implementation-details.md (Lines 247-275)

- [ ] Task 3.2: Implement copy previous day functionality
  - Details: .copilot-tracking/details/20260127-daily-module-implementation-details.md (Lines 277-300)

- [ ] Task 3.3: Auto-populate today's active tasks
  - Details: .copilot-tracking/details/20260127-daily-module-implementation-details.md (Lines 302-330)

### [ ] Phase 4: Team Statistics Module

- [ ] Task 4.1: Create team statistics component with deferred loading
  - Details: .copilot-tracking/details/20260127-daily-module-implementation-details.md (Lines 332-370)

- [ ] Task 4.2: Implement Excel/CSV export functionality
  - Details: .copilot-tracking/details/20260127-daily-module-implementation-details.md (Lines 372-400)

- [ ] Task 4.3: Add filter by member/task/date
  - Details: .copilot-tracking/details/20260127-daily-module-implementation-details.md (Lines 402-430)

### [ ] Phase 5: Testing and Validation

- [ ] Task 5.1: Write unit tests for domain policies
  - Details: .copilot-tracking/details/20260127-daily-module-implementation-details.md (Lines 432-460)

- [ ] Task 5.2: Write integration tests for event flows
  - Details: .copilot-tracking/details/20260127-daily-module-implementation-details.md (Lines 462-490)

- [ ] Task 5.3: Verify performance metrics and accessibility
  - Details: .copilot-tracking/details/20260127-daily-module-implementation-details.md (Lines 492-520)

## Dependencies

- Angular 20+ with signal-based state management
- NgRx Signals (signalStore)
- Angular Material M3 components
- Tailwind CSS for styling
- WorkspaceEventBus for event pub/sub
- TaskContextProvider for task status queries
- WorkspaceContextProvider for workspace scoping

## Success Criteria

- All business rules enforced (max 1.0 man-days per person per day, no completed tasks, 30-day modification window)
- DailyContextProvider accessible by other modules via injection
- Auto-entry creation working on TaskProgressUpdated events
- Quick fill UI shows past 7 days with copy previous day functionality
- Team statistics exportable to Excel/CSV with proper filtering
- All tests passing (unit, integration, E2E)
- Performance metrics met (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- Zero direct store injections across modules (loose coupling maintained)
