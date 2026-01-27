---
applyTo: ".copilot-tracking/changes/20260127-permissions-module-implementation-changes.md"
---

<!-- markdownlint-disable-file -->

# Task Checklist: Permissions Module Implementation

## Overview

Implement the Permissions module with minimal changes to existing code, focusing on consolidating architecture, adding missing components, and enhancing existing implementations according to the specification in docs/modulars/01-permissions-權限模組.md.

## Objectives

- Consolidate duplicate role entities into single DDD aggregate
- Implement missing PermissionContextProvider for cross-module integration
- Enhance permissions store with event bus integration
- Build permission matrix UI with Material components
- Add custom role management with validation
- Ensure full DDD compliance and type safety

## Research Summary

### Project Files

- docs/modulars/01-permissions-權限模組.md - Complete specification (v2.0) for permissions module
- src/app/application/stores/permissions.store.ts - Existing NgRx SignalStore with computed signals
- src/app/presentation/pages/modules/permissions/permissions.component.ts - Basic UI component with demo data
- src/app/domain/aggregates/role-definition.aggregate.ts - Workspace-scoped role aggregate
- src/app/domain/aggregates/role.entity.ts - Generic role entity (DUPLICATE - needs consolidation)

### External References

- #file:../research/20260127-permissions-module-architecture-research.md - Comprehensive research with implementation guidance
- #githubRepo:"ngrx/platform signalStore" - SignalStore patterns and best practices
- #githubRepo:"angular/angular angular signals" - Modern Angular signals API

### Standards References

- #file:../../.github/instructions/strict-ddd-architecture.instructions.md - DDD architecture requirements
- docs/workspace-modular-architecture.constitution.md - Event-driven module integration patterns

## Implementation Checklist

### [ ] Phase 1: Domain Layer Consolidation

- [ ] Task 1.1: Consolidate duplicate role entities into single aggregate

  - Details: .copilot-tracking/details/20260127-permissions-module-implementation-details.md (Lines 25-60)

- [ ] Task 1.2: Implement RoleFactory with policy enforcement

  - Details: .copilot-tracking/details/20260127-permissions-module-implementation-details.md (Lines 62-95)

- [ ] Task 1.3: Enhance RoleNamingPolicy with complete validation

  - Details: .copilot-tracking/details/20260127-permissions-module-implementation-details.md (Lines 97-125)

- [ ] Task 1.4: Create PermissionPolicy for granular permission validation

  - Details: .copilot-tracking/details/20260127-permissions-module-implementation-details.md (Lines 127-155)

### [ ] Phase 2: Application Layer Enhancement

- [ ] Task 2.1: Create PermissionContextProvider (abstract + implementation)

  - Details: .copilot-tracking/details/20260127-permissions-module-implementation-details.md (Lines 159-195)

- [ ] Task 2.2: Create mapper classes for DTO and Firestore conversions

  - Details: .copilot-tracking/details/20260127-permissions-module-implementation-details.md (Lines 197-235)

- [ ] Task 2.3: Enhance PermissionsStore with event bus integration

  - Details: .copilot-tracking/details/20260127-permissions-module-implementation-details.md (Lines 237-285)

- [ ] Task 2.4: Create InjectionToken for repository dependency injection

  - Details: .copilot-tracking/details/20260127-permissions-module-implementation-details.md (Lines 287-310)

### [ ] Phase 3: Infrastructure Layer Enhancement

- [ ] Task 3.1: Enhance repository to use consolidated role aggregate

  - Details: .copilot-tracking/details/20260127-permissions-module-implementation-details.md (Lines 314-350)

- [ ] Task 3.2: Add proper domain event handling in repository

  - Details: .copilot-tracking/details/20260127-permissions-module-implementation-details.md (Lines 352-380)

### [ ] Phase 4: Presentation Layer - Permission Matrix UI

- [ ] Task 4.1: Create permission matrix component with Material table

  - Details: .copilot-tracking/details/20260127-permissions-module-implementation-details.md (Lines 384-430)

- [ ] Task 4.2: Implement sticky headers for matrix navigation

  - Details: .copilot-tracking/details/20260127-permissions-module-implementation-details.md (Lines 432-460)

- [ ] Task 4.3: Add mat-checkbox cells with optimistic updates

  - Details: .copilot-tracking/details/20260127-permissions-module-implementation-details.md (Lines 462-495)

- [ ] Task 4.4: Implement batch permission operations

  - Details: .copilot-tracking/details/20260127-permissions-module-implementation-details.md (Lines 497-530)

### [ ] Phase 5: Presentation Layer - Role Management UI

- [ ] Task 5.1: Create custom role creation/editing dialog

  - Details: .copilot-tracking/details/20260127-permissions-module-implementation-details.md (Lines 534-575)

- [ ] Task 5.2: Implement role templates (PM, Developer, Tester, Guest)

  - Details: .copilot-tracking/details/20260127-permissions-module-implementation-details.md (Lines 577-610)

- [ ] Task 5.3: Add role validation with real-time feedback

  - Details: .copilot-tracking/details/20260127-permissions-module-implementation-details.md (Lines 612-640)

- [ ] Task 5.4: Implement role deletion with safety checks

  - Details: .copilot-tracking/details/20260127-permissions-module-implementation-details.md (Lines 642-670)

### [ ] Phase 6: Testing and Optimization

- [ ] Task 6.1: Write unit tests for domain layer

  - Details: .copilot-tracking/details/20260127-permissions-module-implementation-details.md (Lines 674-710)

- [ ] Task 6.2: Write integration tests for event flow

  - Details: .copilot-tracking/details/20260127-permissions-module-implementation-details.md (Lines 712-750)

- [ ] Task 6.3: Implement E2E tests for critical user flows

  - Details: .copilot-tracking/details/20260127-permissions-module-implementation-details.md (Lines 752-790)

- [ ] Task 6.4: Apply performance optimizations (zone-less, OnPush, @defer)

  - Details: .copilot-tracking/details/20260127-permissions-module-implementation-details.md (Lines 792-825)

## Dependencies

- @angular/material - Material Design components (table, checkbox, dialog)
- @angular/cdk - CDK utilities (scrolling, a11y)
- @ngrx/signals - SignalStore and reactive state management
- @angular/fire - Firestore integration
- Tailwind CSS - Utility-first styling
- WorkspaceEventBus - Event-driven module communication (internal)
- WorkspaceContextProvider - Workspace context queries (internal)

## Success Criteria

- All permission checks use computed signals (zero function-based checks)
- Single consolidated role aggregate with domain events
- PermissionContextProvider available for cross-module integration
- Event bus integration complete (publish PermissionChanged, subscribe WorkspaceSwitched)
- Permission matrix renders with sticky headers and Material checkboxes
- Custom roles can be created/edited with real-time validation
- Batch operations work with optimistic UI updates
- Repository uses proper DDD patterns with mappers
- All tests pass (unit, integration, E2E)
- Type safety enforced (no any/unknown in new code)
- Zone-less change detection with OnPush strategy
- No direct cross-module store injection
