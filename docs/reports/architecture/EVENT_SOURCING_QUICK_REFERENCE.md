# Event Sourcing & DDD - Quick Reference Guide

## Golden Rule
**Presentation MUST NOT publish events or mutate state directly.**

## Event Lifecycle (Sacred Order)
```
create → append(EventStore) → publish(EventBus) → react
```

## How to Add a New User Action

### Step 1: Create Use Case (`application/{feature}/use-cases/`)
```typescript
import { inject, Injectable } from '@angular/core';
import { createMyDomainEvent } from '@domain/events/domain-events';
import { PublishEventUseCase } from '@application/events/use-cases/publish-event.use-case';

@Injectable({ providedIn: 'root' })
export class MyActionUseCase {
  private readonly publishEvent = inject(PublishEventUseCase);

  async execute(request: MyActionRequest): Promise<MyActionResponse> {
    // 1. Create domain event
    const event = createMyDomainEvent(...);
    
    // 2. Publish via PublishEventUseCase (append → publish)
    const result = await this.publishEvent.execute({ event });
    
    return result;
  }
}
```

### Step 2: Add Event Handler to Store (`application/{feature}/stores/`)
```typescript
withMethods((store) => ({
  /**
   * Handle MyDomainEvent
   * Event handler - mutates state in response to event
   */
  handleMyDomainEvent(event: MyDomainEvent): void {
    const updatedItems = store.items().map(item =>
      item.id === event.payload.id
        ? { ...item, status: event.payload.newStatus, updatedAt: event.timestamp }
        : item
    );
    patchState(store, { items: updatedItems });
  },
}))
```

### Step 3: Register Event Handler (`application/{feature}/handlers/`)
```typescript
export function registerMyFeatureEventHandlers(eventBus: EventBus): void {
  const myStore = inject(MyStore);
  
  eventBus.subscribe<MyDomainEvent>(
    'MyDomainEvent',
    (event) => myStore.handleMyDomainEvent(event)
  );
}
```

### Step 4: Call from Presentation
```typescript
export class MyComponent {
  private readonly myActionUseCase = inject(MyActionUseCase);
  
  async onUserAction(): Promise<void> {
    const result = await this.myActionUseCase.execute({
      // ... request data
    });
    
    if (!result.success) {
      console.error('Action failed:', result.error);
    }
  }
}
```

## Event Tracing (Causality Chain)

### Initial Event (User Action)
```typescript
const event = createMyEvent(...);
// correlationId: auto-generated UUID
// causationId: null (no parent)
```

### Derived Event (Triggered by Another Event)
```typescript
eventBus.subscribe<MyEvent>('MyEvent', (causeEvent) => {
  const derivedEvent = createDerivedEvent(
    ...,
    causeEvent.correlationId, // Propagate correlation
    causeEvent.eventId         // This event caused derived event
  );
  
  publishEvent.execute({ event: derivedEvent });
});
```

## Anti-Patterns (DON'T DO THIS)

### ❌ Direct Event Publishing from Presentation
```typescript
// BAD
onUserAction(): void {
  const event = createMyEvent(...);
  this.eventBus.publish(event); // WRONG - bypasses EventStore
}
```

### ❌ Direct State Mutation from Presentation
```typescript
// BAD
onUserAction(): void {
  this.myStore.updateItem(itemId, newData); // WRONG - not event-driven
}
```

### ❌ Publishing Before Appending
```typescript
// BAD (inside Use Case)
await this.eventBus.publish(event);   // WRONG ORDER
await this.eventStore.append(event);
```

### ❌ Business Logic in Presentation
```typescript
// BAD
onSubmit(): void {
  if (this.form.valid) {
    const calculatedValue = this.complexBusinessLogic(); // WRONG LAYER
    this.myStore.setValue(calculatedValue);
  }
}
```

## Correct Patterns (DO THIS)

### ✅ Event Publishing via Use Case
```typescript
// GOOD
onUserAction(): void {
  this.myActionUseCase.execute({
    // ... request data
  });
}
```

### ✅ State Changes via Events
```typescript
// GOOD (in Store)
handleMyEvent(event: MyEvent): void {
  patchState(store, { 
    value: event.payload.newValue,
    updatedAt: event.timestamp 
  });
}
```

### ✅ Append Before Publish
```typescript
// GOOD (in PublishEventUseCase)
await this.eventStore.append(event);   // FIRST
await this.eventBus.publish(event);    // THEN
```

## Domain Event Structure
```typescript
export interface DomainEvent<TPayload = Record<string, unknown>> {
  readonly eventId: string;          // UUID for this event
  readonly eventType: string;        // Event type discriminator
  readonly aggregateId: string;      // Aggregate root ID
  readonly workspaceId: string;      // Workspace context
  readonly timestamp: Date;          // When event occurred
  readonly correlationId: string;    // Causal chain root
  readonly causationId: string | null; // Direct parent event
  readonly payload: TPayload;        // Event-specific data
  readonly metadata: EventMetadata;  // Tracking info
}
```

## Debugging Event Flow

### 1. Check EventStore
```typescript
const events = await eventStore.getEventsForAggregate(aggregateId);
console.log('Event history:', events);
```

### 2. Check Causality Chain
```typescript
const chain = await eventStore.getEventsByCausality(correlationId);
console.log('Causality chain:', chain);
```

### 3. Verify Event Handlers
```typescript
// Event handlers should log when triggered
handleMyEvent(event: MyEvent): void {
  console.log('[MyStore] Handling MyEvent:', event);
  // ... state mutation
}
```

## Testing Event-Driven Code

### Test Use Case
```typescript
it('should publish event via PublishEventUseCase', async () => {
  const result = await useCase.execute(request);
  
  expect(result.success).toBe(true);
  expect(publishEventMock.execute).toHaveBeenCalledWith(
    expect.objectContaining({
      event: expect.objectContaining({
        eventType: 'MyEvent',
        correlationId: expect.any(String),
      })
    })
  );
});
```

### Test Event Handler
```typescript
it('should update state when event is handled', () => {
  const event = createMyEvent(...);
  
  store.handleMyEvent(event);
  
  expect(store.items()).toContainEqual(
    expect.objectContaining({
      id: event.payload.id,
      status: event.payload.newStatus,
    })
  );
});
```

## See Also
- `EVENT_SOURCING_REFACTORING_SUMMARY.md` - Detailed implementation notes
- `src/app/application/acceptance/` - Reference implementation
