<!-- markdownlint-disable-file -->

# Task Research Notes: Tasks Module Implementation (任務模組)

## Research Executed

### File Analysis

- **docs/modulars/03-tasks-任務模組.md**
  - Complete module specification with DDD architecture requirements
  - Defines 6 major functional requirements including infinite task hierarchy, status flow transitions, and automated workflows
  - Specifies 14 domain layer files, 13 application layer files, 3 infrastructure layer files, and 6 presentation layer files
  - Requires strict adherence to Angular 20+ patterns: @if/@for/@switch, signalStore, zone-less change detection
  - Module positioned as Workspace capability module following Domain → Application → Infrastructure → Presentation layers

- **src/app/domain/aggregates/task.aggregate.ts** (EXISTING)
  - Basic TaskAggregate interface with 11 readonly fields
  - TaskStatus enum: DRAFT, READY, IN_PROGRESS, IN_QC, QC_FAILED, IN_ACCEPTANCE, ACCEPTED, REJECTED, COMPLETED, BLOCKED
  - TaskPriority enum: LOW, MEDIUM, HIGH, CRITICAL
  - Factory functions: createTask(), updateTaskStatus(), blockTask(), unblockTask(), restoreTask()
  - **MISSING**: subtasks, parentTaskId, unitPrice, quantity, totalPrice, progress, multi-assignee support, dependency tracking

- **src/app/application/stores/tasks.store.ts** (EXISTING)
  - SignalStore implementation with Array<TaskAggregate> state
  - Computed signals: tasksByStatus, blockedTasks, readyTasks, tasksInQC, taskCount
  - Methods: loadByWorkspace (rxMethod), addTask, updateTask, deleteTask, reset
  - **MISSING**: Map-based storage for O(1) lookups, viewMode signal, hierarchy computeds, progress tracking

- **src/app/presentation/pages/modules/tasks/tasks.component.ts** (EXISTING)
  - Basic component with create form and task list display
  - ViewMode signal with 'list' and 'kanban' options
  - Uses TasksFacade for operations
  - **MISSING**: tree view, gantt chart, drag-drop, subtask management UI

- **.github/instructions/03-modules-guidelines.instructions.md**
  - Workspace is context provider only, never modifies module state
  - Modules are autonomous capability executors
  - All inter-module communication via events only
  - No circular dependencies, no direct module-to-module calls

- **.github/instructions/04-event-sourcing-and-causality.instructions.md**
  - Pure reactive flow: Producer → EventBus → EventStore (side) → Consumer
  - Required event metadata: eventId, type, aggregateId, correlationId, causationId, timestamp, payload
  - Causality tracking: correlationId (first event), causationId (direct parent)
  - Event lifecycle: New → Published → Consumed → Completed/Failed

- **.github/instructions/ng-angular-20-control-flow.instructions.md**
  - @if/@else replaces *ngIf
  - @for (item of items; track item.id) replaces *ngFor - track is MANDATORY
  - @switch/@case replaces *ngSwitch
  - @defer (on viewport) for lazy loading

### Code Search Results

- **Existing Domain Events**
  - task-created.event.ts: TaskCreatedEvent with payload (workspaceId, taskId, title, description, priority, createdById)
  - task-updated.event.ts: TaskUpdatedEvent for general updates
  - task-deleted.event.ts: TaskDeletedEvent
  - task-completed.event.ts: TaskCompletedEvent
  - task-submitted-for-qc.event.ts: TaskSubmittedForQCEvent
  - **MISSING**: TaskReadyForQC, TaskReadyForAcceptance, TaskProgressUpdated, TaskAssigneeChanged, TaskUnblocked, TaskCompletionBlocked, TaskBlocked

- **Existing Value Objects Pattern**
  - All follow same structure: private constructor, static create/generate, getValue, equals, toString
  - Existing: TaskId, WorkspaceId, UserId, MemberId, OrganizationId, etc. (17 total)
  - **MISSING per spec**: TaskStatus.vo, TaskPriority.vo, Money.vo, Progress.vo

- **Repository Pattern**
  - Interface in domain/repositories, implementation in infrastructure/repositories
  - Injection token in application/interfaces
  - All async operations return Promise (no RxJS Observables)
  - TASK_REPOSITORY token exists in src/app/application/interfaces/task-repository.token.ts

### External Research

- **#githubRepo:"angular/angular" control-flow**
  - Angular 20 built-in control flow syntax is production-ready
  - @for requires track expression - no default track by index
  - @defer supports triggers: on viewport, on interaction, on timer, on idle
  - All structural directives (*ngIf, *ngFor) should be migrated

