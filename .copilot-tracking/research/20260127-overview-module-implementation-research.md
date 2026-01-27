<!-- markdownlint-disable-file -->

# Task Research Notes: Overview Module Implementation Summary

## Research Executed

### File Analysis

- `/docs/modulars/08-overview-總覽模組.md`
  - Complete module specification with requirements, architecture patterns, and implementation standards
  - Version 2.0, last updated 2026-01-27
  - Parent document: workspace-modular-architecture_constitution_enhanced.md

- `/src/app/application/stores/overview.store.ts`
  - Existing NgRx Signals store with WorkspaceMetrics interface
  - Methods: updateMetrics, incrementMetric, decrementMetric, addActivity, reset
  - Computed properties: taskCompletionRate, healthScore, hasActivity, latestActivity

- `/src/app/presentation/pages/modules/overview/overview.component.ts`
  - Existing component with basic metrics grid and activity feed
  - Currently directly injecting other module stores (non-compliant pattern)
  - Uses modern @if/@for control flow syntax

- `/src/app/presentation/pages/workspace/workspace.routes.ts`
  - Overview route already configured at '' (default) and 'overview' paths
  - Uses lazy loading with loadComponent

### Code Search Results

- **Existing Overview Files**:
  - Domain: `overview-dashboard.aggregate.ts`, `overview.repository.ts`
  - Application: `overview.store.ts`, `overview-repository.token.ts`
  - Infrastructure: `overview.repository.impl.ts`
  - Presentation: `overview.component.ts`, `overview.component.scss`

- **Event Bus Integration**:
  - Module event bus at `application/interfaces/module-event-bus.interface.ts`
  - Workspace event bus at `application/facades/workspace-event-bus.adapter.ts`
  - Component currently subscribes to: TaskCreated, QCPassed, QCFailed, AcceptanceApproved, IssueCreated, IssueResolved

- **Current Store Injection Pattern** (VIOLATES SPEC):
  - Component directly injects: TasksStore, QualityControlStore, AcceptanceStore, IssuesStore
  - Spec requires: Event Bus subscription only, no direct store injection

### External Research

- #githubRepo:"angular/angular signals"
  - NgRx Signals store pattern confirmed as standard for Angular 20+
  - Use signalStore with withState, withComputed, withMethods, withHooks

- Documentation referenced:
  - `.github/skills/ddd/SKILL.md` - DDD architecture standards
  - `docs/modulars/workspace-modular-architecture_constitution_enhanced.md` - Parent architecture document

### Project Conventions

- **Standards referenced**: 
  - DDD layering: Domain → Application → Infrastructure → Presentation
  - Pure reactive communication via Event Bus only
  - No direct module-to-module store injection
  - Angular 20+ control flow (@if/@for/@switch/@defer)
  - Zone-less change detection with OnPush strategy

- **Instructions followed**:
  - Module scope: 08-overview
  - Read-only aggregation model (no business logic)
  - Event subscription only (no event publishing)

## Key Discoveries

### Project Structure

The Overview module follows the standard 4-layer DDD architecture:

```
src/app/
├── domain/
│   ├── aggregates/overview-dashboard.aggregate.ts
│   └── repositories/overview.repository.ts
├── application/
│   ├── stores/overview.store.ts
│   └── interfaces/overview-repository.token.ts
├── infrastructure/
│   └── repositories/overview.repository.impl.ts
└── presentation/
    └── pages/modules/overview/
        ├── overview.component.ts
        └── overview.component.scss
```

**Missing Files Identified**:
- No `application/providers/overview-context.provider.ts` (required by spec)
- No dedicated widget components for dashboard cards
- No chart/visualization components
- No user preference persistence for widget layout
- No drag-and-drop grid layout implementation

### Implementation Patterns

**Current Pattern (INCORRECT)**:
```typescript
// Component directly injects other stores
readonly tasksStore = inject(TasksStore);
readonly qcStore = inject(QualityControlStore);
```

**Required Pattern (CORRECT)**:
```typescript
// Store subscribes to Event Bus, component reads from Overview Store only
withHooks({
  onInit(store) {
    const eventBus = inject(WorkspaceEventBus);
    eventBus.on('TaskCreated', (event) => {
      patchState(store, /* update metrics */);
    });
  }
})
```

### Complete Examples

#### Event Bus Subscription Pattern (from spec)

