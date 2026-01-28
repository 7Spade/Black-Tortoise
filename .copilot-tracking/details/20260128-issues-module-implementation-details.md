<!-- markdownlint-disable-file -->

# Task Details: Issues Module (07-issues) Implementation

## Research Reference

**Source Research**: #file:../research/20260128-issues-module-research.md

## Phase 1: Context Provider & Event Integration

### Task 1.1: Create IssueContextProvider interface and implementation

Create abstract provider interface and concrete implementation to expose issue state for cross-module queries (especially Tasks module for blocking logic).

- **Files**:
  - `src/app/application/providers/issue-context.provider.ts` - Abstract interface
  - `src/app/application/providers/issue-context-provider.impl.ts` - Concrete implementation
- **Success**:
  - Interface defines hasBlockingIssues(taskId: string): boolean
  - Interface defines getOpenIssuesCount(taskId: string): number
  - Implementation uses IssuesStore to query state
  - Injectable with providedIn: 'root'
- **Research References**:
  - #file:../research/20260128-issues-module-research.md (Lines 336-398) - Context Provider pattern and gap analysis
  - #file:../../src/app/application/providers/task-context.provider.ts - Existing provider pattern reference
- **Dependencies**:
  - IssuesStore with getIssuesByTask computed signal

### Task 1.2: Subscribe to AcceptanceRejected event for auto-issue creation

Add event subscription to automatically create issues when acceptance testing fails, similar to existing QCFailed handler.

- **Files**:
  - `src/app/application/handlers/issues.event-handlers.ts` - Add new subscription
  - OR `src/app/presentation/pages/modules/issues/issues.component.ts` - Alternative location
- **Success**:
  - Event handler receives AcceptanceRejected payload
  - Auto-creates issue with type BUG, priority based on severity
  - Includes correlationId and causationId from source event
  - Publishes IssueCreated event
- **Research References**:
  - #file:../research/20260128-issues-module-research.md (Lines 401-405) - Missing event subscriptions
  - #file:../research/20260128-issues-module-research.md (Lines 107-119) - Event-driven pattern example
- **Dependencies**:
  - CreateIssueHandler
  - WorkspaceEventBus
  - AcceptanceRejected event definition

### Task 1.3: Subscribe to TaskCompleted event for validation

Prevent task completion if open/in-progress issues exist for that task.

- **Files**:
  - `src/app/application/handlers/issues.event-handlers.ts` - Add validation subscription
- **Success**:
  - Receives TaskCompleted event
  - Queries IssueContextProvider.hasBlockingIssues(taskId)
  - Throws validation error or publishes TaskCompletionBlocked event if issues exist
  - Allows completion if all issues closed
- **Research References**:
  - #file:../research/20260128-issues-module-research.md (Lines 401-405) - Missing TaskCompleted subscription
  - #file:../research/20260128-issues-module-research.md (Lines 47-63) - Task lifecycle integration requirements
- **Dependencies**:
  - IssueContextProvider
  - TaskCompleted event definition

### Task 1.4: Register IssueContextProvider in app.config.ts

Add provider to dependency injection configuration for cross-module availability.

- **Files**:
  - `src/app/app.config.ts` - Add to providers array
- **Success**:
  - IssueContextProvider token registered
  - IssueContextProviderImpl bound as implementation
  - Available for injection in Tasks module and other modules
- **Research References**:
  - #file:../research/20260128-issues-module-research.md (Lines 256-277) - Dependency injection setup
  - #file:../../src/app/application/providers.ts - Existing provider registration pattern
- **Dependencies**:
  - Task 1.1 completion (provider created)

## Phase 2: Status & Type Alignment

### Task 2.1: Update IssueStatus enum to include REOPENED status

Align IssueStatus enum with documentation requirements by adding REOPENED status.

- **Files**:
  - `src/app/domain/aggregates/issue.aggregate.ts` - Update enum
- **Success**:
  - IssueStatus.REOPENED = 'reopened' added
  - Documentation alignment confirmed
  - No breaking changes to existing code (WONT_FIX remains)
- **Research References**:
  - #file:../research/20260128-issues-module-research.md (Lines 348-352) - Status enum mismatch identified
  - #file:../../docs/modulars/07-issues-問題單模組.md (Lines 39-47) - Status flow requirements
- **Dependencies**:
  - None

### Task 2.2: Add reopenIssue function to aggregate

Implement pure function to handle issue reopening from RESOLVED or CLOSED status.

- **Files**:
  - `src/app/domain/aggregates/issue.aggregate.ts` - Add reopenIssue function
- **Success**:
  - Function signature: reopenIssue(issue: IssueAggregate): IssueAggregate
  - Validates source status (only RESOLVED or CLOSED can reopen)
  - Sets status to REOPENED
  - Clears resolvedAt/closedAt timestamps
  - Increments version
  - Returns new aggregate instance (immutable)
- **Research References**:
  - #file:../research/20260128-issues-module-research.md (Lines 136-152) - Functional aggregate pattern
  - #file:../../docs/modulars/07-issues-問題單模組.md (Lines 39-47) - Reopen requirements