- **#githubRepo:"ngrx/platform" signals**
  - @ngrx/signals v18+ provides signalStore factory
  - withState for initial state definition
  - withComputed for derived values (uses Angular's computed)
  - withMethods for state mutations and async operations
  - rxMethod for reactive async operations with tapResponse
  - patchState for immutable updates

- **#fetch:https://material.angular.io/cdk/drag-drop/overview**
  - CDK Drag & Drop provides cdkDrag and cdkDropList directives
  - Works with arrays and custom data structures
  - Supports nested drag-drop for tree structures
  - Events: cdkDragStarted, cdkDragMoved, cdkDragEnded, cdkDropListDropped

### Project Conventions

- **Standards referenced**:
  - Strict DDD Architecture (.github/instructions/strict-ddd-*.instructions.md)
  - Event Sourcing & Causality (.github/instructions/04-event-sourcing-and-causality.instructions.md)
  - Workspace Guidelines (.github/instructions/02-workspace-guidelines.instructions.md)
  - Angular 20 Control Flow (.github/instructions/ng-angular-20-control-flow.instructions.md)

- **Instructions followed**:
  - Zone-less change detection: ChangeDetectionStrategy.OnPush
  - No manual .subscribe() in components
  - Pure signal-based reactivity
  - Event-driven module boundaries

## Key Discoveries

### Project Structure

The project follows strict DDD layered architecture with clear separation of concerns:

```
src/app/
├── domain/              # Pure TypeScript, zero framework dependencies
│   ├── aggregates/      # Aggregate roots (entities with business logic)
│   ├── entities/        # Child entities within aggregates
│   ├── value-objects/   # Immutable values with equality by value
│   ├── events/          # Domain events (past tense, e.g., TaskCreated)
│   ├── policies/        # Business rules and validation policies
│   ├── repositories/    # Repository interfaces (abstract)
│   ├── services/        # Domain services (stateless logic)
│   ├── factories/       # Complex object creation
│   └── types/           # Shared domain types
├── application/         # Use cases, orchestration, application state
│   ├── stores/          # NgRx signalStore implementations
│   ├── facades/         # Application facades (coordinate use cases)
│   ├── interfaces/      # Repository tokens, service interfaces
│   ├── commands/        # Command DTOs
│   ├── queries/         # Query DTOs
│   └── handlers/        # Command/event handlers
├── infrastructure/      # External adapters, concrete implementations
│   ├── repositories/    # Repository implementations (Firebase, etc.)
│   ├── adapters/        # External service adapters
│   ├── services/        # Infrastructure services
│   └── config/          # Configuration management
└── presentation/        # Angular components, UI logic
    ├── pages/           # Page-level routable components
    ├── components/      # Reusable UI components
    └── shared/          # Shared presentation utilities
```

### Implementation Patterns

**1. Aggregate Root Pattern (Domain Layer)**

```typescript
// Pure TypeScript interfaces + factory functions (NO CLASSES)
export interface TaskAggregate {
  readonly id: string;
  readonly workspaceId: string;
  readonly parentTaskId: string | null;  // For hierarchy
  readonly title: string;
  readonly description: string;
  readonly status: TaskStatus;
  readonly priority: TaskPriority;
  readonly unitPrice: number;
  readonly quantity: number;
  readonly totalPrice: number;  // unitPrice × quantity OR sum of subtasks
  readonly progress: number;    // 0-100, auto-calc for parents
  readonly assigneeIds: ReadonlyArray<string>;  // Multi-assignment
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

// Factory function for creation
export function createTask(params: CreateTaskParams): TaskAggregate {
  const now = Date.now();
  const totalPrice = params.unitPrice * params.quantity;
  
  return {
    id: params.id ?? crypto.randomUUID(),
    workspaceId: params.workspaceId,
    parentTaskId: null,
    title: params.title,
    description: params.description,
    status: TaskStatus.DRAFT,
    priority: params.priority ?? TaskPriority.MEDIUM,
    unitPrice: params.unitPrice ?? 0,
    quantity: params.quantity ?? 1,
    totalPrice,
    progress: 0,
    assigneeIds: params.assigneeIds ?? [],
    responsiblePersonId: params.responsiblePersonId ?? null,
    collaboratorIds: [],
    dueDate: params.dueDate ?? null,
    subtasks: [],
    dependsOnTaskIds: [],
    blockedByIssueIds: [],
    createdById: params.createdById,
    createdAt: now,
    updatedAt: now,
  };
}

// Business logic: Add subtask with budget validation
export function addSubtask(
  task: TaskAggregate,
  subtask: SubtaskEntity
): TaskAggregate {
  const currentSubtasksTotal = task.subtasks.reduce(
    (sum, st) => sum + st.totalPrice,
    0
  );
  const newTotal = currentSubtasksTotal + subtask.totalPrice;
  
  if (newTotal > task.totalPrice) {
    throw new Error(
      `Subtask total (${newTotal}) exceeds parent budget (${task.totalPrice})`
    );
  }
  
  return {
    ...task,
    subtasks: [...task.subtasks, subtask],
    updatedAt: Date.now(),
  };
}

// Business logic: Calculate weighted average progress for parent tasks
export function calculateTaskProgress(task: TaskAggregate): TaskAggregate {
  // Leaf node: progress is manually set
  if (task.subtasks.length === 0) {
    return task;
  }
  
  // Parent node: weighted average by totalPrice
  const totalPriceSum = task.subtasks.reduce(
    (sum, st) => sum + st.totalPrice,
    0
  );
  
  if (totalPriceSum === 0) {
    return { ...task, progress: 0, updatedAt: Date.now() };
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

// Business logic: Auto-transition to ReadyForQC when progress hits 100%
export function checkReadyForQC(task: TaskAggregate): { 
  task: TaskAggregate; 
  shouldTransition: boolean;
} {
  const shouldTransition = 
    task.progress === 100 && 
    task.status === TaskStatus.IN_PROGRESS;
  
  if (shouldTransition) {
    return {
      task: { ...task, status: TaskStatus.IN_QC, updatedAt: Date.now() },
      shouldTransition: true,
    };
  }
  
  return { task, shouldTransition: false };
}
```

**2. Value Object Pattern**

```typescript
// src/app/domain/value-objects/progress.vo.ts
export class Progress {
  private readonly value: number;

  private constructor(value: number) {
    if (value < 0 || value > 100) {
      throw new Error('Progress must be between 0 and 100');
    }
    if (!Number.isInteger(value)) {
      throw new Error('Progress must be an integer');
    }
    this.value = value;
  }

  static create(value: number): Progress {
    return new Progress(value);
  }

  static zero(): Progress {
    return new Progress(0);
  }

  static complete(): Progress {
    return new Progress(100);
  }

  getValue(): number {
    return this.value;
  }

  isComplete(): boolean {
    return this.value === 100;
  }

  toPercentageString(): string {
    return `${this.value}%`;
  }

  equals(other: Progress): boolean {
    return this.value === other?.value;
  }

  toString(): string {
    return this.value.toString();
  }
}
```

**3. Domain Event Pattern with Causality**

```typescript
// src/app/domain/events/task-ready-for-qc.event.ts
export interface TaskReadyForQCPayload {
  readonly workspaceId: string;
  readonly taskId: string;
  readonly title: string;
  readonly completedById: string;
  readonly completedAt: number;
}

export interface TaskReadyForQCEvent extends DomainEvent<TaskReadyForQCPayload> {
  readonly type: 'TaskReadyForQC';
}

export function createTaskReadyForQCEvent(
  taskId: string,
  workspaceId: string,
  title: string,
  completedById: string,
  correlationId?: string,
  causationId?: string | null
): TaskReadyForQCEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  const timestamp = Date.now();
  
  return {
    eventId,
    type: 'TaskReadyForQC',
    aggregateId: taskId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp,
    payload: {
      workspaceId,
      taskId,
      title,
      completedById,
      completedAt: timestamp,
    },
  };
}
```

**4. SignalStore Pattern (Application Layer)**

```typescript
// src/app/application/stores/tasks.store.ts (ENHANCED VERSION)
export interface TasksState {
  readonly tasksMap: ReadonlyMap<string, TaskAggregate>;  // O(1) lookup
  readonly viewMode: 'list' | 'kanban' | 'gantt' | 'calendar';
  readonly isLoading: boolean;
  readonly error: string | null;
}

const initialState: TasksState = {
  tasksMap: new Map(),
  viewMode: 'list',
  isLoading: false,
  error: null,
};

export const TasksStore = signalStore(
  { providedIn: 'root' },
  
  withState(initialState),
  
  withComputed((state) => ({
    // Convert map to array for display
    tasks: computed(() => Array.from(state.tasksMap().values())),
    
    // Filter by status
    tasksByStatus: computed(() => (status: TaskStatus) =>
      Array.from(state.tasksMap().values()).filter((t) => t.status === status)
    ),
    
    // Build task hierarchy tree
    taskHierarchy: computed(() => {
      const allTasks = Array.from(state.tasksMap().values());
      const rootTasks = allTasks.filter((t) => t.parentTaskId === null);
      
      function buildTree(parentId: string | null): TaskAggregate[] {
        return allTasks
          .filter((t) => t.parentTaskId === parentId)
          .map((task) => ({
            ...task,
            subtasks: buildTree(task.id),
          }));
      }
      
      return rootTasks.map((task) => ({
        ...task,
        subtasks: buildTree(task.id),
      }));
    }),
    
    // Kanban columns data
    kanbanColumns: computed(() => {
      const tasks = Array.from(state.tasksMap().values());
      return {
        draft: tasks.filter((t) => t.status === TaskStatus.DRAFT),
        ready: tasks.filter((t) => t.status === TaskStatus.READY),
        inProgress: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS),
        inQC: tasks.filter((t) => t.status === TaskStatus.IN_QC),
        inAcceptance: tasks.filter((t) => t.status === TaskStatus.IN_ACCEPTANCE),
        completed: tasks.filter((t) => t.status === TaskStatus.COMPLETED),
        blocked: tasks.filter((t) => t.status === TaskStatus.BLOCKED),
      };
    }),
    
    // Gantt timeline data (tasks with date ranges)
    ganttData: computed(() => {
      const tasks = Array.from(state.tasksMap().values());
      return tasks
        .filter((t) => t.dueDate !== null)
        .map((t) => ({
          id: t.id,
          title: t.title,
          startDate: t.createdAt,
          endDate: t.dueDate!,
          progress: t.progress,
          dependencies: t.dependsOnTaskIds,
        }));
    }),
  })),
  
  withMethods((store) => {
    const repo = inject(TASK_REPOSITORY);
    
    return {
      // Load tasks (Query)
      loadByWorkspace: rxMethod<string>(
        pipe(
          switchMap((workspaceId) => {
            patchState(store, { isLoading: true, error: null });
            return from(repo.findByWorkspaceId(WorkspaceId.create(workspaceId))).pipe(
              tapResponse({
                next: (tasks) => {
                  const tasksMap = new Map(tasks.map((t) => [t.id, t]));
                  patchState(store, { tasksMap, isLoading: false, error: null });
                },
                error: (err: any) =>
                  patchState(store, { error: err.message, isLoading: false }),
              })
            );
          })
        )
      ),
      
      // Set view mode (NO data refetch)
      setViewMode(mode: 'list' | 'kanban' | 'gantt' | 'calendar'): void {
        patchState(store, { viewMode: mode });
      },
      
      // Add task (Reactive update from event)
      addTask(task: TaskAggregate): void {
        const newMap = new Map(store.tasksMap());
        newMap.set(task.id, task);
        patchState(store, { tasksMap: newMap, error: null });
      },
      
      // Update task (Reactive update from event)
      updateTask(taskId: string, updates: Partial<TaskAggregate>): void {
        const task = store.tasksMap().get(taskId);
        if (!task) return;
        
        const updatedTask = { ...task, ...updates, updatedAt: Date.now() };
        const newMap = new Map(store.tasksMap());
        newMap.set(taskId, updatedTask);
        patchState(store, { tasksMap: newMap, error: null });
      },
      
      // Delete task (Reactive update from event)
      deleteTask(taskId: string): void {
        const newMap = new Map(store.tasksMap());
        newMap.delete(taskId);
        patchState(store, { tasksMap: newMap, error: null });
      },
      
      // Reset on workspace switch
      reset(): void {
        patchState(store, initialState);
      },
    };
  })
);
```

### Complete Examples

**Event-Driven Status Flow Handler**

```typescript
// src/app/application/handlers/qc-passed-event.handler.ts
import { inject, Injectable } from '@angular/core';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import { TasksStore } from '@application/stores/tasks.store';
import { QCPassedEvent } from '@domain/events/qc-passed.event';
import { createTaskReadyForAcceptanceEvent } from '@domain/events/task-ready-for-acceptance.event';
import { TaskStatus } from '@domain/aggregates/task.aggregate';

@Injectable({ providedIn: 'root' })
export class QCPassedEventHandler {
  private readonly tasksStore = inject(TasksStore);
  private readonly eventBus = inject(IModuleEventBus);
  
  handle(event: QCPassedEvent): void {
    const { taskId } = event.payload;
    const tasks = Array.from(this.tasksStore.tasksMap().values());
    const task = tasks.find((t) => t.id === taskId);
    
    if (!task) {
      console.warn(`QCPassedEvent: Task ${taskId} not found`);
      return;
    }
    
    // Transition to ReadyForAcceptance
    this.tasksStore.updateTask(taskId, { 
      status: TaskStatus.IN_ACCEPTANCE 
    });
    
    // Publish TaskReadyForAcceptance event (causal chain)
    const readyForAcceptanceEvent = createTaskReadyForAcceptanceEvent(
      taskId,
      task.workspaceId,
      task.title,
      event.correlationId,
      event.eventId  // This event caused the new event
    );
    
    this.eventBus.publish(readyForAcceptanceEvent);
  }
}
```

**Component with Event Subscriptions**

```typescript
// src/app/presentation/pages/modules/tasks/tasks.component.ts (ENHANCED)
import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';
import { TasksStore } from '@application/stores/tasks.store';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import { TaskAggregate, TaskStatus } from '@domain/aggregates/task.aggregate';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tasks-module">
      <h2>📋 Tasks Module</h2>
      
      <!-- View Mode Selector -->
      <div class="view-selector">
        <button 
          (click)="store.setViewMode('list')"
          [class.active]="store.viewMode() === 'list'">
          List
        </button>
        <button 
          (click)="store.setViewMode('kanban')"
          [class.active]="store.viewMode() === 'kanban'">
          Kanban
        </button>
        <button 
          (click)="store.setViewMode('gantt')"
          [class.active]="store.viewMode() === 'gantt'">
          Gantt
        </button>
      </div>
      
      <!-- Conditional View Rendering (NO re-fetch on switch) -->
      @if (store.viewMode() === 'list') {
        <app-task-list [tasks]="store.tasks()" />
      } @else if (store.viewMode() === 'kanban') {
        <app-task-kanban [columns]="store.kanbanColumns()" />
      } @else if (store.viewMode() === 'gantt') {
        <app-task-gantt [data]="store.ganttData()" />
      }
    </div>
  `,
})
export class TasksComponent implements OnInit, OnDestroy {
  protected readonly store = inject(TasksStore);
  private readonly eventBus = inject(IModuleEventBus);
  private eventUnsubscribers: Array<() => void> = [];
  
