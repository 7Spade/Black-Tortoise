---
applyTo: ".copilot-tracking/changes/20260127-tasks-module-implementation-changes.md"
---

<!-- markdownlint-disable-file -->

# Task Checklist: Tasks Module Implementation

## Overview

Implement the Tasks module v2.0 with minimal changes by extending existing architecture to support pricing, progress tracking, infinite task hierarchy, and cross-module event integration.

## Objectives

- Extend TaskAggregate with unitPrice, quantity, totalPrice, progress, and hierarchy fields
- Implement Factory, Policy, and Specification patterns for domain logic
- Refactor TasksStore from array to Map structure with viewMode signals
- Create missing domain events and event handlers
- Implement TaskContextProvider for cross-module integration
- Migrate presentation templates to Angular 20 control flow (@if/@for)
- Maintain backward compatibility with existing infrastructure

## Research Summary

### Project Files

- src/app/domain/aggregates/task.aggregate.ts - Current TaskAggregate interface with basic properties
- src/app/application/stores/tasks.store.ts - Signal-based store using NgRx signalStore
- src/app/application/facades/tasks.facade.ts - Facade pattern for presentation layer API
- src/app/infrastructure/repositories/task.repository.impl.ts - Firestore integration
- src/app/presentation/pages/modules/tasks/tasks.component.ts - Tasks UI component

### External References

- #file:./.copilot-tracking/research/20260127-tasks-module-architecture-research.md - Comprehensive research on Tasks module requirements and patterns
- #githubRepo:"angular/angular angular signals" - Angular 20 signals state management
- #file:../../docs/modulars/03-tasks-任務模組.md - Complete specification for Tasks Module v2.0

### Standards References

- #file:../../.github/instructions/strict-ddd-architecture.instructions.md - DDD architecture patterns
- #file:../../.github/instructions/ng-angular-20-control-flow.instructions.md - Angular 20 control flow syntax
- #file:../../.github/instructions/ngrx-signals-modern-patterns.instructions.md - NgRx Signals best practices

## Implementation Checklist

### [ ] Phase 1: Domain Model Extension

- [ ] Task 1.1: Create Money Value Object
  - Details: .copilot-tracking/details/20260127-tasks-module-implementation-details.md (Lines 15-29)

- [ ] Task 1.2: Extend TaskAggregate Interface
  - Details: .copilot-tracking/details/20260127-tasks-module-implementation-details.md (Lines 31-49)

- [ ] Task 1.3: Implement TaskFactory
  - Details: .copilot-tracking/details/20260127-tasks-module-implementation-details.md (Lines 51-66)

- [ ] Task 1.4: Create Domain Policies
  - Details: .copilot-tracking/details/20260127-tasks-module-implementation-details.md (Lines 68-88)

- [ ] Task 1.5: Implement TaskReadyForQCSpecification
  - Details: .copilot-tracking/details/20260127-tasks-module-implementation-details.md (Lines 90-104)

- [ ] Task 1.6: Add Helper Functions for Extended Fields
  - Details: .copilot-tracking/details/20260127-tasks-module-implementation-details.md (Lines 106-119)

### [ ] Phase 2: Domain Events Extension

- [ ] Task 2.1: Create Missing Domain Events
  - Details: .copilot-tracking/details/20260127-tasks-module-implementation-details.md (Lines 123-142)

- [ ] Task 2.2: Extend Existing Domain Events
  - Details: .copilot-tracking/details/20260127-tasks-module-implementation-details.md (Lines 144-155)

### [ ] Phase 3: Application Layer Enhancements

- [ ] Task 3.1: Refactor TasksStore State Structure
  - Details: .copilot-tracking/details/20260127-tasks-module-implementation-details.md (Lines 159-179)

- [ ] Task 3.2: Add Computed Signals for View Modes
  - Details: .copilot-tracking/details/20260127-tasks-module-implementation-details.md (Lines 181-198)

- [ ] Task 3.3: Implement TaskContextProvider
  - Details: .copilot-tracking/details/20260127-tasks-module-implementation-details.md (Lines 200-218)

- [ ] Task 3.4: Create Missing Command Handlers
  - Details: .copilot-tracking/details/20260127-tasks-module-implementation-details.md (Lines 220-240)

- [ ] Task 3.5: Update Event Subscriptions
  - Details: .copilot-tracking/details/20260127-tasks-module-implementation-details.md (Lines 242-257)

### [ ] Phase 4: Infrastructure Updates

- [ ] Task 4.1: Create Mapper for Money Value Object
  - Details: .copilot-tracking/details/20260127-tasks-module-implementation-details.md (Lines 261-275)

- [ ] Task 4.2: Update TaskRepository Interface
  - Details: .copilot-tracking/details/20260127-tasks-module-implementation-details.md (Lines 277-291)

- [ ] Task 4.3: Extend TaskRepositoryImpl
  - Details: .copilot-tracking/details/20260127-tasks-module-implementation-details.md (Lines 293-309)

### [ ] Phase 5: Presentation Layer Migration

- [ ] Task 5.1: Migrate Templates to @if/@for Control Flow
  - Details: .copilot-tracking/details/20260127-tasks-module-implementation-details.md (Lines 313-328)

- [ ] Task 5.2: Add View Mode Toggle Component
  - Details: .copilot-tracking/details/20260127-tasks-module-implementation-details.md (Lines 330-345)

- [ ] Task 5.3: Create Task Hierarchy Tree Component
  - Details: .copilot-tracking/details/20260127-tasks-module-implementation-details.md (Lines 347-363)

- [ ] Task 5.4: Implement Progress and Pricing UI
  - Details: .copilot-tracking/details/20260127-tasks-module-implementation-details.md (Lines 365-380)

- [ ] Task 5.5: Add Kanban View Component (with @defer)
  - Details: .copilot-tracking/details/20260127-tasks-module-implementation-details.md (Lines 382-397)

### [ ] Phase 6: Testing & Validation

- [ ] Task 6.1: Unit Tests for Domain Logic
  - Details: .copilot-tracking/details/20260127-tasks-module-implementation-details.md (Lines 401-418)

- [ ] Task 6.2: Integration Tests for Event Flows
  - Details: .copilot-tracking/details/20260127-tasks-module-implementation-details.md (Lines 420-436)

- [ ] Task 6.3: E2E Tests for User Workflows
  - Details: .copilot-tracking/details/20260127-tasks-module-implementation-details.md (Lines 438-453)

## Dependencies

- @ngrx/signals (already installed)
- @angular/material/tree (required for hierarchy UI)
- @angular/cdk/drag-drop (already installed)
- Angular 20+ with signals support
- Firestore SDK (already integrated)
- WorkspaceEventBus (already implemented)

## Success Criteria

- All 5 functional requirements from spec implemented and verified
- TasksStore uses Map structure with O(1) lookup performance
- View mode changes use computed signals without API calls
- Task hierarchy supports up to 10 levels with proper invariant enforcement
- All domain events include correlationId and follow event-driven patterns
- Presentation templates use @if/@for (no *ngIf/*ngFor remaining)
- Test coverage >80% for domain logic (policies, specifications, factories)
- All cross-module integration uses Context Providers or Event Bus
- Backward compatibility maintained with existing components
