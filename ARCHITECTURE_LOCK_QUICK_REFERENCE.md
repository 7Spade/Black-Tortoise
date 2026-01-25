# Architecture Lock - Quick Reference

## ✅ DO

### Presentation Layer
```typescript
// ✅ Import from Application layer
import { TasksStore, TaskEntity } from '@application/tasks';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';

// ✅ Read from stores
const tasks = this.tasksStore.tasks();

// ✅ Call use cases
await this.createTaskUseCase.execute({ ... });

// ✅ Subscribe to events via IModuleEventBus
this.eventBus.subscribe('TaskCreated', (event) => { ... });
```

### Application Layer
```typescript
// ✅ Define store mutation methods in *.store.ts
export const TasksStore = signalStore(
  withMethods((store) => ({
    addTask(task: TaskEntity): void {
      patchState(store, { tasks: [...store.tasks(), task] });
    }
  }))
);

// ✅ Call store mutations from *.event-handlers.ts
eventBus.subscribe('TaskCreated', (event) => {
  tasksStore.addTask(task);
});

// ✅ Create and publish events via use cases
const event = createTaskCreatedEvent(...);
await this.publishEventUseCase.execute({ event });
```

### Domain Layer
```typescript
// ✅ Pure TypeScript
export interface TaskEntity { ... }

// ✅ Domain event with correlationId and causationId
export function createTaskCreatedEvent(
  taskId: string,
  correlationId?: string,
  causationId?: string | null
): TaskCreatedEvent {
  return {
    correlationId: correlationId ?? eventId,
    causationId: causationId ?? null,
    ...
  };
}
```

### Infrastructure Layer
```typescript
// ✅ Implement Application interfaces
import { IWorkspaceRuntimeFactory } from '@application/workspace/interfaces';

export class WorkspaceRuntimeFactory implements IWorkspaceRuntimeFactory { ... }
```

## ❌ DON'T

### Presentation Layer
```typescript
// ❌ NO Domain imports
import { TaskEntity } from '@domain/task/task.entity'; // ERROR

// ❌ NO Infrastructure imports
import { InMemoryEventBus } from '@infrastructure/events'; // ERROR

// ❌ NO EventBus/EventStore internals
import { EventBus } from '@domain/event-bus/event-bus.interface'; // ERROR

// ❌ NO PublishEventUseCase
import { PublishEventUseCase } from '@application/events'; // ERROR

// ❌ NO direct publish/append calls
eventBus.publish(event); // ERROR
eventStore.append(event); // ERROR

// ❌ NO store mutations (except in tests)
patchState(store, { ... }); // ERROR
store.set({ ... }); // ERROR
```

### Application Layer (outside *.store.ts, *.event-handlers.ts, *.projection.ts)
```typescript
// ❌ NO direct patchState calls
patchState(tasksStore, { ... }); // ERROR in use cases, facades, etc.
```

### Domain Layer
```typescript
// ❌ NO framework imports
import { inject } from '@angular/core'; // ERROR
import { Observable } from 'rxjs'; // ERROR

// ❌ NO Application/Infrastructure/Presentation imports
import { TasksStore } from '@application/tasks'; // ERROR
```

### Infrastructure Layer
```typescript
// ❌ NO Presentation imports
import { TasksComponent } from '@presentation/tasks'; // ERROR

// ❌ NO Application use cases/stores/facades (only interfaces allowed)
import { CreateTaskUseCase } from '@application/tasks/use-cases'; // ERROR
```

## 🔍 Quick Checks

### Before Committing
```bash
# Run ESLint to check architecture
npm run lint

# Should show: 0 errors, 0 warnings
```

### If You Get an Architecture Error

1. **Read the error message** - it tells you exactly what's wrong
2. **Check this guide** - find the equivalent pattern
3. **Fix the import/pattern** - use the ✅ DO examples
4. **Re-run ESLint** - verify the fix

### Common Fixes

| Error | Fix |
|-------|-----|
| Presentation importing Domain | Add Application barrel export, import from `@application/<feature>` |
| Presentation calling `eventBus.publish()` | Use `IModuleEventBus` or Application use case |
| Application patchState outside handlers | Move to `*.event-handlers.ts` file |
| Domain importing Angular | Remove Angular - use pure TypeScript |

## 📚 Full Documentation

See `ARCHITECTURE_LOCK_IMPLEMENTATION.md` for complete details.

---

**Quick Reference Version**: 1.0  
**Last Updated**: January 25, 2025
