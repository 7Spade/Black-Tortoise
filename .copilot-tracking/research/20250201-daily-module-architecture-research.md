<!-- markdownlint-disable-file -->

# Task Research Notes: Daily Record Module (每日紀錄模組) Architecture

## Research Executed

### File Analysis

- `docs/modulars/04-daily-每日紀錄模組.md`
  - Complete module specification with DDD patterns, Angular 20+ requirements, event integration, and UI/UX standards
  - Man-day tracking system (not hour-based), max 1.0 man-day per person per day
  - Traditional industry worklog requirements with quick fill interface
  
- `src/app/application/stores/daily.store.ts`
  - Existing signalStore implementation with basic CRUD operations
  - Manages entries array, selectedDate, isLogging, error states
  - Computed signals for date-based filtering and headcount calculations
  
- `src/app/domain/aggregates/daily-entry.aggregate.ts`
  - Minimal interface definition (id, userId, workspaceId, date, tasksWorkedOn, notes, headcount, submittedAt)
  - Missing full DDD aggregate implementation with factory/reconstruct patterns
  
- `src/app/presentation/pages/modules/daily/daily.component.ts`
  - Working waterfall timeline UI with stats bars
  - Uses CreateDailyEntryHandler for command execution
  - Event bus integration for WorkspaceSwitched events
  
- `src/app/application/handlers/create-daily-entry.handler.ts`
  - Follows event-first pattern: creates DailyEntryCreatedEvent → publishes via PublishEventHandler
  - Request includes correlationId and causationId for causality tracking
  
- `src/app/domain/policies/daily-validation.policy.ts`
  - Basic validation for date format and headcount > 0
  - Missing comprehensive business rules (max 1.0 per day, task completion checks, 30-day limit)

### Code Search Results

- Context Provider Pattern
  - Found: `TaskContextProvider`, `DocumentContextProvider`, `PermissionContextProvider`, `OverviewContextProvider`
  - Pattern: Abstract class defining read-only access methods for cross-module data queries
  
- Event Bus Architecture
  - Found: `WorkspaceEventBus` interface, `IModuleEventBus` interface
  - Implementation: Workspace-scoped event bus (not global singleton)
  - Pattern: publish() + subscribe() with correlationId tracking
  
- Repository Pattern
  - Found: `DAILYENTRY_REPOSITORY_TOKEN` injection token
  - Implementation: `daily.repository.impl.ts` in infrastructure layer
  - Interface: `IDailyEntryRepository` in application layer

### External Research

- N/A (No external research required - complete specification in project docs)

### Project Conventions

- Standards referenced:
  - `.github/instructions/ng-ddd-architecture.instructions.md` - DDD layer separation, domain purity, entity/value object patterns
  - `.github/instructions/event-sourcing-and-causality.instructions.md` - Event lifecycle, causality tracking, reactive flow
  - `docs/modulars/04-daily-每日紀錄模組.md` - Module-specific requirements
  