- **Dependencies**:
  - Task 2.1 completion (REOPENED status exists)

### Task 2.3: Create ReopenIssueHandler command handler

Create application-layer handler for reopen issue command.

- **Files**:
  - `src/app/application/handlers/reopen-issue.handler.ts` - New handler
  - `src/app/application/commands/reopen-issue.command.ts` - Command DTO
  - `src/app/domain/events/issue-reopened.event.ts` - Domain event
- **Success**:
  - Handler receives ReopenIssueCommand
  - Loads issue from repository
  - Calls reopenIssue aggregate function
  - Publishes IssueReopened event with correlationId/causationId
  - Returns response DTO
- **Research References**:
  - #file:../research/20260128-issues-module-research.md (Lines 173-191) - Handler pattern example
  - #file:../../docs/modulars/07-issues-問題單模組.md (Lines 120-125) - IssueReopened event specification
- **Dependencies**:
  - Task 2.2 completion (reopenIssue function)
  - ISSUE_REPOSITORY token
  - PublishEventHandler

## Phase 3: UI Components - Issue List

### Task 3.1: Create issue-list component with filtering

Build comprehensive list view with Material Table, filters for status/type/priority/assignee, and sorting.

- **Files**:
  - `src/app/presentation/components/issue-list/issue-list.component.ts` - Component
  - `src/app/presentation/components/issue-list/issue-list.component.html` - Template
  - `src/app/presentation/components/issue-list/issue-list.component.scss` - Styles
