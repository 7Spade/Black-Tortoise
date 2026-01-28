<!-- markdownlint-disable-file -->

# Task Research Notes: Issues Module (07-issues) Architecture

## Research Executed

### File Analysis

- `docs/modulars/07-issues-問題單模組.md`
  - Comprehensive module specification with DDD patterns, event-driven architecture, Angular 20+ requirements
  - Defines 5 core functional requirements, event integrations, UI/UX specifications, and cross-module interactions
  
- `src/app/domain/aggregates/issue.aggregate.ts`
  - Functional aggregate with status enums (OPEN, IN_PROGRESS, RESOLVED, CLOSED, WONT_FIX)
  - Pure functions for lifecycle: createIssue, updateIssue, assignIssue, startIssue, resolveIssue, closeIssue, reopenIssue
  - Complete business rules enforcement (e.g., title validation, status transition constraints)

- `src/app/application/stores/issues.store.ts`
  - NgRx SignalStore implementation with computed signals
  - Methods: loadByWorkspace, createIssue, updateIssue, selectIssue, reset
  - Computed: openIssues, resolvedIssues, getIssuesByTask, selectedIssue, hasOpenIssues

- `src/app/application/handlers/issues.event-handlers.ts`
  - Subscribes to IssueCreated and IssueResolved events
  - Syncs events with IssuesStore state
  
- `src/app/presentation/pages/modules/issues/issues.component.ts`
  - Basic component with @if/@for control flow
  - Subscribes to QCFailed event to auto-create issues
  - Uses CreateIssueHandler and ResolveIssueHandler

- `src/app/infrastructure/repositories/issue.repository.impl.ts`
  - Firestore-based implementation
  - Methods: findById, findByWorkspaceId, save, delete

### Code Search Results

- **issue-related files**
  - Domain: issue.aggregate.ts, issue-created.event.ts, issue-resolved.event.ts, issue-id.vo.ts, issue.repository.ts, issue-workflow.policy.ts
  - Application: issues.store.ts, create-issue.handler.ts, update-issue.handler.ts, resolve-issue.handler.ts, change-issue-status.handler.ts, issues.event-handlers.ts
  - Infrastructure: issue.repository.impl.ts
  - Presentation: issues.component.ts

- **Event integrations found**
  - QCFailed event subscription in issues.component.ts and tasks.event-handlers.ts
  - AcceptanceRejected event subscription in acceptance.event-handlers.ts
  - IssueCreated, IssueResolved events published

### External Research

- **Angular 20+ Patterns**
  - #fetch:https://angular.dev/guide/signals
    - Signal-based state management with computed() and effect()
    - NgRx SignalStore pattern for reactive stores
  
- **DDD Event Sourcing**
  - #githubRepo:"microsoft/NubesGen event-sourcing"
    - Append → Publish → React pattern for event ordering
    - Domain events with correlationId/causationId for traceability

### Project Conventions

- Standards referenced: 
  - workspace-modular-architecture_constitution_enhanced.md (parent document)
  - DDD patterns from .github/skills/ddd/SKILL.md
  - Angular Material M3 + Tailwind CSS for UI
  
- Instructions followed:
  - Modular architecture: Domain → Application → Infrastructure → Presentation
  - Event-driven with WorkspaceEventBus
  - Context Providers for cross-module queries (not direct Store injection)

## Key Discoveries

### Project Structure

The Issues Module (07-issues) follows the established 4-layer clean architecture:

**Domain Layer** (Business Logic)
- `aggregates/issue.aggregate.ts` - Functional aggregate with pure lifecycle functions
- `events/issue-created.event.ts`, `issue-resolved.event.ts` - Domain events
- `policies/issue-workflow.policy.ts` - Business rules for state transitions
- `repositories/issue.repository.ts` - Abstract repository interface
- `value-objects/issue-id.vo.ts` - Type-safe identifier

**Application Layer** (Use Cases)
- `stores/issues.store.ts` - NgRx SignalStore with computed properties
- `handlers/create-issue.handler.ts` - Create issue use case
- `handlers/resolve-issue.handler.ts` - Resolve issue use case
- `handlers/update-issue.handler.ts` - Update issue use case
- `handlers/change-issue-status.handler.ts` - Status change use case
- `handlers/issues.event-handlers.ts` - Event subscriptions
- `interfaces/issue-repository.token.ts` - Dependency injection token

**Infrastructure Layer** (Technical Concerns)
- `repositories/issue.repository.impl.ts` - Firestore implementation
- Uses Angular Fire (Firestore) for persistence

