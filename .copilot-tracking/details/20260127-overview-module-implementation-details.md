<!-- markdownlint-disable-file -->

# Task Details: Overview Module Implementation

## Research Reference

**Source Research**: #file:./.copilot-tracking/research/20260127-overview-module-implementation-research.md

## Phase 1: Fix Architecture Violations (HIGH Priority)

### Task 1.1: Move event subscriptions from component to store

**Current Violation**: Component subscribes to events in ngOnInit (lines 109-154 of overview.component.ts), which couples presentation to event handling logic.

**Required Pattern**: Store must subscribe to events in withHooks.onInit as specified in research lines 122-154.

Move all event subscription logic from `overview.component.ts` to `overview.store.ts` using `withHooks` pattern:

- **Files**:
  - src/app/application/stores/overview.store.ts - Add withHooks with event subscriptions
  - src/app/presentation/pages/modules/overview/overview.component.ts - Remove event subscription logic

- **Implementation Steps**:
  1. Add `withHooks` to OverviewStore after `withMethods`
  2. In `onInit(store)` method, inject `WorkspaceEventBus` using `inject(WorkspaceEventBus)`
  3. Subscribe to these events as specified in spec lines 117-124:
     - TaskCreated → increment totalTasks metric
     - TaskCompleted → increment completedTasks metric
     - IssueCreated → increment openIssues metric
     - IssueResolved → decrement openIssues metric
     - DocumentUploaded → increment totalDocuments metric
     - MemberAdded → increment totalMembers metric
     - DailyEntryCreated → add activity to feed
     - WorkspaceSwitched → call reset() method
  4. Each event handler should call `addActivity()` to update activity feed
  5. Use `patchState(store, ...)` for metric updates

- **Success Criteria**:
  - withHooks.onInit exists in OverviewStore
  - All 8 required events have subscriptions
  - Each event updates appropriate metrics using existing store methods
  - WorkspaceSwitched event calls reset() method
  - Activity feed updated for all events

- **Research References**:
  - #file:./.copilot-tracking/research/20260127-overview-module-implementation-research.md (Lines 122-154) - Event Bus subscription pattern example
  - #file:./.copilot-tracking/research/20260127-overview-module-implementation-research.md (Lines 200-209) - Events to subscribe list
  - #file:./docs/modulars/08-overview-總覽模組.md (Lines 116-124) - Subscribed events specification

- **Dependencies**:
  - WorkspaceEventBus must be importable and injectable
  - Store methods (updateMetrics, incrementMetric, decrementMetric, addActivity, reset) already exist

### Task 1.2: Remove direct store injections from component

**Current Violation**: Component directly injects TasksStore, QualityControlStore, AcceptanceStore, IssuesStore (lines 102-105 of overview.component.ts), violating modular isolation per research lines 233-246.

Remove all direct module store injections and read metrics from OverviewStore only:

- **Files**:
  - src/app/presentation/pages/modules/overview/overview.component.ts - Remove store injections and update template

- **Implementation Steps**:
  1. Remove these readonly injections (lines 102-105):
     - `readonly tasksStore = inject(TasksStore);`
     - `readonly qcStore = inject(QualityControlStore);`
     - `readonly acceptanceStore = inject(AcceptanceStore);`
     - `readonly issuesStore = inject(IssuesStore);`
  2. Update template metrics (lines 42-56) to read from `overviewStore.metrics()`:
     - `tasksStore.tasks().length` → `overviewStore.metrics().totalTasks`
     - `qcStore.pendingTasks().length` → `overviewStore.metrics().pendingQC`
     - `acceptanceStore.pendingChecks().length` → `overviewStore.metrics().pendingAcceptance`
     - `issuesStore.openIssues().length` → `overviewStore.metrics().openIssues`
  3. Keep existing `overviewStore` injection and all computed properties
  4. Remove event subscription logic from ngOnInit (lines 115-149) - now handled in store
  5. Simplify initialize() method to only set eventBus if needed for future use

- **Success Criteria**:
  - Only OverviewStore is injected in component
  - Template reads all metrics from overviewStore.metrics() signal
  - No compilation errors
  - Component renders same metrics as before
  - Event subscriptions removed from component

