<!-- markdownlint-disable-file -->

# Task Research Notes: Tasks Module Implementation (任務模組)

## Research Executed

### File Analysis

- **docs/modulars/03-tasks-任務模組.md**
  - Complete module specification with DDD architecture requirements
  - Defines 6 major functional requirements including infinite task hierarchy, status flow transitions, and automated workflows
  - Specifies 14 domain layer files, 13 application layer files, 3 infrastructure layer files, and 6 presentation layer files
  - Requires strict adherence to Angular 20+ patterns: @if/@for/@switch, signalStore, zone-less change detection

- **src/app/domain/aggregates/task.aggregate.ts**
  - Existing basic TaskAggregate with TaskStatus and TaskPriority enums
  - Current implementation has 10 statuses: DRAFT, READY, IN_PROGRESS, IN_QC, QC_FAILED, IN_ACCEPTANCE, ACCEPTED, REJECTED, COMPLETED, BLOCKED
  - Basic functions: createTask, updateTaskStatus, blockTask, unblockTask, restoreTask
  - Missing: subtask support, money/progress value objects, dependency management, comprehensive status transitions

- **src/app/application/stores/tasks.store.ts**
  - Existing signalStore with basic CRUD operations
  - Uses Array<TaskAggregate> instead of recommended Map<TaskId, Task>
  - Has computed signals for filtering by status (blockedTasks, readyTasks, tasksInQC)
  - Missing: view mode signal, derived view computeds, progress tracking, hierarchy support

- **src/app/presentation/pages/modules/tasks/tasks.component.ts**
  - Existing basic task list UI with create form
  - Uses TasksFacade for operations
  - Has viewMode signal with 'list' and 'kanban' options
  - Missing: gantt view, calendar integration, tree view for hierarchy, drag-drop

- **.github/instructions/03-modules-guidelines.instructions.md**
  - Workspace is context provider only, modules are capability executors
  - Workspace must not read/write module state or coordinate module processes
  - All module state changes must be published as domain events
  - Modules interact only through event bus, no direct dependencies

- **.github/instructions/04-event-sourcing-and-causality.instructions.md**
  - Pure reactive interaction: Producer → EventBus → EventStore (side effect) → Consumer
  - All events must have correlationId and causationId for causality tracking
  - Event Lifecycle: New → Published → Consumed → Completed/Failed
  - Append → Publish → React pattern required

### Code Search Results

- **Domain Events Pattern**
  - Found 29 event files in src/app/domain/events/
  - Existing task events: TaskCreated, TaskUpdated, TaskDeleted, TaskCompleted, TaskSubmittedForQC
  - Missing events per spec: TaskReadyForQC, TaskReadyForAcceptance, TaskAssigneeChanged, TaskUnblocked, TaskCompletionBlocked, TaskProgressUpdated, TaskBlocked

- **Value Objects Pattern**
  - Found 17 value object files in src/app/domain/value-objects/
  - Existing: TaskId, WorkspaceId, UserId, MemberId, etc.
  - All follow same pattern: private constructor, static create/generate, getValue, equals, toString
  - Missing per spec: TaskStatus.vo, TaskPriority.vo, Money.vo, Progress.vo

- **Repository Pattern**
  - Found TASK_REPOSITORY injection token in src/app/application/interfaces/task-repository.token.ts
  - Repository interfaces defined in application layer, implementations in infrastructure layer
  - All use Promise-based async operations (no RxJS Observables)
  - TaskRepository has findByWorkspaceId method returning Promise<TaskAggregate[]>

### External Research

- **#githubRepo:"angular/angular" signals**
  - Angular 20 fully supports signal-based reactivity
  - computed() for derived state, effect() for side effects
  - signalStore from @ngrx/signals is recommended for state management
  - No more need for BehaviorSubject or manual subscribe in modern Angular

- **#githubRepo:"ngrx/platform" signalStore**
  - signalStore provides: withState, withComputed, withMethods
  - rxMethod for handling async operations with reactive streams
  - tapResponse operator for handling success/error cases
  - patchState for immutable state updates

