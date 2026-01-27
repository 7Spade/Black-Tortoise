---
description: "Enforce strict bounded context boundaries in Domain-Driven Design"
applyTo: '**'
---

# Strict DDD Boundaries

## What is a Bounded Context?

A **Bounded Context** is an explicit boundary within which a domain model is defined and applicable. Each bounded context has its own ubiquitous language and models.

```
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│  Workspace Context  │  │   Task Context      │  │  Identity Context   │
│                     │  │                     │  │                     │
│  - Workspace        │  │  - Task             │  │  - User             │
│  - Module           │  │  - TaskList         │  │  - Organization     │
│  - Settings         │  │  - TaskStatus       │  │  - Permission       │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

## Core Principles

### 1. Models Are Bounded
The same concept may have **different meanings** in different contexts.

#### Example: "User" in Different Contexts
```typescript
// Identity Context: User = authentication + authorization
export class User {
  id: string;
  email: string;
  passwordHash: string;
  roles: Role[];
}

// Workspace Context: User = workspace member
export class WorkspaceMember {
  id: string;
  displayName: string;
  workspaceRole: 'owner' | 'admin' | 'member';
}

// Task Context: User = task assignee
export class TaskAssignee {
  id: string;
  name: string;
}
```

**Key Point:** These are **different models** for the same real-world concept. They should NOT share the same class/interface.

### 2. Each Context Has Its Own Language
Use context-specific terminology.

```typescript
// ❌ WRONG: Generic, context-free naming
export class Item {
  id: string;
  name: string;
  status: string;
}

// ✅ RIGHT: Context-specific naming
// Workspace Context
export class WorkspaceEntity {
  id: string;
  name: string;
  moduleIds: string[];
}

// Task Context
export class TaskEntity {
  id: string;
  title: string;
  status: TaskStatus;
}
```

### 3. Contexts Communicate via Well-Defined Interfaces
**Never** directly access another context's internals.

```typescript
// ❌ WRONG: Direct cross-context access
export class TaskStore {
  private workspaceStore = inject(WorkspaceStore);
  
  createTask(title: string) {
    // ❌ Reaching into Workspace context internals
    const workspace = this.workspaceStore.currentWorkspace();
    const ownerId = workspace.ownerId;
    // ...
  }
}

// ✅ RIGHT: Communicate via events or shared kernel
export class TaskStore {
  private eventBus = inject(EventBus);
  private workspaceContext = inject(WorkspaceContextProvider);
  
  createTask(title: string) {
    // ✅ Get context ID via explicit interface
    const workspaceId = this.workspaceContext.getCurrentWorkspaceId();
    
    const task = new TaskEntity(generateId(), title, workspaceId);
    
    // ✅ Notify other contexts via event
    this.eventBus.emit({
      type: 'TaskCreated',
      payload: { taskId: task.id, workspaceId }
    });
  }
}
```

## Bounded Context Structure

Each bounded context should have its own folder structure:

```
src/app/
├── workspace-context/          # Bounded Context 1
│   ├── domain/
│   │   ├── aggregates/
│   │   │   └── workspace.entity.ts
│   │   ├── value-objects/
│   │   │   └── workspace-name.vo.ts
│   │   └── events/
│   │       └── workspace-created.event.ts
│   ├── application/
│   │   ├── handlers/
│   │   ├── stores/
│   │   └── interfaces/
│   ├── infrastructure/
│   │   └── repositories/
│   └── presentation/
│       └── components/
│
├── task-context/               # Bounded Context 2
│   ├── domain/
│   │   ├── aggregates/
│   │   │   └── task.entity.ts
│   │   └── value-objects/
│   │       └── task-status.vo.ts
│   ├── application/
│   ├── infrastructure/
│   └── presentation/
│
├── identity-context/           # Bounded Context 3
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── presentation/
│
└── shared-kernel/             # Shared between contexts
    ├── types/
    ├── utils/
    └── interfaces/
```

## Context Integration Patterns

### Pattern 1: Shared Kernel
Small set of common types/interfaces shared across contexts.

```typescript
// shared-kernel/types/identity.types.ts
export type IdentityId = string;
export type IdentityType = 'user' | 'organization';

// Workspace Context uses shared types
export class WorkspaceEntity {
  constructor(
    public readonly ownerId: IdentityId,      // ✅ From shared kernel
    public readonly ownerType: IdentityType   // ✅ From shared kernel
  ) {}
}

// Identity Context uses same types
export class User {
  constructor(
    public readonly id: IdentityId,           // ✅ From shared kernel
    public readonly type: IdentityType        // ✅ From shared kernel
  ) {}
}
```

**Shared Kernel Guidelines:**
- ✅ Keep it MINIMAL (only truly shared concepts)
- ✅ Only primitive types, simple interfaces, utility functions
- ❌ NO business logic
- ❌ NO entities or aggregates
- ❌ NO services or stores

### Pattern 2: Context Map via Events
Contexts communicate through domain events.

```typescript
// Domain event (can be in shared kernel or publishing context)
export interface WorkspaceSwitchedEvent {
  type: 'WorkspaceSwitched';
  payload: {
    previousWorkspaceId: string | null;
    currentWorkspaceId: string;
    timestamp: number;
  };
}

