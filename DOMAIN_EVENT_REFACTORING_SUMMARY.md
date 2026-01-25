# DomainEvent Refactoring Summary

## Objective
Refactor DomainEvent interface to use new generic signature as specified in PR comment 3796475062.

## New Interface Signature

```typescript
interface DomainEvent<TPayload> {
  readonly eventId: string;
  readonly type: string;
  readonly aggregateId: string;
  readonly correlationId: string;
  readonly causationId: string | null;
  readonly timestamp: number;
  readonly payload: TPayload;
}
```

## Key Changes

### 1. Field Removals
- **Removed**: `eventType` → Replaced with `type`
- **Removed**: `workspaceId` → Moved to payload
- **Removed**: `metadata` → Event-specific metadata moved to payload
- **Removed**: `occurredAt` → timestamp is now a number (milliseconds)
- **Removed**: `causalityId` → correlationId serves this purpose

### 2. Field Updates
- **eventType → type**: Simplified field name, same purpose
- **timestamp**: Changed from `Date` to `number` (Unix timestamp in milliseconds)
- **workspaceId**: Moved from root level to payload (where relevant)

### 3. Type Safety
- Generic `TPayload` parameter ensures strict typing throughout
- No `any` or `unknown` escapes in the refactored code
- All event payloads are explicitly typed

## Files Modified

### Core Domain Layer
- ✅ `/src/app/domain/event/domain-event.ts` - Updated base interface
- ✅ `/src/app/domain/event/event-metadata.ts` - Deprecated (no longer used)
- ✅ `/src/app/domain/event/index.ts` - Removed metadata export
- ✅ `/src/app/domain/event-bus/event-bus.interface.ts` - Updated with generic types
- ✅ `/src/app/domain/event-store/event-store.interface.ts` - Updated with generic types, removed `getEventsForWorkspace`

### Domain Event Definitions
All event files updated to use new structure:
- ✅ `/src/app/domain/events/domain-events/task-created.event.ts`
- ✅ `/src/app/domain/events/domain-events/task-submitted-for-qc.event.ts`
- ✅ `/src/app/domain/events/domain-events/task-completed.event.ts`
- ✅ `/src/app/domain/events/domain-events/workspace-created.event.ts`
- ✅ `/src/app/domain/events/domain-events/workspace-switched.event.ts`
- ✅ `/src/app/domain/events/domain-events/issue-created.event.ts`
- ✅ `/src/app/domain/events/domain-events/issue-resolved.event.ts`
- ✅ `/src/app/domain/events/domain-events/qc-passed.event.ts`
- ✅ `/src/app/domain/events/domain-events/qc-failed.event.ts`
- ✅ `/src/app/domain/events/domain-events/acceptance-approved.event.ts`
- ✅ `/src/app/domain/events/domain-events/acceptance-rejected.event.ts`
- ✅ `/src/app/domain/events/domain-events/document-uploaded.event.ts`
- ✅ `/src/app/domain/events/domain-events/daily-entry-created.event.ts`
- ✅ `/src/app/domain/events/domain-events/member-invited.event.ts`
- ✅ `/src/app/domain/events/domain-events/member-removed.event.ts`
- ✅ `/src/app/domain/events/domain-events/permission-granted.event.ts`
- ✅ `/src/app/domain/events/domain-events/permission-revoked.event.ts`
- ✅ `/src/app/domain/module/module-event.ts`

### Infrastructure Layer
- ✅ `/src/app/infrastructure/events/in-memory-event-store.impl.ts` - Updated to use `timestamp` as number and `type` field
- ✅ `/src/app/infrastructure/events/in-memory-event-bus.impl.ts` - Updated with generic types

### Application Layer
Event Handlers:
- ✅ `/src/app/application/tasks/handlers/tasks.event-handlers.ts`
- ✅ `/src/app/application/quality-control/handlers/quality-control.event-handlers.ts`
- ✅ `/src/app/application/acceptance/handlers/acceptance.event-handlers.ts`
- ✅ `/src/app/application/issues/handlers/issues.event-handlers.ts`
- ✅ `/src/app/application/daily/handlers/daily.event-handlers.ts`

