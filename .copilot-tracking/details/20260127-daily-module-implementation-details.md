<!-- markdownlint-disable-file -->

# Task Details: Daily Module Implementation with Minimal Changes

## Research Reference

**Source Research**: #file:../research/20250201-daily-module-architecture-research.md

## Phase 1: Domain Layer Completion

### Task 1.1: Enhance DailyEntryEntity with factory/reconstruct pattern

Refactor `src/app/domain/aggregates/daily-entry.aggregate.ts` to implement full DDD aggregate pattern with factory method for new entities (emits events) and reconstruct method for hydration (no events).

- **Files**:
  - src/app/domain/aggregates/daily-entry.aggregate.ts - Transform from interface to class with private constructor
- **Success**:
  - `DailyEntryEntity.create()` emits DailyEntryCreatedEvent
  - `DailyEntryEntity.reconstruct()` rebuilds from props without events
  - Private constructor prevents direct instantiation
  - Immutable properties with readonly modifiers
- **Research References**:
  - #file:../research/20250201-daily-module-architecture-research.md (Lines 164-214) - DDD Aggregate Pattern with factory/reconstruct examples
  - #file:../../docs/modulars/04-daily-每日紀錄模組.md (Lines 241-275) - Factory and Policy patterns specification
- **Dependencies**:
  - EventMetadata type from domain/events
  - DailyEntryCreatedEvent from domain/events

### Task 1.2: Implement comprehensive business rule policies

Create three policy classes in `src/app/domain/policies/` for business rule validation:
- `work-hour.policy.ts` - Max 1.0 man-day per person per day
- `task-completion.policy.ts` - No time logging on completed tasks
- `historical-entry.policy.ts` - 30-day modification window

- **Files**:
  - src/app/domain/policies/work-hour.policy.ts - NEW: Validate total headcount ≤ 1.0
  - src/app/domain/policies/task-completion.policy.ts - NEW: Check task status
  - src/app/domain/policies/historical-entry.policy.ts - NEW: Date range validation
  - src/app/domain/policies/daily-validation.policy.ts - KEEP: Basic format validation
- **Success**:
  - Each policy has `isSatisfiedBy()` and `assertIsValid()` methods
  - WorkHourPolicy calculates existing entries total before validation
  - TaskCompletionPolicy checks status !== 'Completed'
  - HistoricalEntryPolicy allows modification within 30 days only
  - All throw DomainError with descriptive messages on violation
- **Research References**:
  - #file:../research/20250201-daily-module-architecture-research.md (Lines 216-260) - Policy Pattern with business rules
  - #file:../../docs/modulars/04-daily-每日紀錄模組.md (Lines 276-290) - Policy Pattern specification
- **Dependencies**:
  - DomainError from domain/errors
  - DailyEntry interface for type safety

### Task 1.3: Create ManDay value object for headcount validation

Create value object `src/app/domain/value-objects/man-day.vo.ts` to encapsulate headcount validation (0.1 to 1.0 range).

- **Files**:
  - src/app/domain/value-objects/man-day.vo.ts - NEW: Immutable value object with range validation
- **Success**:
  - Validates value is between 0.1 and 1.0
  - Immutable readonly value property
  - Equals method for value comparison
  - Static factory method `ManDay.create(value: number)`
  - Throws DomainError if value out of range
- **Research References**:
  - #file:../research/20250201-daily-module-architecture-research.md (Lines 456-463) - Business Rules including headcount range
  - #file:../../docs/modulars/04-daily-每日紀錄模組.md (Lines 26-36) - Man-day requirements with 0.1-1.0 range
- **Dependencies**:
  - DomainError from domain/errors

## Phase 2: Application Layer Enhancement

### Task 2.1: Create DailyContextProvider for cross-module integration

Create abstract class and implementation in `src/app/application/providers/daily-context.provider.ts` to expose read-only access to daily data for other modules.

- **Files**:
  - src/app/application/providers/daily-context.provider.ts - NEW: Abstract class + implementation
  - src/app/app.config.ts - UPDATE: Register provider in ApplicationConfig
- **Success**:
  - Abstract class defines `getTotalWorkHours(userId, date)` and `hasDailyEntry(userId, date)`
  - Implementation injects DailyStore (readonly access only)
  - Converts Date to ISO string for querying
  - Reduces entries to calculate total headcount
  - Registered in app.config.ts providers array
