---
description: "Enforce strict Domain-Driven Design layered architecture"
applyTo: '**'
---

# Strict DDD Architecture

## Four-Layer Architecture

```
┌─────────────────────────────────────────────┐
│         Presentation Layer (UI)             │  ← User Interface
│  - Components, Pages, Directives, Pipes     │
│  - ONLY user interaction & display logic    │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         Application Layer                   │  ← Use Cases
│  - Handlers, Stores, Application Services   │
│  - Orchestrates domain objects              │
│  - Manages application state                │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         Domain Layer                        │  ← Business Logic
│  - Entities, Value Objects, Aggregates      │
│  - Domain Services, Domain Events           │
│  - PURE business logic, NO dependencies     │
└─────────────────────────────────────────────┘
                    ↑
┌─────────────────────────────────────────────┐
│         Infrastructure Layer                │  ← Technical Concerns
│  - Repositories, API clients, DB access     │
│  - External service integrations            │
│  - Framework-specific implementations       │
└─────────────────────────────────────────────┘
```

## Layer Definitions

### 1. Presentation Layer
**Purpose:** Handle user interaction and display

**Allowed to depend on:**
- ✅ Application Layer (handlers, stores, services)
- ❌ Domain Layer (indirectly via Application)
- ❌ Infrastructure Layer (NEVER)

**Responsibilities:**
- Display data to users
- Capture user input
- Route navigation
- UI state management (local only)

**What belongs here:**
```
src/app/presentation/
├── components/          # Reusable UI components
├── pages/              # Route components
├── directives/         # Angular directives
├── pipes/              # Angular pipes
└── guards/             # Route guards
```

**Example:**
```typescript
// ✅ GOOD: Component only handles UI
@Component({
  selector: 'app-workspace-list',
  template: `
    @if (workspaces(); as workspaces) {
      @for (workspace of workspaces; track workspace.id) {
        <div (click)="onSelect(workspace.id)">
          {{ workspace.name }}
        </div>
      }
    }
  `
})
export class WorkspaceListComponent {
  // Depend on Application layer
  private workspaceStore = inject(WorkspaceStore);
  
  workspaces = this.workspaceStore.availableWorkspaces;
  
  onSelect(id: string): void {
    // Delegate to Application layer
    this.workspaceStore.switchWorkspace(id);
  }
}

// ❌ BAD: Component has business logic
@Component({ ... })
export class WorkspaceListComponent {
  private firestore = inject(Firestore);  // ❌ Depends on Infrastructure
  
  async onSelect(id: string) {
    // ❌ Business logic in component
    const doc = await getDoc(this.firestore, 'workspaces', id);
    if (!doc.exists()) throw new Error('Not found');
    // ...
  }
}
```

### 2. Application Layer
**Purpose:** Coordinate domain objects to fulfill use cases

**Allowed to depend on:**
- ✅ Domain Layer (entities, value objects, domain services)
- ✅ Application interfaces (repository interfaces, service interfaces)
- ❌ Infrastructure Layer implementations (NEVER directly)

**Responsibilities:**
- Orchestrate use cases (handlers)
- Manage application state (stores)
- Define repository interfaces
- Coordinate domain objects
- Emit domain events

**What belongs here:**
```
src/app/application/
├── handlers/           # Use case handlers
│   ├── create-workspace.handler.ts
│   └── switch-workspace.handler.ts
├── stores/            # Application state (ngrx/signals)
│   ├── workspace.store.ts
│   └── tasks.store.ts
├── services/          # Application services
│   └── workspace-lifecycle.service.ts
├── interfaces/        # Repository/service interfaces
│   ├── workspace-repository.interface.ts
│   └── workspace-repository.token.ts
└── events/           # Application events
    └── workspace.events.ts
```

