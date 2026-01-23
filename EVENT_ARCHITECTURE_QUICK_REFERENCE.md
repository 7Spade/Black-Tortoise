# Event Architecture - Quick Reference

## Quick Start

### 1. Publishing an Event

```typescript
// In Application Layer (Use Case or Store)
import { inject } from '@angular/core';
import { EventBus } from '@domain/event-bus/event-bus.interface';
import { EventStore } from '@domain/event-store/event-store.interface';
import { DomainEvent } from '@domain/event/domain-event';
import { EventType } from '@domain/event/event-type';
import { createEventMetadata } from '@domain/event/event-metadata';

// Create event
const event: DomainEvent = {
  eventId: crypto.randomUUID(),
  eventType: EventType.WORKSPACE_CREATED,
  aggregateId: 'workspace-123',
  workspaceId: 'workspace-123',
  timestamp: new Date(),
  causalityId: 'causality-chain-1',
  payload: {
    ownerId: 'user-456',
    ownerType: 'user',
    name: 'My Workspace'
  },
  metadata: createEventMetadata(1, 'user-456', 'correlation-1')
};

// Publish
const eventBus = inject(EventBus);
const eventStore = inject(EventStore);

await eventBus.publish(event);  // Real-time notification
await eventStore.append(event); // Persistence
```

### 2. Subscribing to Events

```typescript
// In Application Layer or Infrastructure
import { inject } from '@angular/core';
import { EventBus } from '@domain/event-bus/event-bus.interface';
import { WorkspaceCreated } from '@domain/event/domain-event';

const eventBus = inject(EventBus);

// Type-specific subscription
const unsubscribe = eventBus.subscribe<WorkspaceCreated>(
  'WorkspaceCreated',
  (event) => {
    console.log('Workspace created:', event.payload.name);
  }
);

// Global subscription (all events)
const unsubscribeAll = eventBus.subscribeAll((event) => {
  console.log('Event received:', event.eventType);
});

// Cleanup
unsubscribe();
unsubscribeAll();
```

### 3. Querying Events

```typescript
// In Application Layer
import { inject } from '@angular/core';
import { EventStore } from '@domain/event-store/event-store.interface';

const eventStore = inject(EventStore);

// By aggregate
const events = await eventStore.getEventsForAggregate('workspace-123');

// By workspace
const workspaceEvents = await eventStore.getEventsForWorkspace('workspace-123');

// By type
const createdEvents = await eventStore.getEventsByType('WorkspaceCreated');

// By causality chain
const relatedEvents = await eventStore.getEventsByCausality('causality-1');

// By time range
const recentEvents = await eventStore.getEventsSince(new Date('2024-01-01'));
```

### 4. Using the Application Store

```typescript
// In Component or Container
import { inject } from '@angular/core';
import { EventStoreSignal } from '@application/stores/event.store';

export class MyComponent {
  private eventStore = inject(EventStoreSignal);
  
  // Read state
  recentEvents = this.eventStore.recentEvents;
  hasEvents = this.eventStore.hasEvents;
  latestEvent = this.eventStore.latestEvent;
  
  // Publish event
  async publishEvent(event: DomainEvent) {
    this.eventStore.publishEvent({ 
      event, 
      eventBus: inject(EventBus),
      eventStore: inject(EventStore)
    });
  }
  
  // Load events
  loadWorkspaceEvents(workspaceId: string) {
    this.eventStore.loadEvents({ 
      eventStore: inject(EventStore),
      workspaceId 
    });
  }
}
```

## File Locations

### Domain (Interfaces & Value Objects)
```
src/app/domain/
├── event/
│   ├── domain-event.ts         # DomainEvent interface
│   ├── event-metadata.ts       # EventMetadata value object
│   ├── event-type.ts           # Event type constants
│   └── index.ts                # Barrel export
├── event-bus/
│   ├── event-bus.interface.ts  # EventBus contract
│   └── event-bus.interface.spec.ts  # Contract tests
└── event-store/
    ├── event-store.interface.ts     # EventStore contract
    └── event-store.interface.spec.ts # Contract tests
```

### Application (Use Cases & Stores)
```
src/app/application/
├── stores/
│   └── event.store.ts          # NgRx signals event store
└── events/
    ├── use-cases/
    │   ├── publish-event.use-case.ts  # Publish orchestration
    │   └── query-events.use-case.ts   # Query orchestration
    └── index.ts                # Barrel export
```

### Infrastructure (Implementations)
```
src/app/infrastructure/
└── events/
    ├── in-memory-event-bus.impl.ts      # EventBus implementation
    ├── in-memory-event-bus.impl.spec.ts # Tests
    ├── in-memory-event-store.impl.ts    # EventStore implementation
    ├── in-memory-event-store.impl.spec.ts # Tests
    └── index.ts                          # Barrel export
```

## Import Paths (tsconfig)

