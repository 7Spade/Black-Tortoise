---
description: "Enforce strict dependency direction rules in Domain-Driven Design"
applyTo: '**'
---

# Strict DDD Dependency Direction

## The Dependency Rule

**Dependencies can only point in ONE direction:**

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Presentation Layer                                          │
│  (Components, Pages, Directives)                             │
│                                                              │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             ↓ Depends on
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Application Layer                                           │
│  (Handlers, Stores, Services, Interfaces)                    │
│                                                              │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             ↓ Depends on
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Domain Layer                                                │
│  (Entities, Value Objects, Domain Services)                  │
│  ★ NO DEPENDENCIES TO ANYTHING ★                             │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                             ↑
                             │ Depends on (implements interfaces)
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Infrastructure Layer                                        │
│  (Repositories, API Clients, Database Access)                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Core Dependency Rules

### Rule 1: Domain Layer Has ZERO Dependencies
The domain layer is the **center** of your application and must be **completely isolated**.

#### ✅ CORRECT: Pure Domain
```typescript
// domain/aggregates/workspace.entity.ts
export class WorkspaceEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly ownerId: string,
    public readonly ownerType: 'user' | 'organization',
    private _moduleIds: string[]
  ) {
    this.validate();
  }
  
  // Pure business logic
  hasModule(moduleId: string): boolean {
    return this._moduleIds.includes(moduleId);
  }
  
  addModule(moduleId: string): void {
    if (this.hasModule(moduleId)) {
      throw new DomainError('Module already exists');
    }
    this._moduleIds.push(moduleId);
  }
  
  private validate(): void {
    if (this.name.length < 3 || this.name.length > 50) {
      throw new DomainError('Invalid workspace name');
    }
  }
  
  get moduleIds(): ReadonlyArray<string> {
    return [...this._moduleIds];
  }
}
```

**Domain layer can only import:**
- ✅ Other domain objects from same layer
- ✅ Standard library (TypeScript built-ins)
- ❌ NOTHING from Application layer
- ❌ NOTHING from Infrastructure layer
- ❌ NOTHING from Presentation layer
- ❌ NO framework dependencies (Angular, RxJS, etc.)

#### ❌ WRONG: Domain with Dependencies
```typescript
// ❌ WRONG: Domain depends on Angular
import { Injectable } from '@angular/core';

@Injectable()  // ❌ Framework decorator in domain
export class WorkspaceEntity {
  private firestore = inject(Firestore);  // ❌ Infrastructure in domain
  
  async save() {  // ❌ Persistence in domain
    await setDoc(...);
  }
}
```

### Rule 2: Application Layer Depends ONLY on Domain
Application layer orchestrates domain objects but doesn't implement infrastructure.

#### ✅ CORRECT: Application Depends on Domain + Interfaces
```typescript
// application/interfaces/workspace-repository.interface.ts
export interface WorkspaceRepository {
  findById(id: string): Promise<WorkspaceEntity | null>;
  save(workspace: WorkspaceEntity): Promise<void>;
  findByOwnerId(ownerId: string, ownerType: string): Promise<WorkspaceEntity[]>;
}

export const WORKSPACE_REPOSITORY = new InjectionToken<WorkspaceRepository>(
  'WORKSPACE_REPOSITORY'
);

// application/handlers/create-workspace.handler.ts
export class CreateWorkspaceHandler {
  private repository = inject(WORKSPACE_REPOSITORY);  // ✅ Interface
  
  async execute(command: CreateWorkspaceCommand): Promise<WorkspaceEntity> {
    // Use Domain entity
    const workspace = new WorkspaceEntity(
      generateId(),
      command.name,
      command.ownerId,
      command.ownerType,
      command.moduleIds
    );
    
    // Persist via interface (not concrete implementation)
    await this.repository.save(workspace);
    
    return workspace;
  }
}
```

**Application layer can import:**
- ✅ Domain entities and value objects
- ✅ Domain services
- ✅ Framework utilities (Angular, RxJS) for orchestration
- ✅ Interfaces defined in Application layer itself
- ❌ NEVER concrete Infrastructure implementations

