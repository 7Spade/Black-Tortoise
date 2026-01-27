<!-- markdownlint-disable-file -->

# Task Details: Tasks Module Implementation

## Research Reference

**Source Research**: #file:./.copilot-tracking/research/20260127-tasks-module-architecture-research.md

## Phase 1: Domain Model Extension

### Task 1.1: Create Money Value Object

Create a Money value object to support multi-currency pricing with immutability and proper serialization.

- **Files**:
  - src/app/domain/value-objects/money.vo.ts - New Money value object with currency and amount fields
- **Success**:
  - Money VO is immutable with readonly properties
  - Supports arithmetic operations (multiply, add, subtract)
  - Includes equals() method for comparison
  - Properly serializes to/from JSON
- **Research References**:
  - #file:./.copilot-tracking/research/20260127-tasks-module-architecture-research.md (Lines 131-147) - Required TaskAggregate extensions with Money fields
  - #file:../../docs/modulars/03-tasks-任務模組.md (Lines 42-47) - Money value object specification
- **Dependencies**:
  - None (pure TypeScript value object)

### Task 1.2: Extend TaskAggregate Interface

Extend the TaskAggregate interface with new fields for pricing, progress, and hierarchy support.

- **Files**:
  - src/app/domain/aggregates/task.aggregate.ts - Extend interface with unitPrice, quantity, totalPrice, progress, parentId, subtaskIds, assigneeIds, responsibleId, collaboratorIds
- **Success**:
  - All new fields added as readonly properties
  - Existing fields remain unchanged for backward compatibility
  - totalPrice computed from unitPrice × quantity
  - subtaskIds is ReadonlyArray<string>
- **Research References**:
  - #file:./.copilot-tracking/research/20260127-tasks-module-architecture-research.md (Lines 114-146) - Current and required TaskAggregate structure
  - #file:../../docs/modulars/03-tasks-任務模組.md (Lines 42-62) - Task properties specification
- **Dependencies**:
  - Task 1.1 (Money VO must exist)

### Task 1.3: Implement TaskFactory

Create TaskFactory to enforce domain policies during task creation and subtask addition.

- **Files**:
  - src/app/domain/factories/task.factory.ts - New factory with create() and createSubtask() methods
- **Success**:
  - Factory enforces TaskNamingPolicy before creation
  - createSubtask() enforces TaskHierarchyPolicy
  - Returns properly initialized TaskAggregate instances
  - Integrates with existing createTask() helper function
- **Research References**:
  - #file:./.copilot-tracking/research/20260127-tasks-module-architecture-research.md (Lines 417-450) - Factory pattern implementation example
  - #file:../../docs/modulars/03-tasks-任務模組.md (Lines 343-450) - DDD Factory pattern specification
- **Dependencies**:
  - Task 1.4 (Policies must exist)

### Task 1.4: Create Domain Policies

Implement TaskNamingPolicy, TaskHierarchyPolicy, and TaskPricingPolicy to encapsulate business rules.

- **Files**:
  - src/app/domain/policies/task-naming.policy.ts - Validates title length (3-200 characters)
  - src/app/domain/policies/task-hierarchy.policy.ts - Enforces max depth of 10 levels
  - src/app/domain/policies/task-pricing.policy.ts - Validates child totalPrice sum ≤ parent totalPrice
- **Success**:
  - Each policy has isSatisfiedBy() and assertIsValid() methods
  - Policies throw DomainError with descriptive messages
  - Pure functions with no external dependencies
  - All policies tested with valid/invalid cases
- **Research References**:
  - #file:./.copilot-tracking/research/20260127-tasks-module-architecture-research.md (Lines 452-485) - Policy pattern examples
  - #file:../../docs/modulars/03-tasks-任務模組.md (Lines 454-485) - Policy pattern specification
- **Dependencies**:
  - None (pure domain logic)

### Task 1.5: Implement TaskReadyForQCSpecification

Create specification pattern for complex validation rules to determine if task is ready for quality control.

