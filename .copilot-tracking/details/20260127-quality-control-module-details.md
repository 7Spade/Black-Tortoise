<!-- markdownlint-disable-file -->

# Task Details: Quality Control Module Implementation

## Research Reference

**Source Research**: #file:.copilot-tracking/research/20250127-quality-control-module-research.md

## Phase 1: Domain Layer Enhancements

### Task 1.1: Create value objects for checklist system

Create value objects to support checklist-based QC reviews with templates and task snapshots.

- **Files**:
  - src/app/domain/value-objects/checklist-item.vo.ts - New file for individual checklist item
  - src/app/domain/value-objects/task-snapshot.vo.ts - New file for task snapshot audit trail
  - src/app/domain/value-objects/qc-template.vo.ts - New file for QC template definition
- **Success**:
  - ChecklistItem has: name, description, isRequired, isPassed, failureReason fields
  - TaskSnapshot captures: title, description, quantity, attachments, completedAt
  - QCTemplate maps taskType to array of default ChecklistItem definitions
  - All value objects are immutable with readonly properties
  - Validation logic in constructor
- **Research References**:
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 271-276) - Checklist requirements from specification
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 64-67) - Current folder structure for value-objects
- **Dependencies**:
  - None (foundational value objects)

### Task 1.2: Expand QCCheckEntity to full aggregate pattern

Refactor QCCheckEntity from basic interface to full DDD aggregate with create/reconstruct pattern and domain event emission.

- **Files**:
  - src/app/domain/aggregates/quality-control.aggregate.ts - Expand from interface to class with static methods
  - src/app/domain/aggregates/qc-check-entity.ts - New file if separating interface from implementation
- **Success**:
  - Add QCStatus.InProgress to enum (currently missing)
  - Add checklistItems: ReadonlyArray<ChecklistItem> field
  - Add taskSnapshot: TaskSnapshot field
  - Add reviewer: string field, reviewerAssignedAt: number field
  - Implement static create() method that emits domain events
  - Implement static reconstruct() method without events
  - Private constructor enforcing invariants
  - Methods: assignReviewer(), updateChecklistItem(), markPassed(), markFailed()
- **Research References**:
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 113-125) - DDD Aggregate pattern example
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 176-188) - Current QCCheckEntity interface
  - docs/modulars/05-quality-control-質檢模組.md (Lines 249-267) - Aggregate specification
- **Dependencies**:
  - Task 1.1 (ChecklistItem, TaskSnapshot value objects)

### Task 1.3: Create QCRecordFactory with template application

Create factory to enforce business policies and apply templates during QC record creation.

- **Files**:
  - src/app/domain/factories/qc-record.factory.ts - New factory file
- **Success**:
  - Static create() method accepts taskId, taskType, taskSnapshot, eventMetadata
  - Loads appropriate QCTemplate based on taskType
  - Applies template checklist items to new QC record
  - Enforces QCCriteriaPolicy before creation
  - Returns QCCheckEntity via aggregate's static create()
  - Emits domain events through aggregate
- **Research References**:
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 269-279) - Factory pattern specification
  - docs/modulars/05-quality-control-質檢模組.md (Lines 269-279) - Factory pattern requirements
- **Dependencies**:
  - Task 1.1 (QCTemplate value object)
  - Task 1.2 (QCCheckEntity aggregate)

### Task 1.4: Enhance QC policies for checklist validation

Create and enhance policies to validate QC business rules around checklists and task readiness.

- **Files**:
  - src/app/domain/policies/qc-validation.policy.ts - Enhance existing policy
  - src/app/domain/policies/qc-criteria.policy.ts - New policy for checklist validation
  - src/app/domain/specifications/task-ready-for-qc.specification.ts - Enhance existing specification
- **Success**:
  - QCCriteriaPolicy.allRequiredItemsPassed() validates all isRequired items have isPassed=true
  - QCCriteriaPolicy.assertIsValid() throws DomainError if validation fails
  - TaskReadyForQCPolicy verifies task at 100% progress
  - isSatisfiedBy() and assertIsValid() methods for each policy
  - Clear error messages for policy violations
- **Research References**:
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 281-296) - Policy pattern specification
  - docs/modulars/05-quality-control-質檢模組.md (Lines 281-296) - Policy requirements
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 217-222) - Checklist validation rules
- **Dependencies**:
  - Task 1.1 (ChecklistItem value object)