- **Success**:
  - Uses MatTable with MatSort
  - Filter controls for status, type, priority, assignee
  - Uses @if/@for control flow (no *ngIf/*ngFor)
  - ChangeDetectionStrategy.OnPush
  - @defer for performance on large lists
  - Emits events for row selection and actions
- **Research References**:
  - #file:../research/20260128-issues-module-research.md (Lines 353-357) - Issue list feature requirements
  - #file:../../docs/modulars/07-issues-問題單模組.md (Lines 64-77) - List and filtering requirements
  - #file:../research/20260128-issues-module-research.md (Lines 195-216) - Component control flow pattern
- **Dependencies**:
  - Angular Material modules (MatTableModule, MatSortModule, MatFormFieldModule)
  - IssuesStore for data binding

### Task 3.2: Add store methods for filtering and sorting

Extend IssuesStore with computed signals and methods for list filtering.

- **Files**:
  - `src/app/application/stores/issues.store.ts` - Add filter/sort methods
- **Success**:
  - filterByStatus(status: IssueStatus) method added
  - filterByType(type: IssueType) method added
  - filterByPriority(priority: IssuePriority) method added
  - filterByAssignee(assigneeId: string) method added
  - Computed signals for filtered lists
  - All methods use patchState for reactivity
- **Research References**:
  - #file:../research/20260128-issues-module-research.md (Lines 121-135) - SignalStore pattern
  - #file:../../src/app/application/stores/issues.store.ts - Existing store structure
- **Dependencies**:
  - None (extends existing store)

### Task 3.3: Implement search functionality

Add text search across issue title and description fields.

- **Files**:
  - `src/app/application/stores/issues.store.ts` - Add search method
  - `src/app/presentation/components/issue-list/issue-list.component.ts` - Add search input
- **Success**:
  - searchIssues(query: string) method in store
  - Computed signal for search results
  - Debounced search input (300ms)
  - Case-insensitive search
  - Searches title and description fields
- **Research References**:
  - #file:../research/20260128-issues-module-research.md (Lines 353-357) - Search requirement
  - #file:../../docs/modulars/07-issues-問題單模組.md (Lines 64-77) - Filtering requirements
- **Dependencies**:
  - Task 3.1 completion (list component)
  - RxJS debounceTime for search optimization

## Phase 4: UI Components - Issue Management

### Task 4.1: Create manual issue creation dialog

Build dialog component for manual issue creation with form validation.

- **Files**:
  - `src/app/presentation/dialogs/create-issue-dialog/create-issue-dialog.component.ts` - Dialog component
  - `src/app/presentation/dialogs/create-issue-dialog/create-issue-dialog.component.html` - Template
  - `src/app/presentation/dialogs/create-issue-dialog/create-issue-dialog.component.scss` - Styles
- **Success**:
  - Uses MatDialog
  - Reactive form with validation (title required, min 5 chars)
  - Type, priority, assignee selectors
  - Task association optional
  - Uses @if for conditional rendering
  - ChangeDetectionStrategy.OnPush
  - Calls CreateIssueHandler on submit
- **Research References**:
  - #file:../research/20260128-issues-module-research.md (Lines 406-410) - UI components needed
  - #file:../../docs/modulars/07-issues-問題單模組.md (Lines 25-36) - Issue creation requirements
  - #file:../research/20260128-issues-module-research.md (Lines 295-300) - Angular 20+ compliance
- **Dependencies**:
  - Angular Material Dialog module
  - CreateIssueHandler
  - IssuesStore for type/priority enums

### Task 4.2: Create issue detail dialog component

Build read-only detail view with action buttons (resolve, close, reopen).

- **Files**:
  - `src/app/presentation/dialogs/issue-detail-dialog/issue-detail-dialog.component.ts` - Component
  - `src/app/presentation/dialogs/issue-detail-dialog/issue-detail-dialog.component.html` - Template
  - `src/app/presentation/dialogs/issue-detail-dialog/issue-detail-dialog.component.scss` - Styles
- **Success**:
  - Receives issue ID via MatDialogData
  - Displays full issue details
  - Action buttons based on current status
  - Uses @if/@switch for status-based UI
  - Calls appropriate handlers (ResolveIssueHandler, ReopenIssueHandler)
  - ChangeDetectionStrategy.OnPush
- **Research References**:
  - #file:../research/20260128-issues-module-research.md (Lines 406-410) - UI components needed
  - #file:../../docs/modulars/07-issues-問題單模組.md (Lines 38-63) - Issue lifecycle UI
- **Dependencies**:
  - Task 2.3 completion (ReopenIssueHandler)
  - ResolveIssueHandler
  - ChangeIssueStatusHandler

### Task 4.3: Update main issues.component.ts with new UI

Integrate list component and dialogs into main issues module page.

- **Files**:
  - `src/app/presentation/pages/modules/issues/issues.component.ts` - Update component
  - `src/app/presentation/pages/modules/issues/issues.component.html` - New template (if separated)
- **Success**:
  - Embeds issue-list component
  - "Create Issue" button opens CreateIssueDialog
  - Row click opens IssueDetailDialog
  - Maintains existing event subscriptions (QCFailed, AcceptanceRejected)
  - Uses @defer for dialog components
  - Proper TypeScript typing for all dialogs
- **Research References**:
  - #file:../research/20260128-issues-module-research.md (Lines 195-216) - Existing component structure
  - #file:../../src/app/presentation/pages/modules/issues/issues.component.ts - Current implementation
- **Dependencies**:
  - Task 3.1 completion (issue-list component)
  - Task 4.1 completion (create dialog)
  - Task 4.2 completion (detail dialog)

## Phase 5: Testing & Validation

### Task 5.1: Write unit tests for aggregate functions

Test all pure functions in issue.aggregate.ts with various scenarios.

- **Files**:
  - `src/app/domain/aggregates/issue.aggregate.spec.ts` - Unit tests
- **Success**:
  - Tests for createIssue with valid/invalid inputs
  - Tests for resolveIssue status transitions
  - Tests for reopenIssue validation (only RESOLVED/CLOSED)
  - Tests for closeIssue business rules
  - Tests for updateIssue field changes
  - 100% coverage of aggregate functions
- **Research References**:
  - #file:../research/20260128-issues-module-research.md (Lines 136-152) - Functional aggregate pattern
  - #file:../../docs/modulars/07-issues-問題單模組.md (Lines 150-155) - Unit test requirements
- **Dependencies**:
  - Phase 2 completion (all aggregate functions)

### Task 5.2: Write integration tests for event flow

Test event subscriptions and publishing with Given-When-Then pattern.

- **Files**:
  - `src/app/application/handlers/issues.event-handlers.spec.ts` - Integration tests
- **Success**:
  - Test QCFailed → IssueCreated flow
  - Test AcceptanceRejected → IssueCreated flow
  - Test TaskCompleted validation with blocking issues
  - Test IssueResolved → task routing
  - Verify correlationId/causationId propagation
  - No private method testing
- **Research References**:
  - #file:../research/20260128-issues-module-research.md (Lines 107-119) - Event-driven pattern
  - #file:../../docs/modulars/07-issues-問題單模組.md (Lines 156-160) - Integration test strategy
- **Dependencies**:
  - Phase 1 completion (event handlers)

### Task 5.3: Write E2E tests for complete lifecycle

Test end-to-end user flows with Playwright.

- **Files**:
  - `e2e/issues-module.spec.ts` - E2E tests
- **Success**:
  - Test manual issue creation flow
  - Test auto-creation from QC failure
  - Test issue resolution and task unblocking
  - Test filtering and search
  - Test task completion prevention with open issues
  - All tests pass in CI pipeline
- **Research References**:
  - #file:../research/20260128-issues-module-research.md (Lines 480-496) - Success criteria
  - #file:../../docs/modulars/07-issues-問題單模組.md (Lines 161-164) - E2E test requirements
- **Dependencies**:
  - All previous phases completed
  - Playwright configuration

## Dependencies

- Angular 20+ with signals
- NgRx SignalStore
- Angular Material M3
- Tailwind CSS
- Firestore
- Playwright for E2E testing

## Success Criteria

- All 15 tasks completed and verified
- IssueContextProvider accessible from Tasks module
- AcceptanceRejected and TaskCompleted event subscriptions working
- Issue list with all filters operational
- Manual issue creation functional
- REOPENED status implemented
- All tests passing (unit, integration, E2E)
- No Angular template syntax warnings (@if/@for compliance)
- ChangeDetectionStrategy.OnPush on all components
- Zero direct Store injections between modules