- **#fetch:https://angular.dev/guide/templates/control-flow**
  - @if / @else replaces *ngIf
  - @for (item of items; track item.id) replaces *ngFor - track is mandatory
  - @switch / @case replaces *ngSwitch
  - @defer (on viewport) for lazy loading heavy components

### Project Conventions

- **Standards referenced**: 
  - DDD Architecture (.github/instructions/strict-ddd-*.instructions.md)
  - Angular Control Flow (.github/instructions/ng-angular-20-control-flow.instructions.md)
  - NgRx Signals (.github/instructions/ng-ngrx-signals.instructions.md)
  - Event Sourcing (.github/instructions/04-event-sourcing-and-causality.instructions.md)

- **Instructions followed**:
  - Zone-less change detection with ChangeDetectionStrategy.OnPush
  - No manual .subscribe() calls in components
  - Pure signal-based state management
  - Event-driven module communication only

## Key Discoveries

### Project Structure

The project follows a strict DDD layered architecture:

```
src/app/
├── domain/           # Pure TypeScript, no framework dependencies
│   ├── aggregates/   # Aggregate roots (entity + business logic)
│   ├── entities/     # Child entities
│   ├── value-objects/# Immutable value objects with equality by value
│   ├── events/       # Domain events (past tense naming)
│   ├── policies/     # Business rules and validation
│   ├── repositories/ # Repository interfaces
│   └── services/     # Domain services
├── application/      # Use cases, commands, queries, stores
│   ├── stores/       # NgRx signalStore implementations
│   ├── facades/      # Application facades (orchestration layer)
│   ├── interfaces/   # Repository tokens and interfaces
│   └── events/       # Application-level events
├── infrastructure/   # External adapters, repository implementations
│   ├── repositories/ # Concrete repository implementations (Firebase, etc.)
│   ├── adapters/     # External service adapters
│   └── services/     # Infrastructure services
└── presentation/     # Angular components, pages, UI
    ├── pages/        # Page-level components
    ├── components/   # Reusable components
    └── shared/       # Shared presentation utilities
```

### Implementation Patterns

**1. Aggregate Pattern (Domain Layer)**
```typescript
// Pure TypeScript interface + factory functions
export interface TaskAggregate {
  readonly id: string;
  readonly workspaceId: string;
  // ... fields
}

export function createTask(params: CreateTaskParams): TaskAggregate {
  const now = Date.now();
  return {
    id: params.id ?? crypto.randomUUID(),
    // ... initialize with defaults
  };
}

export function updateTaskStatus(task: TaskAggregate, newStatus: TaskStatus): TaskAggregate {
  return { ...task, status: newStatus, updatedAt: Date.now() };
}
```

**2. Value Object Pattern**
```typescript
export class TaskId {
  private readonly value: string;

  private constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('TaskId cannot be empty');
    }
    this.value = value;
  }

  static create(value: string): TaskId {
    return new TaskId(value);
  }

  static generate(): TaskId {
    return new TaskId(crypto.randomUUID());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: TaskId): boolean {
    return this.value === other?.value;
  }

  toString(): string {
    return this.value;
  }
}
```

**3. Domain Event Pattern**
```typescript
export interface TaskCreatedPayload {
  readonly workspaceId: string;
  readonly taskId: string;
  readonly title: string;
  // ... other data
}

export interface TaskCreatedEvent extends DomainEvent<TaskCreatedPayload> {
  readonly type: 'TaskCreated';
}

export function createTaskCreatedEvent(
  taskId: string,
  workspaceId: string,
  // ... params
  correlationId?: string,
  causationId?: string | null
): TaskCreatedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  return {
    eventId,
    type: 'TaskCreated',
    aggregateId: taskId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload: { workspaceId, taskId, title, /* ... */ },
  };
}
```

**4. SignalStore Pattern (Application Layer)**
```typescript
export const TasksStore = signalStore(
  { providedIn: 'root' },
  
  withState(initialState),
  
  withComputed((state) => ({
    tasksByStatus: computed(() => (status: TaskStatus) =>
      state.tasks().filter((t) => t.status === status)
    ),
    taskCount: computed(() => state.tasks().length),
  })),
  
  withMethods((store) => {
    const repo = inject(TASK_REPOSITORY);
    
    return {
      loadByWorkspace: rxMethod<string>(
        pipe(
          switchMap((workspaceId) => {
            patchState(store, { isLoading: true });
            return from(repo.findByWorkspaceId(WorkspaceId.create(workspaceId))).pipe(
              tapResponse({
                next: (tasks) => patchState(store, { tasks, isLoading: false }),
                error: (err) => patchState(store, { error: err.message, isLoading: false }),
              })
            );
          })
        )
      ),
      
      addTask(task: TaskAggregate): void {
        patchState(store, { tasks: [...store.tasks(), task] });
      },
    };
  })
);
```

