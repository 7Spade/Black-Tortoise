# Before/After Code Examples - PR Comment 3796522349

## Example 1: Use-Case Injection

### Before (Direct Interface Injection)
```typescript
// publish-event.use-case.ts
import { inject, Injectable } from '@angular/core';
import { EventBus } from '@domain/event-bus/event-bus.interface';
import { EventStore } from '@domain/event-store/event-store.interface';

@Injectable({ providedIn: 'root' })
export class PublishEventUseCase {
  private readonly eventBus = inject(EventBus);      // ❌ Direct interface injection
  private readonly eventStore = inject(EventStore);  // ❌ Direct interface injection
  // ...
}
```

### After (Token-Based Injection)
```typescript
// publish-event.use-case.ts
import { inject, Injectable } from '@angular/core';
import { EVENT_BUS, EVENT_STORE } from '../tokens/event-infrastructure.tokens';

@Injectable({ providedIn: 'root' })
export class PublishEventUseCase {
  private readonly eventBus = inject(EVENT_BUS);      // ✅ Token-based injection
  private readonly eventStore = inject(EVENT_STORE);  // ✅ Token-based injection
  // ...
}
```

## Example 2: Provider Configuration

### Before (No Configuration)
```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    // ❌ No EventBus/EventStore providers - relies on direct class injection
  ],
};
```

### After (Token-Based Providers)
```typescript
// app.config.ts
import { EVENT_BUS, EVENT_STORE } from '@application/events';
import { InMemoryEventBus, InMemoryEventStore } from '@infrastructure/events';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    
    // ✅ Token-based providers - type-safe, swappable singletons
    {
      provide: EVENT_BUS,
      useClass: InMemoryEventBus
    },
    {
      provide: EVENT_STORE,
      useClass: InMemoryEventStore
    },
  ],
};
```

## Example 3: Domain Event Definitions

### Before (Events in domain-event.ts)
```typescript
// domain-event.ts
export interface DomainEvent<TPayload> {
  readonly eventId: string;
  readonly type: string;
  readonly aggregateId: string;
  readonly correlationId: string;
  readonly causationId: string | null;
  readonly timestamp: number;
  readonly payload: TPayload;
}

// ❌ Event definitions mixed with base interface
export interface WorkspaceCreatedPayload {
  readonly workspaceId: string;
  readonly ownerId: string;
  readonly ownerType: 'user' | 'organization';
  readonly organizationId: string;
  readonly name: string;
}

export interface WorkspaceCreated extends DomainEvent<WorkspaceCreatedPayload> {
  readonly type: 'WorkspaceCreated';
}
// ... more event definitions ...
```

### After (Events in Individual Files)
```typescript
// domain-event.ts - Only the base interface
export interface DomainEvent<TPayload> {
  readonly eventId: string;
  readonly type: string;
  readonly aggregateId: string;
  readonly correlationId: string;
  readonly causationId: string | null;
  readonly timestamp: number;
  readonly payload: TPayload;
}
// ✅ Clean separation - only base interface here

// workspace-created.event.ts - Individual event file
export interface WorkspaceCreatedPayload {
  readonly workspaceId: string;
  readonly name: string;
  readonly ownerId: string;
  readonly ownerType: 'user' | 'organization';
  readonly organizationId: string;
  readonly userId?: string;
}

export interface WorkspaceCreatedEvent extends DomainEvent<WorkspaceCreatedPayload> {
  readonly type: 'WorkspaceCreated';
}

// ✅ Factory function for consistent creation
export function createWorkspaceCreatedEvent(
  workspaceId: string,
  name: string,
  ownerId: string,
  ownerType: 'user' | 'organization',
  organizationId: string,
  userId?: string,
  correlationId?: string,
  causationId?: string | null
): WorkspaceCreatedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  return {
    eventId,
    type: 'WorkspaceCreated',
    aggregateId: workspaceId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload: {
      workspaceId,
      name,
      ownerId,
      ownerType,
      organizationId,
      userId,
    },
  };
}
```

## Example 4: Event Creation

### Before (Manual Event Creation)
```typescript
// create-workspace.use-case.ts
execute(command: CreateWorkspaceCommand): WorkspaceEntity {
  const workspace = createWorkspaceEntity(/* ... */);
  
  // ❌ Manual event creation with old format
  const eventId = `evt-${Date.now()}`;
  const event: WorkspaceCreated = {
    eventId,
    eventType: 'WorkspaceCreated',  // ❌ eventType instead of type
    aggregateId: workspace.id,
    workspaceId: workspace.id,
    timestamp: new Date(),          // ❌ Date instead of number
    correlationId,
    causationId: null,
    payload: {
      name: workspace.name,
      ownerId: workspace.ownerId,
      ownerType: workspace.ownerType,
      // ❌ Missing required fields
    },
    metadata: {                      // ❌ metadata not part of DomainEvent
      version: 1,
      userId: command.ownerId,
    },
  };
  
  return workspace;
}
```

### After (Factory Function)
```typescript
// create-workspace.use-case.ts
import { createWorkspaceCreatedEvent } from '@domain/events/domain-events/workspace-created.event';

execute(command: CreateWorkspaceCommand): WorkspaceEntity {
  const workspace = createWorkspaceEntity(/* ... */);
  
  // ✅ Factory function ensures correct format
  const event = createWorkspaceCreatedEvent(
    workspace.id,
    workspace.name,
    workspace.ownerId,
    workspace.ownerType,
    command.organizationId,
    command.ownerId
  );
  
  return workspace;
}
```

## Example 5: Type Safety Improvements

### Before (String Types)
```typescript
// task-created.event.ts
export interface TaskCreatedPayload {
  readonly workspaceId: string;
  readonly taskId: string;
  readonly title: string;
  readonly description: string;
  readonly priority: string;           // ❌ Should be TaskPriority type
  readonly createdById: string;
}

export function createTaskCreatedEvent(
  taskId: string,
  workspaceId: string,
  title: string,
  description: string,
  priority: string,                    // ❌ Accepts any string
  createdById: string,
  correlationId?: string,
  causationId?: string | null
): TaskCreatedEvent {
  // ...
}
```

### After (Proper Type Safety)
```typescript
// task-created.event.ts
import { TaskPriority } from '@domain/task/task.entity';

export interface TaskCreatedPayload {
  readonly workspaceId: string;
  readonly taskId: string;
  readonly title: string;
  readonly description: string;
  readonly priority: TaskPriority;     // ✅ Type-safe enum
  readonly createdById: string;
}

export function createTaskCreatedEvent(
  taskId: string,
  workspaceId: string,
  title: string,
  description: string,
  priority: TaskPriority,              // ✅ Only accepts valid priorities
  createdById: string,
  correlationId?: string,
  causationId?: string | null
): TaskCreatedEvent {
  // ...
}
```

## Key Improvements Summary

| Aspect | Before | After |
|--------|--------|-------|
| **DI Pattern** | Direct interface injection | Token-based injection |
| **Type Safety** | Loose string types | Strong typed enums |
| **Configuration** | Implicit/none | Explicit providers in app.config |
| **Testability** | Hard to mock | Easy to swap implementations |
| **Event Creation** | Manual, error-prone | Factory functions |
| **Event Organization** | Monolithic file | Individual event files |
| **Maintainability** | Mixed concerns | Clean separation |
| **Swappability** | Tightly coupled | Loosely coupled via tokens |

---
**All changes maintain backward compatibility while improving type safety and maintainability.**