### Task 1.5: Create new domain events (QCStarted)

Create QCStarted domain event to complete event architecture per specification.

- **Files**:
  - src/app/domain/events/qc-started.event.ts - New event file
- **Success**:
  - Event extends DomainEvent with proper type
  - Payload includes: taskId, qcId, reviewerId, checklistItemCount, startedAt
  - Includes correlationId, causationId, eventId, timestamp
  - Event properly typed for WorkspaceEventBus subscription
- **Research References**:
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 109-114) - Published events specification
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 250-254) - Event architecture requirements
  - docs/modulars/05-quality-control-質檢模組.md (Lines 108-123) - Event integration specification
- **Dependencies**:
  - None (domain event definition)

## Phase 2: Application Layer Expansion

### Task 2.1: Enhance QualityControlStore with checklist management

Expand QualityControlStore to manage checklist items, templates, and QC restart capability.

- **Files**:
  - src/app/application/stores/quality-control.store.ts - Enhance existing store
- **Success**:
  - Add checklistTemplates: Map<string, QCTemplate> to state
  - Add issueResolutions: Map<taskId, resolvedAt> to state for restart tracking
  - Add computed signal: canStartQC(taskId) checking task ready and no pending QC
  - Add method: loadTemplate(taskType) to fetch template
  - Add method: updateChecklistItem(qcId, itemIndex, isPassed, failureReason)
  - Add method: canPassQC(qcId) validating all required items passed
  - Add method: restartQCAfterIssueResolved(taskId)
  - All state updates use patchState()
  - Zero RxJS usage (signals only)
- **Research References**:
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 88-104) - SignalStore pattern
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 22-27) - Current store structure
  - docs/modulars/05-quality-control-質檢模組.md (Lines 82-104) - State management requirements
- **Dependencies**:
  - Phase 1 completion (value objects and aggregate)

### Task 2.2: Create StartQCHandler with template application

Create command handler to initiate QC review with template-based checklist.

- **Files**:
  - src/app/application/commands/start-qc.command.ts - New command file
  - src/app/application/handlers/start-qc.handler.ts - New handler file
- **Success**:
  - StartQCCommand contains: taskId, taskType, reviewerId, taskSnapshot, correlationId
  - Handler loads template via QCRecordFactory
  - Handler creates QCCheckEntity via factory with template applied
  - Handler persists entity via repository
  - Handler publishes QCStarted event via eventBus
  - Handler updates store with new QC task
  - Proper error handling and logging
- **Research References**:
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 41-42) - Command/handler file structure
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 213-218) - QC workflow requirements
- **Dependencies**:
  - Task 1.3 (QCRecordFactory)
  - Task 2.1 (Store enhancement)

### Task 2.3: Create UpdateChecklistItemHandler

Create command handler for updating individual checklist item status.

- **Files**:
  - src/app/application/commands/update-checklist-item.command.ts - New command file
  - src/app/application/handlers/update-checklist-item.handler.ts - New handler file
- **Success**:
  - UpdateChecklistItemCommand contains: qcId, itemIndex, isPassed, failureReason (optional), correlationId
  - Handler loads QCCheckEntity from repository
  - Handler calls entity.updateChecklistItem() method
  - Handler persists updated entity
  - Handler updates store state
  - Validation: failureReason required if isPassed=false
  - No event emission (internal state change)
- **Research References**:
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 41-42) - Handler pattern
  - docs/modulars/05-quality-control-質檢模組.md (Lines 39-51) - QC workflow specification
- **Dependencies**:
  - Task 1.2 (QCCheckEntity with updateChecklistItem method)

### Task 2.4: Create RestartQCAfterIssueResolvedHandler

Create handler to restart QC review after associated issue is resolved.

- **Files**:
  - src/app/application/handlers/restart-qc-after-issue-resolved.handler.ts - New handler file
- **Success**:
  - Subscribes to IssueResolved event
  - Checks if issue is linked to a QC failure
  - Resets QC status to Pending
  - Clears previous checklist results (or preserves for comparison)
  - Updates store to show task ready for re-review
  - Notifies reviewer via event or notification