#### ❌ WRONG: Application Depends on Infrastructure
```typescript
// ❌ WRONG: Application depends on concrete infrastructure
import { FirebaseWorkspaceRepository } from '@infrastructure/repositories';

export class CreateWorkspaceHandler {
  private repository = inject(FirebaseWorkspaceRepository);  // ❌ Concrete class
  
  async execute(command: CreateWorkspaceCommand) {
    // ❌ Direct infrastructure usage
    await this.repository.saveToFirestore(workspace);
  }
}
```

### Rule 3: Infrastructure Depends on Domain + Implements Application Interfaces
Infrastructure provides technical implementations.

#### ✅ CORRECT: Infrastructure Implements Interface
```typescript
// infrastructure/repositories/firebase-workspace.repository.ts
import { WorkspaceRepository } from '@application/interfaces/workspace-repository.interface';
import { WorkspaceEntity } from '@domain/aggregates/workspace.entity';

@Injectable()
export class FirebaseWorkspaceRepository implements WorkspaceRepository {
  private firestore = inject(Firestore);
  
  async findById(id: string): Promise<WorkspaceEntity | null> {
    const docRef = doc(this.firestore, 'workspaces', id);
    const snapshot = await getDoc(docRef);
    
    if (!snapshot.exists()) return null;
    
    const data = snapshot.data();
    
    // Convert Firestore data → Domain entity
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
    
    // Convert Domain entity → Firestore data
    await setDoc(docRef, {
      name: workspace.name,
      ownerId: workspace.ownerId,
      ownerType: workspace.ownerType,
      moduleIds: workspace.moduleIds,
      updatedAt: Timestamp.now()
    });
  }
  
  async findByOwnerId(
    ownerId: string, 
    ownerType: string
  ): Promise<WorkspaceEntity[]> {
    const q = query(
      collection(this.firestore, 'workspaces'),
      where('ownerId', '==', ownerId),
      where('ownerType', '==', ownerType)
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => 
      new WorkspaceEntity(
        doc.id,
        doc.data().name,
        doc.data().ownerId,
        doc.data().ownerType,
        doc.data().moduleIds
      )
    );
  }
}
```

**Infrastructure layer can import:**
- ✅ Domain entities (to convert to/from)
- ✅ Application interfaces (to implement)
- ✅ Any external libraries (Firebase, HTTP clients, etc.)
- ❌ NEVER Presentation layer

#### ❌ WRONG: Infrastructure with Business Logic
```typescript
// ❌ WRONG: Business validation in infrastructure
@Injectable()
export class FirebaseWorkspaceRepository {
  async save(workspace: WorkspaceEntity): Promise<void> {
    // ❌ Business rule in infrastructure
    if (workspace.name.length < 3) {
      throw new Error('Name too short');
    }
    
    // ❌ Business logic in infrastructure
    if (!workspace.moduleIds.includes('overview')) {
      workspace.moduleIds.push('overview');
    }
    
    await setDoc(...);
  }
}
```

### Rule 4: Presentation Layer Depends ONLY on Application
Presentation layer handles UI and user interaction.

#### ✅ CORRECT: Component Uses Application Layer
```typescript
// presentation/components/workspace-list.component.ts
@Component({
  selector: 'app-workspace-list',
  template: `
    @if (isLoading()) {
      <mat-spinner />
    }
    
    @if (workspaces(); as workspaces) {
      @for (workspace of workspaces; track workspace.id) {
        <mat-list-item (click)="onSelect(workspace.id)">
          {{ workspace.name }}
        </mat-list-item>
      }
    }
  `
})
export class WorkspaceListComponent {
  private workspaceStore = inject(WorkspaceStore);  // ✅ Application layer
  
  workspaces = this.workspaceStore.availableWorkspaces;
  isLoading = this.workspaceStore.isLoading;
  
  onSelect(id: string): void {
    // Delegate to Application layer
    this.workspaceStore.switchWorkspace(id);
  }
}
```

