<!-- markdownlint-disable-file -->

# Task Research Notes: Tasks Module Architecture

## Research Executed

### File Analysis

- `docs/modulars/03-tasks-任務模組.md`
  - Complete specification for Tasks Module v2.0
  - Defines 5 core functional requirements with detailed need lists
  - Specifies DDD implementation patterns (Aggregate Root, Factory, Policy, Specification)
  - Documents event bus integration with publish/subscribe events
  - Details UI/UX requirements using Angular Material M3 and Tailwind CSS
  - Provides cross-module integration using Context Providers

- `src/app/domain/aggregates/task.aggregate.ts`
  - Existing TaskAggregate interface with basic properties
  - Current implementation missing: unitPrice, quantity, totalPrice, progress, subtasks
  - Status enum defined but missing some required states (ReadyForQC, ReadyForAcceptance, Accepted)
  - Pure functional approach with helper functions (createTask, updateTaskStatus, blockTask, unblockTask)

- `src/app/application/stores/tasks.store.ts`
  - Signal-based store using NgRx signalStore
  - Repository-backed architecture already implemented
  - Computed signals for filtering by status
  - Missing: viewMode signal, computed views for Gantt/Kanban/Calendar

- `src/app/application/facades/tasks.facade.ts`
  - Current facade pattern already in use
  - Handles event bus subscription and initialization
  - Delegates to command handlers (CreateTaskHandler, SubmitTaskForQCHandler, etc.)

### Code Search Results

- Task-related files found:
  - Domain Events: task-created.event.ts, task-updated.event.ts, task-deleted.event.ts, task-completed.event.ts, task-submitted-for-qc.event.ts
  - Application Handlers: create-task.handler.ts, submit-task-for-qc.handler.ts, approve-task.handler.ts, reject-task.handler.ts, complete-task.command.ts
  - Infrastructure: task.repository.impl.ts
  - Presentation: tasks.component.ts (in modules/tasks)
  - Domain: task.policy.ts, task-id.vo.ts

- Event Bus Implementation:
  - WorkspaceEventBus interface at domain level
  - Multiple implementations: in-memory-event-bus.adapter.ts, rxjs-event-bus.ts
  - Event bus already scoped per workspace

### External Research

- #githubRepo:"angular/angular angular signals"
  - Angular 20 signals are the recommended state management approach
  - computed() for derived state, effect() for side effects
  - signalStore from @ngrx/signals for complex state management

### Project Conventions

- Standards referenced: 
  - DDD architecture from `.github/instructions/strict-ddd-architecture.instructions.md`
  - Angular 20 control flow from `.github/instructions/ng-angular-20-control-flow.instructions.md`
  - NgRx Signals patterns from `.github/instructions/ngrx-signals-modern-patterns.instructions.md`
- Instructions followed:
  - Event sourcing and causality tracking
  - Strict layer separation (Domain → Application → Infrastructure → Presentation)
  - Zone-less change detection with OnPush strategy

## Key Discoveries

### Project Structure

The project follows a strict DDD layered architecture:

```
src/app/
├── domain/                    # Pure TypeScript, no framework dependencies
│   ├── aggregates/           # TaskAggregate (entity + business logic)
│   ├── events/               # Domain events (TaskCreated, TaskUpdated, etc.)
│   ├── factories/            # TaskFactory (creation logic with policy enforcement)
│   ├── policies/             # TaskNamingPolicy, TaskHierarchyPolicy
│   ├── repositories/         # ITaskRepository interface
│   ├── value-objects/        # TaskId, Money (for unitPrice)
│   └── types/                # WorkspaceEventBus interface
├── application/              # Use cases and state management
│   ├── handlers/             # Command handlers (CreateTaskHandler, SubmitTaskForQCHandler)
│   ├── stores/               # TasksStore (signalStore)
│   ├── facades/              # TasksFacade (presentation layer API)
│   └── interfaces/           # IModuleEventBus, tokens
├── infrastructure/           # External integrations
│   ├── repositories/         # TaskRepositoryImpl (Firestore integration)
│   ├── adapters/             # Event bus adapters
│   └── mappers/              # Entity <-> DTO conversion
└── presentation/             # UI components
    └── pages/modules/tasks/  # Tasks module UI
```