**Presentation Layer** (UI)
- `pages/modules/issues/issues.component.ts` - Main component
- Uses @if/@for control flow (Angular 20+)
- ChangeDetectionStrategy.OnPush

### Implementation Patterns

**Event-Driven Architecture**
```typescript
// Pattern: Append → Publish → React
eventBus.subscribe('QCFailed', async (event) => {
  // Create IssueCreatedEvent
  await createIssueHandler.execute({
    issueId: crypto.randomUUID(),
    taskId: event.aggregateId,
    workspaceId: eventBus.workspaceId,
    correlationId: event.correlationId,
    causationId: event.eventId,
  });
});
```

**SignalStore Pattern**
```typescript
export const IssuesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => ({
    openIssues: computed(() => 
      state.issues().filter(i => i.status === IssueStatus.OPEN)
    ),
  })),
  withMethods((store, repo = inject(ISSUE_REPOSITORY)) => ({
    loadByWorkspace: rxMethod<string>(...)
  }))
);
```

**Functional Aggregate Pattern**
```typescript
// Pure functions, no class mutation
export function resolveIssue(issue: IssueAggregate): IssueAggregate {
  if (issue.status === IssueStatus.RESOLVED) {
    throw new Error('Cannot resolve issue in resolved status');
  }
  return {
    ...issue,
    status: IssueStatus.RESOLVED,
    resolvedAt: Date.now(),
    version: issue.version + 1,
  };
}
```

### Complete Examples

**Issue Aggregate Creation**
```typescript
import { createIssue, IssueType, IssuePriority } from '@domain/aggregates';
import { WorkspaceId } from '@domain/value-objects';

const issue = createIssue(
  crypto.randomUUID(),
  WorkspaceId.create('workspace-id'),
  'QC Failed: Login Component',
  'Unit tests are failing for login validation',
  IssueType.BUG,
  IssuePriority.HIGH,
  'user-123',
  'assignee-456',
  'task-789'
);
```

**Handler Pattern (Command → Event)**
```typescript
@Injectable({ providedIn: 'root' })
export class CreateIssueHandler {
  private readonly publishEvent = inject(PublishEventHandler);

  async execute(request: CreateIssueRequest): Promise<CreateIssueResponse> {
    const event = createIssueCreatedEvent(
      request.issueId,
      request.taskId,
      request.workspaceId,
      request.title,
      request.description,
      request.createdBy,
      request.correlationId,
      request.causationId
    );
    return await this.publishEvent.execute({ event });
  }
}
```