  ngOnInit(): void {
    // Subscribe to QCPassed event
    const unsubQCPassed = this.eventBus.on('QCPassed', (event) => {
      const { taskId } = event.payload;
      this.store.updateTask(taskId, { status: TaskStatus.IN_ACCEPTANCE });
    });
    
    // Subscribe to QCFailed event
    const unsubQCFailed = this.eventBus.on('QCFailed', (event) => {
      const { taskId } = event.payload;
      this.store.updateTask(taskId, { status: TaskStatus.BLOCKED });
    });
    
    // Subscribe to IssueResolved event (check unblock)
    const unsubIssueResolved = this.eventBus.on('IssueResolved', (event) => {
      const { taskId, issueId } = event.payload;
      const tasks = Array.from(this.store.tasksMap().values());
      const task = tasks.find((t) => t.id === taskId);
      
      if (task) {
        const remainingIssues = task.blockedByIssueIds.filter(
          (id) => id !== issueId
        );
        
        if (remainingIssues.length === 0) {
          // All issues resolved, unblock
          this.store.updateTask(taskId, { 
            status: TaskStatus.READY,
            blockedByIssueIds: [],
          });
        } else {
          // Still blocked by other issues
          this.store.updateTask(taskId, { 
            blockedByIssueIds: remainingIssues,
          });
        }
      }
    });
    
    // Subscribe to WorkspaceSwitched event
    const unsubWorkspaceSwitched = this.eventBus.on('WorkspaceSwitched', () => {
      this.store.reset();
    });
    
    this.eventUnsubscribers.push(
      unsubQCPassed,
      unsubQCFailed,
      unsubIssueResolved,
      unsubWorkspaceSwitched
    );
  }
  
