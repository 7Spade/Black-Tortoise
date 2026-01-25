# Event Sourcing Architecture - Visual Guide

## Complete Event Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER (UI)                             │
│                                                                              │
│  ┌────────────────────┐                                                     │
│  │  Component/Module  │                                                     │
│  │                    │                                                     │
│  │  onUserAction() {  │                                                     │
│  │    useCase.execute │   ❌ NO direct eventBus.publish()                  │
│  │  }                 │   ❌ NO direct store.mutation()                    │
│  └──────┬─────────────┘   ✅ ONLY call Use Cases                           │
│         │                 ✅ ONLY read from Stores                          │
│         │ (delegate)                                                        │
└─────────┼────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         APPLICATION LAYER (Orchestration)                    │
│                                                                              │
│  ┌────────────────────┐                                                     │
│  │  MyActionUseCase   │                                                     │
│  │                    │                                                     │
│  │  1. Create Event   │────────┐                                           │
│  │  2. Publish Event  │        │                                           │
│  └────────┬───────────┘        │                                           │
│           │                    │                                           │
│           ▼                    │                                           │
│  ┌────────────────────┐        │                                           │
│  │ PublishEventUseCase│        │                                           │
│  │                    │        │                                           │
│  │  validate(event)   │        │                                           │
│  │  append(event) ───────────┐ │                                           │
│  │  publish(event) ──────────┼─┼──┐                                        │
│  └────────────────────┘       │ │  │                                        │
│                               │ │  │                                        │
└───────────────────────────────┼─┼──┼────────────────────────────────────────┘
                                │ │  │
         ┌──────────────────────┘ │  │
         │  (append)               │  │
         ▼                         │  │
┌─────────────────────────────────┼──┼────────────────────────────────────────┐
│                    INFRASTRUCTURE LAYER (Persistence)                        │
│                                  │  │                                        │
│  ┌──────────────────────┐        │  │                                        │
│  │   EventStore (DB)    │◄───────┘  │                                        │
│  │                      │            │                                        │
│  │  append(event) {     │            │                                        │
│  │    events.push(e)    │  ✅ Append-Only                                   │
│  │    return            │  ✅ Immutable                                      │
│  │  }                   │  ✅ Replay-Safe                                    │
│  │                      │                                                    │
│  │  getEventsByCausality│  Query Support:                                   │
│  │  getEventsForAggregate│  - Aggregate reconstruction                      │
│  │  getEventsInRange    │  - Time travel                                    │
│  └──────────────────────┘  - Causality tracking                             │
│                                                                              │
│  ┌──────────────────────┐                                                   │
│  │   EventBus (PubSub)  │◄───────────┘                                      │
│  │                      │                                                    │
│  │  publish(event) {    │  (publish)                                        │
│  │    subscribers.notify│                                                    │
│  │  }                   │                                                    │
│  └──────────┬───────────┘                                                   │
│             │                                                                │
└─────────────┼──────────────────────────────────────────────────────────────┘
              │ (notify all subscribers)
              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER (Event Handlers)                        │
│                                                                              │
│  ┌────────────────────────────┐                                             │
│  │  registerEventHandlers()   │                                             │
│  │                            │                                             │
│  │  eventBus.subscribe(       │                                             │
│  │    'MyEvent',              │                                             │
│  │    (e) => store.handle(e)  │                                             │
│  │  )                         │                                             │
│  └─────────────┬──────────────┘                                             │
│                │                                                             │
│                ▼                                                             │
│  ┌────────────────────────────┐                                             │
│  │  MyStore (Signal Store)    │                                             │
│  │                            │                                             │
│  │  handleMyEvent(event) {    │   ✅ State mutations ONLY here             │
│  │    patchState({            │   ✅ Triggered by events                   │
│  │      items: updated        │   ✅ No direct calls from presentation     │
│  │    })                      │                                             │
│  │  }                         │                                             │
│  └─────────────┬──────────────┘                                             │
│                │                                                             │
│                │ (state change)                                              │
└────────────────┼───────────────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER (Reactive UI)                     │
│                                                                              │
│  ┌────────────────────┐                                                     │
│  │  Component         │                                                     │
│  │                    │                                                     │
│  │  <div>             │                                                     │
│  │    {{ store.items() }}  ← Signal reads (auto-reactive)                  │
│  │  </div>            │                                                     │
│  └────────────────────┘                                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Causality Chain Tracking