- **Files**:
  - src/app/domain/specifications/task-ready-for-qc.specification.ts - Specification with isSatisfiedBy() and whyNotSatisfied()
- **Success**:
  - Checks progress === 100, status === InProgress
  - Validates no blocking issues exist
  - whyNotSatisfied() returns descriptive error list
  - Reusable across application layer handlers
- **Research References**:
  - #file:./.copilot-tracking/research/20260127-tasks-module-architecture-research.md (Lines 487-519) - Specification pattern example
  - #file:../../docs/modulars/03-tasks-任務模組.md (Lines 489-519) - Specification pattern specification
- **Dependencies**:
  - None (uses existing TaskAggregate interface)

### Task 1.6: Add Helper Functions for Extended Fields

Update existing helper functions (createTask, updateTaskStatus) to support new fields and add new helpers for progress and hierarchy.

- **Files**:
  - src/app/domain/aggregates/task.aggregate.ts - Add updateProgress(), addSubtask(), removeSubtask(), computeParentProgress()
- **Success**:
  - All functions are pure and immutable
  - computeParentProgress() implements weighted formula
  - Helper functions maintain backward compatibility
  - Properly handle Money value objects
- **Research References**:
  - #file:./.copilot-tracking/research/20260127-tasks-module-architecture-research.md (Lines 95-103) - Functional domain model pattern
  - #file:../../docs/modulars/03-tasks-任務模組.md (Lines 56-62) - Progress calculation formula
- **Dependencies**:
  - Task 1.2 (Extended TaskAggregate)

## Phase 2: Domain Events Extension

### Task 2.1: Create Missing Domain Events

Implement TaskProgressUpdated, TaskReadyForAcceptance, and TaskAssigneeChanged events.

- **Files**:
  - src/app/domain/events/task-progress-updated.event.ts - Event with taskId, progress, timestamp
  - src/app/domain/events/task-ready-for-acceptance.event.ts - Event signaling readiness for acceptance
  - src/app/domain/events/task-assignee-changed.event.ts - Event with old and new assignee IDs
- **Success**:
  - All events extend DomainEvent interface
  - Include correlationId and causedBy fields
  - Payload follows DTO pattern (plain data objects)
  - Event factories create properly structured events
- **Research References**:
  - #file:./.copilot-tracking/research/20260127-tasks-module-architecture-research.md (Lines 180-198) - Required events to publish
  - #file:../../docs/modulars/03-tasks-任務模組.md (Lines 146-154) - Published events specification
- **Dependencies**:
  - None (follows existing event patterns)

### Task 2.2: Extend Existing Domain Events

Update TaskCreated and TaskUpdated events to include new fields (unitPrice, quantity, progress, etc).

- **Files**:
  - src/app/domain/events/task-created.event.ts - Add new fields to payload
  - src/app/domain/events/task-updated.event.ts - Add new fields to payload
- **Success**:
  - Event payloads include all new TaskAggregate fields
  - Money objects properly serialized in payload
  - Backward compatibility maintained with optional fields
  - Event factories handle Money serialization
- **Research References**:
  - #file:./.copilot-tracking/research/20260127-tasks-module-architecture-research.md (Lines 148-178) - Current event bus pattern
- **Dependencies**:
  - Task 1.1 (Money VO)

## Phase 3: Application Layer Enhancements

### Task 3.1: Refactor TasksStore State Structure

Change TasksStore from array-based to Map<string, TaskAggregate> for O(1) lookup and add viewMode signal.

- **Files**:
  - src/app/application/stores/tasks.store.ts - Refactor state from tasks: TaskAggregate[] to tasks: Map<string, TaskAggregate>, add viewMode signal
- **Success**:
  - State uses Map structure with TaskId as key
  - viewMode signal with type 'list' | 'gantt' | 'kanban' | 'calendar'
  - All existing methods updated to work with Map
  - Backward compatibility for consumers using computed taskList
  - Performance improved with O(1) lookup
