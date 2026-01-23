# Workspace Event Architecture - Visual Reference

## Current Architecture (Partial Compliance)

```
┌────────────────────────────────────────────────────────────────┐
│ PRESENTATION LAYER                                             │
│                                                                │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │  Module A    │    │  Module B    │    │  Header      │   │
│  │  Component   │    │  Component   │    │  Component   │   │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘   │
│         │                   │                   │            │
│         │ @Input()         │ @Input()          │ inject()   │
│         │ eventBus         │ eventBus          │            │
└─────────┼───────────────────┼───────────────────┼────────────┘
          │                   │                   │
          │                   │                   │
┌─────────▼───────────────────▼───────────────────▼────────────┐
│ APPLICATION LAYER                                             │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ IModuleEventBus (workspace-scoped) ✅                   │ │
│  │ - workspaceId: string                                   │ │
│  │ - publish(event)                                        │ │
│  │ - subscribe(type, handler)                              │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ EventStoreSignal (providedIn: 'root') ❌                │ │
│  │ GLOBAL STATE - ALL WORKSPACES SHARE                     │ │
│  │ - recentEvents: DomainEvent[]  // MIXED WORKSPACE DATA  │ │
│  │ - eventCount: number                                    │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ PresentationStore (providedIn: 'root') ❌               │ │
│  │ GLOBAL STATE - ALL WORKSPACES SHARE                     │ │
│  │ - notifications: NotificationItem[]  // MIXED DATA      │ │
│  │ - searchQuery: string               // MIXED DATA      │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ WorkspaceRuntimeFactory                                 │ │
│  │ - runtimes: Map<workspaceId, WorkspaceRuntime>          │ │
│  │   ✅ Per-workspace isolation                            │ │
│  └─────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
          │
          │
┌─────────▼───────────────────────────────────────────────────┐
│ INFRASTRUCTURE LAYER                                         │
│                                                              │
│  Per-Workspace Runtime #1 (workspace-a)                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ InMemoryEventBus                                       │ │
│  │ - workspaceId: "workspace-a"                           │ │
│  │ - events$: Subject<DomainEvent>                        │ │
│  │ - subscriptions: Map<...>                              │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Per-Workspace Runtime #2 (workspace-b)                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ InMemoryEventBus                                       │ │
│  │ - workspaceId: "workspace-b"                           │ │
│  │ - events$: Subject<DomainEvent>                        │ │
│  │ - subscriptions: Map<...>                              │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Shared Global Store (VIOLATION) ❌                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ InMemoryEventStore                                     │ │
│  │ - events: DomainEvent[]  // ALL WORKSPACES MIXED       │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

## Target Architecture (Full Compliance)

```
┌────────────────────────────────────────────────────────────────┐
│ PRESENTATION LAYER                                             │
│                                                                │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │  Module A    │    │  Module B    │    │  Header      │   │
│  │  Component   │    │  Component   │    │  Component   │   │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘   │
│         │                   │                   │            │
│         │ @Input()         │ @Input()          │ runtime    │
│         │ eventBus         │ eventBus          │            │
└─────────┼───────────────────┼───────────────────┼────────────┘
          │                   │                   │
          │                   │                   │
┌─────────▼───────────────────▼───────────────────▼────────────┐
│ APPLICATION LAYER                                             │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ IModuleEventBus (workspace-scoped) ✅                   │ │
│  │ - workspaceId: string                                   │ │
│  │ - publish(event)                                        │ │
│  │ - subscribe(type, handler)                              │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ WorkspaceRuntimeFactory                                 │ │
│  │                                                          │ │
│  │ runtimes: Map<workspaceId, WorkspaceRuntime>            │ │
│  │                                                          │ │
│  │ WorkspaceRuntime {                                      │ │
│  │   context: WorkspaceContext                             │ │
│  │   eventBus: WorkspaceEventBus          ✅ SCOPED        │ │
│  │   eventStore: WorkspaceEventStore      ✅ SCOPED        │ │
│  │   presentationStore: WorkspacePresStore ✅ SCOPED       │ │
│  │ }                                                        │ │
│  └─────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
          │
          │