Use Cases:
- ✅ `/src/app/application/events/use-cases/publish-event.use-case.ts` - Updated validation for new structure
- ✅ `/src/app/application/events/use-cases/query-events.use-case.ts` - Removed `workspaceId`, updated field names
- ✅ `/src/app/application/workspace/use-cases/handle-domain-event.use-case.ts` - Updated field references

Application Events:
- ✅ `/src/app/application/events/module-events.ts` - Updated timestamp field

### Test Files
- ✅ `/src/app/domain/event-store/event-store.interface.spec.ts` - Updated test helpers and assertions
- ✅ `/src/app/domain/event-bus/event-bus.interface.spec.ts` - Updated test helpers and assertions

## Event Factory Pattern Changes

### Before
```typescript
export function createTaskCreatedEvent(...): TaskCreatedEvent {
  return {
    eventId: crypto.randomUUID(),
    eventType: 'TaskCreated',  // ❌ Old field
    aggregateId: taskId,
    workspaceId,                // ❌ Root level
    timestamp: new Date(),      // ❌ Date object
    correlationId,
    causationId,
    payload: { ... },
    metadata: {                 // ❌ Separate metadata
      version: 1,
      userId,
    },
  };
}
```

### After
```typescript
export function createTaskCreatedEvent(...): TaskCreatedEvent {
  const eventId = crypto.randomUUID();
  return {
    eventId,
    type: 'TaskCreated',        // ✅ New field name
    aggregateId: taskId,
    correlationId: correlationId ?? eventId,
    causationId: causationId ?? null,
    timestamp: Date.now(),      // ✅ Number (milliseconds)
    payload: {
      workspaceId,              // ✅ In payload
      taskId,
      title,
      description,
      priority,
      createdById,              // ✅ User info in payload
    },
  };
}
```

## Causality Chain Rules

1. **correlationId**: Always required, tracks entire causal chain
   - For root events: `correlationId = eventId`
   - For derived events: `correlationId = parent.correlationId`

2. **causationId**: Nullable only for root events
   - For root events: `causationId = null`
   - For derived events: `causationId = parent.eventId`

## Migration Impact

### No Breaking Changes To
- Event type constants in `event-type.ts` remain unchanged
- Event handler registration patterns unchanged
- EventBus subscribe/publish patterns unchanged
- Event persistence and querying patterns unchanged

### Migration Required For
- Any code accessing `event.eventType` → Change to `event.type`
- Any code accessing `event.workspaceId` → Change to `event.payload.workspaceId`
- Any code accessing `event.metadata` → Access specific payload fields
- Any code using `timestamp.getTime()` → Use `timestamp` directly
- Any code referencing `occurredAt` → Use `timestamp`
- Any code referencing `causalityId` → Use `correlationId`

## Testing Strategy
- All event contract tests updated
- Event store tests updated to use number timestamps
- Event bus tests updated with proper generic types
- Event factory functions generate correctly structured events

## Validation Rules
Events are validated in `PublishEventUseCase`:
- ✅ `eventId` must exist
- ✅ `type` must exist  
- ✅ `aggregateId` must exist
- ✅ `timestamp` must be a number
- ✅ `correlationId` must exist
- ✅ `causationId` must be string or null

## Completion Status
✅ All core domain interfaces updated
✅ All domain event definitions updated
✅ All infrastructure implementations updated
✅ All application layer event handlers updated
✅ All use cases updated
✅ All test files updated
✅ No TODOs left
✅ Strict typing maintained throughout

## Notes
- EventMetadata interface deprecated but kept for backward compatibility
- All events now include workspaceId in their payload where needed
- Timestamp is now consistently in milliseconds (Unix epoch)
- Generic type parameter ensures type safety across the entire event pipeline