**Component with Control Flow**
```typescript
@Component({
  selector: 'app-issues-module',
  template: `
    @if (issuesStore.openIssues().length === 0) {
      <div class="empty-state">No open issues</div>
    }
    @for (issue of issuesStore.openIssues(); track issue.id) {
      <div class="issue-card">
        <h4>{{ issue.title }}</h4>
        <button (click)="resolveIssue(issue.id)">Resolve</button>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssuesComponent {
  readonly issuesStore = inject(IssuesStore);
  private readonly resolveIssueHandler = inject(ResolveIssueHandler);
}
```

### API and Schema Documentation

**IssueAggregate Interface**
```typescript
export interface IssueAggregate {
  readonly id: string;
  readonly workspaceId: WorkspaceId;
  readonly title: string;
  readonly description: string;
  readonly type: IssueType; // BUG, FEATURE, ENHANCEMENT, QUESTION, DOCUMENTATION
  readonly status: IssueStatus; // OPEN, IN_PROGRESS, RESOLVED, CLOSED, WONT_FIX
  readonly priority: IssuePriority; // LOW, MEDIUM, HIGH, CRITICAL
  readonly assigneeId?: string;
  readonly taskId?: string;
  readonly reportedBy: string;
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly resolvedAt?: number;
  readonly closedAt?: number;
  readonly version: number;
}
```

**Published Events**
- IssueCreated - When issue is created (auto from QC/Acceptance failure or manual)
- IssueUpdated - When issue details change
- IssueResolved - When issue marked as resolved
- IssueClosed - When issue verified and closed
- IssueReopened - When resolved/closed issue reopened

**Subscribed Events**
- QCFailed - Auto-create issue when QC fails
- AcceptanceRejected - Auto-create issue when acceptance fails
- TaskCompleted - Verify no open issues before allowing completion
- WorkspaceSwitched - Reset state

### Configuration Examples

**Dependency Injection Setup**
```typescript
// Application Layer: Token definition
export const ISSUE_REPOSITORY_TOKEN = new InjectionToken<IIssueRepository>(
  'ISSUE_REPOSITORY_TOKEN'
);

// Infrastructure Layer: Provider
{
  provide: ISSUE_REPOSITORY,
  useClass: IssueRepositoryImpl,
}

// Usage in Store
withMethods((store, repo = inject(ISSUE_REPOSITORY)) => ({
  async createIssue(issue: IssueAggregate): Promise<void> {
    await repo.save(issue);
  }
}))
```

**Event Handler Registration**
```typescript
export function registerIssuesEventHandlers(eventBus: EventBus): void {
  const issuesStore = inject(IssuesStore);
  
  eventBus.subscribe<IssueCreatedEvent['payload']>(
    'IssueCreated',
    (event) => {
      const issue = createIssue(...);
      issuesStore.createIssue(issue);
    }
  );
}
```

### Technical Requirements

**Angular 20+ Compliance**
- ✅ Use @if/@else/@for/@switch instead of *ngIf/*ngFor/*ngSwitch
- ✅ Use @defer for lazy loading
- ✅ SignalStore for state management (no BehaviorSubject)
- ✅ ChangeDetectionStrategy.OnPush
- ✅ Zone-less change detection ready
- ✅ @for must have track expression

**DDD Requirements**
- ✅ Aggregate Root pattern (IssueAggregate)
- ✅ Factory Pattern (createIssue function)
- ✅ Policy Pattern (issue-workflow.policy.ts)
- ✅ Repository Pattern with Dependency Inversion
- ✅ Domain Events (IssueCreated, IssueResolved)
- ✅ Value Objects (IssueId, WorkspaceId)

**Event-Driven Architecture**
- ✅ Append → Publish → React pattern
- ✅ correlationId/causationId for traceability
- ✅ Events are pure data DTOs (no functions/services)
- ✅ Cross-module communication via EventBus only
- ❌ Direct Store injection forbidden

**Accessibility**
- Keyboard navigation required
- Semantic HTML required
- LiveAnnouncer for state changes

**Performance**
- LCP < 2.5s
- INP < 200ms
- CLS < 0.1

## Recommended Approach

### Gap Analysis - What's Missing

**1. Issue Lifecycle Automation (HIGH PRIORITY)**
- ❌ Missing: Auto-transition tasks to Blocked when issue opened
- ❌ Missing: Auto-unblock tasks when all issues closed
- ❌ Missing: Prevent task completion if open issues exist
- ❌ Missing: Auto-route task back to ReadyForQC/ReadyForAcceptance based on issue source

**Implementation Need**: IssueContextProvider for cross-module queries
```typescript
// Application Layer: 07-issues/application/providers/issues-context.provider.ts
export abstract class IssueContextProvider {
  abstract getOpenIssuesCount(taskId: string): number;
  abstract hasBlockingIssues(taskId: string): boolean;
}
```

**2. Issue Status Workflow (MEDIUM PRIORITY)**
- ✅ Exists: Basic status transitions (open → in_progress → resolved → closed)
- ❌ Missing: REOPENED status (doc requires it, code has WONT_FIX instead)
- ❌ Missing: Status validation policy enforcement

**Implementation Need**: Update IssueStatus enum, add reopenIssue validation

**3. Issue List Features (MEDIUM PRIORITY)**
- ❌ Missing: List view with filtering (status, type, priority, assignee, task)
- ❌ Missing: Sorting and grouping
- ❌ Missing: Batch operations (assign, close, export)
- ❌ Missing: Search functionality

**Implementation Need**: New list component, filtering/sorting store methods

**4. Statistics & Reports (LOW PRIORITY)**
- ❌ Missing: Dashboard with counts, MTTR, distribution charts
- ❌ Missing: Trend analysis
- ❌ Missing: Export to Excel/CSV/PDF

**Implementation Need**: Dedicated statistics component, charting library integration

**5. Attachment Support (LOW PRIORITY)**
- ❌ Missing: File upload (screenshots, logs)
- ❌ Missing: Clipboard paste support

**Implementation Need**: File storage service, upload UI component

**6. Issue Types Alignment (LOW PRIORITY)**
- ⚠️ Mismatch: Doc specifies Defect/Bug/Requirement Change/Question
- ⚠️ Code has: BUG/FEATURE/ENHANCEMENT/QUESTION/DOCUMENTATION

**Implementation Need**: Align IssueType enum with documentation

### Architecture Gaps

**Context Provider Missing**
```typescript
// Needed by Tasks Module to check blocking issues
@Injectable({ providedIn: 'root' })
export class IssueContextProviderImpl extends IssueContextProvider {
  private issuesStore = inject(IssuesStore);
  
  getOpenIssuesCount(taskId: string): number {
    return this.issuesStore.getIssuesByTask()(taskId)
      .filter(i => i.status === IssueStatus.OPEN || i.status === IssueStatus.IN_PROGRESS)
      .length;
  }
  
  hasBlockingIssues(taskId: string): boolean {
    return this.getOpenIssuesCount(taskId) > 0;
  }
}
```

**Event Subscriptions Missing**
- AcceptanceRejected - Should auto-create issue (currently only QCFailed implemented)
- TaskCompleted - Should validate no open issues before allowing completion

**UI Components Needed**
- Issue list/grid component with filters
- Issue detail dialog/page
- Issue creation form (manual creation)
- Statistics dashboard

### Proposed Implementation Plan

**Phase 1: Core Lifecycle Integration (Week 1)**
1. Implement IssueContextProvider and register in DI
2. Subscribe to AcceptanceRejected event
3. Add TaskCompleted validation (reject if open issues)
4. Update IssueStatus enum to include REOPENED
5. Publish IssueResolved event with proper task routing info

**Phase 2: Task Integration (Week 1)**
6. Tasks module subscribes to IssueCreated → set task to Blocked
7. Tasks module subscribes to IssueClosed → check if all issues closed → unblock task
8. Tasks module routes task back to ReadyForQC or ReadyForAcceptance based on issue origin

**Phase 3: UI Enhancement (Week 2)**
9. Create issue list component with filters (status, type, priority, assignee)
10. Add sorting and search
11. Implement manual issue creation form
12. Add issue detail view

**Phase 4: Advanced Features (Week 3)**
13. Batch operations (assign, close)
14. Attachment upload support
15. Statistics dashboard
16. Export functionality

## Implementation Guidance

**Objectives**
- Complete issue lifecycle integration with tasks module
- Implement required event subscriptions (QCFailed ✅, AcceptanceRejected ❌, TaskCompleted ❌)
- Provide IssueContextProvider for cross-module blocking logic
- Build comprehensive UI for issue management

**Key Tasks**

1. **Create IssueContextProvider**
   - Define abstract class in application/providers/
   - Implement in application/providers/ (not infrastructure)
   - Register in app.config.ts providers
   - Use in Tasks module for blocking checks

2. **Complete Event Subscriptions**
   - Add AcceptanceRejected handler in issues.component.ts or dedicated handler
   - Add TaskCompleted validation handler
   - Ensure correlationId/causationId propagation

3. **Fix Status Enum Mismatch**
   - Update IssueStatus to include REOPENED (or confirm WONT_FIX is acceptable)
   - Update IssueType to match doc (Defect/Bug/RequirementChange/Question)

4. **Implement UI Components**
   - Issue list with Material Table + filters
   - Issue creation dialog (manual)
   - Issue detail dialog
   - Use @defer for performance

5. **Add Repository Methods**
   - findByTaskId (already findByWorkspaceId exists)
   - findByAssignee
   - findByStatus

6. **Testing Strategy**
   - Unit: Test aggregate functions (createIssue, resolveIssue, etc.)
   - Integration: Test event flow (QCFailed → IssueCreated → Task Blocked)
   - E2E: Test full lifecycle (create → assign → resolve → close → unblock task)

**Dependencies**
- Tasks module must subscribe to IssueCreated/IssueClosed events
- WorkspaceContextProvider (already available)
- Angular Material components (already in use)
- Firestore (already configured)

**Success Criteria**
- ✅ QC failure auto-creates issue and blocks task
- ✅ Acceptance rejection auto-creates issue and blocks task
- ✅ Issue resolution routes task back to correct state
- ✅ Task completion prevented if open issues exist
- ✅ All issues for a task closed → task unblocked
- ✅ Manual issue creation works
- ✅ Issue list with filtering operational
- ✅ All events have correlationId/causationId
- ✅ UI uses @if/@for control flow
- ✅ ChangeDetectionStrategy.OnPush enforced
- ✅ No direct Store injection between modules

## Constraints and Forbidden Practices

**Forbidden**
- ❌ Direct modification of task status (must use events)
- ❌ Closing issues without verification
- ❌ Allowing task completion with open issues
- ❌ Using *ngIf/*ngFor (use @if/@for)
- ❌ Using BehaviorSubject (use signals)
- ❌ Direct Store injection between modules (use Context Providers)
- ❌ Testing effect side effects
- ❌ Events with functions/services in payload

**Required**
- ✅ All events must have correlationId/causationId
- ✅ Append → Publish → React pattern
- ✅ InjectionToken for repository
- ✅ Context Provider for cross-module queries
- ✅ OnPush change detection
- ✅ @for with track expression
- ✅ Semantic HTML
- ✅ Keyboard navigation