```typescript
// Domain
import { DomainEvent, EventMetadata, EventType } from '@domain/event';
import { EventBus } from '@domain/event-bus/event-bus.interface';
import { EventStore } from '@domain/event-store/event-store.interface';

// Application
import { EventStoreSignal } from '@application/stores/event.store';
import { PublishEventUseCase, QueryEventsUseCase } from '@application/events';

// Infrastructure
import { InMemoryEventBus, InMemoryEventStore } from '@infrastructure/events';
```

## Event Type Reference

```typescript
import { EventType } from '@domain/event/event-type';

// Workspace Events
EventType.WORKSPACE_CREATED
EventType.WORKSPACE_SWITCHED
EventType.WORKSPACE_RENAMED
EventType.WORKSPACE_DEACTIVATED
EventType.WORKSPACE_REACTIVATED
EventType.WORKSPACE_OWNERSHIP_TRANSFERRED

// Module Events
EventType.MODULE_ACTIVATED
EventType.MODULE_DEACTIVATED
EventType.MODULE_REGISTERED
EventType.MODULE_UNREGISTERED

// Task Events
EventType.TASK_CREATED
EventType.TASK_UPDATED
EventType.TASK_COMPLETED
EventType.TASK_DELETED

// Document Events
EventType.DOCUMENT_UPLOADED
EventType.DOCUMENT_DELETED
EventType.DOCUMENT_SHARED
```

## Testing

### Domain Contract Tests
```typescript
import { testEventBusContract } from '@domain/event-bus/event-bus.interface.spec';
import { testEventStoreContract } from '@domain/event-store/event-store.interface.spec';
import { MyEventBusImpl } from './my-event-bus.impl';
import { MyEventStoreImpl } from './my-event-store.impl';

// Your implementation MUST pass these tests
testEventBusContract(() => new MyEventBusImpl());
testEventStoreContract(() => new MyEventStoreImpl());
```

### Implementation Tests
```typescript
describe('MyEventBus', () => {
  // Contract tests (mandatory)
  testEventBusContract(() => new MyEventBus());
  
  // Implementation-specific tests (optional)
  it('should have custom feature', () => {
    // Test implementation-specific behavior
  });
});
```

## DDD Compliance Checklist

✅ Domain layer has NO framework imports (pure TypeScript)
✅ Domain layer defines ONLY interfaces and value objects
✅ Application layer uses NgRx signals for state
✅ Application layer orchestrates via use cases
✅ Infrastructure layer implements domain interfaces
✅ Infrastructure layer is swappable without affecting domain
✅ Contract tests ensure implementation compliance
✅ All imports use tsconfig path mappings

## Common Patterns

### Creating a New Event Type

1. Add constant to `domain/event/event-type.ts`:
```typescript
export const EventType = {
  // ...
  MY_NEW_EVENT: 'MyNewEvent',
} as const;
```

2. Define event interface in `domain/event/domain-event.ts`:
```typescript
export interface MyNewEventPayload {
  readonly field1: string;
  readonly field2: number;
}

export interface MyNewEvent extends DomainEvent<MyNewEventPayload> {
  readonly eventType: 'MyNewEvent';
}
```

3. Use it:
```typescript
const event: MyNewEvent = {
  eventId: crypto.randomUUID(),
  eventType: EventType.MY_NEW_EVENT,
  // ... rest of fields
  payload: {
    field1: 'value',
    field2: 123
  }
};
```

### Implementing a New EventStore

1. Implement `EventStore` interface:
```typescript
import { EventStore } from '@domain/event-store/event-store.interface';

export class FirestoreEventStore implements EventStore {
  async append(event: DomainEvent): Promise<void> {
    // Implementation
  }
  // ... implement all methods
}
```

2. Test against contract:
```typescript
import { testEventStoreContract } from '@domain/event-store/event-store.interface.spec';

testEventStoreContract(() => new FirestoreEventStore());
```

## Best Practices

1. **Always use EventType constants** - Never hardcode event type strings
2. **Always set causalityId** - Essential for event sourcing
3. **Use metadata** - Helps with debugging and auditing
4. **Test against contracts** - Ensures compliance with domain contracts
5. **Keep payloads serializable** - No functions, classes, or circular refs
6. **Version your events** - Use metadata.version for schema evolution
7. **Immutable events** - Never modify events after creation
8. **Async handlers** - Event handlers can be async
9. **Error handling** - Use try/catch in event handlers
10. **Cleanup subscriptions** - Always unsubscribe when done

## Migration from Deprecated Code

```typescript
// OLD (Deprecated - DDD Violation)
import { InMemoryEventStore } from '@domain/event-store/in-memory-event-store';
import { WorkspaceEventBus } from '@domain/event-bus/workspace-event-bus';

// NEW (DDD Compliant)
import { InMemoryEventStore } from '@infrastructure/events';
import { InMemoryEventBus } from '@infrastructure/events';
```