┌─────────▼───────────────────────────────────────────────────┐
│ INFRASTRUCTURE LAYER                                         │
│                                                              │
│  Per-Workspace Runtime #1 (workspace-a) ✅ ISOLATED         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ InMemoryEventBus                                       │ │
│  │ - workspaceId: "workspace-a"                           │ │
│  │ - events$: Subject<DomainEvent>                        │ │
│  │                                                        │ │
│  │ WorkspaceEventStore (Factory)                          │ │
│  │ - workspaceId: "workspace-a"                           │ │
│  │ - recentEvents: DomainEvent[]  // ONLY workspace-a     │ │
│  │                                                        │ │
│  │ WorkspacePresentationStore (Factory)                   │ │
│  │ - workspaceId: "workspace-a"                           │ │
│  │ - notifications: []            // ONLY workspace-a     │ │
│  │ - searchQuery: ""             // ONLY workspace-a     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Per-Workspace Runtime #2 (workspace-b) ✅ ISOLATED         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ InMemoryEventBus                                       │ │
│  │ - workspaceId: "workspace-b"                           │ │
│  │ - events$: Subject<DomainEvent>                        │ │
│  │                                                        │ │
│  │ WorkspaceEventStore (Factory)                          │ │
│  │ - workspaceId: "workspace-b"                           │ │
│  │ - recentEvents: DomainEvent[]  // ONLY workspace-b     │ │
│  │                                                        │ │
│  │ WorkspacePresentationStore (Factory)                   │ │
│  │ - workspaceId: "workspace-b"                           │ │
│  │ - notifications: []            // ONLY workspace-b     │ │
│  │ - searchQuery: ""             // ONLY workspace-b     │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

## Event Flow Comparison

### Current Flow (Violation)

```
User in Workspace A publishes event
    │
    ▼
ModuleComponent.publishEvent()
    │
    ▼
IModuleEventBus.publish(event)  ✅ Workspace-scoped
    │
    ▼
InMemoryEventBus (workspace-a).publish()  ✅ Isolated
    │
    ├─► RxJS Subject → Subscribers in workspace-a  ✅ Isolated
    │
    └─► EventStoreSignal.publishEvent()  ❌ GLOBAL
        │
        ▼
        Global EventStoreSignal.recentEvents.push(event)
        │
        ▼
        ❌ Event from workspace-a stored in GLOBAL cache
        ❌ User in workspace-b can query this event
```

### Target Flow (Compliant)

```
User in Workspace A publishes event
    │
    ▼
ModuleComponent.publishEvent()
    │
    ▼
IModuleEventBus.publish(event)  ✅ Workspace-scoped
    │
    ▼
InMemoryEventBus (workspace-a).publish()  ✅ Isolated
    │
    ├─► RxJS Subject → Subscribers in workspace-a  ✅ Isolated
    │
    └─► runtime.eventStore.appendEvent(event)  ✅ SCOPED
        │
        ▼
        WorkspaceEventStore (workspace-a).recentEvents.push(event)
        │
        ▼
        ✅ Event stored in workspace-a's isolated cache
        ✅ User in workspace-b CANNOT query this event
```

## Workspace Switching Scenario

### Current Behavior (Bug)

```
Step 1: User in Workspace A
  - EventStoreSignal.recentEvents = [eventA1, eventA2]
  - PresentationStore.notifications = [notifA1]
  - PresentationStore.searchQuery = "search in A"

Step 2: User switches to Workspace B
  - WorkspaceContextStore.currentWorkspace = workspace-b
  - InMemoryEventBus (workspace-a).clear() ✅
  - New InMemoryEventBus (workspace-b) created ✅

Step 3: State in Workspace B
  - EventStoreSignal.recentEvents = [eventA1, eventA2] ❌ LEAKED
  - PresentationStore.notifications = [notifA1] ❌ LEAKED
  - PresentationStore.searchQuery = "search in A" ❌ LEAKED
  - InMemoryEventBus (workspace-b) ✅ CLEAN (new instance)

Result: ❌ Stale data from workspace A visible in workspace B
```

### Target Behavior (Fixed)