- **Research References**:
  - #file:./.copilot-tracking/research/20260127-tasks-module-architecture-research.md (Lines 200-227) - SignalStore with view modes example
  - #file:../../docs/modulars/03-tasks-任務模組.md (Lines 28-39) - Single source of truth requirement
- **Dependencies**:
  - Phase 1 completion (Extended TaskAggregate)

### Task 3.2: Add Computed Signals for View Modes

Create computed signals for different view projections (taskList, kanbanColumns, ganttTimeline, taskHierarchy).

- **Files**:
  - src/app/application/stores/tasks.store.ts - Add computed signals for view projections
- **Success**:
  - taskList: computed(() => Array.from(state.tasks().values()))
  - kanbanColumns: computed(() => groupByStatus(state.tasks()))
  - rootTasks: computed(() => tasks without parentId)
  - taskHierarchy: computed(() => buildTaskTree(state.tasks()))
  - No API calls on view mode changes
- **Research References**:
  - #file:./.copilot-tracking/research/20260127-tasks-module-architecture-research.md (Lines 213-227) - Computed signals for views
  - #file:../../docs/modulars/03-tasks-任務模組.md (Lines 31-39) - View projection requirements
- **Dependencies**:
  - Task 3.1 (Map-based state)

### Task 3.3: Implement TaskContextProvider

Create TaskContextProvider abstract class and implementation for cross-module queries.

- **Files**:
  - src/app/application/providers/task-context.provider.ts - Abstract provider interface
  - src/app/infrastructure/providers/task-context.provider.impl.ts - Concrete implementation using TasksStore
- **Success**:
  - Provides getTaskStatus(), getTaskProgress(), canSubmitForQC(), hasBlockingIssues()
  - Implementation injects TasksStore and queries computed state
  - No direct store coupling for other modules
  - Proper dependency injection with providedIn: 'root'
- **Research References**:
  - #file:./.copilot-tracking/research/20260127-tasks-module-architecture-research.md (Lines 229-248) - Context Provider pattern example
  - #file:../../docs/modulars/03-tasks-任務模組.md (Lines 220-228) - TaskContextProvider specification
- **Dependencies**:
  - Task 3.1 (TasksStore with Map structure)

### Task 3.4: Create Missing Command Handlers

Implement UpdateProgressHandler, AssignTaskHandler, and AddSubtaskHandler.

- **Files**:
  - src/app/application/handlers/update-progress.handler.ts - Handler for progress updates
  - src/app/application/handlers/assign-task.handler.ts - Handler for assignee changes
  - src/app/application/handlers/add-subtask.handler.ts - Handler for subtask creation
- **Success**:
  - Each handler follows command/handler pattern
  - Handlers validate using specifications and policies
  - Emit appropriate domain events after updates
  - Update repository and store state
  - Include proper error handling
- **Research References**:
  - #file:./.copilot-tracking/research/20260127-tasks-module-architecture-research.md (Lines 155-177) - Command handler pattern
  - #file:../../docs/modulars/03-tasks-任務模組.md (Lines 102-111) - Progress update and auto-record requirements
- **Dependencies**:
  - Phase 1 (Policies and Specifications)
  - Task 2.1 (New domain events)

### Task 3.5: Update Event Subscriptions

Add event subscriptions for IssueResolved and new QC/Acceptance events in TasksStore.

- **Files**:
  - src/app/application/stores/tasks.store.ts - Add withHooks event subscriptions
  - src/app/application/handlers/tasks.event-handlers.ts - Update event handling logic
- **Success**:
  - Subscribe to IssueResolved to auto-unblock tasks
  - Update task status on AcceptanceApproved/Rejected
  - Properly handle QCPassed/QCFailed state transitions
  - All subscriptions include correlationId tracking
  - Event handlers update store state reactively
- **Research References**:
  - #file:./.copilot-tracking/research/20260127-tasks-module-architecture-research.md (Lines 192-199) - Required events to subscribe
  - #file:../../docs/modulars/03-tasks-任務模組.md (Lines 241-249) - Subscribed events specification