**5. Component Pattern (Presentation Layer)**
```typescript
@Component({
  selector: 'app-tasks',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isLoading()) {
      <div>Loading...</div>
    } @else {
      @for (task of tasks(); track task.id) {
        <div>{{ task.title }}</div>
      }
    }
  `
})
export class TasksComponent {
  private readonly tasksStore = inject(TasksStore);
  
  // Signals from store
  tasks = this.tasksStore.tasks;
  isLoading = this.tasksStore.isLoading;
}
```

### Complete Examples

**Full Task Aggregate with Subtasks Support**
```typescript
// src/app/domain/aggregates/task.aggregate.ts
export interface SubtaskEntity {
  readonly id: string;
  readonly parentTaskId: string;
  readonly title: string;
  readonly description: string;
  readonly status: TaskStatus;
  readonly priority: TaskPriority;
  readonly unitPrice: number;
  readonly quantity: number;
  readonly totalPrice: number;
  readonly progress: number; // 0-100
  readonly assigneeId: string | null;
  readonly dueDate: number | null;
  readonly createdAt: number;
  readonly updatedAt: number;
}

export interface TaskAggregate {
  readonly id: string;
  readonly workspaceId: string;
  readonly parentTaskId: string | null;
  readonly title: string;
  readonly description: string;
  readonly status: TaskStatus;
  readonly priority: TaskPriority;
  readonly unitPrice: number;
  readonly quantity: number;
  readonly totalPrice: number; // Auto-calculated: unitPrice * quantity OR sum of subtasks
  readonly progress: number; // 0-100, auto-calculated for parent tasks
  readonly assigneeIds: ReadonlyArray<string>;
  readonly responsiblePersonId: string | null;
  readonly collaboratorIds: ReadonlyArray<string>;
  readonly dueDate: number | null;
  readonly subtasks: ReadonlyArray<SubtaskEntity>;
  readonly dependsOnTaskIds: ReadonlyArray<string>;
  readonly blockedByIssueIds: ReadonlyArray<string>;
  readonly createdById: string;
  readonly createdAt: number;
  readonly updatedAt: number;
}

// Factory function to add subtask
export function addSubtask(
  task: TaskAggregate,
  subtask: SubtaskEntity
): TaskAggregate {
  // Validation: subtask total price cannot exceed parent remaining budget
  const currentSubtasksTotal = task.subtasks.reduce((sum, st) => sum + st.totalPrice, 0);
  const newTotal = currentSubtasksTotal + subtask.totalPrice;
  
  if (newTotal > task.totalPrice) {
    throw new Error('Subtask total exceeds parent task budget');
  }
  
  return {
    ...task,
    subtasks: [...task.subtasks, subtask],
    updatedAt: Date.now(),
  };
}

// Auto-calculate parent task progress from weighted subtasks
export function calculateTaskProgress(task: TaskAggregate): TaskAggregate {
  // Leaf node: manual progress
  if (task.subtasks.length === 0) {
    return task;
  }
  
  // Parent node: weighted average by totalPrice
  const totalPriceSum = task.subtasks.reduce((sum, st) => sum + st.totalPrice, 0);
  
  if (totalPriceSum === 0) {
    return { ...task, progress: 0 };
  }
  
  const weightedProgress = task.subtasks.reduce(
    (sum, st) => sum + (st.progress * st.totalPrice),
    0
  );
  
  const calculatedProgress = Math.round(weightedProgress / totalPriceSum);
  
  return {
    ...task,
    progress: calculatedProgress,
    updatedAt: Date.now(),
  };
}
```

**Event-Driven Status Flow**
```typescript
// src/app/application/handlers/task-progress-updated.handler.ts
export class TaskProgressUpdatedHandler {
  constructor(
    private eventBus: IModuleEventBus,
    private tasksStore: TasksStore
  ) {}
  