- **Research References**:
  - #file:./.copilot-tracking/research/20260127-overview-module-implementation-research.md (Lines 233-246) - Forbidden vs correct integration patterns
  - #file:./.copilot-tracking/research/20260127-overview-module-implementation-research.md (Lines 284-297) - Fix architecture violations guidance
  - #file:./docs/modulars/08-overview-總覽模組.md (Lines 233-247) - Prohibited integration examples

- **Dependencies**:
  - Task 1.1 must be complete (store handles event subscriptions)
  - Store must populate metrics correctly from events

### Task 1.3: Create OverviewContextProvider

**Missing Component**: Spec requires OverviewContextProvider for external module access per spec lines 183-190, currently not implemented.

Create abstract provider class and implement in store to allow other modules to query overview data:

- **Files**:
  - src/app/application/providers/overview-context.provider.ts - NEW FILE: Create abstract provider
  - src/app/application/stores/overview.store.ts - Implement provider interface
  - src/app/application/providers/index.ts - NEW FILE: Export barrel for providers

- **Implementation Steps**:
  1. Create `src/app/application/providers/` directory if not exists
  2. Create `overview-context.provider.ts` with abstract class:
     ```typescript
     export abstract class OverviewContextProvider {
       abstract getWorkspaceMetrics(): WorkspaceMetrics;
       abstract getModuleStats(moduleId: string): ModuleStats | null;
     }
     ```
  3. Define ModuleStats interface:
     ```typescript
     export interface ModuleStats {
       readonly moduleId: string;
       readonly itemCount: number;
       readonly completedCount: number;
       readonly pendingCount: number;
     }
     ```
  4. Create implementation class that uses OverviewStore
  5. Provide implementation in app config or root
  6. Create barrel export `index.ts` for providers

- **Success Criteria**:
  - OverviewContextProvider abstract class exists
  - Implementation class created with getWorkspaceMetrics() and getModuleStats() methods
  - getWorkspaceMetrics() returns current metrics from store
  - getModuleStats() returns calculated stats for supported modules (tasks, issues, qc, acceptance)
  - Provider registered in dependency injection
  - Other modules can inject OverviewContextProvider

- **Research References**:
  - #file:./.copilot-tracking/research/20260127-overview-module-implementation-research.md (Lines 156-164) - Context Provider pattern example
  - #file:./docs/modulars/08-overview-總覽模組.md (Lines 183-190) - OverviewContextProvider specification
  - #file:./.copilot-tracking/research/20260127-overview-module-implementation-research.md (Lines 352-359) - Create OverviewContextProvider task

- **Dependencies**:
  - OverviewStore must have current metrics available
  - WorkspaceMetrics interface already defined in overview.store.ts

## Phase 2: Validate and Test

### Task 2.1: Verify event subscription functionality

Validate that event subscriptions in store correctly update metrics and activity feed:

- **Files**:
  - src/app/application/stores/overview.store.ts - Verify subscription behavior

- **Verification Steps**:
  1. Manually test or create integration test for each event type
  2. Publish TaskCreated event → verify totalTasks increments
  3. Publish TaskCompleted event → verify completedTasks increments
  4. Publish IssueCreated event → verify openIssues increments
  5. Publish IssueResolved event → verify openIssues decrements
  6. Publish WorkspaceSwitched event → verify reset() called and state cleared
  7. Verify each event adds activity to recentActivities array
  8. Verify activity feed limits to 50 items

- **Success Criteria**:
  - All event types correctly update corresponding metrics
  - Activity feed updates with correct event type, description, timestamp
  - WorkspaceSwitched properly resets all state
  - Activity feed maintains max 50 items
  - No console errors during event handling

- **Research References**:
  - #file:./.copilot-tracking/research/20260127-overview-module-implementation-research.md (Lines 200-209) - Events to subscribe
  - #file:./docs/modulars/08-overview-總覽模組.md (Lines 127-131) - Event handling principles

- **Dependencies**:
  - Task 1.1 completion (event subscriptions in store)
  - Event bus must be functional

### Task 2.2: Test component rendering and metrics display

Verify component correctly displays metrics from OverviewStore without direct store injections:

- **Files**:
  - src/app/presentation/pages/modules/overview/overview.component.ts - Component template rendering
  - src/app/presentation/pages/modules/overview/overview.component.scss - Styling (no changes)