**Example:**
```typescript
// ✅ GOOD: Handler orchestrates domain logic
export class CreateWorkspaceHandler {
  private repo = inject(WORKSPACE_REPOSITORY);  // Interface, not implementation
  
  async execute(command: CreateWorkspaceCommand): Promise<WorkspaceEntity> {
    // 1. Create domain entity (business rules enforced)
    const workspace = new WorkspaceEntity(
      generateId(),
      command.name,
      command.ownerId,
      command.ownerType,
      command.moduleIds
    );
    
    // 2. Persist via repository interface
    await this.repo.save(workspace);
    
    return workspace;
  }
}

// ❌ BAD: Handler directly uses Firebase
export class CreateWorkspaceHandler {
  private firestore = inject(Firestore);  // ❌ Depends on Infrastructure
  
  async execute(command: CreateWorkspaceCommand) {
    // ❌ Persistence logic in Application layer
    await setDoc(doc(this.firestore, 'workspaces', id), {
      name: command.name,
      // ...
    });
  }
}
```

### 3. Domain Layer
**Purpose:** Encapsulate core business logic and rules

**Allowed to depend on:**
- ✅ NOTHING (completely isolated)
- ✅ Other domain objects in same layer
- ❌ Application Layer (NEVER)
- ❌ Infrastructure Layer (NEVER)
- ❌ Presentation Layer (NEVER)