  handle(event: TaskProgressUpdatedEvent): void {
    const { taskId, progress } = event.payload;
    
    // Update task progress in store
    this.tasksStore.updateTask(taskId, { progress });
    
    // If progress reaches 100%, trigger automatic status transition
    if (progress === 100) {
      const task = this.tasksStore.tasks().find(t => t.id === taskId);
      
      if (task && task.status === TaskStatus.IN_PROGRESS) {
        // Transition to ReadyForQC and publish event
        const readyForQCEvent = createTaskReadyForQCEvent(
          taskId,
          task.workspaceId,
          event.correlationId,
          event.eventId
        );
        
        this.eventBus.publish(readyForQCEvent);
      }
    }
  }
}
```

### API and Schema Documentation

**Repository Interface Pattern**
```typescript
// src/app/domain/repositories/task.repository.interface.ts
export interface ITaskRepository {
  findById(taskId: TaskId): Promise<TaskAggregate | null>;
  findByWorkspaceId(workspaceId: WorkspaceId): Promise<TaskAggregate[]>;
  findByParentTaskId(parentTaskId: TaskId): Promise<TaskAggregate[]>;
  save(task: TaskAggregate): Promise<void>;
  delete(taskId: TaskId): Promise<void>;
}

// src/app/application/interfaces/task-repository.token.ts
import { InjectionToken } from '@angular/core';
import { ITaskRepository } from '@domain/repositories/task.repository.interface';

export const TASK_REPOSITORY = new InjectionToken<ITaskRepository>(
  'TASK_REPOSITORY'
);
```

### Configuration Examples

**Module Event Bus Integration**
```typescript
// Component subscribes to events using signal-based pattern
export class TasksComponent implements OnInit, OnDestroy {
  private readonly eventBus = inject(IModuleEventBus);
  private readonly tasksStore = inject(TasksStore);
  private eventUnsubscribers: Array<() => void> = [];
  
  ngOnInit(): void {
    // Subscribe to QCPassed event
    const unsubQCPassed = this.eventBus.on('QCPassed', (event) => {
      const taskId = event.payload.taskId;
      this.tasksStore.updateTask(taskId, { 
        status: TaskStatus.IN_ACCEPTANCE 
      });
    });
    
    // Subscribe to IssueResolved event
    const unsubIssueResolved = this.eventBus.on('IssueResolved', (event) => {
      const { taskId, issueId } = event.payload;
      // Check if all issues resolved, unblock if so
      const task = this.tasksStore.tasks().find(t => t.id === taskId);
      if (task) {
        const remainingIssues = task.blockedByIssueIds.filter(id => id !== issueId);
        if (remainingIssues.length === 0) {
          this.tasksStore.updateTask(taskId, { 
            status: TaskStatus.READY,
            blockedByIssueIds: []
          });
        }
      }
    });
    
    this.eventUnsubscribers.push(unsubQCPassed, unsubIssueResolved);
  }
  
