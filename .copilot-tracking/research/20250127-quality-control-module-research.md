<!-- markdownlint-disable-file -->

# Task Research Notes: Quality Control Module Implementation Analysis

## Research Executed

### File Analysis

- **docs/modulars/05-quality-control-質檢模組.md**
  - Complete module specification with architecture requirements, functional specs, and DDD patterns
  - Defines 4 major feature areas: QC item management, QC workflow, issue creation on failure, history tracking
  - Prescribes strict Angular 20+ patterns (signalStore, @if/@for, OnPush, zone-less)
  - Requires event-driven architecture with Append → Publish → React pattern

- **src/app/domain/aggregates/quality-control.aggregate.ts**
  - Basic QCCheckEntity interface exists with: id, taskId, workspaceId, status, artifacts, comments
  - Simple enum QCStatus (PENDING, PASSED, FAILED) - missing InProgress state from spec
  - No domain aggregate with creation/reconstruction pattern
  - Missing: checklist items, reviewer tracking, timestamps

- **src/app/application/stores/quality-control.store.ts**
  - Implements signalStore with QCTask state interface
  - Has computed signals (pendingTasks, completedReviews, selectedTask)
  - Methods: addTaskForReview, passTask, failTask, selectTask, reset
  - Missing: checklist management, template support, issue resolution tracking

- **src/app/presentation/pages/modules/quality-control/quality-control.component.ts**
  - Basic UI with pending/completed task lists
  - Uses modern @if/@for control flow
  - Connects to PassQCUseCase and FailQCHandler
  - Missing: task snapshot display, checklist UI, detailed review form

- **src/app/application/handlers/quality-control.event-handlers.ts**
  - Registers handlers for: TaskSubmittedForQC, QCPassed, QCFailed
  - QCFailed handler automatically creates issue via CreateIssueHandler
  - Proper causality chain (correlationId, causationId)

### Code Search Results

- **QC-related files found**:
  - Domain: quality-control.aggregate.ts, qc-*.event.ts, qc-check-id.vo.ts, qc-validation.policy.ts, task-ready-for-qc.specification.ts, quality-control.repository.ts
  - Application: quality-control.store.ts, submit-qc-check.command.ts, submit-qc-check.handler.ts, submit-task-for-qc.handler.ts, pass-qc.handler.ts, fail-qc.handler.ts, quality-control.event-handlers.ts, quality-control-repository.token.ts
  - Infrastructure: quality-control.repository.impl.ts
  - Presentation: quality-control/quality-control.component.ts|.scss

- **Event Types**:
  - Published: QCPassed, QCFailed, TaskSubmittedForQC
  - Consumed: TaskReadyForQC (no references found), IssueResolved (exists but not consumed by QC)

### Project Conventions

- **Layer Structure**: Domain → Application → Infrastructure → Presentation (clean architecture)
- **Folder Organization**: Each layer has subdirectories (aggregates, events, policies, stores, handlers, repositories)
- **State Management**: NgRx Signals (signalStore) with computed/methods/hooks
- **Event Bus**: WorkspaceEventBus for inter-module communication
- **DDD Patterns**: Aggregates with create/reconstruct, Factories, Policies, Repositories with InjectionToken

### External Research

- N/A (internal codebase analysis)

## Key Discoveries

### Project Structure

The codebase follows a strict 4-layer clean architecture:

1. **Domain Layer** (`src/app/domain/`)
   - aggregates/, entities/, events/, factories/, policies/, repositories/ (interfaces), specifications/, value-objects/
   - Pure business logic, no framework dependencies
   - Aggregates use static create() (with events) and reconstruct() (without events)

2. **Application Layer** (`src/app/application/`)
   - stores/, handlers/, commands/, facades/, mappers/, providers/, ports/, tokens/
   - Orchestrates domain logic, manages state with signalStore
   - Event handlers subscribe to domain events and coordinate workflows

3. **Infrastructure Layer** (`src/app/infrastructure/`)
   - repositories/ (implementations), adapters/, mappers/, providers/
   - External dependencies (Firestore, etc.)
   - Implements repository interfaces with InjectionToken DI

4. **Presentation Layer** (`src/app/presentation/`)
   - pages/, components/, directives/, pipes/
   - Angular components, strict OnPush, modern control flow (@if/@for/@switch/@defer)

### Implementation Patterns