  ngOnDestroy(): void {
    // Clean up event subscriptions
    this.eventUnsubscribers.forEach((unsub) => unsub());
  }
}
```

### API and Schema Documentation

**Repository Interface (Domain Layer)**

```typescript
// src/app/domain/repositories/task.repository.interface.ts
import { TaskId } from '@domain/value-objects/task-id.vo';
import { WorkspaceId } from '@domain/value-objects/workspace-id.vo';
import { TaskAggregate } from '@domain/aggregates/task.aggregate';

export interface ITaskRepository {
  /**
   * Find task by ID
   */
  findById(taskId: TaskId): Promise<TaskAggregate | null>;
  
  /**
   * Find all tasks in workspace
   */
  findByWorkspaceId(workspaceId: WorkspaceId): Promise<TaskAggregate[]>;
  
  /**
   * Find subtasks by parent task ID
   */
  findByParentTaskId(parentTaskId: TaskId): Promise<TaskAggregate[]>;
  
  /**
   * Find tasks by assignee
   */
  findByAssigneeId(assigneeId: string, workspaceId: WorkspaceId): Promise<TaskAggregate[]>;
  
  /**
   * Find tasks by status
   */
  findByStatus(status: TaskStatus, workspaceId: WorkspaceId): Promise<TaskAggregate[]>;
  