### Implementation Patterns

**Current Patterns in Use:**
1. **Functional Domain Model**: TaskAggregate is an immutable interface with pure functions
2. **Signal-based State**: TasksStore uses @ngrx/signals signalStore
3. **Repository Pattern**: TASK_REPOSITORY token for dependency inversion
4. **Facade Pattern**: TasksFacade provides clean API to presentation layer
5. **Event-Driven**: WorkspaceEventBus for cross-module communication
6. **Command Handlers**: Separate handlers for each use case (CreateTaskHandler, etc.)

**Missing Patterns Required by Spec:**
1. **Value Objects**: Money for unitPrice/totalPrice
2. **Factory Pattern**: TaskFactory for enforcing policies during creation
3. **Policy Pattern**: TaskNamingPolicy, TaskHierarchyPolicy, TaskPricingPolicy
4. **Specification Pattern**: TaskReadyForQCSpecification for complex validation
5. **Aggregate Hierarchy**: Parent-child task relationships with invariants

### Complete Examples

**Current TaskAggregate Interface:**
```typescript
export interface TaskAggregate {
  readonly id: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly description: string;
  readonly status: TaskStatus;
  readonly priority: TaskPriority;
  readonly assigneeId: string | null;
  readonly createdById: string;
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly dueDate: number | null;
  readonly blockedByIssueIds: ReadonlyArray<string>;
}
```

**Required Extensions:**
```typescript
export interface TaskAggregate {
  // ... existing fields
  readonly unitPrice: Money | null;           // Value Object
  readonly quantity: number;                   // Default: 1
  readonly totalPrice: Money;                  // Computed: unitPrice × quantity
  readonly progress: number;                   // 0-100
  readonly parentId: string | null;            // Hierarchy support
  readonly subtaskIds: ReadonlyArray<string>;  // Child tasks
  readonly assigneeIds: ReadonlyArray<string>; // Multiple assignees
  readonly responsibleId: string | null;       // Primary responsible person
  readonly collaboratorIds: ReadonlyArray<string>; // Collaborators
}
```

**Current Event Bus Pattern:**
```typescript
// Domain Event
export interface TaskCreatedEvent extends DomainEvent<TaskCreatedPayload> {
  readonly type: 'TaskCreated';
}

// Event Handler (Application Layer)
export class CreateTaskHandler {
  async execute(request: CreateTaskRequest): Promise<CreateTaskResponse> {
    const task = createTask({ ... });
    await this.repository.save(task);
    
    const event = createTaskCreatedEvent(...);
    await this.publishEvent.execute({ event });
    
    return { success: true };
  }
}

// Store Subscription (Application Layer)
export const TasksStore = signalStore(
  withHooks({
    onInit(store) {
      eventBus.subscribe('QCPassed', (event) => {
        // Update task status reactively
      });
    }
  })
);
```

### API and Schema Documentation

**Required Events to Publish:**
- TaskCreated ✅ (implemented)
- TaskUpdated ✅ (implemented)
- TaskDeleted ✅ (implemented)
- TaskProgressUpdated ❌ (missing)
- TaskReadyForQC ✅ (task-submitted-for-qc.event.ts exists)
- TaskReadyForAcceptance ❌ (missing)
- TaskCompleted ✅ (implemented)
- TaskAssigneeChanged ❌ (missing)

**Required Events to Subscribe:**
- QCPassed ✅ (qc-passed.event.ts exists)
- QCFailed ✅ (qc-failed.event.ts exists)
- AcceptanceApproved ✅ (acceptance-approved.event.ts exists)
- AcceptanceRejected ✅ (acceptance-rejected.event.ts exists)
- IssueResolved ❌ (need to verify)
- WorkspaceSwitched ✅ (already handled in store)