- **Research References**:
  - #file:../research/20250201-daily-module-architecture-research.md (Lines 112-137) - Context Provider Pattern with implementation
  - #file:../../docs/modulars/04-daily-每日紀錄模組.md (Lines 168-177) - DailyContextProvider specification
- **Dependencies**:
  - DailyStore from application/stores
  - @Injectable decorator with providedIn: 'root'

### Task 2.2: Add event subscriptions to DailyStore hooks

Enhance `src/app/application/stores/daily.store.ts` withHooks to subscribe to TaskProgressUpdated and TaskCompleted events for reactive behavior.

- **Files**:
  - src/app/application/stores/daily.store.ts - UPDATE: Add event subscriptions in onInit hook
- **Success**:
  - Subscribe to WorkspaceSwitched (already exists) - clear state
  - Subscribe to TaskProgressUpdated - auto-create entry based on progress delta
  - Subscribe to TaskCompleted - prevent further time logging
  - Subscribe to DailyEntryCreated - add entry to state
  - All subscriptions include correlationId tracking
  - Store remains pure (no side effects except state updates)
- **Research References**:
  - #file:../research/20250201-daily-module-architecture-research.md (Lines 139-163) - Event Subscription Pattern in store hooks
  - #file:../../docs/modulars/04-daily-每日紀錄模組.md (Lines 104-117) - Event integration requirements
- **Dependencies**:
  - WorkspaceEventBus injection
  - Existing DailyStore structure

### Task 2.3: Enhance CreateDailyEntryHandler with comprehensive validation

Update `src/app/application/handlers/create-daily-entry.handler.ts` to validate all business rules before creating events.

- **Files**:
  - src/app/application/handlers/create-daily-entry.handler.ts - UPDATE: Add policy validations
- **Success**:
  - Inject TaskContextProvider to check task status
  - Validate WorkHourPolicy before creating entry
  - Validate TaskCompletionPolicy for each task
  - Validate HistoricalEntryPolicy for past dates
  - Return descriptive error messages on validation failure
  - Maintain event-first pattern (validation → create event → publish)
- **Research References**:
  - #file:../research/20250201-daily-module-architecture-research.md (Lines 262-305) - Event-First Command Handler with validation
  - #file:../../docs/modulars/04-daily-每日紀錄模組.md (Lines 241-290) - Factory and Policy integration
- **Dependencies**:
  - WorkHourPolicy, TaskCompletionPolicy, HistoricalEntryPolicy
  - TaskContextProvider for task status queries
  - Existing PublishEventHandler

## Phase 3: UI Quick Fill Features

### Task 3.1: Add 7-day history view to daily component

Enhance `src/app/presentation/pages/modules/daily/daily.component.ts` to display past 7 days of entries in a timeline view.

- **Files**:
  - src/app/presentation/pages/modules/daily/daily.component.ts - UPDATE: Add computed signal for 7-day entries
  - src/app/presentation/pages/modules/daily/daily.component.html - UPDATE: Add timeline template with @for
- **Success**:
  - Computed signal `past7DaysEntries()` filters entries from last 7 days
  - Template uses @for (entry of past7DaysEntries(); track entry.id)
  - Displays date, headcount, task names, notes for each entry
  - Shows "No entries" placeholder when empty (@else block)
  - Deferred loading for non-visible days (@defer on viewport)
- **Research References**:
  - #file:../research/20250201-daily-module-architecture-research.md (Lines 406-433) - Modern template control flow syntax
  - #file:../../docs/modulars/04-daily-每日紀錄模組.md (Lines 38-49) - Quick fill interface requirements
- **Dependencies**:
  - DailyStore.entries() signal
  - Date manipulation utilities

### Task 3.2: Implement copy previous day functionality

Add "Copy Yesterday" button to daily component that clones previous day's entries to today with user confirmation.

- **Files**:
  - src/app/presentation/pages/modules/daily/daily.component.ts - UPDATE: Add copyPreviousDay method
  - src/app/presentation/pages/modules/daily/daily.component.html - UPDATE: Add copy button