- **Research References**:
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 115-118) - Subscribed events
  - docs/modulars/05-quality-control-質檢模組.md (Lines 53-65) - Issue resolution workflow
- **Dependencies**:
  - Task 2.1 (Store with restart tracking)
  - Issues module IssueResolved event

### Task 2.5: Update event handlers for missing subscriptions

Add missing event subscriptions (TaskReadyForQC, IssueResolved) to complete event architecture.

- **Files**:
  - src/app/application/handlers/quality-control.event-handlers.ts - Enhance existing file
- **Success**:
  - Subscribe to TaskReadyForQC event
  - TaskReadyForQC handler: validate task readiness, create initial QC record or add to queue
  - Subscribe to IssueResolved event
  - IssueResolved handler: check if issue linked to QC, enable QC restart if applicable
  - Subscribe to WorkspaceSwitched event (already exists, verify reset logic)
  - All subscriptions properly typed with event payload types
  - Proper causality chain (correlationId, causationId)
- **Research References**:
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 129-157) - Event handler registration pattern
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 34-35) - Current event handlers
  - docs/modulars/05-quality-control-質檢模組.md (Lines 114-117) - Subscribed events
- **Dependencies**:
  - Task 2.4 (RestartQC handler)
  - Tasks module TaskReadyForQC event
  - Issues module IssueResolved event

### Task 2.6: Create QC analytics computed signals

Add computed signals to QualityControlStore for analytics metrics.

- **Files**:
  - src/app/application/stores/quality-control.store.ts - Enhance with computed signals
- **Success**:
  - passRate: computed() calculating passed / total QC reviews
  - averageQCTime: computed() calculating avg time from submitted to reviewed
  - failureTypeDistribution: computed() grouping failures by reason
  - reviewerWorkload: computed() counting QC tasks per reviewer
  - All computations use computed() signal API
  - Efficient recalculation (only when source signals change)
- **Research References**:
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 88-104) - Computed signal pattern
  - docs/modulars/05-quality-control-質檢模組.md (Lines 66-77) - History & analytics requirements
- **Dependencies**:
  - Task 2.1 (Store with enhanced state)

## Phase 3: Presentation Layer Completion

### Task 3.1: Create task snapshot display component

Create component to display task snapshot (audit trail) during QC review.

- **Files**:
  - src/app/presentation/components/qc/task-snapshot-display/task-snapshot-display.component.ts - New component
  - src/app/presentation/components/qc/task-snapshot-display/task-snapshot-display.component.html - New template
  - src/app/presentation/components/qc/task-snapshot-display/task-snapshot-display.component.scss - New styles
- **Success**:
  - Input: taskSnapshot (TaskSnapshot value object)
  - Displays: title, description, completion quantity, attachments list
  - Displays submittedAt timestamp formatted
  - Uses @if for conditional rendering
  - Uses @for with track for attachments list
  - ChangeDetectionStrategy.OnPush
  - Tailwind CSS for styling
  - Angular Material card layout
  - Accessible (keyboard nav, screen reader)
- **Research References**:
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 159-172) - Modern component template pattern
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 213-218) - Task snapshot requirements
  - docs/modulars/05-quality-control-質檢模組.md (Lines 39-51) - QC workflow UI requirements
- **Dependencies**:
  - Task 1.1 (TaskSnapshot value object)

### Task 3.2: Create checklist review component

Create component for step-by-step checklist item review with pass/fail marking.

- **Files**:
  - src/app/presentation/components/qc/checklist-review/checklist-review.component.ts - New component
  - src/app/presentation/components/qc/checklist-review/checklist-review.component.html - New template
  - src/app/presentation/components/qc/checklist-review/checklist-review.component.scss - New styles
- **Success**:
  - Input: checklistItems (Array<ChecklistItem>), qcId (string)
  - Output: itemUpdated (EventEmitter) with itemIndex, isPassed, failureReason
  - Each item shows: name, description, isRequired badge
  - Pass/Fail radio buttons or toggle per item
  - Failure reason textarea (required if isPassed=false)
  - Disabled state for completed items
  - Visual indicator for required vs optional items
  - Uses @for with track item.name or index
  - Uses @if for conditional failure reason field
  - ChangeDetectionStrategy.OnPush
  - Angular Material expansion panel or list
  - Form validation for failure reasons