### Configuration Examples

**SignalStore with View Modes:**
```typescript
export interface TasksState {
  readonly tasks: ReadonlyMap<string, TaskAggregate>;  // Map structure for efficient lookup
  readonly viewMode: 'list' | 'gantt' | 'kanban' | 'calendar';
  readonly isLoading: boolean;
  readonly error: string | null;
}

export const TasksStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => ({
    // View projections
    taskList: computed(() => Array.from(state.tasks().values())),
    kanbanColumns: computed(() => groupByStatus(state.tasks())),
    ganttTimeline: computed(() => buildGanttData(state.tasks())),
    
    // Hierarchy computations
    rootTasks: computed(() => 
      Array.from(state.tasks().values()).filter(t => !t.parentId)
    ),
    taskHierarchy: computed(() => buildTaskTree(state.tasks())),
  }))
);
```

**Context Provider Pattern:**
```typescript
// Application Layer
export abstract class TaskContextProvider {
  abstract getTaskStatus(taskId: string): TaskStatus | null;
  abstract getTaskProgress(taskId: string): number;
  abstract canSubmitForQC(taskId: string): boolean;
  abstract hasBlockingIssues(taskId: string): boolean;
}

// Infrastructure Implementation
@Injectable({ providedIn: 'root' })
export class TaskContextProviderImpl extends TaskContextProvider {
  private store = inject(TasksStore);
  
  getTaskStatus(taskId: string): TaskStatus | null {
    return this.store.tasks().get(taskId)?.status ?? null;
  }
}
```

### Technical Requirements

**Functional Requirements:**

1. **Single Source of Truth + Derived Views**
   - Store tasks in Map<TaskId, Task> for O(1) lookup
   - Use computed signals for view projections (no API re-fetching)
   - viewMode signal to control rendering (@if for conditional display)

2. **Task Properties**
   - Money Value Object for unitPrice/totalPrice (multi-currency support)
   - Progress: manual for leaf tasks, auto-computed for parent tasks
   - Formula: `parentProgress = Σ(childProgress × childTotalPrice) / Σ(childTotalPrice)`
   - Multiple assignees with primary responsible person

3. **Infinite Task Hierarchy**
   - Parent-child relationships (parentId, subtaskIds)
   - Invariant: child totalPrice sum ≤ parent totalPrice
   - Policy: maximum depth = 10 levels
   - UI: mat-tree or custom tree component with drag-and-drop

4. **State Flow Integration**
   - Lifecycle: Draft → InProgress → ReadyForQC → QCPassed → ReadyForAcceptance → Accepted → Completed
   - Auto-transition: progress=100% → ReadyForQC
   - Event-driven state updates from QC/Acceptance modules
   - Blocked state requires unresolved issues

5. **Daily Record Auto-Publishing**
   - On progress update, emit TaskProgressUpdated event
   - DailyModule subscribes and creates/updates daily entries
   - Configurable auto-record toggle