```typescript
// Application Layer: 08-overview/application/stores/overview.store.ts
export const OverviewStore = signalStore(
  { providedIn: 'root' },
  withState<OverviewState>(initialState),
  withMethods((store) => {
    const eventBus = inject(WorkspaceEventBus);
    const workspaceContext = inject(WorkspaceContextProvider);
    
    return {
      // Business methods
    };
  }),
  withHooks({
    onInit(store) {
      const eventBus = inject(WorkspaceEventBus);
      
      // Subscribe to WorkspaceSwitched
      eventBus.on('WorkspaceSwitched', () => {
        patchState(store, initialState);
      });
      
      // Subscribe to all module events
      eventBus.on('TaskCreated', (event) => { /* update */ });
      eventBus.on('TaskCompleted', (event) => { /* update */ });
      eventBus.on('IssueCreated', (event) => { /* update */ });
      // ... other events
    }
  })
);
```

#### Context Provider Pattern (from spec)

```typescript
// Application Layer: 08-overview/application/providers/overview-context.provider.ts
export abstract class OverviewContextProvider {
  abstract getWorkspaceMetrics(): WorkspaceMetrics;
  abstract getModuleStats(moduleId: string): ModuleStats | null;
}
```

### API and Schema Documentation

**WorkspaceMetrics Interface** (already defined):
```typescript
export interface WorkspaceMetrics {
  readonly totalTasks: number;
  readonly completedTasks: number;
  readonly activeTasks: number;
  readonly blockedTasks: number;
  readonly openIssues: number;
  readonly pendingQC: number;
  readonly pendingAcceptance: number;
  readonly totalMembers: number;
  readonly totalDocuments: number;
  readonly lastActivityAt: Date | null;
}
```

**OverviewState Interface** (already defined):
```typescript
export interface OverviewState {
  readonly metrics: WorkspaceMetrics;
  readonly recentActivities: ReadonlyArray<{
    readonly id: string;
    readonly type: string;
    readonly description: string;
    readonly timestamp: Date;
    readonly actorId: string;
  }>;
  readonly isLoading: boolean;
  readonly error: string | null;
}
```

**Events to Subscribe** (from spec):
- TaskCreated
- TaskCompleted
- IssueCreated
- IssueResolved
- DocumentUploaded
- MemberAdded
- DailyEntryCreated
- WorkspaceSwitched

### Configuration Examples

**Template Control Flow** (Required):
```typescript
@if (overviewStore.hasActivity()) {
  @for (activity of overviewStore.recentActivities(); track activity.id) {
    <div class="activity-item">{{ activity.description }}</div>
  }
} @else {
  <div class="empty-state">No recent activity</div>
}

@defer (on viewport) {
  <app-charts-widget />
}
```