**Presentation layer can import:**
- ✅ Application stores
- ✅ Application handlers (via injection)
- ✅ Angular framework (components, directives, etc.)
- ✅ UI libraries (Material, etc.)
- ❌ NEVER Domain entities directly (get them via Application)
- ❌ NEVER Infrastructure implementations

#### ❌ WRONG: Component with Business Logic
```typescript
// ❌ WRONG: Component has business logic and infrastructure access
@Component({ ... })
export class WorkspaceListComponent {
  private firestore = inject(Firestore);  // ❌ Direct infrastructure
  
  async onSelect(id: string) {
    // ❌ Business logic in component
    const doc = await getDoc(this.firestore, 'workspaces', id);
    
    if (!doc.exists()) {
      throw new Error('Workspace not found');
    }
    
    const data = doc.data();
    
    // ❌ Business validation in component
    if (data.moduleIds.length === 0) {
      throw new Error('Invalid workspace');
    }
    
    // ❌ Direct navigation
    this.router.navigate(['/workspace', id]);
  }
}
```

## Dependency Inversion Principle (DIP)

**Key principle:** High-level modules should not depend on low-level modules. Both should depend on abstractions.

### Before DIP (Tight Coupling)
```typescript
// Application depends on Infrastructure (WRONG)
export class WorkspaceStore {
  private repo = inject(FirebaseWorkspaceRepository);  // ❌ Concrete class
}
```

### After DIP (Loose Coupling)
```typescript
// 1. Application defines interface
export interface WorkspaceRepository {
  save(workspace: WorkspaceEntity): Promise<void>;
}

export const WORKSPACE_REPOSITORY = new InjectionToken<WorkspaceRepository>(
  'WORKSPACE_REPOSITORY'
);

// 2. Application depends on interface
export class WorkspaceStore {
  private repo = inject(WORKSPACE_REPOSITORY);  // ✅ Interface
}

// 3. Infrastructure implements interface
@Injectable()
export class FirebaseWorkspaceRepository implements WorkspaceRepository {
  async save(workspace: WorkspaceEntity): Promise<void> {
    // Implementation
  }
}

// 4. Wire up in app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: WORKSPACE_REPOSITORY,
      useClass: FirebaseWorkspaceRepository  // ✅ Concrete bound here
    }
  ]
};
```

**Benefits:**
- ✅ Application layer doesn't know about Firebase
- ✅ Easy to swap Firebase → PostgreSQL → MongoDB
- ✅ Easy to mock for testing
- ✅ Follows Open/Closed Principle

## Detecting Dependency Violations

### Tool 1: Import Analysis
Check import statements:

```typescript
// domain/aggregates/workspace.entity.ts

// ✅ ALLOWED
import { DomainError } from '@domain/errors';           // Same layer
import { WorkspaceModule } from '@domain/value-objects'; // Same layer

// ❌ FORBIDDEN
import { WorkspaceStore } from '@application/stores';   // Higher layer
import { Firestore } from '@angular/fire/firestore';    // Infrastructure
import { Component } from '@angular/core';              // Presentation
```

### Tool 2: Circular Dependency Detection
```bash
# Use madge or similar tool
npx madge --circular src/
```

If you see:
```
✓ No circular dependencies found
```
Good! But also check layer violations:

```typescript
// ❌ WRONG: Circular dependency
// application/stores/workspace.store.ts
import { WorkspaceEntity } from '@domain/aggregates';  // ✅ OK

// domain/aggregates/workspace.entity.ts  
import { WorkspaceStore } from '@application/stores';  // ❌ CIRCULAR!
```

### Tool 3: Dependency Graph
```
Domain (0 dependencies)
   ↑
Application (depends on Domain only)
   ↑
Presentation (depends on Application only)

Infrastructure (depends on Domain + Application interfaces)
```

## Common Violations

### ❌ Violation 1: Domain Calls Infrastructure
```typescript
// domain/aggregates/workspace.entity.ts
export class WorkspaceEntity {
  private repo = inject(WorkspaceRepository);  // ❌ Domain depends on infrastructure
  
  async save() {
    await this.repo.save(this);
  }
}
```