// Workspace Context publishes event
export class WorkspaceStore {
  private eventBus = inject(EventBus);
  
  switchWorkspace(id: string): void {
    const previous = this.currentWorkspaceId();
    this.currentWorkspaceId.set(id);
    
    // Publish to other contexts
    this.eventBus.emit<WorkspaceSwitchedEvent>({
      type: 'WorkspaceSwitched',
      payload: {
        previousWorkspaceId: previous,
        currentWorkspaceId: id,
        timestamp: Date.now()
      }
    });
  }
}

// Task Context listens to event
export class TaskStore {
  constructor() {
    const eventBus = inject(EventBus);
    
    // React to workspace switch
    eventBus.on('WorkspaceSwitched', (event) => {
      this.loadTasksForWorkspace(event.payload.currentWorkspaceId);
    });
  }
}

// Document Context listens to same event
export class DocumentStore {
  constructor() {
    const eventBus = inject(EventBus);
    
    eventBus.on('WorkspaceSwitched', (event) => {
      this.loadDocumentsForWorkspace(event.payload.currentWorkspaceId);
    });
  }
}
```

### Pattern 3: Context Provider (Anti-Corruption Layer)
Provide a stable interface to query another context.

```typescript
// Workspace Context exposes provider
export abstract class WorkspaceContextProvider {
  abstract getCurrentWorkspaceId(): string | null;
  abstract getWorkspaceName(id: string): string | null;
  abstract hasWorkspace(): boolean;
}

// Implementation in Workspace Context
@Injectable({ providedIn: 'root' })
export class WorkspaceContextProviderImpl implements WorkspaceContextProvider {
  private store = inject(WorkspaceStore);
  
  getCurrentWorkspaceId(): string | null {
    return this.store.currentWorkspaceId();
  }
  
  getWorkspaceName(id: string): string | null {
    const workspace = this.store.findWorkspaceById(id);
    return workspace?.name ?? null;
  }
  
  hasWorkspace(): boolean {
    return this.store.hasWorkspace();
  }
}

// Provide in app.config.ts
providers: [
  {
    provide: WorkspaceContextProvider,
    useClass: WorkspaceContextProviderImpl
  }
]

// Other contexts use the provider
export class TaskStore {
  private workspaceContext = inject(WorkspaceContextProvider);
  
  createTask(title: string) {
    const workspaceId = this.workspaceContext.getCurrentWorkspaceId();
    
    if (!workspaceId) {
      throw new Error('No workspace selected');
    }
    
    // Use workspace ID without knowing Workspace Context internals
    const task = new TaskEntity(generateId(), title, workspaceId);
  }
}
```

## Boundary Violations

### ❌ Violation 1: Direct Cross-Context Entity Access
```typescript
// Task Context directly imports Workspace entity
import { WorkspaceEntity } from '@workspace-context/domain';

export class TaskEntity {
  constructor(
    public workspace: WorkspaceEntity  // ❌ WRONG: Cross-context entity reference
  ) {}
}
```

**Fix:** Reference by ID only
```typescript
export class TaskEntity {
  constructor(
    public workspaceId: string  // ✅ RIGHT: Reference by ID
  ) {}
}
```

### ❌ Violation 2: Shared Mutable State
```typescript
// Shared store between contexts
export class SharedDataStore {
  workspaceData = signal<any>(null);
  taskData = signal<any>(null);
  // ❌ WRONG: Mixing contexts in single store
}
```

**Fix:** Separate stores per context
```typescript
// Workspace Context
export class WorkspaceStore {
  workspaceData = signal<WorkspaceState>(initialState);
}

// Task Context
export class TaskStore {
  taskData = signal<TaskState>(initialState);
}
```

### ❌ Violation 3: Cross-Context Business Logic
```typescript
// Task Context has Workspace business logic
export class TaskService {
  createTask(title: string) {
    const workspace = this.workspaceStore.currentWorkspace();
    
    // ❌ WRONG: Workspace business rule in Task Context
    if (workspace.moduleIds.includes('premium')) {
      // Premium workspace logic
    }
  }
}
```

**Fix:** Let Workspace Context handle its own rules
```typescript
// Workspace Context exposes capability query
export class WorkspaceContextProvider {
  hasFeature(feature: string): boolean {
    const workspace = this.store.currentWorkspace();
    return workspace?.hasModule(feature) ?? false;
  }
}

