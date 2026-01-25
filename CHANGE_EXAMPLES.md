# exactOptionalPropertyTypes Enforcement - Change Examples

## Example 1: Single Optional Field (AcceptanceApprovedEvent)

### Before
```typescript
export function createAcceptanceApprovedEvent(
  taskId: string,
  workspaceId: string,
  taskTitle: string,
  approverId: string,
  approvalNotes?: string,
  correlationId?: string,
  causationId?: string | null
): AcceptanceApprovedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  const payload: AcceptanceApprovedPayload = {
    workspaceId,
    taskId,
    taskTitle,
    approverId,
  };
  
  if (approvalNotes !== undefined) {
    (payload as { approvalNotes?: string }).approvalNotes = approvalNotes;
  }
  
  return {
    eventId,
    type: 'AcceptanceApproved',
    aggregateId: taskId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload,
  };
}
```

### After
```typescript
export function createAcceptanceApprovedEvent(
  taskId: string,
  workspaceId: string,
  taskTitle: string,
  approverId: string,
  approvalNotes?: string,
  correlationId?: string,
  causationId?: string | null
): AcceptanceApprovedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  const payload: AcceptanceApprovedPayload = {
    workspaceId,
    taskId,
    taskTitle,
    approverId,
    ...(approvalNotes !== undefined ? { approvalNotes } : {}),
  };
  
  return {
    eventId,
    type: 'AcceptanceApproved',
    aggregateId: taskId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload,
  };
}
```

## Example 2: Multiple Optional Fields (TaskCompletedEvent)

### Before
```typescript
export function createTaskCompletedEvent(
  taskId: string,
  taskName: string,
  completedBy: string,
  workspaceId: string,
  completionNotes?: string,
  userId?: string,
  correlationId?: string,
  causationId?: string | null
): TaskCompletedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  const payload: TaskCompletedPayload = {
    workspaceId,
    taskId,
    taskName,
    completedBy,
  };
  
  if (completionNotes !== undefined) {
    (payload as { completionNotes?: string }).completionNotes = completionNotes;
  }
  
  if (userId !== undefined) {
    (payload as { userId?: string }).userId = userId;
  }
  
  return {
    eventId,
    type: 'TaskCompleted',
    aggregateId: taskId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload,
  };
}
```

### After
```typescript
export function createTaskCompletedEvent(
  taskId: string,
  taskName: string,
  completedBy: string,
  workspaceId: string,
  completionNotes?: string,
  userId?: string,
  correlationId?: string,
  causationId?: string | null
): TaskCompletedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  const payload: TaskCompletedPayload = {
    workspaceId,
    taskId,
    taskName,
    completedBy,
    ...(completionNotes !== undefined ? { completionNotes } : {}),
    ...(userId !== undefined ? { userId } : {}),
  };
  
  return {
    eventId,
    type: 'TaskCompleted',
    aggregateId: taskId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload,
  };
}
```

## Example 3: Caller Update (AcceptanceModule)

### Before
```typescript
approveTask(taskId: string): void {
  if (!this.eventBus) return;
  
  const task = this.acceptanceStore.tasks().find(t => t.taskId === taskId);
  if (!task) return;
  
  const request: Parameters<typeof this.approveTaskUseCase.execute>[0] = {
    taskId,
    workspaceId: this.eventBus.workspaceId,
    taskTitle: task.taskTitle,
    approverId: this.currentUserId,
  };
  
  if (this.notes) {
    (request as { approvalNotes?: string }).approvalNotes = this.notes;
  }
  
  this.approveTaskUseCase.execute(request).then(result => {
    if (!result.success) {
      console.error('[AcceptanceModule] Approve failed:', result.error);
    }
  });
  
  this.notes = '';
}
```

### After
```typescript
approveTask(taskId: string): void {
  if (!this.eventBus) return;
  
  const task = this.acceptanceStore.tasks().find(t => t.taskId === taskId);
  if (!task) return;
  
  const request: Parameters<typeof this.approveTaskUseCase.execute>[0] = {
    taskId,
    workspaceId: this.eventBus.workspaceId,
    taskTitle: task.taskTitle,
    approverId: this.currentUserId,
    ...(this.notes ? { approvalNotes: this.notes } : {}),
  };
  
  this.approveTaskUseCase.execute(request).then(result => {
    if (!result.success) {
      console.error('[AcceptanceModule] Approve failed:', result.error);
    }
  });
  
  this.notes = '';
}
```

## Key Improvements

### Type Safety
- **Before**: Used type assertions `(payload as { field?: Type })`
- **After**: Uses conditional object spread with proper type inference

### Code Clarity
- **Before**: 4-7 lines for optional field handling
- **After**: 1 line per optional field (inline in object literal)

### Runtime Behavior
- **Before**: Optional field set to `undefined` if parameter is `undefined`
- **After**: Optional field omitted entirely if parameter is `undefined`

### TypeScript Compliance
- **Before**: Violates `exactOptionalPropertyTypes: true`
- **After**: Fully compliant with `exactOptionalPropertyTypes: true`

## Pattern Recognition

All changes follow this transformation:

```typescript
// ❌ OLD PATTERN (3 lines per optional field)
const obj = { required };
if (optional !== undefined) {
  (obj as { optional?: Type }).optional = optional;
}

// ✅ NEW PATTERN (1 line per optional field)
const obj = {
  required,
  ...(optional !== undefined ? { optional } : {}),
};
```

## Benefits

1. **Correctness**: Satisfies TypeScript's strict optional property requirements
2. **Conciseness**: Reduces code by ~70% for optional field handling
3. **Maintainability**: Single-line pattern is easier to understand and maintain
4. **Type Safety**: No type assertions needed
5. **Consistency**: Same pattern used across entire codebase