```
User Action
    │
    ▼
┌─────────────────────────┐
│ Event A                 │
│ eventId: aaa-111        │
│ correlationId: aaa-111  │◄──── First in chain (correlation = own ID)
│ causationId: null       │◄──── No parent
└──────────┬──────────────┘
           │ (triggers)
           ▼
┌─────────────────────────┐
│ Event B (derived)       │
│ eventId: bbb-222        │
│ correlationId: aaa-111  │◄──── Same correlation (from A)
│ causationId: aaa-111    │◄──── Caused by Event A
└──────────┬──────────────┘
           │ (triggers)
           ▼
┌─────────────────────────┐
│ Event C (derived)       │
│ eventId: ccc-333        │
│ correlationId: aaa-111  │◄──── Same correlation (from A)
│ causationId: bbb-222    │◄──── Caused by Event B
└─────────────────────────┘

Query by correlationId = 'aaa-111' returns [A, B, C]
Build causality graph: A → B → C
```

## Event Replay for State Reconstruction

```
┌──────────────────┐
│  EventStore      │
│  (Event Log)     │
│                  │
│  [Event A]       │
│  [Event B]       │───┐
│  [Event C]       │   │
│  [Event D]       │   │  Replay Events
│  ...             │   │
└──────────────────┘   │
                       ▼
              ┌────────────────┐
              │ Replay Engine  │
              │                │
              │ foreach event: │
              │   store.handle │
              └───────┬────────┘
                      │
                      ▼
              ┌────────────────┐
              │ Store (Empty)  │───► handle(Event A) ───┐
              └────────────────┘                        │
                      │                                  │
                      ▼                                  │
              ┌────────────────┐                        │
              │ Store          │◄───────────────────────┘
              │ state: {...A}  │───► handle(Event B) ───┐
              └────────────────┘                        │
                      │                                  │
                      ▼                                  │
              ┌────────────────┐                        │
              │ Store          │◄───────────────────────┘
              │ state: {...B}  │───► handle(Event C) ───┐
              └────────────────┘                        │
                      ...                                │
                                                         │
                                    ┌────────────────────┘
                                    ▼
                            ┌────────────────┐
                            │ Store (Final)  │
                            │ state: current │
                            └────────────────┘
```

## Module Event Flow Example

```
Acceptance Module Example:

┌────────────────────────────────────┐
│ AcceptanceModule (Presentation)    │
│                                    │
│ approveTask(taskId) {              │
│   this.approveTaskUseCase.execute({│◄── User clicks "Approve"
│     taskId,                        │
│     workspaceId,                   │
│     approverId,                    │
│     notes                          │
│   })                               │
│ }                                  │
└────────────────┬───────────────────┘
                 │
                 ▼
┌────────────────────────────────────┐
│ ApproveTaskUseCase                 │
│                                    │
│ 1. Create AcceptanceApprovedEvent  │
│    - taskId                        │
│    - workspaceId                   │
│    - approverId                    │
│    - notes                         │
│                                    │
│ 2. publishEvent.execute({ event }) │
│    └─► PublishEventUseCase         │
│        ├─► EventStore.append(e)    │ ✅ Persisted
│        └─► EventBus.publish(e)     │ ✅ Published
└────────────────────────────────────┘
                 │
                 │ (EventBus notifies)
                 ▼
┌────────────────────────────────────┐
│ AcceptanceStore                    │
│                                    │
│ handleAcceptanceApproved(event) {  │
│   const updated = tasks.map(t =>   │
│     t.taskId === event.payload.id  │
│     ? { ...t, status: 'approved' } │
│     : t                            │
│   )                                │
│   patchState({ tasks: updated })   │ ✅ State mutated
│ }                                  │
└────────────────┬───────────────────┘
                 │
                 │ (Signal change)
                 ▼
┌────────────────────────────────────┐
│ AcceptanceModule (UI Update)       │
│                                    │
│ @if (store.approvedTasks().length) │
│   <div>                            │
│     Approved: {{ count }}          │◄── Auto-updates
│   </div>                           │
│ }                                  │
└────────────────────────────────────┘
```

## Key Architectural Invariants

1. **Append-Only EventStore**
   - Events are NEVER modified
   - Events are NEVER deleted
   - Only append operation supported
   - Replay-safe by design

2. **Causality Tracking**
   - `correlationId` tracks entire workflow
   - `causationId` tracks immediate parent
   - Forms directed acyclic graph (DAG)
   - Enables root cause analysis

3. **State Derivation**
   - State = reduce(events, initialState)
   - Any state can be computed from events
   - Time travel = replay to timestamp
   - Snapshots optional for performance

4. **Layer Boundaries**
   - Presentation: READ from stores, WRITE via Use Cases
   - Application: Orchestrate domain logic, Handle events
   - Domain: Pure business logic, No framework dependencies
   - Infrastructure: EventBus, EventStore implementations

5. **Event Publishing Order**
   - ALWAYS: append → publish
   - NEVER: publish → append
   - Ensures persistence before notification
   - Prevents lost events