- **Dependencies**:
  - Task 3.1 (Refactored TasksStore)

## Phase 4: Infrastructure Updates

### Task 4.1: Create Mapper for Money Value Object

Implement MoneyMapper for serialization/deserialization between Money VO and Firestore.

- **Files**:
  - src/app/infrastructure/mappers/money.mapper.ts - Mapper with toDomain() and toDto() methods
- **Success**:
  - toDomain() converts { amount, currency } to Money VO
  - toDto() converts Money VO to plain object
  - Handles null/undefined Money values
  - Properly preserves currency code
  - Type-safe conversions
- **Research References**:
  - #file:./.copilot-tracking/research/20260127-tasks-module-architecture-research.md (Lines 540-550) - Mapper pattern requirement
  - #file:../../docs/modulars/03-tasks-任務模組.md (Lines 43-45) - Money value object specification
- **Dependencies**:
  - Task 1.1 (Money VO)

### Task 4.2: Update TaskRepository Interface

Extend ITaskRepository interface with methods for hierarchy queries.

- **Files**:
  - src/app/domain/repositories/task.repository.ts - Add findByParentId(), findSubtasks(), updateWithHierarchy()
- **Success**:
  - findByParentId(parentId: string) returns child tasks
  - findSubtasks(taskId: string) recursively gets all descendants
  - updateWithHierarchy() updates task and recalculates parent progress
  - All methods return Promises with proper types
  - Interface maintains backward compatibility
- **Research References**:
  - #file:./.copilot-tracking/research/20260127-tasks-module-architecture-research.md (Lines 521-537) - Repository pattern with DI
  - #file:../../docs/modulars/03-tasks-任務模組.md (Lines 65-80) - Task hierarchy requirements
- **Dependencies**:
  - Task 1.2 (Extended TaskAggregate)

### Task 4.3: Extend TaskRepositoryImpl

Update Firestore repository implementation to handle Money objects and hierarchical queries.

- **Files**:
  - src/app/infrastructure/repositories/task.repository.impl.ts - Implement new repository methods and Money mapping
  - src/app/infrastructure/mappers/task-firestore.mapper.ts - Update mapper for new fields
- **Success**:
  - Money fields properly serialized to Firestore
  - Hierarchy queries efficiently retrieve parent/child relationships
  - Mapper handles all new TaskAggregate fields
  - Backward compatibility with existing documents
  - Proper error handling for missing data
- **Research References**:
  - #file:./.copilot-tracking/research/20260127-tasks-module-architecture-research.md (Lines 38-40) - Current repository implementation
  - #file:../../docs/modulars/03-tasks-任務模組.md (Lines 546-547) - Mapper pattern for nested objects
- **Dependencies**:
  - Task 4.1 (MoneyMapper)
  - Task 4.2 (Updated repository interface)

## Phase 5: Presentation Layer Migration

### Task 5.1: Migrate Templates to @if/@for Control Flow

Replace all *ngIf and *ngFor with Angular 20 @if and @for control flow.

- **Files**:
  - src/app/presentation/pages/modules/tasks/tasks.component.html - Migrate template syntax
  - All task-related component templates - Update control flow
- **Success**:
  - Zero *ngIf remaining (all converted to @if/@else)
  - Zero *ngFor remaining (all converted to @for with track)
  - All @for includes track expression
  - Template functionality unchanged
  - Proper @switch/@case for status display
- **Research References**:
  - #file:./.copilot-tracking/research/20260127-tasks-module-architecture-research.md (Lines 283-287) - Angular 20+ requirements
  - #file:../../docs/modulars/03-tasks-任務模組.md (Lines 124-127) - Control flow requirements
  - #file:../../.github/instructions/ng-angular-20-control-flow.instructions.md - Control flow migration guide
- **Dependencies**:
  - None (template-only changes)

### Task 5.2: Add View Mode Toggle Component

Create view mode switcher component with buttons for List, Kanban, Gantt, Calendar.

