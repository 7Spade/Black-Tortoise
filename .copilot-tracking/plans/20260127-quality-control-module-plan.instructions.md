---
applyTo: ".copilot-tracking/changes/20260127-quality-control-module-changes.md"
---

<!-- markdownlint-disable-file -->

# Task Checklist: Quality Control Module Implementation

## Overview

Implement comprehensive Quality Control module with checklist-based reviews, template system, event-driven workflow, and analytics tracking following strict Angular 20+ and DDD patterns.

## Objectives

- Expand QC domain model to support checklist-based reviews with templates
- Implement complete event integration (TaskReadyForQC, IssueResolved, QCStarted)
- Build comprehensive review UI with task snapshot display
- Add QC analytics and history tracking capabilities
- Ensure all code follows Angular 20+ signals, modern control flow, and OnPush strategy

## Research Summary

### Project Files

- src/app/domain/aggregates/quality-control.aggregate.ts - Basic QCCheckEntity exists, needs expansion to full aggregate pattern
- src/app/application/stores/quality-control.store.ts - SignalStore foundation with pending/completed tracking, needs checklist management
- src/app/presentation/pages/modules/quality-control/quality-control.component.ts - Basic UI with modern control flow, needs task snapshot and checklist components
- src/app/application/handlers/quality-control.event-handlers.ts - QCPassed/QCFailed handlers exist, missing TaskReadyForQC and IssueResolved subscriptions

### External References

- #file:.copilot-tracking/research/20250127-quality-control-module-research.md - Complete module analysis with patterns and technical requirements
- docs/modulars/05-quality-control-質檢模組.md - Module specification with functional requirements and DDD patterns

### Standards References

- #file:.github/instructions/angular-typescript.instructions.md - Angular 20+ signals, modern control flow, OnPush patterns
- #file:.github/skills/ddd/SKILL.md - DDD implementation with aggregates, factories, policies, repositories

## Implementation Checklist

### [ ] Phase 1: Domain Layer Enhancements

- [ ] Task 1.1: Create value objects for checklist system
  - Details: .copilot-tracking/details/20260127-quality-control-module-details.md (Lines 22-41)

- [ ] Task 1.2: Expand QCCheckEntity to full aggregate pattern
  - Details: .copilot-tracking/details/20260127-quality-control-module-details.md (Lines 43-66)

- [ ] Task 1.3: Create QCRecordFactory with template application
  - Details: .copilot-tracking/details/20260127-quality-control-module-details.md (Lines 68-87)

- [ ] Task 1.4: Enhance QC policies for checklist validation
  - Details: .copilot-tracking/details/20260127-quality-control-module-details.md (Lines 89-108)

- [ ] Task 1.5: Create new domain events (QCStarted)
  - Details: .copilot-tracking/details/20260127-quality-control-module-details.md (Lines 110-129)

### [ ] Phase 2: Application Layer Expansion

- [ ] Task 2.1: Enhance QualityControlStore with checklist management
  - Details: .copilot-tracking/details/20260127-quality-control-module-details.md (Lines 131-156)

- [ ] Task 2.2: Create StartQCHandler with template application
  - Details: .copilot-tracking/details/20260127-quality-control-module-details.md (Lines 158-177)

- [ ] Task 2.3: Create UpdateChecklistItemHandler
  - Details: .copilot-tracking/details/20260127-quality-control-module-details.md (Lines 179-198)

- [ ] Task 2.4: Create RestartQCAfterIssueResolvedHandler
  - Details: .copilot-tracking/details/20260127-quality-control-module-details.md (Lines 200-219)

- [ ] Task 2.5: Update event handlers for missing subscriptions
  - Details: .copilot-tracking/details/20260127-quality-control-module-details.md (Lines 221-246)

- [ ] Task 2.6: Create QC analytics computed signals
  - Details: .copilot-tracking/details/20260127-quality-control-module-details.md (Lines 248-267)

### [ ] Phase 3: Presentation Layer Completion

- [ ] Task 3.1: Create task snapshot display component
  - Details: .copilot-tracking/details/20260127-quality-control-module-details.md (Lines 269-292)

- [ ] Task 3.2: Create checklist review component
  - Details: .copilot-tracking/details/20260127-quality-control-module-details.md (Lines 294-321)

- [ ] Task 3.3: Create template selection UI
  - Details: .copilot-tracking/details/20260127-quality-control-module-details.md (Lines 323-342)

- [ ] Task 3.4: Create QC history timeline component
  - Details: .copilot-tracking/details/20260127-quality-control-module-details.md (Lines 344-363)

- [ ] Task 3.5: Create QC analytics dashboard component
  - Details: .copilot-tracking/details/20260127-quality-control-module-details.md (Lines 365-384)

- [ ] Task 3.6: Update main QC component for comprehensive workflow
  - Details: .copilot-tracking/details/20260127-quality-control-module-details.md (Lines 386-409)

### [ ] Phase 4: Infrastructure Integration

- [ ] Task 4.1: Expand QualityControlRepository for checklist persistence
  - Details: .copilot-tracking/details/20260127-quality-control-module-details.md (Lines 411-432)

- [ ] Task 4.2: Create template repository and Firestore schema
  - Details: .copilot-tracking/details/20260127-quality-control-module-details.md (Lines 434-453)

- [ ] Task 4.3: Create Firestore mappers for nested structures
  - Details: .copilot-tracking/details/20260127-quality-control-module-details.md (Lines 455-474)

### [ ] Phase 5: Testing & Validation

- [ ] Task 5.1: Create domain layer unit tests
  - Details: .copilot-tracking/details/20260127-quality-control-module-details.md (Lines 476-497)

- [ ] Task 5.2: Create application layer integration tests
  - Details: .copilot-tracking/details/20260127-quality-control-module-details.md (Lines 499-520)

- [ ] Task 5.3: Create presentation layer component tests
  - Details: .copilot-tracking/details/20260127-quality-control-module-details.md (Lines 522-541)

- [ ] Task 5.4: Create E2E tests for complete QC workflow
  - Details: .copilot-tracking/details/20260127-quality-control-module-details.md (Lines 543-564)

## Dependencies

- Angular 20+ with signals and modern control flow (@if/@for/@switch/@defer)
- NgRx Signals (signalStore) for state management
- Angular Material (M3) for UI components
- Tailwind CSS for utility-first styling
- WorkspaceEventBus for event-driven architecture
- Firestore for data persistence
- Tasks module (TaskReadyForQC event, task snapshot data)
- Issues module (IssueResolved event, automatic issue creation)

## Success Criteria

- All domain entities follow create/reconstruct aggregate pattern
- QC checklist created from templates based on task type
- Reviewers can mark individual checklist items as pass/fail
- QC cannot pass unless all required checklist items pass
- Failure automatically creates issue with bidirectional link and proper causality
- Task snapshot preserved in QC record for audit trail
- QC history displays all review attempts with timestamps and reviewers
- Analytics dashboard shows pass rate, average time, failure types, reviewer workload
- All events include correlationId and follow Append → Publish → React pattern
- Zero usage of *ngIf/*ngFor (all @if/@for with track)
- Store uses only signals (zero RxJS BehaviorSubject)
- All components use ChangeDetectionStrategy.OnPush
- Keyboard navigation and screen reader support implemented
- Comprehensive test coverage (unit, integration, E2E)