- Instructions followed:
  - Domain → Application → Infrastructure → Presentation layering
  - signalStore for state management (NO RxJS subscriptions)
  - @if/@for/@switch control flow (NO *ngIf/*ngFor)
  - Event-first architecture: Append → Publish → React
  - Context Providers for cross-module communication

## Key Discoveries

### Project Structure

```
src/app/
├── domain/
│   ├── aggregates/
│   │   └── daily-entry.aggregate.ts         # INCOMPLETE: Needs factory/reconstruct
│   ├── policies/
│   │   └── daily-validation.policy.ts       # INCOMPLETE: Missing comprehensive rules
│   ├── events/
│   │   └── daily-entry-created.event.ts     # EXISTS
│   ├── value-objects/
│   │   └── daily-entry-id.vo.ts             # EXISTS
│   └── repositories/
│       └── daily.repository.ts              # Interface definition
├── application/
│   ├── stores/
│   │   └── daily.store.ts                   # COMPLETE: signalStore implementation
│   ├── handlers/
│   │   ├── create-daily-entry.handler.ts    # COMPLETE: Event creation
│   │   ├── submit-daily-entry.handler.ts    # EXISTS
│   │   └── daily.event-handlers.ts          # Event subscribers
│   ├── providers/
│   │   └── daily-context.provider.ts        # MISSING: Needs implementation
│   ├── interfaces/
│   │   └── daily-repository.token.ts        # EXISTS
│   └── commands/
│       └── submit-daily-entry.command.ts    # EXISTS
├── infrastructure/
│   └── repositories/
│       └── daily.repository.impl.ts         # EXISTS
└── presentation/
    └── pages/modules/daily/
        ├── daily.component.ts               # COMPLETE: Working UI
        └── daily.component.scss             # Styling
```

### Implementation Patterns

#### Context Provider Pattern (Cross-Module Communication)
```typescript
// Application Layer: 04-daily/application/providers/daily-context.provider.ts
export abstract class DailyContextProvider {
  abstract getTotalWorkHours(userId: string, date: Date): number;
  abstract hasDailyEntry(userId: string, date: Date): boolean;
}

// Implementation in same file or separate impl file
@Injectable({ providedIn: 'root' })
export class DailyContextProviderImpl extends DailyContextProvider {
  private readonly store = inject(DailyStore);
  
  getTotalWorkHours(userId: string, date: Date): number {
    const dateStr = date.toISOString().split('T')[0];
    return this.store.entries()
      .filter(e => e.userId === userId && e.date === dateStr)
      .reduce((sum, e) => sum + e.headcount, 0);
  }
  
  hasDailyEntry(userId: string, date: Date): boolean {
    const dateStr = date.toISOString().split('T')[0];
    return this.store.entries()
      .some(e => e.userId === userId && e.date === dateStr);
  }
}
```

#### Event Subscription Pattern (Reactive Event Handling)
```typescript
// Application Layer: 04-daily/application/stores/daily.store.ts
export const DailyStore = signalStore(
  { providedIn: 'root' },
  withState<DailyState>(initialState),
  withHooks({
    onInit(store) {
      const eventBus = inject(WorkspaceEventBus);
      
      // Subscribe to WorkspaceSwitched
      eventBus.subscribe('WorkspaceSwitched', () => {
        patchState(store, initialState);
      });
      
      // Subscribe to TaskProgressUpdated - auto-create daily entry
      eventBus.subscribe('TaskProgressUpdated', (event) => {
        // Auto-calculate man-days based on progress change
        // Create DailyEntry if progress increased
      });
    }
  })
);
```

#### DDD Aggregate Pattern (Missing in Current Code)
```typescript
// Domain Layer: 04-daily/domain/aggregates/daily-entry.aggregate.ts
export class DailyEntryEntity {
  private constructor(
    private readonly id: string,
    private readonly userId: string,
    private readonly workspaceId: string,
    private readonly date: string,
    private tasksWorkedOn: ReadonlyArray<string>,
    private notes: string,
    private headcount: number,
    private readonly submittedAt: number
  ) {}
  
  // Factory method - creates new entity WITH domain events
  public static create(
    id: string,
    userId: string,
    workspaceId: string,
    date: string,
    tasksWorkedOn: string[],
    headcount: number,
    notes?: string,
    metadata?: EventMetadata
  ): DailyEntryEntity {
    // Emit domain event
    return new DailyEntryEntity(id, userId, workspaceId, date, tasksWorkedOn, notes ?? '', headcount, Date.now());
  }
  
  // Reconstruct - rebuilds from snapshot WITHOUT domain events
  public static reconstruct(props: DailyEntryProps): DailyEntryEntity {
    return new DailyEntryEntity(
      props.id,
      props.userId,
      props.workspaceId,
      props.date,
      props.tasksWorkedOn,
      props.notes,
      props.headcount,
      props.submittedAt
    );
  }
  
  // Behavior methods
  public updateHeadcount(newHeadcount: number): void {
    WorkHourPolicy.assertIsValid(this.date, newHeadcount);
    this.headcount = newHeadcount;
    // Emit DailyEntryUpdatedEvent
  }
}
```

#### Policy Pattern (Business Rules Validation)
```typescript
// Domain Layer: 04-daily/domain/policies/work-hour.policy.ts
export class WorkHourPolicy {
  public static isSatisfiedBy(
    userId: string,
    date: string,
    newHeadcount: number,
    existingEntries: DailyEntry[]
  ): boolean {
    const totalForDay = existingEntries
      .filter(e => e.userId === userId && e.date === date)
      .reduce((sum, e) => sum + e.headcount, 0);
    
    return (totalForDay + newHeadcount) <= 1.0;
  }
  
  public static assertIsValid(
    userId: string,
    date: string,
    newHeadcount: number,
    existingEntries: DailyEntry[]
  ): void {
    if (!this.isSatisfiedBy(userId, date, newHeadcount, existingEntries)) {
      throw new DomainError('Total man-days per person per day cannot exceed 1.0');
    }
  }
}

export class TaskCompletionPolicy {
  public static canRecordTime(taskId: string, taskStatus: string): boolean {
    return taskStatus !== 'Completed';
  }
}

export class HistoricalEntryPolicy {
  public static canModify(entryDate: string): boolean {
    const date = new Date(entryDate);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 30; // Allow modification within 30 days
  }
}
```

### Complete Examples

#### Event-First Command Handler
```typescript
// Application Layer: create-daily-entry.handler.ts
@Injectable({ providedIn: 'root' })
export class CreateDailyEntryHandler {
  private readonly publishEvent = inject(PublishEventHandler);
  private readonly workspaceContext = inject(WorkspaceContextProvider);
  private readonly taskContext = inject(TaskContextProvider);

  async execute(request: CreateDailyEntryRequest): Promise<CreateDailyEntryResponse> {
    // 1. Validate business rules
    const validation = validateDailyEntry(request.date, request.headcount);
    if (!validation.valid) {
      return { success: false, error: validation.errors.join(', ') };
    }
    
    // 2. Check task completion status
    for (const taskId of request.taskIds) {
      const status = this.taskContext.getTaskStatus(taskId);
      if (status === 'Completed') {
        return { success: false, error: 'Cannot log time for completed tasks' };
      }
    }
    
    // 3. Create domain event
    const event = createDailyEntryCreatedEvent(
      request.entryId,
      request.workspaceId,
      request.date,
      request.userId,
      request.taskIds,
      request.headcount,
      request.notes,
      request.correlationId
    );
    
    // 4. Publish event (Append → Publish → React)
    const result = await this.publishEvent.execute({ event });
    return result;
  }
}
```

#### Store with Event Subscriptions
```typescript
// Application Layer: daily.store.ts
export const DailyStore = signalStore(
  { providedIn: 'root' },
  withState<DailyState>(initialState),
  withComputed((state) => ({
    // Computed signals for reactive queries
    selectedDateEntries: computed(() => {
      const date = state.selectedDate();
      return date ? state.entries().filter(e => e.date === date) : [];
    }),
    weeklyManDays: computed(() => {
      const weekStart = getWeekStart();
      return state.entries()
        .filter(e => new Date(e.date) >= weekStart)
        .reduce((sum, e) => sum + e.headcount, 0);
    })
  })),
  withMethods((store) => ({
    // Pure state mutations
    addEntry(entry: DailyEntry): void {
      patchState(store, {
        entries: [...store.entries(), entry]
      });
    }
  })),
  withHooks({
    onInit(store) {
      const eventBus = inject(WorkspaceEventBus);
      
      // React to WorkspaceSwitched
      eventBus.subscribe('WorkspaceSwitched', () => {
        patchState(store, initialState);
      });
      
      // React to DailyEntryCreated (from event store)
      eventBus.subscribe('DailyEntryCreated', (event) => {
        store.addEntry({
          id: event.payload.entryId,
          date: event.payload.date,
          userId: event.payload.userId,
          taskIds: event.payload.taskIds,
          headcount: event.payload.headcount,
          notes: event.payload.notes,
          createdAt: new Date(event.timestamp)
        });
      });
      
      // React to TaskProgressUpdated - auto-create entry
      eventBus.subscribe('TaskProgressUpdated', (event) => {
        // Auto-calculate man-days from progress change
        // Emit DailyEntryCreated if applicable
      });
    }
  })
);
```

### API and Schema Documentation

#### DailyEntry Domain Model
```typescript
export interface DailyEntry {
  readonly id: string;
  readonly date: string;              // ISO date (YYYY-MM-DD)
  readonly userId: string;
  readonly workspaceId: string;
  readonly taskIds: ReadonlyArray<string>;
  readonly headcount: number;         // 0.1 to 1.0 (man-days)
  readonly notes?: string;
  readonly submittedAt: number;       // Unix timestamp
  readonly createdAt: Date;
}
```

#### DailyState (signalStore)
```typescript
export interface DailyState {
  readonly entries: ReadonlyArray<DailyEntry>;
  readonly selectedDate: string | null;
  readonly isLogging: boolean;
  readonly error: string | null;
}
```

#### Events Published
- **DailyEntryCreated**: When user submits new entry
- **DailyEntryUpdated**: When user modifies existing entry (within 30 days)
- **WorkHourRecorded**: For analytics/statistics modules

#### Events Subscribed
- **TaskProgressUpdated**: Auto-create daily entry based on progress change
- **WorkspaceSwitched**: Clear all state
- **TaskCompleted**: Prevent further time logging

### Configuration Examples

#### Angular 20+ Template Control Flow
```html
<!-- Modern @if/@for syntax (REQUIRED) -->
@if (dailyStore.hasEntries()) {
  <div class="timeline">
    @for (entry of sortedEntries(); track entry.id) {
      <div class="entry-card">
        <span>{{ entry.date }}</span>
        <span>{{ entry.headcount }} man-days</span>
        @if (entry.notes) {
          <p>{{ entry.notes }}</p>
        }
      </div>
    }
  </div>
} @else {
  <div class="empty-state">
    <p>No entries yet</p>
  </div>
}

<!-- Deferred loading for heavy charts -->
@defer (on viewport) {
  <app-daily-statistics-chart />
} @placeholder {
  <div class="chart-skeleton"></div>
}
```

#### Module Providers Configuration
```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    // Context Providers
    { provide: DailyContextProvider, useClass: DailyContextProviderImpl },
    
    // Repository injection
    { provide: DAILYENTRY_REPOSITORY_TOKEN, useClass: DailyRepositoryImpl },
    
    // Event handlers
    DailyEventHandlers,
    CreateDailyEntryHandler,
    
    // Stores (providedIn: 'root' handles this)
  ]
};
```

### Technical Requirements

#### Business Rules (Domain Policies)
1. **Max 1.0 Man-Day per Person per Day**: Total headcount for all entries of one user on one date ≤ 1.0
2. **No Time on Completed Tasks**: Cannot create/update entry for tasks with status === 'Completed'
3. **30-Day Modification Window**: Can only modify entries from past 30 days
4. **Task Association Required**: Must link to at least one valid task
5. **Date Format Validation**: Must be YYYY-MM-DD ISO format
6. **Headcount Range**: Must be between 0.1 and 1.0
7. **Workspace Scoping**: All entries scoped to current workspace

#### Performance Requirements
- LCP < 2.5s: Use @defer for charts and heavy components
- INP < 200ms: Use ChangeDetectionStrategy.OnPush on all components
- CLS < 0.1: Pre-allocate space for dynamic content
- Zone-less: Enable zoneless change detection in Angular 20+

#### Accessibility Requirements
- Keyboard navigation for all form inputs
- ARIA labels on date pickers and headcount inputs
- LiveAnnouncer for success/error messages
- Semantic HTML for timeline/card structure

#### State Management Requirements
- NO RxJS subscriptions (use signals only)
- NO BehaviorSubject or manual observables
- All computed values via computed()
- All side effects via effect() or event subscriptions
- Immutable state updates via patchState()

## Recommended Approach

### Implementation Strategy: Event-First DDD with Signal-Based Reactivity

The existing codebase has **partial implementation** of the Daily module. The recommended approach is to:

1. **Complete DDD Domain Layer**
   - Enhance `DailyEntryEntity` aggregate with factory/reconstruct methods
   - Implement comprehensive policies: `WorkHourPolicy`, `TaskCompletionPolicy`, `HistoricalEntryPolicy`
   - Create missing value objects if needed (e.g., `ManDay` value object for 0.1-1.0 validation)

2. **Implement Context Provider**
   - Create `DailyContextProvider` abstract class
   - Implement `DailyContextProviderImpl` with store injection
   - Expose `getTotalWorkHours()` and `hasDailyEntry()` for other modules

3. **Enhance Event Integration**
   - Subscribe to `TaskProgressUpdated` in store hooks for auto-entry creation
   - Subscribe to `TaskCompleted` to prevent further time logging
   - Ensure all events include correlationId for causality tracking

4. **Implement Quick Fill UI Features**
   - Auto-populate today's active tasks
   - Display past 7 days history
   - Copy previous day functionality
   - Weekly/monthly statistics with deferred chart loading

5. **Add Team Statistics Features** (Lower Priority)
   - Team member filter
   - Export to Excel/CSV
   - Trend charts with @defer loading

### Architecture Benefits
- **Loose Coupling**: Modules communicate via events and context providers (no direct store injection)
- **Testability**: Pure domain logic, signal-based state, command/handler separation
- **Performance**: Zone-less change detection, deferred loading, OnPush strategy
- **Maintainability**: Clear layer separation, single responsibility, DDD patterns

### Missing Implementation Items
1. ✅ Store: COMPLETE
2. ⚠️ Aggregate: INCOMPLETE (needs factory/reconstruct)
3. ⚠️ Policies: INCOMPLETE (needs comprehensive rules)
4. ❌ Context Provider: MISSING
5. ⚠️ Event Subscriptions: PARTIAL (needs TaskProgressUpdated, TaskCompleted)
6. ✅ UI Component: COMPLETE (basic)
7. ⚠️ UI Features: PARTIAL (missing quick fill, copy previous day, 7-day history)
8. ❌ Team Statistics: MISSING

## Implementation Guidance

- **Objectives**: 
  1. Complete DDD domain layer with proper aggregate/policy patterns
  2. Implement DailyContextProvider for cross-module integration
  3. Add comprehensive event subscriptions for reactive auto-entry creation
  4. Enhance UI with quick fill features (7-day history, copy previous day, auto-populate tasks)
  5. Add team statistics module (filter, export, charts)

- **Key Tasks**:
  1. Refactor `daily-entry.aggregate.ts` to follow factory/reconstruct pattern from spec
  2. Implement `work-hour.policy.ts`, `task-completion.policy.ts`, `historical-entry.policy.ts`
  3. Create `daily-context.provider.ts` with abstract class + implementation
  4. Add TaskProgressUpdated and TaskCompleted event subscriptions to DailyStore hooks
  5. Enhance daily.component.ts with quick fill UI (7-day history, copy button, task auto-list)
  6. Create deferred statistics component with charts (@defer on viewport)
  7. Add validation in handler to enforce 1.0 max man-days per person per day

- **Dependencies**:
  - WorkspaceContextProvider (exists) - for workspace ID
  - TaskContextProvider (exists) - for task status and active tasks
  - WorkspaceEventBus (exists) - for event pub/sub
  - PublishEventHandler (exists) - for event publishing

- **Success Criteria**:
  1. All business rules enforced (max 1.0, no completed tasks, 30-day window)
  2. DailyContextProvider accessible by other modules
  3. Auto-entry creation working on TaskProgressUpdated
  4. Quick fill UI showing past 7 days + copy previous day
  5. Team statistics exportable to Excel/CSV
  6. All tests passing (unit for policies, integration for events, E2E for UI flows)
  7. Performance metrics met (LCP < 2.5s, INP < 200ms, CLS < 0.1)