- **Files**:
  - src/app/presentation/pages/modules/tasks/components/view-mode-toggle.component.ts - New component
  - src/app/presentation/pages/modules/tasks/components/view-mode-toggle.component.html - Template with @if for active state
- **Success**:
  - mat-button-toggle-group for view selection
  - Updates TasksStore viewMode signal on change
  - Active state visually indicated
  - Responsive layout for mobile
  - Uses @if for conditional icon display
- **Research References**:
  - #file:./.copilot-tracking/research/20260127-tasks-module-architecture-research.md (Lines 204-212) - ViewMode signal specification
  - #file:../../docs/modulars/03-tasks-任務模組.md (Lines 28-39) - View modes requirement
- **Dependencies**:
  - Task 3.1 (TasksStore with viewMode)

### Task 5.3: Create Task Hierarchy Tree Component

Build tree component using mat-tree or custom implementation with drag-and-drop support.

- **Files**:
  - src/app/presentation/pages/modules/tasks/components/task-tree.component.ts - Tree component
  - src/app/presentation/pages/modules/tasks/components/task-tree.component.html - Template with @for and track
- **Success**:
  - Uses mat-tree or custom recursive @for
  - CDK drag-drop for hierarchy changes
  - Expand/collapse functionality
  - Visual indentation for levels
  - Shows subtask count and progress summary
  - Uses @if for expand/collapse icons
- **Research References**:
  - #file:./.copilot-tracking/research/20260127-tasks-module-architecture-research.md (Lines 267-275) - Infinite hierarchy requirement
  - #file:../../docs/modulars/03-tasks-任務模組.md (Lines 65-80) - Task hierarchy UI requirements
- **Dependencies**:
  - Task 3.2 (taskHierarchy computed signal)
  - @angular/material/tree
  - @angular/cdk/drag-drop

### Task 5.4: Implement Progress and Pricing UI

Create form controls and display components for unitPrice, quantity, totalPrice, and progress.

- **Files**:
  - src/app/presentation/pages/modules/tasks/components/task-form.component.ts - Update form with new fields
  - src/app/presentation/pages/modules/tasks/components/task-pricing-display.component.ts - Read-only pricing display
- **Success**:
  - Currency input for unitPrice using Money VO
  - Quantity input with validation
  - Computed totalPrice display (read-only)
  - Progress slider (0-100) for leaf tasks
  - Auto-calculated progress display for parent tasks
  - Uses @if for conditional field display
- **Research References**:
  - #file:./.copilot-tracking/research/20260127-tasks-module-architecture-research.md (Lines 258-266) - Task properties requirements
  - #file:../../docs/modulars/03-tasks-任務模組.md (Lines 42-62) - Task attributes specification
- **Dependencies**:
  - Task 1.1 (Money VO)
  - Task 3.4 (UpdateProgressHandler)

### Task 5.5: Add Kanban View Component (with @defer)

Create Kanban board component with columns for each task status, using @defer for performance.

- **Files**:
  - src/app/presentation/pages/modules/tasks/views/kanban-view.component.ts - Kanban component
  - src/app/presentation/pages/modules/tasks/views/kanban-view.component.html - Template with @defer
- **Success**:
  - Uses kanbanColumns computed signal from store
  - CDK drag-drop for moving tasks between columns
  - @defer (on viewport) for lazy loading
  - @for with track for rendering task cards
  - Columns for each TaskStatus
  - Visual feedback for drag operations
- **Research References**:
  - #file:./.copilot-tracking/research/20260127-tasks-module-architecture-research.md (Lines 283-287) - Performance requirements with @defer
  - #file:../../docs/modulars/03-tasks-任務模組.md (Lines 34-36) - Kanban view requirement
- **Dependencies**:
  - Task 3.2 (kanbanColumns computed signal)
  - @angular/cdk/drag-drop

## Phase 6: Testing & Validation

### Task 6.1: Unit Tests for Domain Logic