**Responsibilities:**
- Business rules enforcement
- Domain entity behavior
- Value object validation
- Domain event definitions
- Domain service logic (when behavior doesn't belong to entity)

**What belongs here:**
```
src/app/domain/
├── aggregates/        # Aggregate roots
│   ├── workspace/
│   │   ├── workspace.entity.ts
│   │   └── workspace-module.value-object.ts
│   └── task/
│       └── task.entity.ts
├── value-objects/     # Immutable value objects
│   ├── email.value-object.ts
│   └── workspace-name.value-object.ts
├── services/          # Domain services
│   └── workspace-validation.service.ts
└── events/           # Domain events
    └── workspace-created.event.ts
```

**Example:**
```typescript
// ✅ GOOD: Pure domain entity
export class WorkspaceEntity {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly ownerId: string,
    public readonly ownerType: 'user' | 'organization',
    private _moduleIds: string[]
  ) {
    this.validateName(name);
    this.validateModules(_moduleIds);
  }
  
  // Domain behavior
  hasModule(moduleId: string): boolean {
    return this._moduleIds.includes(moduleId);
  }
  
  addModule(moduleId: string): void {
    if (this.hasModule(moduleId)) {
      throw new DomainError('Module already exists');
    }
    this._moduleIds.push(moduleId);
  }
  
  // Business rule
  private validateName(name: string): void {
    if (name.length < 3 || name.length > 50) {
      throw new DomainError('Workspace name must be 3-50 characters');
    }
  }
  
  // Business rule
  private validateModules(moduleIds: string[]): void {
    if (moduleIds.length === 0) {
      throw new DomainError('Workspace must have at least one module');
    }
  }
  
  get moduleIds(): ReadonlyArray<string> {
    return [...this._moduleIds];
  }
}

// ❌ BAD: Domain entity with infrastructure dependencies
export class WorkspaceEntity {
  private firestore = inject(Firestore);  // ❌ Domain depends on Infrastructure
  
  async save() {  // ❌ Persistence in domain
    await setDoc(doc(this.firestore, 'workspaces', this.id), {
      name: this.name
    });
  }
}
```

### 4. Infrastructure Layer
**Purpose:** Provide technical implementations

**Allowed to depend on:**
- ✅ Domain Layer (entities, value objects)
- ✅ Application Layer interfaces (implements them)
- ❌ Presentation Layer (NEVER)

**Responsibilities:**
- Database access (Firestore, SQL, etc.)
- External API calls
- File system operations
- Email sending
- Message queue operations
- Implement repository interfaces

**What belongs here:**
```
src/app/infrastructure/
├── repositories/      # Repository implementations
│   ├── firebase-workspace.repository.ts
│   └── firestore-task.repository.ts
├── clients/          # External API clients
│   └── slack-api.client.ts
├── adapters/         # Third-party adapters
│   └── firebase.adapter.ts
└── providers/        # DI providers
    └── repository.providers.ts
```

**Example:**
```typescript
// ✅ GOOD: Repository implements interface from Application layer
@Injectable()
export class FirebaseWorkspaceRepository implements WorkspaceRepository {
  private firestore = inject(Firestore);
  
  async findById(id: string): Promise<WorkspaceEntity | null> {
    const docRef = doc(this.firestore, 'workspaces', id);
    const snapshot = await getDoc(docRef);
    
    if (!snapshot.exists()) return null;
    
    // Convert Firestore data to Domain entity
    const data = snapshot.data();
    return new WorkspaceEntity(
      snapshot.id,
      data.name,
      data.ownerId,
      data.ownerType,
      data.moduleIds
    );
  }
  
  async save(workspace: WorkspaceEntity): Promise<void> {
    const docRef = doc(this.firestore, 'workspaces', workspace.id);
    
    // Convert Domain entity to Firestore data
    await setDoc(docRef, {
      name: workspace.name,
      ownerId: workspace.ownerId,
      ownerType: workspace.ownerType,
      moduleIds: workspace.moduleIds,
      updatedAt: Timestamp.now()
    });
  }
}

// ❌ BAD: Repository with business logic
@Injectable()
export class FirebaseWorkspaceRepository {
  async save(workspace: WorkspaceEntity): Promise<void> {
    // ❌ Business validation in Infrastructure
    if (workspace.name.length < 3) {
      throw new Error('Name too short');
    }
    
    await setDoc(...);
  }
}
```

## Dependency Rules (CRITICAL)

### Rule 1: Dependency Direction
```
Presentation → Application → Domain ← Infrastructure
```

**ALLOWED:**
- ✅ Presentation depends on Application
- ✅ Application depends on Domain
- ✅ Infrastructure depends on Domain
- ✅ Infrastructure implements Application interfaces

**FORBIDDEN:**
- ❌ Domain depends on ANYTHING
- ❌ Application depends on Infrastructure implementations
- ❌ Domain depends on Application
- ❌ Infrastructure depends on Presentation

### Rule 2: Dependency Inversion
Application layer defines interfaces, Infrastructure layer implements them.

```typescript
// Application layer defines interface
export interface WorkspaceRepository {
  findById(id: string): Promise<WorkspaceEntity | null>;
  save(workspace: WorkspaceEntity): Promise<void>;
}

export const WORKSPACE_REPOSITORY = new InjectionToken<WorkspaceRepository>(
  'WORKSPACE_REPOSITORY'
);

// Infrastructure layer implements
@Injectable()
export class FirebaseWorkspaceRepository implements WorkspaceRepository {
  // Implementation
}

// Provide in app.config.ts
providers: [
  {
    provide: WORKSPACE_REPOSITORY,
    useClass: FirebaseWorkspaceRepository
  }
]

// Application layer uses interface
export class WorkspaceStore {
  private repo = inject(WORKSPACE_REPOSITORY);  // ✅ Depends on abstraction
}
```

## Layer Communication Patterns

### Presentation → Application
```typescript
// Component calls Application layer
@Component({ ... })
export class WorkspaceListComponent {
  private store = inject(WorkspaceStore);  // Application layer
  
  onSelect(id: string): void {
    this.store.switchWorkspace(id);
  }
}
```

### Application → Domain
```typescript
// Handler uses Domain entities
export class CreateWorkspaceHandler {
  execute(command: CreateWorkspaceCommand): WorkspaceEntity {
    // Use domain entity
    return new WorkspaceEntity(...);
  }
}
```

### Application → Infrastructure (via Interface)
```typescript
// Application defines interface
export interface WorkspaceRepository {
  save(workspace: WorkspaceEntity): Promise<void>;
}

// Application uses interface
export class WorkspaceStore {
  private repo = inject(WORKSPACE_REPOSITORY);  // Interface token
  
  async createWorkspace(name: string) {
    const workspace = new WorkspaceEntity(...);
    await this.repo.save(workspace);  // ✅ Via interface
  }
}
```

### Infrastructure → Domain
```typescript
// Repository converts to/from Domain entities
export class FirebaseWorkspaceRepository {
  async findById(id: string): Promise<WorkspaceEntity> {
    const data = await this.firestore.get(...);
    
    // Convert to Domain entity
    return new WorkspaceEntity(
      data.id,
      data.name,
      data.ownerId,
      data.ownerType,
      data.moduleIds
    );
  }
}
```

## Common Violations

### ❌ Violation 1: Domain depends on Infrastructure
```typescript
// Domain layer
export class WorkspaceEntity {
  private firestore = inject(Firestore);  // ❌ WRONG
  
  async save() {
    await setDoc(...);  // ❌ Persistence in domain
  }
}
```

### ❌ Violation 2: Application depends on Infrastructure implementation
```typescript
// Application layer
export class WorkspaceStore {
  private repo = inject(FirebaseWorkspaceRepository);  // ❌ WRONG: concrete class
}
```

### ❌ Violation 3: Component has business logic
```typescript
@Component({ ... })
export class WorkspaceFormComponent {
  onSubmit(name: string) {
    // ❌ WRONG: Business validation in component
    if (name.length < 3 || name.length > 50) {
      throw new Error('Invalid name');
    }
  }
}
```

### ❌ Violation 4: Repository has business logic
```typescript
export class FirebaseWorkspaceRepository {
  async save(workspace: WorkspaceEntity) {
    // ❌ WRONG: Business rule in infrastructure
    if (workspace.moduleIds.length === 0) {
      throw new Error('Must have modules');
    }
    
    await setDoc(...);
  }
}
```

## Testing by Layer

### Domain Layer Tests
```typescript
// NO infrastructure, NO mocks needed
describe('WorkspaceEntity', () => {
  it('should enforce name length', () => {
    expect(() => new WorkspaceEntity('', 'AB', ...))
      .toThrow('Workspace name must be 3-50 characters');
  });
});
```

### Application Layer Tests
```typescript
// Mock repository interface
describe('CreateWorkspaceHandler', () => {
  it('should create workspace', async () => {
    const mockRepo: WorkspaceRepository = {
      save: jest.fn()
    };
    
    const handler = new CreateWorkspaceHandler(mockRepo);
    await handler.execute({ name: 'Test' });
    
    expect(mockRepo.save).toHaveBeenCalled();
  });
});
```

### Infrastructure Layer Tests
```typescript
// Integration tests with real Firestore (or emulator)
describe('FirebaseWorkspaceRepository', () => {
  it('should save and retrieve workspace', async () => {
    const repo = new FirebaseWorkspaceRepository(firestore);
    const workspace = new WorkspaceEntity(...);
    
    await repo.save(workspace);
    const retrieved = await repo.findById(workspace.id);
    
    expect(retrieved).toEqual(workspace);
  });
});
```

## Checklist

- [ ] Domain entities have ZERO dependencies?
- [ ] Application layer depends on Domain, NOT Infrastructure implementations?
- [ ] Infrastructure implements Application interfaces?
- [ ] Components only handle UI, delegate to Application layer?
- [ ] Repository interfaces defined in Application layer?
- [ ] Business rules ONLY in Domain layer?
- [ ] No circular dependencies between layers?

## Benefits

✅ **Testability:** Each layer can be tested independently
✅ **Flexibility:** Swap Infrastructure implementations easily
✅ **Maintainability:** Clear separation of concerns
✅ **Team scalability:** Different teams can work on different layers
✅ **Business logic protection:** Domain layer isolated from technical changes