  /**
   * Save task (create or update)
   */
  save(task: TaskAggregate): Promise<void>;
  
  /**
   * Delete task
   */
  delete(taskId: TaskId): Promise<void>;
}
```

**Repository Token (Application Layer)**

```typescript
// src/app/application/interfaces/task-repository.token.ts
import { InjectionToken } from '@angular/core';
import { ITaskRepository } from '@domain/repositories/task.repository.interface';

export const TASK_REPOSITORY = new InjectionToken<ITaskRepository>(
  'TASK_REPOSITORY',
  {
    providedIn: 'root',
    factory: () => {
      throw new Error(
        'TASK_REPOSITORY must be provided in application config'
      );
    },
  }
);
```

### Configuration Examples

**Module Event Bus Subscription Pattern**

```typescript
// Clean subscription management pattern
export class SomeComponent implements OnInit, OnDestroy {
  private readonly eventBus = inject(IModuleEventBus);
  private eventUnsubscribers: Array<() => void> = [];
  
  ngOnInit(): void {
    // Subscribe to multiple events
    const unsubs = [
      this.eventBus.on('TaskCreated', (e) => this.handleTaskCreated(e)),
      this.eventBus.on('TaskUpdated', (e) => this.handleTaskUpdated(e)),
      this.eventBus.on('WorkspaceSwitched', () => this.handleWorkspaceSwitch()),
    ];
    
    this.eventUnsubscribers.push(...unsubs);
  }
  