// Task Context queries capability
export class TaskService {
  createTask(title: string) {
    const hasPremium = this.workspaceContext.hasFeature('premium');
    
    if (hasPremium) {
      // Task-specific premium feature
    }
  }
}
```

### ❌ Violation 4: God Context
```typescript
// One context doing everything
export class ApplicationContext {
  // ❌ WRONG: All domain logic in one context
  workspaces: WorkspaceEntity[];
  tasks: TaskEntity[];
  documents: DocumentEntity[];
  users: UserEntity[];
  organizations: OrganizationEntity[];
  // ...
}
```

**Fix:** Split into focused contexts
```typescript
// Separate bounded contexts
- WorkspaceContext → manages workspaces
- TaskContext → manages tasks
- DocumentContext → manages documents
- IdentityContext → manages users and organizations
```

## Context Identification Guidelines

### When to Create a New Bounded Context

**Create separate context if:**
- ✅ Different teams own the subdomain
- ✅ Different release cycles
- ✅ Different data models for same concept
- ✅ Different business rules
- ✅ Could be deployed as separate service
- ✅ Different languages/terminologies used

**Don't create separate context if:**
- ❌ Just to organize code (use modules instead)
- ❌ Models are tightly coupled
- ❌ Shares most business rules
- ❌ Always deployed together
- ❌ Same team, same release cycle

### Example: Task vs. Workspace

**Should Task and Workspace be separate contexts?**

✅ **YES**, because:
- Different core concepts (workspace = container, task = work item)
- Different business rules (workspace membership ≠ task assignment)
- Different data models (workspace modules ≠ task status)
- Could scale independently
- Different read/write patterns

**Workspace Context responsibilities:**
- Workspace CRUD
- Module management
- Membership
- Permissions

**Task Context responsibilities:**
- Task CRUD
- Task status
- Task assignment
- Task dependencies

**Integration:**
- Task stores `workspaceId` (not full Workspace entity)
- Task Context listens to `WorkspaceSwitched` event
- Task Context queries `WorkspaceContextProvider` for current workspace

## Context Communication Rules

### Rule 1: No Direct Entity Sharing
```typescript
// ❌ WRONG
export class TaskEntity {
  workspace: WorkspaceEntity;  // Cross-context entity reference
}

// ✅ RIGHT
export class TaskEntity {
  workspaceId: string;  // ID reference only
}
```

### Rule 2: Events for State Changes
```typescript
// Workspace Context emits event
this.eventBus.emit({ type: 'WorkspaceSwitched', payload: { ... } });

// Task Context reacts
eventBus.on('WorkspaceSwitched', () => this.reset());
```

### Rule 3: Provider for Queries
```typescript
// Query via provider, not direct store access
const workspaceId = this.workspaceProvider.getCurrentWorkspaceId();

// ❌ Not this
const workspaceId = this.workspaceStore.currentWorkspaceId();
```

### Rule 4: Shared Kernel for Common Types
```typescript
// Shared kernel
export type WorkspaceId = string;
export type TaskId = string;

// Both contexts use shared types
```

## Testing Bounded Contexts

Each context should be **testable in isolation**.

```typescript
// Test Workspace Context independently
describe('WorkspaceContext', () => {
  it('should create workspace', () => {
    const handler = new CreateWorkspaceHandler(mockRepo);
    const workspace = await handler.execute({ name: 'Test' });
    expect(workspace).toBeDefined();
  });
});

// Test Task Context independently
describe('TaskContext', () => {
  it('should create task for workspace', () => {
    const handler = new CreateTaskHandler(mockRepo);
    const task = await handler.execute({
      title: 'Test',
      workspaceId: 'workspace-123'  // Just an ID, no Workspace knowledge
    });
    expect(task.workspaceId).toBe('workspace-123');
  });
});

// Test integration via events
describe('Context Integration', () => {
  it('should reset tasks when workspace switches', async () => {
    const eventBus = new InMemoryEventBus();
    const taskStore = new TaskStore(eventBus);
    
    // Emit event from Workspace Context
    eventBus.emit({ type: 'WorkspaceSwitched', payload: { ... } });
    
    // Task Context reacts
    expect(taskStore.tasks()).toEqual([]);
  });
});
```

## Checklist

- [ ] Each context has its own folder structure?
- [ ] Contexts don't share entity classes?
- [ ] Contexts communicate via events or providers?
- [ ] Shared kernel is minimal?
- [ ] Each context testable independently?
- [ ] Context boundaries match team/subdomain boundaries?
- [ ] No circular dependencies between contexts?
- [ ] Each context uses its own ubiquitous language?

## Benefits

✅ **Independence:** Contexts can evolve separately
✅ **Team autonomy:** Different teams own different contexts
✅ **Scalability:** Contexts can scale independently
✅ **Testability:** Each context tested in isolation
✅ **Clarity:** Clear boundaries reduce confusion
✅ **Flexibility:** Easy to extract to microservices later