- **Success**:
  - Button fetches yesterday's entries from store
  - Opens confirmation dialog with entry preview
  - On confirm, creates new entries with today's date
  - Uses CreateDailyEntryHandler for each entry
  - Shows success/error toast notification
  - Disabled if no yesterday entries exist
- **Research References**:
  - #file:../research/20250201-daily-module-architecture-research.md (Lines 307-364) - Store with event-driven methods
  - #file:../../docs/modulars/04-daily-每日紀錄模組.md (Lines 44-45) - Copy previous day requirement
- **Dependencies**:
  - Angular Material Dialog for confirmation
  - CreateDailyEntryHandler for entry creation
  - Toast/Snackbar for notifications

### Task 3.3: Auto-populate today's active tasks

Display list of today's active tasks at top of form for quick entry selection.

- **Files**:
  - src/app/presentation/pages/modules/daily/daily.component.ts - UPDATE: Add activeTasks computed signal
  - src/app/presentation/pages/modules/daily/daily.component.html - UPDATE: Add task selection UI
- **Success**:
  - Inject TaskContextProvider to get active tasks
  - Filter tasks for current workspace and user
  - Exclude completed tasks
  - Display as checkboxes with task name and ID
  - Pre-fill form when task selected
  - Shows "No active tasks" when empty
- **Research References**:
  - #file:../research/20250201-daily-module-architecture-research.md (Lines 112-137) - Context Provider usage
  - #file:../../docs/modulars/04-daily-每日紀錄模組.md (Lines 40-41) - Auto-list today's tasks
- **Dependencies**:
  - TaskContextProvider for task queries
  - Angular Material Checkbox for selection

## Phase 4: Team Statistics Module

### Task 4.1: Create team statistics component with deferred loading

Create new component `src/app/presentation/pages/modules/daily/team-statistics/team-statistics.component.ts` for manager view of team worklog.

- **Files**:
  - src/app/presentation/pages/modules/daily/team-statistics/team-statistics.component.ts - NEW
  - src/app/presentation/pages/modules/daily/team-statistics/team-statistics.component.html - NEW
  - src/app/presentation/pages/modules/daily/team-statistics/team-statistics.component.scss - NEW
  - src/app/presentation/pages/modules/daily/daily.component.html - UPDATE: Add @defer block for statistics
- **Success**:
  - Standalone component with ChangeDetectionStrategy.OnPush
  - Displays weekly man-days trend (line chart)
  - Shows task distribution (bar chart)
  - Member comparison (radar chart)
  - Uses @defer (on viewport) for lazy loading
  - Placeholder skeleton during loading
- **Research References**:
  - #file:../research/20250201-daily-module-architecture-research.md (Lines 406-433) - Deferred loading syntax
  - #file:../../docs/modulars/04-daily-每日紀錄模組.md (Lines 63-72) - Team statistics requirements
- **Dependencies**:
  - Chart.js or Angular Material Charts
  - DailyStore for data access
  - @defer directive

### Task 4.2: Implement Excel/CSV export functionality

Add export service and buttons to team statistics for downloading worklog data.

- **Files**:
  - src/app/application/services/daily-export.service.ts - NEW: Export logic
  - src/app/presentation/pages/modules/daily/team-statistics/team-statistics.component.ts - UPDATE: Add export methods
  - src/app/presentation/pages/modules/daily/team-statistics/team-statistics.component.html - UPDATE: Add export buttons
- **Success**:
  - Export to CSV with proper encoding
  - Export to Excel with formatting
  - Includes filtered data (respects current filters)
  - Columns: Date, User, Task, Headcount, Notes
  - Downloads with filename: `daily-worklog-{startDate}-{endDate}.{ext}`
- **Research References**:
  - #file:../research/20250201-daily-module-architecture-research.md (Lines 307-364) - Store data access patterns
  - #file:../../docs/modulars/04-daily-每日紀錄模組.md (Lines 67-68) - Export requirement
- **Dependencies**:
  - xlsx library for Excel export
  - Browser File API for download

### Task 4.3: Add filter by member/task/date

Implement filtering UI in team statistics component for member, task, and date range selection.

- **Files**:
  - src/app/presentation/pages/modules/daily/team-statistics/team-statistics.component.ts - UPDATE: Add filter signals
  - src/app/presentation/pages/modules/daily/team-statistics/team-statistics.component.html - UPDATE: Add filter form