  ngOnDestroy(): void {
    this.eventUnsubscribers.forEach((unsub) => unsub());
  }
  
  private handleTaskCreated(event: TaskCreatedEvent): void {
    // React to event
  }
}
```

**Drag & Drop Configuration (CDK)**

```typescript
// Using Angular CDK for Kanban drag-drop
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  template: `
    <div class="kanban-board">
      @for (column of columns(); track column.status) {
        <div 
          class="kanban-column"
          cdkDropList
          [cdkDropListData]="column.tasks"
          (cdkDropListDropped)="onDrop($event, column.status)">
          
          <h3>{{ column.label }}</h3>
          
          @for (task of column.tasks; track task.id) {
            <div class="task-card" cdkDrag>
              {{ task.title }}
            </div>
          }
        </div>
      }
    </div>
  `
})
export class TaskKanbanComponent {
  onDrop(event: CdkDragDrop<TaskAggregate[]>, newStatus: TaskStatus): void {
    if (event.previousContainer === event.container) {
      // Reorder within same column
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Move to different column
      const task = event.previousContainer.data[event.previousIndex];
      
      // Update task status (triggers store update)
      this.tasksStore.updateTask(task.id, { status: newStatus });
      
      // Transfer item visually
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
```

### Technical Requirements

**1. Angular 20+ Control Flow**
- Use @if/@else instead of *ngIf
- Use @for (item of items; track item.id) instead of *ngFor - track is MANDATORY
- Use @switch/@case instead of *ngSwitch
- Use @defer (on viewport) for lazy loading heavy components

**2. State Management**
- Use signalStore from @ngrx/signals for all state
- Store canonical state as Map<string, T> for O(1) lookups
- Use computed() for all derived state
- Use rxMethod() for async operations
- patchState() for immutable updates
- NO BehaviorSubject, NO manual subscribe()

**3. Event Sourcing**
- All events extend DomainEvent<TPayload>
- Required fields: eventId, type, aggregateId, correlationId, causationId, timestamp, payload
- Use past tense: TaskCreated, not CreateTask
- Follow Append → Publish → React pattern
- Causality: correlationId (first event), causationId (direct parent)

**4. DDD Boundaries**
- Domain: Pure TypeScript, no Angular/RxJS imports
- Application: Use cases, stores, facades, commands, queries
- Infrastructure: Repository implementations, adapters
- Presentation: Components consume stores via signals only

**5. Type Safety**
- NO `any` or `as unknown`
- All aggregate fields are `readonly`
- Immutable updates: return new objects
- Use discriminated unions for enums

**6. Performance**
- ChangeDetectionStrategy.OnPush on all components
- Zone-less compatible (no manual change detection)
- @defer for heavy views
- Map-based storage for large datasets

## Recommended Approach

### Implementation Phases

**Phase 1: Domain Layer Foundation (Critical Path)**

1. **Create Missing Value Objects** (4 files)
   - `value-objects/task-status.vo.ts` - Encapsulate TaskStatus enum with validation
   - `value-objects/task-priority.vo.ts` - Encapsulate TaskPriority with ordering logic
   - `value-objects/money.vo.ts` - Amount + currency code with arithmetic
   - `value-objects/progress.vo.ts` - 0-100 validation with percentage formatting

2. **Enhance Task Aggregate** (modify existing)
   - Add fields: parentTaskId, unitPrice, quantity, totalPrice, progress
   - Add fields: assigneeIds[], responsiblePersonId, collaboratorIds[]
   - Add fields: subtasks[], dependsOnTaskIds[]
   - Add business logic functions:
     - `addSubtask()` - Budget validation
     - `removeSubtask()` - Cascade effects
     - `calculateProgress()` - Weighted average for parents
     - `updateProgress()` - Manual for leaf nodes
     - `assignMultiple()` - Multi-person assignment
     - `checkReadyForQC()` - Auto-transition logic
     - `blockWithIssue()` - Add issue and update status
     - `unblockIfResolved()` - Check all issues resolved

3. **Create Child Entities** (2 files)
   - `entities/subtask.entity.ts` - Full task entity nested within parent
   - `entities/task-dependency.entity.ts` - taskId, dependsOnTaskId, dependencyType

4. **Create Missing Domain Events** (7 files)
   - `events/task-ready-for-qc.event.ts` - Auto-published at 100% progress
   - `events/task-ready-for-acceptance.event.ts` - After QC passes
   - `events/task-progress-updated.event.ts` - For DailyModule integration
   - `events/task-assignee-changed.event.ts` - When assignments change
   - `events/task-unblocked.event.ts` - When all issues resolved
   - `events/task-completion-blocked.event.ts` - When completion attempted with open issues
   - `events/task-blocked.event.ts` - When task becomes blocked

5. **Update Repository Interface** (modify existing)
   - Add: `findByParentTaskId()`
   - Add: `findByAssigneeId()`
   - Add: `findByStatus()`

**Phase 2: Application Layer (Orchestration)**

1. **Enhance TasksStore** (modify existing)
   - Change state from Array to Map<string, TaskAggregate>
   - Add viewMode signal: 'list' | 'kanban' | 'gantt' | 'calendar'
   - Add computed: taskHierarchy (tree structure)
   - Add computed: kanbanColumns (by status)
   - Add computed: ganttData (timeline data)
   - Add method: setViewMode() - NO data refetch
   - Add method: updateTaskProgress()
   - Add method: addSubtask()
   - Add method: assignTask()

2. **Create Command DTOs** (5 files)
   - `commands/create-task.command.ts`
   - `commands/update-task.command.ts`
   - `commands/delete-task.command.ts`
   - `commands/update-progress.command.ts`
   - `commands/assign-task.command.ts`

3. **Create Command Handlers** (5 files)
   - `handlers/create-task.handler.ts` - Create aggregate, save, publish event
   - `handlers/update-task.handler.ts` - Update aggregate, save, publish event
   - `handlers/delete-task.handler.ts` - Delete or cascade check
   - `handlers/update-progress.handler.ts` - Update, check QC readiness, publish
   - `handlers/assign-task.handler.ts` - Update assignees, publish event

4. **Create Event Handlers** (4 files)
   - `handlers/qc-passed-event.handler.ts` - Transition to ReadyForAcceptance
   - `handlers/qc-failed-event.handler.ts` - Transition to Blocked
   - `handlers/acceptance-approved-event.handler.ts` - Transition to Completed
   - `handlers/issue-resolved-event.handler.ts` - Check unblock

5. **Create Query DTOs** (4 files)
   - `queries/get-tasks.query.ts` - Filter, sort, pagination
   - `queries/get-task-by-id.query.ts` - Single task with subtasks
   - `queries/get-tasks-by-status.query.ts`
   - `queries/get-task-hierarchy.query.ts` - Tree structure

**Phase 3: Infrastructure Layer (External Integration)**

1. **Implement Repository** (1 file)
   - `repositories/task.repository.ts` - Firestore implementation
   - Support hierarchical queries
   - Proper Firestore indexes
   - Transaction support

2. **Create/Update Adapters** (1 file)
   - `adapters/firebase-tasks.adapter.ts` - Firestore mapping
   - Handle subcollections if needed
   - Denormalization strategy

**Phase 4: Presentation Layer (UI Components)**

1. **Enhance Existing Component** (modify)
   - `pages/modules/tasks/tasks.component.ts`
   - Use new store structure
   - Implement view switching
   - Add event subscriptions

2. **Create View Components** (5 files)
   - `components/task-list/task-list.component.ts` - Enhanced list with filters
   - `components/task-kanban/task-kanban.component.ts` - Drag-drop board (CDK)
   - `components/task-gantt/task-gantt.component.ts` - Timeline (CSS Grid/SVG)
   - `components/task-editor/task-editor.component.ts` - Full editor with subtasks
   - `components/task-detail/task-detail.component.ts` - Detail view with hierarchy

3. **Create Supporting Components** (5 files)
   - `components/task-tree/task-tree.component.ts` - Hierarchical tree view
   - `components/progress-bar/progress-bar.component.ts` - Auto/manual indicator
   - `components/assignee-selector/assignee-selector.component.ts` - Multi-select
   - `components/subtask-list/subtask-list.component.ts` - Nested subtasks
   - `components/task-status-badge/task-status-badge.component.ts` - Visual status

**Phase 5: Event Integration (Cross-Module)**

1. **Subscribe to External Events**
   - QCPassed → Transition to ReadyForAcceptance
   - QCFailed → Transition to Blocked
   - AcceptanceApproved → Transition to Completed
   - AcceptanceRejected → Transition to Blocked
   - IssueResolved → Check unblock
   - WorkspaceSwitched → Reset store

2. **Publish Domain Events**
   - TaskCreated, TaskUpdated, TaskDeleted
   - TaskProgressUpdated (with work data for DailyModule)
   - TaskReadyForQC (auto when progress = 100%)
   - TaskReadyForAcceptance (after QC passes)
   - TaskCompleted (when accepted)
   - TaskAssigneeChanged (when assignments change)
   - TaskUnblocked (when all issues resolved)
   - TaskCompletionBlocked (when completion attempted with open issues)

**Phase 6: Testing (Quality Assurance)**

1. **Unit Tests**
   - Domain logic: All aggregate functions (90%+ coverage)
   - Value objects: Validation and equality
   - Computed signals: Correct derivation

2. **Integration Tests**
   - Event flows: TaskProgressUpdated → TaskReadyForQC → QCPassed → TaskReadyForAcceptance
   - Repository: CRUD operations
   - Store: State updates from events

3. **E2E Tests**
   - Complete flow: Create → Assign → Progress → QC → Accept → Complete
   - Blocked flow: QC Fail → Issue → Resolve → Unblock
   - View switching: No data refetch

## Implementation Guidance

### Objectives
1. Implement complete Tasks Module per docs/modulars/03-tasks-任務模組.md specification
2. Support infinite task hierarchy with parent-child relationships and budget constraints
3. Implement automated status flow with QC/Acceptance/Issues integration via events
4. Provide multiple views (List, Kanban, Gantt, Calendar) from single source of truth
5. Full event-driven communication with other modules (no direct dependencies)
6. Maintain strict DDD boundaries: Domain → Application → Infrastructure → Presentation

### Key Tasks
1. Create 7 missing value objects (TaskStatus, TaskPriority, Money, Progress)
2. Enhance TaskAggregate with 12 new fields (subtasks, hierarchy, money, progress, multi-assignment)
3. Implement 10+ business logic functions (addSubtask, calculateProgress, etc.)
4. Create 7 missing domain events (TaskReadyForQC, TaskProgressUpdated, etc.)
5. Refactor TasksStore to Map-based storage with 5 new computed signals
6. Implement 5 command handlers and 4 event handlers
7. Build 10 presentation components (Kanban, Gantt, Tree, Editor, etc.)
8. Wire up 8 event subscriptions and 9 event publications
9. Write comprehensive tests (unit, integration, e2e)

### Dependencies
- @angular/core ~20.0.0
- @angular/cdk ~20.0.0 (Drag & Drop)
- @angular/material ~20.0.0 (UI components)
- @ngrx/signals (signalStore, withComputed, withMethods, rxMethod)
- @ngrx/operators (tapResponse)
- Firebase SDK (Firestore for persistence)

### Success Criteria
1. ✅ All 40+ files created as specified in docs/modulars/03-tasks-任務模組.md
2. ✅ Passes TypeScript compilation with strict mode (no any, no errors)
3. ✅ Passes project linting (ESLint, Prettier)
4. ✅ Unit tests for domain logic (90%+ coverage)
5. ✅ Integration tests for event flows (TaskProgressUpdated → QC → Acceptance)
6. ✅ E2E test for complete task lifecycle
7. ✅ UI displays all 4 views (List, Kanban, Gantt, Calendar) without re-fetching
8. ✅ Task hierarchy displays correctly with proper indentation and budget validation
9. ✅ Parent task progress auto-calculates from weighted subtask average
10. ✅ Events publish and subscribe correctly across modules
11. ✅ No workspace context violations (module is autonomous)
12. ✅ All components use @if/@for/@switch (no *ngIf/*ngFor)
13. ✅ All @for loops have track expressions
14. ✅ All components use ChangeDetectionStrategy.OnPush
15. ✅ No manual .subscribe() calls in components