```
Step 1: User in Workspace A
  Runtime A:
    - eventStore.recentEvents = [eventA1, eventA2]
    - presentationStore.notifications = [notifA1]
    - presentationStore.searchQuery = "search in A"

Step 2: User switches to Workspace B
  - WorkspaceContextStore.currentWorkspace = workspace-b
  - runtime A.eventBus.clear() ✅
  - runtime A.eventStore.clearCache() ✅ NEW
  - runtime A.presentationStore.reset() ✅ NEW
  - Runtime B retrieved (or created)

Step 3: State in Workspace B
  Runtime B:
    - eventStore.recentEvents = [] ✅ CLEAN
    - presentationStore.notifications = [] ✅ CLEAN
    - presentationStore.searchQuery = "" ✅ CLEAN
    - eventBus ✅ NEW INSTANCE

Result: ✅ Complete isolation between workspaces
```

## Data Flow Matrix

| Component | Current | Target | Change |
|-----------|---------|--------|--------|
| **Event Bus** | ✅ Per-workspace instance | ✅ Per-workspace instance | No change |
| **Event Store Cache** | ❌ Global singleton | ✅ Per-workspace instance | Factory function |
| **Presentation Store** | ❌ Global singleton | ✅ Per-workspace instance | Factory function |
| **Module Event Bus** | ✅ Scoped via @Input | ✅ Scoped via @Input | No change |
| **Workspace Runtime** | ✅ Per-workspace map | ✅ Enhanced with stores | Add 2 properties |
| **Use-Cases** | ⚠️ Inject abstracts | ✅ Require workspaceId | Add parameter |

## Architecture Compliance Score

### Before Fixes
```
┌────────────────────────────────────────┐
│ Component            Score   Compliant │
├────────────────────────────────────────┤
│ Event Bus            100%   ✅        │
│ Event Store          30%    ❌        │
│ Presentation Store   0%     ❌        │
│ Module Communication 100%   ✅        │
│ Use-Cases            60%    ⚠️         │
│ Lifecycle Management 90%    ✅        │
├────────────────────────────────────────┤
│ OVERALL              63%    ⚠️         │
└────────────────────────────────────────┘
```

### After Fixes
```
┌────────────────────────────────────────┐
│ Component            Score   Compliant │
├────────────────────────────────────────┤
│ Event Bus            100%   ✅        │
│ Event Store          100%   ✅        │
│ Presentation Store   100%   ✅        │
│ Module Communication 100%   ✅        │
│ Use-Cases            100%   ✅        │
│ Lifecycle Management 100%   ✅        │
├────────────────────────────────────────┤
│ OVERALL              100%   ✅        │
└────────────────────────────────────────┘
```

## Key Architectural Principles

### ✅ What Works (Keep)

1. **Per-Workspace Event Bus**
   - Each workspace gets isolated `InMemoryEventBus` instance
   - RxJS Subject scoped to single workspace
   - Proper cleanup on workspace destroy

2. **Module Communication Pattern**
   - Modules receive event bus via `@Input()` (not injection)
   - No direct store/use-case dependencies in modules
   - Clean separation via `IModuleEventBus` interface

3. **Workspace Runtime Factory**
   - Map-based storage for per-workspace runtimes
   - Proper lifecycle (create/destroy)
   - Centralized isolation management

4. **DDD Layer Boundaries**
   - Domain layer pure TypeScript (no framework)
   - Application layer uses domain interfaces
   - Infrastructure provides concrete implementations

### ❌ What Violates (Fix)

1. **Global Event Store**
   - `EventStoreSignal` provided in 'root' scope
   - Single `recentEvents` array for all workspaces
   - No cleanup on workspace switch

2. **Global Presentation Store**
   - `PresentationStore` provided in 'root' scope
   - Notifications/search mixed across workspaces
   - Stale data on workspace switch

3. **Abstract Injection in Use-Cases**
   - Use-cases inject `EventBus`/`EventStore` abstracts
   - No workspace context binding
   - Fragile architecture (future global provider risk)

### 🎯 Design Goals

- **Workspace Isolation:** No data leakage between workspaces
- **Memory Efficiency:** Cleanup on workspace destroy
- **Type Safety:** Compile-time enforcement of workspace scoping
- **DDD Compliance:** Proper layer boundaries
- **Minimal Change:** ~180 LOC, 2-3 hours effort

---

**Legend:**
- ✅ Compliant / Working correctly
- ❌ Violation / Needs fix
- ⚠️ Partial compliance / At risk