- **Success**:
  - Member dropdown (multi-select) from workspace users
  - Task dropdown (multi-select) from workspace tasks
  - Date range picker (start/end dates)
  - Computed signal filters entries based on selections
  - "Clear filters" button resets all
  - Filter state persists during session
- **Research References**:
  - #file:../research/20250201-daily-module-architecture-research.md (Lines 307-364) - Computed signals for filtering
  - #file:../../docs/modulars/04-daily-每日紀錄模組.md (Lines 66-67) - Filter requirements
- **Dependencies**:
  - Angular Material Select for dropdowns
  - Angular Material Datepicker for range
  - Signal-based form state

## Phase 5: Testing and Validation

### Task 5.1: Write unit tests for domain policies

Create test files for WorkHourPolicy, TaskCompletionPolicy, and HistoricalEntryPolicy.

- **Files**:
  - src/app/domain/policies/work-hour.policy.spec.ts - NEW
  - src/app/domain/policies/task-completion.policy.spec.ts - NEW
  - src/app/domain/policies/historical-entry.policy.spec.ts - NEW
- **Success**:
  - Test `isSatisfiedBy()` with valid/invalid inputs
  - Test `assertIsValid()` throws DomainError on violation
  - Test edge cases (exactly 1.0, 30 days, boundary conditions)
  - Test pure functions without side effects
  - 100% code coverage for policy logic
- **Research References**:
  - #file:../research/20250201-daily-module-architecture-research.md (Lines 216-260) - Policy implementations
  - #file:../../docs/modulars/04-daily-每日紀錄模組.md (Lines 130-143) - Testing strategy
- **Dependencies**:
  - Jasmine/Jest test framework
  - Test data builders

### Task 5.2: Write integration tests for event flows

Create integration tests for DailyStore event subscriptions and CreateDailyEntryHandler.

- **Files**:
  - src/app/application/stores/daily.store.spec.ts - UPDATE: Add event subscription tests
  - src/app/application/handlers/create-daily-entry.handler.spec.ts - UPDATE: Add validation tests
- **Success**:
  - Test WorkspaceSwitched clears state
  - Test TaskProgressUpdated creates auto-entry
  - Test TaskCompleted prevents new entries
  - Test DailyEntryCreated adds to store
  - Test handler validation rejects invalid requests
  - Test correlationId propagation through events
- **Research References**:
  - #file:../research/20250201-daily-module-architecture-research.md (Lines 139-163) - Event subscription patterns
  - #file:../../docs/modulars/04-daily-每日紀錄模組.md (Lines 130-143) - Integration testing requirements
- **Dependencies**:
  - Mock WorkspaceEventBus
  - Test event factories
  - TestBed configuration

### Task 5.3: Verify performance metrics and accessibility

Run Lighthouse audits and accessibility scans to ensure compliance with Core Web Vitals and A11y standards.

- **Files**:
  - Performance audit results document - NEW
  - Accessibility audit checklist - NEW
- **Success**:
  - LCP < 2.5s measured with Lighthouse
  - INP < 200ms verified with user interactions
  - CLS < 0.1 checked with layout shift tracking
  - Keyboard navigation tested on all forms
  - ARIA labels verified on date pickers and inputs
  - LiveAnnouncer confirmed for success/error messages
  - Screen reader compatibility tested
- **Research References**:
  - #file:../research/20250201-daily-module-architecture-research.md (Lines 464-483) - Performance and accessibility requirements
  - #file:../../docs/modulars/04-daily-每日紀錄模組.md (Lines 148-163) - UI/UX and A11y specifications
- **Dependencies**:
  - Lighthouse CLI
  - axe-core for accessibility testing
  - Chrome DevTools

## Dependencies

- Angular 20+ with signals
- NgRx Signals (signalStore)
- Angular Material M3
- Tailwind CSS
- WorkspaceEventBus
- TaskContextProvider
- WorkspaceContextProvider

## Success Criteria

- All phases completed with working code
- Business rules enforced in policies
- Context provider accessible to other modules
- Event subscriptions reactive
- UI features functional (7-day history, copy, auto-tasks, statistics)
- Tests passing with >80% coverage
- Performance metrics met (LCP, INP, CLS)
- Accessibility standards satisfied
