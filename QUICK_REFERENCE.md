# DDD Architecture Quick Reference

## Layer Responsibilities

### Domain (`src/app/domain/workspace`)
**What**: Pure business logic
**Contains**: Entities, Value Objects, Aggregates, Domain Services, Repository Interfaces
**Dependencies**: None (Pure TypeScript)
**Import Pattern**: `import { ... } from '@domain/workspace';`

### Application (`src/app/application/workspace`)
**What**: Orchestration and state management
**Contains**: Use Cases, Facades, Stores
**Dependencies**: Domain layer only
**Import Pattern**: `import { ... } from '@application/workspace';`

### Infrastructure (`src/app/infrastructure/workspace`)
**What**: External dependencies and implementations
**Contains**: Repository Implementations, Factories, External Services
**Dependencies**: Domain and Application layers
**Import Pattern**: `import { ... } from '@infrastructure/workspace';`

### Presentation (`src/app/presentation/features/workspace`)
**What**: UI components
**Contains**: Components, Dialogs, Pages
**Dependencies**: Application facades only (no Domain/Infrastructure)
**Import Pattern**: `import { ... } from '@presentation/features/workspace';`

## File Organization

```
workspace/
├── Domain Layer
│   ├── entities/                    # Business entities
│   ├── value-objects/               # Immutable value types
│   ├── aggregates/                  # Aggregate roots
│   ├── services/                    # Domain services
│   ├── repositories/                # Repository interfaces
│   └── interfaces/                  # Domain contracts
│
├── Application Layer
│   ├── use-cases/                   # Business workflows
│   ├── facades/                     # UI coordination
│   └── stores/                      # State management
│
├── Infrastructure Layer
│   ├── factories/                   # Object creation
│   └── persistence/                 # Data storage
│
└── Presentation Layer
    ├── components/                  # Reusable UI
    ├── dialogs/                     # Modal dialogs
    └── pages/                       # Page components
```

## Import Examples

### Domain Layer Usage
```typescript
// Creating entities
import { 
  WorkspaceEntity, 
  createWorkspace 
} from '@domain/workspace';

// Using value objects
import { WorkspaceId } from '@domain/workspace';

// Domain services
import { 
  validateWorkspaceName,
  canCreateWorkspace 
} from '@domain/workspace';
```

### Application Layer Usage
```typescript
// Using facades in components
import { 
  WorkspaceFacade,
  WorkspaceHostFacade,
  IdentityFacade 
} from '@application/workspace';

// Using stores
import { WorkspaceContextStore } from '@application/workspace';

// Using use cases
import { 
  CreateWorkspaceUseCase,
  SwitchWorkspaceUseCase 
} from '@application/workspace';
```

### Infrastructure Layer Usage
```typescript
// Only in app.config.ts or DI setup
import { WorkspaceRuntimeFactory } from '@infrastructure/workspace';
```

### Presentation Layer Usage
```typescript
// Importing workspace UI components
import { 
  WorkspaceSwitcherComponent,
  WorkspaceCreateDialogComponent 
} from '@presentation/features/workspace';
```

## State Management Flow

```
User Action (Component)
    ↓
Facade Method
    ↓
Use Case Execution
    ↓
Domain Logic
    ↓
Store Update (Single Source of Truth)
    ↓
Signal Change
    ↓
UI Update (Automatic)
```

## Dependency Rules

✅ Allowed:
- Domain → No dependencies
- Application → Domain
- Infrastructure → Domain, Application
- Presentation → Application

❌ Forbidden:
- Domain → Application, Infrastructure, Presentation
- Application → Infrastructure, Presentation
- Presentation → Domain, Infrastructure

## Adding New Features

### 1. New Domain Entity
Location: `domain/workspace/entities/`
Export: Add to `domain/workspace/index.ts`

### 2. New Use Case
Location: `application/workspace/use-cases/`
Export: Add to `application/workspace/index.ts`
Pattern: Create Command interface + Use Case class

### 3. New Facade Method
Location: `application/workspace/facades/`
Pattern: Coordinate between store and navigation

### 4. New Component
Location: `presentation/features/workspace/components/`
Export: Add to `presentation/features/workspace/index.ts`
Pattern: Inject facade, use signals, no business logic

## Common Patterns

### Creating a Workspace
```typescript
// In Use Case
export class CreateWorkspaceUseCase {
  execute(command: CreateWorkspaceCommand): WorkspaceEntity {
    // 1. Create domain entity
    const workspace = createWorkspace(...);
    // 2. Persist (via repository)
    // 3. Publish domain event
    // 4. Return entity
  }
}

// In Store
createWorkspace(name: string) {
  const workspace = createWorkspaceUseCase.execute({...});
  patchState(store, { 
    availableWorkspaces: [...workspaces, workspace] 
  });
}

// In Facade
createWorkspace(result: WorkspaceCreateResult) {
  this.store.createWorkspace(result.workspaceName);
  this.router.navigate(['/workspace']);
}

// In Component
onWorkspaceCreated(result: WorkspaceCreateResult) {
  this.facade.createWorkspace(result);
}
```

### Reading State
```typescript
// In Component
readonly workspaceName = computed(() => 
  this.facade.currentWorkspaceName()
);

// In Template
<span>{{ workspaceName() }}</span>
```

## Verification Commands

```bash
# Check structure
tree -L 3 src/app/domain/workspace
tree -L 3 src/app/application/workspace
tree -L 3 src/app/infrastructure/workspace
tree -L 3 src/app/presentation/features/workspace

# Verify no old imports
./verify-ddd-structure.sh

# Check domain purity (should return 0)
grep -r "from '@angular" src/app/domain/workspace | wc -l
```

## Best Practices

1. **Keep Domain Pure**: No Angular, no RxJS in domain layer
2. **Single Source of Truth**: All state in WorkspaceContextStore
3. **Facade Coordination**: Components only call facades, never stores directly
4. **Immutability**: Use readonly, never mutate state
5. **Signal-Based**: Use computed() and effect() for reactivity
6. **Barrel Exports**: Always import from layer barrel (index.ts)
7. **No Business Logic in UI**: Move all logic to domain/application layers

## Migration Guide

When refactoring other features:

1. Identify domain concepts → Move to domain/[feature]/
2. Identify use cases → Move to application/[feature]/use-cases/
3. Identify state → Consolidate to application/[feature]/stores/
4. Create facades → application/[feature]/facades/
5. Clean components → presentation/features/[feature]/
6. Update imports → Use barrel exports
7. Verify → No cross-layer violations