- **Research References**:
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 159-172) - Template control flow
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 217-222) - Checklist validation
  - docs/modulars/05-quality-control-質檢模組.md (Lines 39-51) - Checklist workflow
- **Dependencies**:
  - Task 1.1 (ChecklistItem value object)
  - Task 2.3 (UpdateChecklistItemHandler)

### Task 3.3: Create template selection UI

Create UI component for selecting QC template when starting review.

- **Files**:
  - src/app/presentation/components/qc/template-selector/template-selector.component.ts - New component
  - src/app/presentation/components/qc/template-selector/template-selector.component.html - New template
  - src/app/presentation/components/qc/template-selector/template-selector.component.scss - New styles
- **Success**:
  - Input: availableTemplates (Array<QCTemplate>)
  - Output: templateSelected (EventEmitter) with selected template
  - Displays template name and preview of checklist items
  - Radio button or card selection UI
  - Uses @for with track template.taskType
  - Uses @if for empty state
  - ChangeDetectionStrategy.OnPush
  - Angular Material radio or card components
  - Preview shows item count and required item count
- **Research References**:
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 213-218) - Template support requirement
  - docs/modulars/05-quality-control-質檢模組.md (Lines 25-36) - Template management
- **Dependencies**:
  - Task 1.1 (QCTemplate value object)

### Task 3.4: Create QC history timeline component

Create component to display historical QC review attempts with timeline visualization.

- **Files**:
  - src/app/presentation/components/qc/qc-history-timeline/qc-history-timeline.component.ts - New component
  - src/app/presentation/components/qc/qc-history-timeline/qc-history-timeline.component.html - New template
  - src/app/presentation/components/qc/qc-history-timeline/qc-history-timeline.component.scss - New styles
- **Success**:
  - Input: qcHistory (Array<QCCheckEntity>) for a task
  - Displays each review: timestamp, reviewer, result (passed/failed), failure reason
  - Timeline visualization with Angular Material timeline or custom CSS
  - Color coding: green for passed, red for failed, yellow for in-progress
  - Uses @for with track history.id
  - Uses @if for empty state
  - ChangeDetectionStrategy.OnPush
  - Expandable details per history entry
- **Research References**:
  - docs/modulars/05-quality-control-質檢模組.md (Lines 66-77) - History requirements
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 159-172) - Component patterns
- **Dependencies**:
  - Task 1.2 (QCCheckEntity aggregate)

### Task 3.5: Create QC analytics dashboard component

Create dashboard component displaying QC metrics with charts and statistics.

- **Files**:
  - src/app/presentation/components/qc/qc-analytics-dashboard/qc-analytics-dashboard.component.ts - New component
  - src/app/presentation/components/qc/qc-analytics-dashboard/qc-analytics-dashboard.component.html - New template
  - src/app/presentation/components/qc/qc-analytics-dashboard/qc-analytics-dashboard.component.scss - New styles
- **Success**:
  - Displays: pass rate (percentage), average QC time (duration), failure type distribution (chart), reviewer workload (chart)
  - Uses computed signals from QualityControlStore
  - Chart library integration (e.g., Chart.js, ngx-charts) or simple CSS bars
  - Uses @defer for chart loading (on viewport)
  - Uses @if for data availability checks
  - ChangeDetectionStrategy.OnPush
  - Angular Material cards for metric display
  - Responsive grid layout with Tailwind
- **Research References**:
  - docs/modulars/05-quality-control-質檢模組.md (Lines 66-77) - Analytics requirements
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 99-103) - Performance optimization with @defer
  - Task 2.6 details (computed analytics signals)
- **Dependencies**:
  - Task 2.6 (Analytics computed signals)

### Task 3.6: Update main QC component for comprehensive workflow

Enhance main quality-control.component to integrate all new subcomponents and workflow.

- **Files**:
  - src/app/presentation/pages/modules/quality-control/quality-control.component.ts - Enhance existing
  - src/app/presentation/pages/modules/quality-control/quality-control.component.html - Enhance existing
  - src/app/presentation/pages/modules/quality-control/quality-control.component.scss - Enhance existing