**State Management (Application Layer)**:
```typescript
export const QualityControlStore = signalStore(
  { providedIn: 'root' },
  withState<QualityControlState>(initialState),
  withComputed((state) => ({
    pendingTasks: computed(() => state.tasks().filter(t => t.reviewStatus === 'pending'))
  })),
  withMethods((store) => ({ /* state mutations */ })),
  withHooks({
    onInit(store) {
      const eventBus = inject(WorkspaceEventBus);
      eventBus.on('WorkspaceSwitched', () => patchState(store, initialState));
    }
  })
);
```

**Event-Driven Workflow**:
- Event handlers in `application/handlers/*.event-handlers.ts`
- Pattern: TaskSubmittedForQC → addTaskForReview → QCPassed/QCFailed → downstream reactions
- QCFailed automatically triggers CreateIssueHandler with proper causality

**DDD Aggregate Pattern**:
```typescript
export class QCRecordEntity {
  private constructor(...) {}
  
  public static create(..., eventMetadata?: EventMetadata): QCRecordEntity {
    // Produces domain events
  }
  
  public static reconstruct(props): QCRecordEntity {
    // From snapshot, no events
  }
}
```

### Complete Examples

**Event Handler Registration** (`quality-control.event-handlers.ts`):
```typescript
export function registerQualityControlEventHandlers(eventBus: EventBus): void {
  const qcStore = inject(QualityControlStore);
  
  eventBus.subscribe<TaskSubmittedForQCEvent['payload']>(
    'TaskSubmittedForQC',
    (event) => {
      qcStore.addTaskForReview({
        taskId: event.aggregateId,
        taskTitle: event.payload.taskTitle,
        // ...
      });
    }
  );
  
  eventBus.subscribe<QCFailedEvent['payload']>(
    'QCFailed',
    async (event) => {
      qcStore.failTask(event.aggregateId, ...);
      
      // Auto-create issue with causality
      await createIssueHandler.execute({
        correlationId: event.correlationId, // Inherited
        causationId: event.eventId, // Parent event
      });
    }
  );
}
```

**Modern Component Template**:
```html
@if (qcStore.pendingTasks().length === 0) {
  <div class="empty-state">No tasks pending QC review</div>
}

@for (task of qcStore.pendingTasks(); track task.id) {
  <div class="qc-task-card">
    <h4>{{ task.taskTitle }}</h4>
    <!-- ... -->
  </div>
}
```

### API and Schema Documentation

**QCCheckEntity (Current - Basic)**:
```typescript
interface QCCheckEntity {
  readonly id: string;
  readonly taskId: string;
  readonly workspaceId: string;
  readonly status: QCStatus; // PENDING, PASSED, FAILED
  readonly artifacts: ReadonlyArray<string>;
  readonly comments: string;
  readonly checkedBy: string | null;
  readonly checkedAt: number | null;
}
```

**QCTask (Store Model)**:
```typescript
interface QCTask {
  readonly id: string;
  readonly taskId: string;
  readonly taskTitle: string;
  readonly taskDescription: string;
  readonly submittedAt: Date;
  readonly submittedBy: string;
  readonly reviewStatus: 'pending' | 'passed' | 'failed';
  readonly reviewedAt?: Date;
  readonly reviewedBy?: string;
  readonly reviewNotes?: string;
}
```

### Configuration Examples

N/A - No specific configuration files for QC module

### Technical Requirements

**From Documentation (05-quality-control-質檢模組.md)**:

1. **Checklist Management**:
   - Auto-create QC item when task progress = 100%
   - Subscribe to TaskReadyForQC event
   - Support default templates by task type
   - Support custom checklist items
   - Each item: name, description, isRequired, checkResult
   - All required items must pass for QC to pass

2. **QC Workflow**:
   - Display task snapshot (title, description, quantity, attachments)
   - Step-by-step checklist review
   - Pass: QCPassed event → task status = ReadyForAcceptance
   - Fail: QCFailed event → auto-create issue → task status = Blocked
   - Failure reason required for fail

3. **Issue Integration**:
   - Auto-create issue on QC fail
   - Issue title: "[QC 失敗] {任務標題}"
   - Issue type: Defect
   - Issue priority: inherit from task
   - Issue assignee: task owner
   - Bidirectional task-issue relationship
   - After issue resolved, QC can restart