**Angular 20+ Requirements:**
- ✅ signalStore for state management (already implemented)
- ❌ @if/@for/@switch control flow (needs migration from *ngIf/*ngFor)
- ❌ @defer for lazy-loading heavy views (Gantt, Calendar)
- ✅ ChangeDetectionStrategy.OnPush (already used)
- ❌ Zone-less change detection (needs configuration)

**DDD Requirements:**
- Factory Pattern: TaskFactory with policy enforcement
- Policy Pattern: Naming, Hierarchy, Pricing policies
- Specification Pattern: Complex validation rules
- Repository Pattern: Already implemented with InjectionToken
- Mapper Pattern: Need TaskToDtoMapper, TaskFirestoreMapper

## Recommended Approach

**Single Phased Implementation with Incremental Delivery**

Given the existing foundation (signalStore, event bus, repository pattern), the recommended approach is to **extend and refactor incrementally** rather than rebuild:

### Phase 1: Domain Model Extension
1. **Create Value Objects**: Money for pricing, TaskId (already exists)
2. **Extend TaskAggregate**: Add unitPrice, quantity, totalPrice, progress, hierarchy fields
3. **Implement Policies**: TaskNamingPolicy, TaskHierarchyPolicy, TaskPricingPolicy
4. **Create Factory**: TaskFactory enforcing policies
5. **Add Specifications**: TaskReadyForQCSpecification

### Phase 2: Application Layer Enhancements
1. **Update TasksStore**: 
   - Change from array to Map<string, TaskAggregate>
   - Add viewMode signal
   - Add computed signals for views (kanban, gantt, hierarchy)
2. **Create Missing Events**: TaskProgressUpdated, TaskReadyForAcceptance, TaskAssigneeChanged
3. **Implement TaskContextProvider**: For cross-module queries
4. **Add Command Handlers**: UpdateProgressHandler, AssignTaskHandler, AddSubtaskHandler

### Phase 3: Infrastructure Updates
1. **Update Repository**: Handle nested subtasks and Money value objects
2. **Create Mappers**: TaskToDtoMapper, TaskFirestoreMapper with Money serialization
3. **Event Handlers**: Wire up new events in tasks.event-handlers.ts

### Phase 4: Presentation Layer
1. **Migrate Control Flow**: Replace *ngIf/*ngFor with @if/@for
2. **Add View Modes**: List (exists), Kanban, Gantt, Calendar
3. **Implement Tree UI**: For task hierarchy with drag-and-drop
4. **Add @defer**: For heavy components (Gantt chart)
5. **Forms**: Create/edit task with pricing, progress, assignees

### Phase 5: Testing & Optimization
1. **Unit Tests**: Policies, specifications, factories
2. **Integration Tests**: Event flows, repository operations
3. **E2E Tests**: Task creation, hierarchy, state transitions
4. **Performance**: Zone-less change detection, virtual scrolling for large lists

## Implementation Guidance

- **Objectives**: 
  - Extend existing task system with pricing, progress tracking, and infinite hierarchy
  - Maintain single source of truth with multiple view projections
  - Integrate with QC, Acceptance, and Daily modules via events
  - Follow strict DDD patterns and Angular 20+ best practices

- **Key Tasks**:
  1. Create Money value object and update TaskAggregate interface
  2. Implement Factory and Policy patterns in domain layer
  3. Refactor TasksStore to use Map and add view mode signals
  4. Create missing domain events and handlers
  5. Implement TaskContextProvider for cross-module queries
  6. Build task hierarchy UI with mat-tree and CDK drag-drop
  7. Add view mode toggle and implement Kanban/Gantt views
  8. Migrate templates to @if/@for control flow
  9. Write comprehensive tests

- **Dependencies**:
  - @ngrx/signals (already installed)
  - @angular/material/tree
  - @angular/cdk/drag-drop (already installed)
  - Firestore SDK (already integrated)
  - WorkspaceEventBus (already implemented)

- **Success Criteria**:
  - All 5 functional requirements fully implemented
  - No API re-fetch on view mode changes (computed signals only)
  - Task hierarchy supports 10 levels with proper invariant enforcement
  - State transitions fully automated via event bus
  - All templates use @if/@for (no *ngIf/*ngFor)
  - Test coverage >80% for domain logic
  - Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1

**Critical Implementation Notes**:
- DO NOT inject other module stores directly (use Context Providers)
- DO NOT modify entities in presentation layer (use command handlers)
- DO NOT re-fetch data on view changes (use computed signals)
- MUST include correlationId in all events
- MUST enforce pricing invariant: sum(child.totalPrice) ≤ parent.totalPrice
- MUST auto-compute parent progress from weighted child progress