- **Success**:
  - Integrate task-snapshot-display, checklist-review, template-selector components
  - Workflow: select pending task → display snapshot → review checklist → submit pass/fail
  - Uses @if/@else for workflow steps
  - Uses @for with track for task lists
  - Connects to StartQCHandler, UpdateChecklistItemHandler, PassQCUseCase, FailQCHandler
  - Success/error feedback with Angular Material snackbar
  - ChangeDetectionStrategy.OnPush
  - Zero *ngIf/*ngFor usage
  - Keyboard navigation support
- **Research References**:
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 28-33) - Current component structure
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 159-172) - Modern template patterns
  - docs/modulars/05-quality-control-質檢模組.md (Lines 39-51) - Complete workflow specification
- **Dependencies**:
  - Tasks 3.1-3.5 (all subcomponents)
  - Phase 2 handlers

## Phase 4: Infrastructure Integration

### Task 4.1: Expand QualityControlRepository for checklist persistence

Enhance repository interface and implementation to persist checklist data and snapshots.

- **Files**:
  - src/app/domain/repositories/quality-control.repository.ts - Enhance interface
  - src/app/infrastructure/repositories/quality-control.repository.impl.ts - Enhance implementation
- **Success**:
  - Add method: findByTaskId(taskId) returning QCCheckEntity or null
  - Add method: findHistory(taskId) returning array of all QC attempts
  - Expand save() to persist checklistItems array and taskSnapshot object
  - Firestore collection structure: qc-records/{qcId} with nested checklist subcollection or embedded array
  - Use transaction for atomic updates
  - Proper error handling and logging
- **Research References**:
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 40-44) - Repository file structure
  - docs/modulars/05-quality-control-質檢模組.md (Lines 299-321) - Repository pattern specification
- **Dependencies**:
  - Task 1.2 (QCCheckEntity with checklists)

### Task 4.2: Create template repository and Firestore schema

Create repository for QC template management and persistence.

- **Files**:
  - src/app/domain/repositories/qc-template.repository.ts - New interface
  - src/app/infrastructure/repositories/qc-template.repository.impl.ts - New implementation
  - src/app/application/tokens/qc-template-repository.token.ts - New InjectionToken
- **Success**:
  - Interface methods: findByTaskType(taskType), findAll(), save(template)
  - Firestore collection: qc-templates/{taskType}
  - Document structure: { taskType, templateName, checklistItems: [...] }
  - Default templates seeded on first load
  - InjectionToken for dependency injection
  - Repository registered in providers
- **Research References**:
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 40-44) - Repository pattern
  - docs/modulars/05-quality-control-質檢模組.md (Lines 309-313) - InjectionToken pattern
- **Dependencies**:
  - Task 1.1 (QCTemplate value object)

### Task 4.3: Create Firestore mappers for nested structures

Create mappers to convert between domain entities and Firestore documents for complex nested data.

- **Files**:
  - src/app/infrastructure/mappers/qc-record-firestore.mapper.ts - New mapper
  - src/app/infrastructure/mappers/checklist-item-firestore.mapper.ts - New mapper
- **Success**:
  - QCRecordFirestoreMapper: toFirestore(entity) and fromFirestore(doc)
  - Handles nested checklistItems array transformation
  - Handles taskSnapshot object transformation
  - ChecklistItemFirestoreMapper for individual item conversion
  - Proper type safety (no any or as unknown)
  - Preserves all domain invariants during conversion
- **Research References**:
  - docs/modulars/05-quality-control-質檢模組.md (Lines 315-321) - Mapper pattern specification
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 79-80) - Infrastructure mapper structure
- **Dependencies**:
  - Task 1.2 (QCCheckEntity with nested structures)

## Phase 5: Testing & Validation

### Task 5.1: Create domain layer unit tests

Create comprehensive unit tests for domain layer (aggregates, policies, factories, value objects).

- **Files**:
  - src/app/domain/aggregates/quality-control.aggregate.spec.ts - Test aggregate
  - src/app/domain/factories/qc-record.factory.spec.ts - Test factory
  - src/app/domain/policies/qc-criteria.policy.spec.ts - Test policy
  - src/app/domain/value-objects/checklist-item.vo.spec.ts - Test value object
- **Success**:
  - Test QCCheckEntity.create() emits domain events
  - Test QCCheckEntity.reconstruct() does not emit events
  - Test QCCriteriaPolicy.allRequiredItemsPassed() validation logic
  - Test factory template application
  - Test value object immutability and validation
  - All tests use Jasmine/Jest framework
  - Coverage: critical paths and edge cases
- **Research References**:
  - docs/modulars/05-quality-control-質檢模組.md (Lines 136-141) - Unit test strategy
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 113-125) - Aggregate creation pattern
- **Dependencies**:
  - Phase 1 completion (domain layer)

### Task 5.2: Create application layer integration tests

Create integration tests for event handlers, stores, and use cases.

- **Files**:
  - src/app/application/handlers/quality-control.event-handlers.spec.ts - Test handlers
  - src/app/application/stores/quality-control.store.spec.ts - Test store
  - src/app/application/handlers/start-qc.handler.spec.ts - Test start QC handler
- **Success**:
  - Test event publish/subscribe contracts
  - Given initial state → When command → Then event verification
  - Test computed signal recalculation
  - Test event causality chain (correlationId, causationId)
  - Mock repository and event bus dependencies
  - No testing of private methods or private state
- **Research References**:
  - docs/modulars/05-quality-control-質檢模組.md (Lines 143-147) - Integration test strategy
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 129-157) - Event handler patterns
- **Dependencies**:
  - Phase 2 completion (application layer)

### Task 5.3: Create presentation layer component tests

Create component tests for all UI components with TestBed and fixture setup.

- **Files**:
  - src/app/presentation/components/qc/task-snapshot-display/task-snapshot-display.component.spec.ts - Test snapshot component
  - src/app/presentation/components/qc/checklist-review/checklist-review.component.spec.ts - Test checklist component
  - src/app/presentation/pages/modules/quality-control/quality-control.component.spec.ts - Test main component
- **Success**:
  - Test component inputs and outputs
  - Test @if/@for rendering logic
  - Test user interactions (button clicks, form inputs)
  - Test ChangeDetectionStrategy.OnPush behavior
  - Test accessibility (keyboard navigation, aria labels)
  - Mock store dependencies with signal stubs
- **Research References**:
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 159-172) - Component template patterns
  - docs/modulars/05-quality-control-質檢模組.md (Lines 136-147) - Testing strategy
- **Dependencies**:
  - Phase 3 completion (presentation layer)

### Task 5.4: Create E2E tests for complete QC workflow

Create end-to-end tests covering complete user journeys through QC workflow.

- **Files**:
  - e2e/quality-control/qc-workflow.spec.ts - New E2E test file
- **Success**:
  - Test: Task submitted → QC started → checklist reviewed → all items passed → QC passed → task ready for acceptance
  - Test: Task submitted → QC started → checklist reviewed → item failed → QC failed → issue created → task blocked
  - Test: Issue resolved → QC restarted → checklist reviewed → QC passed
  - Test: Analytics dashboard displays correct metrics after multiple QC reviews
  - Test optimistic UI and rollback on error
  - Use Playwright or Cypress framework
  - Coverage of critical user flows
- **Research References**:
  - docs/modulars/05-quality-control-質檢模組.md (Lines 148-150) - E2E test strategy
  - #file:.copilot-tracking/research/20250127-quality-control-module-research.md (Lines 213-242) - Complete workflow requirements
- **Dependencies**:
  - Phases 1-4 completion (all implementation)

## Dependencies

- Angular 20+ with signals
- NgRx Signals (signalStore)
- Angular Material (M3)
- Tailwind CSS
- WorkspaceEventBus
- Firestore
- Tasks module (TaskReadyForQC event)
- Issues module (IssueResolved event, CreateIssueHandler)

## Success Criteria

- All domain entities follow create/reconstruct pattern with proper event emission
- QC templates applied correctly based on task type
- Checklist items validated with required/optional distinction
- All UI components use @if/@for/@switch (zero *ngIf/*ngFor)
- All components use ChangeDetectionStrategy.OnPush
- Store uses only signals (zero RxJS)
- Events include correlationId and follow Append → Publish → React
- QC cannot pass unless all required items passed
- Failure automatically creates issue with bidirectional link
- Task snapshot preserved for audit trail
- History and analytics display correctly
- Comprehensive test coverage (unit, integration, E2E)
- Keyboard navigation and screen reader support
- Zero violations of DDD principles or Angular 20+ patterns