Write comprehensive unit tests for policies, specifications, factories, and value objects.

- **Files**:
  - src/app/domain/policies/task-naming.policy.spec.ts - Test naming validation
  - src/app/domain/policies/task-hierarchy.policy.spec.ts - Test depth limits
  - src/app/domain/policies/task-pricing.policy.spec.ts - Test pricing invariants
  - src/app/domain/specifications/task-ready-for-qc.specification.spec.ts - Test QC readiness
  - src/app/domain/value-objects/money.vo.spec.ts - Test Money operations
  - src/app/domain/factories/task.factory.spec.ts - Test factory creation
- **Success**:
  - >80% code coverage for domain layer
  - All policy validation paths tested
  - Specification edge cases covered
  - Money arithmetic operations verified
  - Factory policy enforcement verified
- **Research References**:
  - #file:./.copilot-tracking/research/20260127-tasks-module-architecture-research.md (Lines 364-378) - Success criteria with test coverage
  - #file:../../docs/modulars/03-tasks-任務模組.md (Lines 179-185) - Unit testing strategy
- **Dependencies**:
  - Phase 1 completion (Domain layer)

### Task 6.2: Integration Tests for Event Flows

Test event publishing and subscription workflows across module boundaries.

- **Files**:
  - src/app/application/handlers/update-progress.handler.spec.ts - Test progress update events
  - src/app/application/stores/tasks.store.spec.ts - Test event subscriptions
  - src/app/application/facades/tasks.facade.spec.ts - Test facade integration
- **Success**:
  - TaskProgressUpdated event triggers DailyModule (mocked)
  - QCPassed event updates task status correctly
  - AcceptanceApproved flows to Completed state
  - IssueResolved unblocks tasks properly
  - correlationId preserved across events
- **Research References**:
  - #file:./.copilot-tracking/research/20260127-tasks-module-architecture-research.md (Lines 148-178) - Event bus integration patterns
  - #file:../../docs/modulars/03-tasks-任務模組.md (Lines 187-190) - Integration testing strategy
- **Dependencies**:
  - Phase 3 (Event handlers and subscriptions)

### Task 6.3: E2E Tests for User Workflows

Create end-to-end tests covering key user scenarios from task creation to completion.

- **Files**:
  - e2e/tasks/task-creation.spec.ts - Test full task creation flow
  - e2e/tasks/task-hierarchy.spec.ts - Test subtask creation and hierarchy
  - e2e/tasks/task-lifecycle.spec.ts - Test status transitions through QC/Acceptance
- **Success**:
  - Create task with pricing and assign
  - Add subtasks and verify progress calculation
  - Update progress to 100% and submit for QC
  - QC pass triggers acceptance flow
  - View mode switching works without reload
  - Drag-and-drop hierarchy changes persist
- **Research References**:
  - #file:./.copilot-tracking/research/20260127-tasks-module-architecture-research.md (Lines 276-282) - State flow integration
  - #file:../../docs/modulars/03-tasks-任務模組.md (Lines 192-194) - E2E testing coverage
- **Dependencies**:
  - Phase 5 (Presentation layer complete)

## Dependencies

- @ngrx/signals (already installed)
- @angular/material/tree (required for hierarchy UI)
- @angular/cdk/drag-drop (already installed)
- Angular 20+ with signals support
- Firestore SDK (already integrated)
- WorkspaceEventBus (already implemented)

## Success Criteria

- All 5 functional requirements from specification fully implemented
- TasksStore uses Map<string, TaskAggregate> with O(1) lookup
- View mode changes use only computed signals (zero API calls)
- Task hierarchy supports up to 10 levels with pricing invariant enforced
- All domain events include correlationId and follow Append->Publish->React pattern
- All presentation templates use @if/@for/@switch (zero *ngIf/*ngFor remaining)
- Test coverage >80% for domain logic (policies, specifications, factories, value objects)
- Cross-module integration exclusively uses TaskContextProvider or Event Bus
- Backward compatibility maintained with existing task management functionality
- Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1
