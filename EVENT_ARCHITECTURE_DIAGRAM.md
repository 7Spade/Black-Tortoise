# Event Architecture - DDD Layer Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                              │
│                        (Angular Components)                             │
│                                                                         │
│  ┌─────────────────┐                                                   │
│  │   Components    │  (Not modified in this task)                      │
│  │                 │  Will inject EventStoreSignal for UI events       │
│  └─────────────────┘                                                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ inject()
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                                │
│                    (Use Cases + NgRx Signals)                          │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  EventStoreSignal (signalStore)                                  │  │
│  │  ┌────────────────────────────────────────────────────────────┐  │  │
│  │  │ State:                                                      │  │  │
│  │  │ - recentEvents: DomainEvent[]                              │  │  │
│  │  │ - eventCount: number                                       │  │  │
│  │  │ - isPublishing: boolean                                    │  │  │
│  │  │ - error: string | null                                     │  │  │
│  │  │                                                             │  │  │
│  │  │ Computed:                                                   │  │  │
│  │  │ - hasEvents()                                              │  │  │
│  │  │ - getEventsByType()                                        │  │  │
│  │  │ - latestEvent()                                            │  │  │
│  │  │                                                             │  │  │
│  │  │ Methods:                                                    │  │  │
│  │  │ - publishEvent() [rxMethod]                                │  │  │
│  │  │ - loadEvents() [rxMethod]                                  │  │  │
│  │  │ - clearCache()                                             │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌────────────────────┐         ┌────────────────────┐                │
│  │ PublishEventUseCase│         │ QueryEventsUseCase │                │
│  │ ┌────────────────┐ │         │ ┌────────────────┐ │                │
│  │ │ execute()      │ │         │ │ execute()      │ │                │
│  │ │ validateEvent()│ │         │ │                │ │                │
│  │ └────────────────┘ │         │ └────────────────┘ │                │
│  └────────────────────┘         └────────────────────┘                │
│           │                                 │                          │
│           │ inject()                        │ inject()                 │
│           ▼                                 ▼                          │
└─────────────────────────────────────────────────────────────────────────┘
                    │                         │
                    │ depends on              │ depends on
                    ▼                         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          DOMAIN LAYER                                   │
│                    (Pure TypeScript - NO Framework)                    │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ INTERFACES (Contracts)                                         │    │
│  │                                                                 │    │
│  │  EventBus Interface           EventStore Interface             │    │
│  │  ┌──────────────────┐         ┌──────────────────┐            │    │
│  │  │ publish()        │         │ append()         │            │    │
│  │  │ publishBatch()   │         │ appendBatch()    │            │    │
│  │  │ subscribe()      │         │ getEvents...()   │            │    │
│  │  │ subscribeAll()   │         │ (9 query methods)│            │    │
│  │  │ unsubscribe()    │         │                  │            │    │
│  │  │ clear()          │         │                  │            │    │
│  │  └──────────────────┘         └──────────────────┘            │    │
│  │                                                                 │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ VALUE OBJECTS & TYPES                                          │    │
│  │                                                                 │    │
│  │  DomainEvent<TPayload>        EventMetadata (VO)               │    │
│  │  ┌──────────────────┐         ┌──────────────────┐            │    │
│  │  │ eventId          │         │ version          │            │    │
│  │  │ eventType        │         │ userId?          │            │    │
│  │  │ aggregateId      │         │ correlationId?   │            │    │
│  │  │ workspaceId      │         │ causationId?     │            │    │
│  │  │ timestamp        │         └──────────────────┘            │    │
│  │  │ causalityId      │                                         │    │
│  │  │ payload          │         EventType (Constants)           │    │
│  │  │ metadata         │         ┌──────────────────┐            │    │
│  │  └──────────────────┘         │ WORKSPACE_*      │            │    │
│  │                               │ MODULE_*         │            │    │
│  │                               │ TASK_*           │            │    │
│  │                               │ DOCUMENT_*       │            │    │
│  │                               └──────────────────┘            │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ CONTRACT TESTS (Specification)                                 │    │
│  │                                                                 │    │
│  │  testEventBusContract()     testEventStoreContract()           │    │
│  │  - 7 test scenarios         - 8 test scenarios                 │    │
│  │  - All implementations      - All implementations              │    │
│  │    MUST pass these           MUST pass these                   │    │
│  └────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                    ▲
                                    │ implements
                                    │
┌─────────────────────────────────────────────────────────────────────────┐
│                      INFRASTRUCTURE LAYER                               │
│                  (Framework-Specific Implementations)                  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  InMemoryEventBus (implements EventBus)                          │  │
│  │  ┌────────────────────────────────────────────────────────────┐  │  │
│  │  │ - Uses Map<string, Set<EventHandler>>                      │  │  │
│  │  │ - Synchronous publish/subscribe                            │  │  │
│  │  │ - Type-based and global subscriptions                      │  │  │
│  │  │ - No RxJS dependency (pure Map/Set)                        │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  InMemoryEventStore (implements EventStore)                      │  │
│  │  ┌────────────────────────────────────────────────────────────┐  │  │
│  │  │ - Uses DomainEvent[] array                                 │  │  │
│  │  │ - Supports all 9 query methods:                            │  │  │
│  │  │   • getEventsForAggregate()                                │  │  │
│  │  │   • getEventsForWorkspace()                                │  │  │
│  │  │   • getEventsSince()                                       │  │  │
│  │  │   • getEventsByCausality()                                 │  │  │
│  │  │   • getEventsByType()                                      │  │  │
│  │  │   • getEventsInRange()                                     │  │  │
│  │  │ - In-memory only (no persistence)                          │  │  │
│  │  │ - For testing/development                                  │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Future: FirestoreEventStore (implements EventStore)            │  │
│  │  - Production-ready persistence                                  │  │
│  │  - Firestore collection-based storage                            │  │
│  │  - Real-time sync capabilities                                   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

## Event Lifecycle Flow

```
┌──────────────┐
│ User Action  │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────┐
│ 1. Create DomainEvent                            │
│    - Generate eventId                            │
│    - Set eventType (from EventType constants)    │
│    - Add payload                                 │
│    - Create metadata (causality, correlation)    │
└──────┬───────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────┐
│ 2. Publish via EventBus                          │
│    - eventBus.publish(event)                     │
│    - Notify all type-specific subscribers        │
│    - Notify all global subscribers               │
└──────┬───────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────┐
│ 3. Persist via EventStore                        │
│    - eventStore.append(event)                    │
│    - Append to immutable event log               │
│    - Enable event sourcing / replay              │
└──────┬───────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────┐
│ 4. Update Application State                     │
│    - patchState({ recentEvents: [...] })        │
│    - Update signals reactively                   │
│    - Trigger computed() recalculations           │
└──────┬───────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────┐
│ 5. UI Updates Automatically                      │
│    - Signals propagate to components             │
│    - Change detection runs (zone-less)           │
│    - UI reflects new state                       │
└──────────────────────────────────────────────────┘
```

## Key Architectural Principles

1. **Dependency Inversion**: Application depends on Domain interfaces, Infrastructure implements them
2. **Single Responsibility**: Each layer has one clear purpose
3. **Interface Segregation**: EventBus and EventStore are separate concerns
4. **Open/Closed**: New event types added via constants, implementations can be swapped
5. **Liskov Substitution**: All implementations pass domain contract tests