**Fix:** Move persistence to Application layer
```typescript
// application/handlers/create-workspace.handler.ts
export class CreateWorkspaceHandler {
  private repo = inject(WORKSPACE_REPOSITORY);
  
  async execute(command: CreateWorkspaceCommand): Promise<WorkspaceEntity> {
    const workspace = new WorkspaceEntity(...);
    await this.repo.save(workspace);  // ✅ Application handles persistence
    return workspace;
  }
}
```

### ❌ Violation 2: Application Depends on Concrete Infrastructure
```typescript
// application/stores/workspace.store.ts
import { FirebaseWorkspaceRepository } from '@infrastructure/repositories';

export class WorkspaceStore {
  private repo = inject(FirebaseWorkspaceRepository);  // ❌ Concrete class
}
```

**Fix:** Depend on interface
```typescript
import { WORKSPACE_REPOSITORY } from '@application/interfaces';

export class WorkspaceStore {
  private repo = inject(WORKSPACE_REPOSITORY);  // ✅ Interface
}
```

### ❌ Violation 3: Infrastructure Depends on Presentation
```typescript
// infrastructure/repositories/firebase-workspace.repository.ts
import { WorkspaceListComponent } from '@presentation/components';  // ❌ WRONG

export class FirebaseWorkspaceRepository {
  private component = inject(WorkspaceListComponent);  // ❌ WRONG
}
```

**Fix:** Never let Infrastructure know about Presentation

### ❌ Violation 4: Domain Depends on Framework
```typescript
// domain/aggregates/workspace.entity.ts
import { Injectable } from '@angular/core';  // ❌ Framework in domain

@Injectable()  // ❌ Angular decorator in domain
export class WorkspaceEntity {
  private http = inject(HttpClient);  // ❌ Framework service in domain
}
```

**Fix:** Keep domain pure
```typescript
// domain/aggregates/workspace.entity.ts
// NO IMPORTS from framework

export class WorkspaceEntity {
  // Pure TypeScript class
}
```

## Testing Dependency Direction

### Domain Layer Tests (Zero Mocks)
```typescript
describe('WorkspaceEntity', () => {
  it('should validate name length', () => {
    // NO MOCKS NEEDED - pure domain logic
    expect(() => new WorkspaceEntity('', 'AB', ...))
      .toThrow('Invalid workspace name');
  });
});
```

### Application Layer Tests (Mock Interfaces)
```typescript
describe('CreateWorkspaceHandler', () => {
  it('should create workspace', async () => {
    // Mock APPLICATION interface (not infrastructure)
    const mockRepo: WorkspaceRepository = {
      save: jest.fn().mockResolvedValue(undefined)
    };
    
    const handler = new CreateWorkspaceHandler(mockRepo);
    const workspace = await handler.execute({ name: 'Test', ... });
    
    expect(mockRepo.save).toHaveBeenCalledWith(workspace);
  });
});
```

### Infrastructure Layer Tests (Integration)
```typescript
describe('FirebaseWorkspaceRepository', () => {
  it('should save and retrieve', async () => {
    // Integration test with real Firebase (or emulator)
    const repo = new FirebaseWorkspaceRepository(firestore);
    const workspace = new WorkspaceEntity(...);
    
    await repo.save(workspace);
    const retrieved = await repo.findById(workspace.id);
    
    expect(retrieved).toEqual(workspace);
  });
});
```

## Checklist

- [ ] Domain layer has ZERO imports from Application/Infrastructure/Presentation?
- [ ] Application layer only imports Domain + its own interfaces?
- [ ] Infrastructure implements Application interfaces?
- [ ] Presentation only imports Application layer?
- [ ] No circular dependencies?
- [ ] All dependencies point inward (toward Domain)?
- [ ] Can swap Infrastructure without changing Application?
- [ ] Can test Domain without any mocks?

## Benefits

✅ **Testability:** Each layer testable independently
✅ **Flexibility:** Easy to swap implementations
✅ **Maintainability:** Clear boundaries prevent coupling
✅ **Portability:** Domain logic portable to other frameworks
✅ **Team scalability:** Clear ownership boundaries
✅ **Business logic protection:** Core business rules isolated from technical changes