4. **History & Analytics**:
   - Preserve all QC history
   - Display: time, reviewer, result, failure reason
   - Metrics: pass rate, average QC time, common failure types, reviewer workload

5. **Angular 20+ Requirements**:
   - signalStore for state (NO RxJS BehaviorSubject)
   - @if/@for/@switch (NO *ngIf/*ngFor)
   - @defer for heavy views
   - ChangeDetectionStrategy.OnPush
   - Zone-less change detection

6. **Event Architecture**:
   - Published: QCPassed, QCFailed, QCStarted
   - Subscribed: TaskReadyForQC, IssueResolved, WorkspaceSwitched
   - All events must include correlationId
   - Append → Publish → React pattern
   - No direct cross-module store injection

7. **DDD Implementation**:
   - QCRecordEntity aggregate with create/reconstruct
   - QCRecordFactory enforcing policies
   - QCCriteriaPolicy for validation
   - Repository with InjectionToken
   - Mapper pattern for Domain ↔ DTO ↔ Firestore

## Recommended Approach

**Incremental Enhancement Strategy** (Build on existing foundation)

The QC module has a working foundation but requires significant expansion to meet specification:

### Phase 1: Domain Layer Enhancements
1. **Expand QCCheckEntity Aggregate**:
   - Add checklist items array with ChecklistItem value object
   - Add QCStatus.InProgress state
   - Add taskSnapshot field for audit trail
   - Implement create() and reconstruct() static methods
   - Emit proper domain events

2. **Create Supporting Value Objects**:
   - ChecklistItem (name, description, isRequired, isPassed)
   - TaskSnapshot (title, description, quantity, attachments)
   - QCTemplate (taskType → default checklist items)

3. **Enhance Policies**:
   - QCCriteriaPolicy: validate all required items passed
   - TaskReadyForQCPolicy: verify task at 100% progress

4. **Create Factory**:
   - QCRecordFactory with template application logic

### Phase 2: Application Layer Expansion
1. **Enhance QualityControlStore**:
   - Add checklist state management methods
   - Add template selection logic
   - Track IssueResolved events for restart capability
   - Add QC metrics computed signals (pass rate, avg time)

2. **New Use Cases/Handlers**:
   - StartQCHandler (apply template, create checklist)
   - UpdateChecklistItemHandler
   - RestartQCAfterIssueResolvedHandler

3. **Event Handler Updates**:
   - Subscribe to TaskReadyForQC (currently missing)
   - Subscribe to IssueResolved
   - Emit QCStarted event

### Phase 3: Presentation Layer Completion
1. **QC Review UI**:
   - Task snapshot display component
   - Checklist review component with item-by-item checking
   - Failure reason form validation
   - Template selection UI

2. **QC History UI**:
   - History timeline component
   - Analytics dashboard (metrics charts)

### Phase 4: Infrastructure Integration
1. **Repository Implementation**:
   - Expand QualityControlRepository to persist checklists
   - Add template repository
   - Firestore mapper for nested checklist structure

## Implementation Guidance

- **Objectives**:
  - Expand QC domain model to support checklist-based reviews
  - Implement template system for different task types
  - Complete event integration (TaskReadyForQC, IssueResolved)
  - Build comprehensive review UI with task snapshot
  - Add QC analytics and history tracking

- **Key Tasks**:
  1. Create ChecklistItem, TaskSnapshot, QCTemplate value objects
  2. Refactor QCCheckEntity into full aggregate with create/reconstruct
  3. Add checklist management to QualityControlStore
  4. Build checklist review component with step-by-step UI
  5. Implement template selection and application
  6. Subscribe to missing events (TaskReadyForQC, IssueResolved)
  7. Create QC history and analytics components

- **Dependencies**:
  - Tasks module (TaskReadyForQC event, task snapshot data)
  - Issues module (IssueResolved event)
  - WorkspaceEventBus (already integrated)
  - Task template definitions (for QC template mapping)

- **Success Criteria**:
  - QC checklist can be created from templates
  - Reviewers can mark items pass/fail individually
  - QC cannot pass unless all required items pass
  - Failure creates issue automatically with bidirectional link
  - Task snapshot preserved in QC record
  - QC history shows all review attempts with metrics
  - All events follow Append → Publish → React pattern
  - No *ngIf/*ngFor in templates (all @if/@for)
  - Store uses only signals (no RxJS)