  ngOnDestroy(): void {
    this.eventUnsubscribers.forEach(unsub => unsub());
  }
}
```

### Technical Requirements

1. **Angular 20+ Modern Patterns**
   - Use @if/@for/@switch instead of *ngIf/*ngFor/*ngSwitch
   - All @for loops MUST include track expression: `@for (item of items; track item.id)`
   - Use @defer for lazy loading: `@defer (on viewport) { <heavy-component /> }`
   - Zone-less change detection with ChangeDetectionStrategy.OnPush
   - No manual .subscribe() calls - use signals and computed

2. **State Management**
   - Use signalStore from @ngrx/signals
   - Store state as signals, derive with computed()
   - Use rxMethod for async operations
   - patchState for immutable updates
   - Consider Map<string, Task> instead of Array for O(1) lookups

3. **Event Sourcing**
   - All events must extend DomainEvent<TPayload>
   - Include eventId, aggregateId, correlationId, causationId, timestamp
   - Use past tense naming: TaskCreated, TaskUpdated, not CreateTask
   - Follow Append → Publish → React pattern
   - Handlers must not mutate aggregates directly

4. **DDD Boundaries**
   - Domain layer: Pure TypeScript, no Angular imports
   - Application layer: Use cases, stores, facades
   - Infrastructure layer: Concrete implementations (Firebase, etc.)
   - Presentation layer: Components consume stores via signals

5. **Type Safety**
   - No `any` or `as unknown`
   - Readonly properties in aggregates and value objects
   - Immutable updates: return new objects, never mutate
   - Use discriminated unions for status types

## Recommended Approach

Based on comprehensive research, the implementation should follow this approach:

### Phase 1: Domain Layer Foundation (Priority 1)

**Create Missing Value Objects**
1. `task-status.vo.ts` - Enum-based value object with validation
2. `task-priority.vo.ts` - Enum-based value object with ordering
3. `money.vo.ts` - Multi-currency support with amount and currency code
4. `progress.vo.ts` - 0-100 validation with percentage display

**Enhance Task Aggregate**
1. Add missing fields: unitPrice, quantity, totalPrice, progress
2. Add subtasks: ReadonlyArray<SubtaskEntity>
3. Add assigneeIds (multiple), responsiblePersonId, collaboratorIds
4. Add parentTaskId for hierarchy support
5. Add dependsOnTaskIds for task dependencies

**Create Missing Entities**
1. `subtask.entity.ts` - Child entity within task aggregate
2. `task-dependency.entity.ts` - Represents dependency relationships

**Create Missing Domain Events**
1. `task-ready-for-qc.event.ts` - Auto-published when progress reaches 100%
2. `task-ready-for-acceptance.event.ts` - Published after QC passes
3. `task-assignee-changed.event.ts` - Published when assignees updated
4. `task-unblocked.event.ts` - Published when all issues resolved
5. `task-completion-blocked.event.ts` - Published when completion attempted with open issues
6. `task-progress-updated.event.ts` - Published when progress changes
7. `task-blocked.event.ts` - Published when task becomes blocked

**Create Business Logic Functions**
1. `addSubtask()` - Add child task with budget validation
2. `calculateProgress()` - Weighted average for parent tasks
3. `assignTask()` - Multi-person assignment
4. `updateProgress()` - Manual progress for leaf nodes
5. `transitionToReadyForQC()` - Status transition with validation
6. `blockTaskWithIssue()` - Associate issue and update status
7. `unblockTaskIfResolved()` - Check all issues and unblock

### Phase 2: Application Layer (Priority 2)

**Enhance TasksStore**
1. Change state from Array to Map<string, TaskAggregate> for O(1) lookups
2. Add viewMode signal: 'list' | 'kanban' | 'gantt' | 'calendar'
3. Add computed for task hierarchy tree structure
4. Add computed for Gantt timeline data
5. Add computed for Kanban columns
6. Add methods for subtask operations
7. Add methods for progress updates
8. Add methods for assignment changes

**Create Missing Commands**
1. `create-task.command.ts` - With full validation
2. `update-task.command.ts` - Partial updates
3. `delete-task.command.ts` - Cascade or prevent if has subtasks
4. `update-progress.command.ts` - Manual progress for leaf tasks
5. `assign-task.command.ts` - Multi-person assignment

**Create Command Handlers**
1. `create-task.handler.ts` - Create aggregate, append event, publish
2. `update-task.handler.ts` - Update aggregate, append event, publish
3. Event handlers for QCPassed, QCFailed, AcceptanceApproved, AcceptanceRejected, IssueResolved

**Create Query Handlers**
1. `get-tasks.query.ts` - Filter, sort, pagination
2. `get-task-by-id.query.ts` - Single task with subtasks
3. `get-tasks-by-status.query.ts` - Status-based filtering
4. `get-task-hierarchy.query.ts` - Tree structure for display

### Phase 3: Infrastructure Layer (Priority 3)

**Implement Repository**
1. `task.repository.ts` - Firebase Firestore implementation
2. Support for hierarchical queries (findByParentTaskId)
3. Efficient queries with proper indexes
4. Transaction support for aggregate consistency

**Create Adapters**
1. `firebase-tasks.adapter.ts` - Firestore collection mapping
2. Handle subcollections for subtasks if needed
3. Denormalization strategy for performance

### Phase 4: Presentation Layer (Priority 4)

**Enhance Existing Components**
1. Update `tasks.component.ts` to use new store structure
2. Implement view mode switching without re-fetching data
3. Add tree view for task hierarchy

**Create Missing Components**
1. `task-list/` - Enhanced list with grouping, sorting, filtering
2. `task-kanban/` - Drag-drop Kanban board using CDK
3. `task-gantt/` - Timeline view with dependencies (CSS Grid or SVG)
4. `task-editor/` - Full task editor with subtask management
5. `task-detail/` - Task detail view with hierarchy visualization

**Create Supporting UI**
1. Progress bar component with auto/manual indicator
2. Assignee selector with multi-select
3. Subtask tree with indent visualization
4. Status transition flowchart
5. Budget allocation visualizer

### Phase 5: Event Integration (Priority 5)

**Implement Event Handlers**
1. Subscribe to QCPassed → transition to ReadyForAcceptance
2. Subscribe to QCFailed → transition to Blocked, await IssueCreated confirmation
3. Subscribe to AcceptanceApproved → transition to Completed
4. Subscribe to AcceptanceRejected → transition to Blocked
5. Subscribe to IssueResolved → check if can unblock
6. Subscribe to WorkspaceSwitched → reset store

**Publish Events**
1. TaskCreated - on task creation
2. TaskUpdated - on any task update
3. TaskProgressUpdated - on progress change, include work data for DailyModule
4. TaskReadyForQC - when progress reaches 100%
5. TaskReadyForAcceptance - after QC passes
6. TaskCompleted - when fully accepted
7. TaskAssigneeChanged - when assignments change
8. TaskUnblocked - when all issues resolved
9. TaskCompletionBlocked - when completion attempted with open issues

### Implementation Order

1. ✅ Domain layer foundation (value objects, enhanced aggregate, events)
2. ✅ Application layer stores and commands
3. ✅ Infrastructure repository implementation
4. ✅ Basic presentation components (list, editor)
5. ✅ Event integration and handlers
6. ✅ Advanced views (Kanban, Gantt)
7. ✅ Testing (unit, integration, e2e)

This approach ensures:
- **DDD compliance**: Pure domain logic, clear boundaries
- **Event-driven**: All state changes via events
- **Single source of truth**: Store manages canonical state, views are projections
- **Modern Angular**: Signals, control flow, zone-less
- **Type safety**: No any, readonly properties, immutable updates
- **Testability**: Pure functions, dependency injection, mockable interfaces

## Implementation Guidance

- **Objectives**: 
  1. Implement complete Tasks Module per specification docs/modulars/03-tasks-任務模組.md
  2. Support infinite task hierarchy with parent-child relationships
  3. Implement automated status flow with QC/Acceptance/Issues integration
  4. Provide multiple views (List, Kanban, Gantt) from single source of truth
  5. Full event-driven communication with other modules

- **Key Tasks**: 
  1. Create missing domain layer files (7 value objects, 2 entities, 7 events)
  2. Enhance TaskAggregate with subtasks, money, progress, multi-assignment
  3. Update TasksStore to use Map structure and add view projections
  4. Implement command/query handlers for all operations
  5. Build presentation components with modern Angular patterns
  6. Wire up event subscriptions and publications
  7. Create comprehensive tests

- **Dependencies**: 
  - @angular/core ~20.0.0
  - @angular/cdk ~20.0.0 (for drag-drop)
  - @angular/material ~20.0.0 (for UI components)
  - @ngrx/signals (for signalStore)
  - @ngrx/operators (for tapResponse)
  - Firebase SDK (for persistence)

- **Success Criteria**: 
  1. All 40+ files created as per specification
  2. Passes linting and type checking (no any, no errors)
  3. Unit tests for domain logic (90%+ coverage)
  4. Integration tests for event flows
  5. E2E test for complete task creation → QC → acceptance flow
  6. UI displays all views correctly with no re-fetching on view switch
  7. Task hierarchy displays correctly with proper indentation
  8. Progress auto-calculates for parent tasks
  9. Events publish and subscribe correctly across modules
  10. No workspace context violations