**Change Detection Strategy** (Required):
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
```

### Technical Requirements

#### Mandatory Angular 20+ Features

1. **Control Flow**: Must use @if/@else, @for with track, @switch/@case, @defer
2. **State Management**: NgRx Signals (signalStore) only, no BehaviorSubject
3. **Performance**: Zone-less change detection, OnPush strategy, @defer for heavy views
4. **Event Pattern**: Append → Publish → React (never Publish before Append)

#### UI/UX Requirements

1. **Design System**: Angular Material M3 + Tailwind CSS
2. **Responsive Layout**: Grid Layout - 3 columns (desktop), 2 (tablet), 1 (mobile)
3. **Widget Features**:
   - Customizable display order
   - Show/hide individual widgets
   - Drag-and-drop positioning
   - User preferences sync across devices
4. **Accessibility**: Keyboard navigation, semantic HTML, LiveAnnouncer for state changes
5. **Performance Targets**: LCP < 2.5s, INP < 200ms, CLS < 0.1

#### Visualization Components

1. **Core Metrics Cards**: Task counts, QC pass rate, health score
2. **Charts**:
   - Burndown chart (task remaining trend)
   - Burnup chart (task completion accumulation)
   - Gantt chart summary (important tasks timeline)
   - Issue trend chart (weekly created vs resolved)
   - Issue type distribution (pie chart)
   - Team workload (bar chart)
   - Member activity (radar chart)
3. **Activity Timeline**: Last 50 activities with filtering (type, actor, date, keyword)
4. **Assignee View**: Tasks grouped by assignee, workload, activity, contribution metrics

#### Forbidden Practices

- ❌ Duplicate API requests (subscribe to original module stores via events instead)
- ❌ Implement business logic in OverviewModule
- ❌ Directly modify other modules' state
- ❌ Direct injection of other module stores
- ❌ Use *ngIf/*ngFor/*ngSwitch (must use @if/@for/@switch)

## Recommended Approach

### Phase 1: Fix Architecture Violations

**Priority: HIGH** - Current implementation violates the modular architecture specification

1. **Remove Direct Store Injections**
   - Remove `tasksStore`, `qcStore`, `acceptanceStore`, `issuesStore` from component
   - Component should only inject `OverviewStore`

2. **Implement Event Bus Subscriptions in Store**
   - Move all event subscriptions from component to store `withHooks.onInit`
   - Subscribe to all required events: TaskCreated, TaskCompleted, IssueCreated, IssueResolved, DocumentUploaded, MemberAdded, DailyEntryCreated, WorkspaceSwitched
   - Update metrics reactively via patchState based on events

3. **Create OverviewContextProvider**
   - Define abstract class in `application/providers/overview-context.provider.ts`
   - Implement methods: `getWorkspaceMetrics()`, `getModuleStats(moduleId)`
   - Provide implementation for other modules to query overview data

### Phase 2: Enhance UI Components

**Priority: MEDIUM** - Improve user experience and visualization

1. **Widget System**
   - Create individual widget components (MetricCardComponent, ActivityFeedWidget, ChartWidget)
   - Implement drag-and-drop grid layout (consider Angular CDK Drag & Drop)
   - Add widget visibility toggle and ordering controls
   - Persist user preferences in workspace settings

2. **Visualization Components**
   - Implement chart components using a library (Chart.js, ngx-charts, or ECharts)
   - Create BurndownChartComponent, BurnupChartComponent
   - Create IssuesTrendChartComponent, TeamWorkloadChartComponent
   - Use @defer (on viewport) for chart components

3. **Activity Timeline Enhancement**
   - Add filtering UI (by type, actor, date range)
   - Add keyword search
   - Implement pagination or virtual scrolling for large datasets
   - Add activity icons based on type

### Phase 3: Advanced Features

**Priority: LOW** - Extended functionality per spec

1. **Assignee View**
   - Group tasks by assignee
   - Display workload distribution
   - Show activity and contribution metrics per member

2. **Gantt Chart Summary**
   - Display important tasks on timeline
   - Show dependencies and milestones
   - Filter to critical path items only

3. **Performance Optimization**
   - Implement @defer for all heavy views
   - Add loading states with skeleton screens
   - Optimize computed signals to minimize recalculation
   - Add memoization where appropriate

## Implementation Guidance

### Objectives

1. **Compliance**: Align with workspace modular architecture specification
2. **Decoupling**: Remove direct store dependencies between modules
3. **Reactivity**: Implement pure event-driven state updates
4. **Usability**: Provide comprehensive dashboard with customization options
5. **Performance**: Meet Core Web Vitals targets (LCP < 2.5s, INP < 200ms, CLS < 0.1)

### Key Tasks

#### Immediate (Fix Violations)

- [ ] Move event subscriptions from component to store withHooks
- [ ] Remove direct store injections from component
- [ ] Update component to read only from OverviewStore
- [ ] Create OverviewContextProvider abstract class
- [ ] Implement OverviewContextProvider in store

#### Short-term (Core Features)

- [ ] Create metric card widget components
- [ ] Create activity timeline widget component
- [ ] Implement widget visibility preferences
- [ ] Add basic chart components (burndown, issue trend)
- [ ] Implement responsive grid layout

#### Long-term (Advanced Features)

- [ ] Add drag-and-drop widget positioning
- [ ] Implement all required chart types
- [ ] Create assignee view components
- [ ] Add Gantt chart summary
- [ ] Implement user preference persistence and sync

### Dependencies

**Required from Other Modules**:
- WorkspaceEventBus (already available)
- WorkspaceContextProvider (already available)
- Event contracts: TaskCreated, TaskCompleted, IssueCreated, IssueResolved, DocumentUploaded, MemberAdded, DailyEntryCreated

**External Libraries to Consider**:
- Angular CDK (for drag-and-drop)
- Chart library (Chart.js, ngx-charts, or Apache ECharts)
- Angular Material M3 (already in use)
- Tailwind CSS (already in use)

### Success Criteria

1. **Architecture Compliance**:
   - No direct module store injections
   - All updates via Event Bus
   - OverviewContextProvider available for other modules

2. **Functional Completeness**:
   - All required metrics displayed
   - Activity feed with filtering
   - Minimum 4 chart types implemented
   - Responsive layout working on all screen sizes

3. **Performance**:
   - LCP < 2.5s
   - INP < 200ms
   - CLS < 0.1
   - Charts use @defer (on viewport)

4. **User Experience**:
   - Widgets can be hidden/shown
   - User preferences persist
   - Keyboard navigation works
   - Screen reader compatible

5. **Code Quality**:
   - All tests passing (unit, integration, e2e)
   - No 'any' types
   - TypeScript strict mode compliant
   - All control flow uses @if/@for/@switch