- **Verification Steps**:
  1. Start development server and navigate to overview module
  2. Verify "Total Tasks" displays overviewStore.metrics().totalTasks
  3. Verify "Pending QC" displays overviewStore.metrics().pendingQC
  4. Verify "Pending Acceptance" displays overviewStore.metrics().pendingAcceptance
  5. Verify "Open Issues" displays overviewStore.metrics().openIssues
  6. Verify "Completion Rate" displays overviewStore.taskCompletionRate()
  7. Verify "Health Score" displays overviewStore.healthScore()
  8. Verify activity feed displays recent activities
  9. Verify empty state shows when no activities exist
  10. Test responsiveness on different screen sizes

- **Success Criteria**:
  - All 6 metric cards display correct values
  - Activity feed shows activities with correct format
  - Empty state appears when no activities
  - No compilation errors
  - No runtime errors in console
  - Component renders identically to before changes

- **Research References**:
  - #file:./.copilot-tracking/research/20260127-overview-module-implementation-research.md (Lines 168-182) - WorkspaceMetrics interface
  - #file:./src/app/presentation/pages/modules/overview/overview.component.ts (Lines 41-89) - Current template structure

- **Dependencies**:
  - Task 1.2 completion (component template updated)
  - Store metrics must be populated with data

### Task 2.3: Update unit tests for new architecture

Update or create unit tests to reflect new event-driven architecture:

- **Files**:
  - src/app/application/stores/overview.store.spec.ts - NEW or UPDATE: Store tests
  - src/app/presentation/pages/modules/overview/overview.component.spec.ts - UPDATE: Component tests
  - src/app/application/providers/overview-context.provider.spec.ts - NEW: Provider tests

- **Test Requirements**:
  1. **Store Tests**:
     - Test event handlers update metrics correctly
     - Test computed signals (taskCompletionRate, healthScore)
     - Test addActivity maintains max 50 items
     - Test reset() clears all state
     - Test WorkspaceSwitched event triggers reset
  2. **Component Tests**:
     - Test component only injects OverviewStore
     - Test template bindings to overviewStore signals
     - Mock OverviewStore for isolated testing
     - Test activity feed rendering
     - Test empty state rendering
  3. **Provider Tests**:
     - Test getWorkspaceMetrics returns current metrics
     - Test getModuleStats returns correct stats for each module
     - Test getModuleStats returns null for unknown modules

- **Success Criteria**:
  - All existing tests updated and passing
  - New tests added for event subscriptions
  - Code coverage maintained or improved
  - No direct store injection tests remain
  - Tests follow Angular 20+ patterns (signals, no manual subscriptions)

- **Research References**:
  - #file:./.copilot-tracking/research/20260127-overview-module-implementation-research.md (Lines 144-157) - Testing strategy from spec
  - #file:./docs/modulars/08-overview-總覽模組.md (Lines 144-157) - Testing requirements
  - #file:./.copilot-tracking/research/20260127-overview-module-implementation-research.md (Lines 390-419) - Success criteria

- **Dependencies**:
  - All Phase 1 tasks complete
  - Testing frameworks configured (Jest/Jasmine)

## Overall Dependencies

- NgRx Signals package (@ngrx/signals)
- Angular 20+ with signals support
- WorkspaceEventBus implementation functional
- Existing module stores publishing events

## Overall Success Criteria

1. **Architecture Compliance**:
   - OverviewComponent only injects OverviewStore
   - No direct module-to-module store injections
   - All updates via Event Bus subscriptions
   - OverviewContextProvider available for external access

2. **Functional Equivalence**:
   - All metrics display correctly
   - Activity feed works identically
   - Computed properties (completion rate, health score) function correctly
   - Workspace switching resets state

3. **Code Quality**:
   - Zero TypeScript errors
   - All tests passing
   - No 'any' types (except necessary event typing)
   - Follows Angular 20+ patterns (@if/@for, signals, OnPush)

4. **Specification Compliance**:
   - Implements all required events from spec lines 117-124
   - Follows DDD layering (Domain → Application → Infrastructure → Presentation)
   - Event integration follows Append → Publish → React pattern
   - No forbidden practices per spec lines 137-139
