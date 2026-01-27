---
description: "Enforce loose coupling and high cohesion across all architectural layers"
applyTo: '**'
---

# Decoupling Principles

## Core Principle
Minimize dependencies between modules. Changes in one module should NOT require changes in unrelated modules.

## Dependency Rules

### 1. Depend on Abstractions, Not Concretions
- ❌ BAD: Direct dependency on concrete implementation
- ✅ GOOD: Depend on interfaces/tokens

#### ❌ Tight Coupling
```typescript
export class WorkspaceStore {
  private firebaseRepo = inject(FirebaseWorkspaceRepository);
  // Tightly coupled to Firebase implementation
}
```

#### ✅ Loose Coupling
```typescript
// Define interface/token
export const WORKSPACE_REPOSITORY = new InjectionToken<WorkspaceRepository>(
  'WORKSPACE_REPOSITORY'
);

export class WorkspaceStore {
  private repo = inject(WORKSPACE_REPOSITORY);
  // Decoupled from implementation
}
```

### 2. Avoid Direct Store-to-Store Dependencies
- ❌ BAD: Store A directly injects and calls Store B
- ✅ GOOD: Use event-driven communication or mediator pattern

#### ❌ Tight Coupling
```typescript
export class WorkspaceStore {
  private tasksStore = inject(TasksStore);
  private documentsStore = inject(DocumentsStore);
  private issuesStore = inject(IssuesStore);
  // ... 8 more stores
  
  switchWorkspace() {
    this.tasksStore.reset();      // Direct coupling
    this.documentsStore.reset();  // Direct coupling
    this.issuesStore.reset();     // Direct coupling
  }
}
```

#### ✅ Loose Coupling (Event-Driven)
```typescript
export class WorkspaceStore {
  private eventBus = inject(WorkspaceEventBus);
  
  switchWorkspace(workspaceId: string) {
    this.eventBus.emit({
      type: 'WorkspaceSwitched',
      payload: { workspaceId }
    });
  }
}

// Each store listens independently
export class TasksStore {
  constructor() {
    const eventBus = inject(WorkspaceEventBus);
    eventBus.on('WorkspaceSwitched', () => this.reset());
  }
}
```

#### ✅ Loose Coupling (Mediator Service)
```typescript
export class WorkspaceLifecycleService {
  private stores = inject(MODULE_STORES); // Array of stores
  
  resetAllModules() {
    this.stores.forEach(store => store.reset());
  }
}

export class WorkspaceStore {
  private lifecycle = inject(WorkspaceLifecycleService);
  
  switchWorkspace() {
    this.lifecycle.resetAllModules();
  }
}
```

### 3. Layer Dependency Direction
**MUST follow this direction ONLY:**
```
Presentation → Application → Domain → Infrastructure
     ↓              ↓           ↓
   (UI)       (Use Cases)   (Entities)
```

**NEVER:**
- Domain depends on Application
- Domain depends on Infrastructure
- Application depends on Infrastructure implementations (only interfaces)

#### ❌ Wrong Direction
```typescript
// Domain layer
export class WorkspaceEntity {
  constructor(
    private firestore: Firestore  // ❌ Domain depends on Infrastructure
  ) {}
}
```

#### ✅ Correct Direction
```typescript
// Domain layer
export class WorkspaceEntity {
  // Pure domain logic, NO infrastructure dependencies
}

// Infrastructure layer
export class FirebaseWorkspaceRepository {
  save(workspace: WorkspaceEntity) {
    // Infrastructure depends on Domain ✅
  }
}
```

## Decoupling Strategies

### Strategy 1: Dependency Inversion (DI)
```typescript
// Application layer defines interface
export interface WorkspaceRepository {
  findById(id: string): Promise<WorkspaceEntity | null>;
}

export const WORKSPACE_REPOSITORY = new InjectionToken<WorkspaceRepository>(
  'WORKSPACE_REPOSITORY'
);

// Infrastructure layer implements
@Injectable()
export class FirebaseWorkspaceRepository implements WorkspaceRepository {
  findById(id: string): Promise<WorkspaceEntity | null> {
    // Implementation
  }
}

// Provide in root module
providers: [
  {
    provide: WORKSPACE_REPOSITORY,
    useClass: FirebaseWorkspaceRepository
  }
]
```

### Strategy 2: Event-Driven Architecture
```typescript
// Event definitions (Domain layer)
export type WorkspaceEvent =
  | { type: 'WorkspaceCreated'; payload: { workspaceId: string } }
  | { type: 'WorkspaceSwitched'; payload: { from: string; to: string } }
  | { type: 'WorkspaceDeleted'; payload: { workspaceId: string } };

// Event bus interface (Application layer)
export interface EventBus {
  emit<T extends WorkspaceEvent>(event: T): void;
  on<T extends WorkspaceEvent['type']>(
    type: T,
    handler: (event: Extract<WorkspaceEvent, { type: T }>) => void
  ): void;
}

// Stores communicate via events, NOT direct calls
```

### Strategy 3: Facade Pattern
```typescript
// Hide complex subsystem behind simple interface
export class WorkspaceFacade {
  constructor(
    private store: WorkspaceStore,
    private lifecycle: WorkspaceLifecycleService,
    private runtime: WorkspaceRuntimeManager
  ) {}
  
  switchWorkspace(id: string): void {
    this.lifecycle.prepareSwitch();
    this.runtime.switchRuntime(id);
    this.store.setCurrentWorkspace(id);
  }
}
```

## Anti-Patterns

### 1. Circular Dependencies
```typescript
// ❌ A depends on B, B depends on A
export class WorkspaceStore {
  private org = inject(OrganizationStore);
}

export class OrganizationStore {
  private workspace = inject(WorkspaceStore);  // ❌ Circular!
}
```

**Solution:** Introduce mediator or event bus

### 2. God Object
```typescript
// ❌ One class knowing/doing everything
export class ApplicationManager {
  private workspace: WorkspaceStore;
  private tasks: TasksStore;
  private auth: AuthService;
  private router: Router;
  private http: HttpClient;
  // ... 20 more dependencies
}
```

**Solution:** Break into focused services with clear responsibilities

### 3. Feature Envy
```typescript
// ❌ Store A manipulating Store B's data
export class WorkspaceStore {
  updateTaskTitle(taskId: string, title: string) {
    const task = this.tasksStore.findById(taskId);  // Feature envy
    task.title = title;
    this.tasksStore.update(task);
  }
}
```

**Solution:** Move logic to the appropriate store

## Metrics for Good Decoupling
- **Afferent Coupling (Ca):** Number of classes depending on this class (incoming)
- **Efferent Coupling (Ce):** Number of classes this class depends on (outgoing)
- **Instability (I):** Ce / (Ca + Ce) — should be low for stable modules

### Target Metrics
- Application Services: I < 0.5
- Domain Entities: I < 0.3 (very stable)
- Infrastructure: I < 0.7 (can be unstable)

## Refactoring Checklist
- [ ] Can I test this module without mocking > 3 dependencies?
- [ ] Can I swap implementation without changing dependent code?
- [ ] Does this module depend on abstractions, not concretions?
- [ ] Are my dependencies going in the correct direction?
- [ ] Can I understand this module without reading other modules?
- [ ] Would changing X require changing Y? (if yes, too coupled)

## Benefits of Proper Decoupling
✅ Easier testing (fewer mocks needed)
✅ Easier to change implementations
✅ Easier to understand (reduced cognitive load)
✅ Better reusability
✅ Parallel development possible
✅ Reduced risk of breaking changes
