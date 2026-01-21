---
description: 'Strict enforcement rules for project structure, naming conventions, and layer dependencies'
applyTo: '**'
---

# Project Structure Rules

## CRITICAL: Layer Directory Structure

ALL files MUST be placed in their designated layer. Cross-layer file placement is FORBIDDEN.

```
src/app/
├── presentation/
│   ├── layouts/
│   ├── features/
│   ├── shared/
│   ├── core/
│   └── theme/
├── application/
│   ├── store/
│   ├── effects/
│   ├── commands/
│   ├── queries/
│   ├── services/
│   ├── mappers/
│   ├── validators/
│   ├── guards/
│   ├── interceptors/
│   ├── pipes/
│   ├── directives/
│   ├── models/
│   ├── utils/
│   └── constants/
├── domain/
│   ├── shared/
│   ├── account/
│   ├── workspace-membership/
│   ├── workspace/
│   ├── modules/
│   ├── events/
│   ├── commands/
│   ├── queries/
│   ├── repositories/
│   └── services/
├── infrastructure/
│   ├── firebase/
│   ├── persistence/
│   ├── storage/
│   ├── auth/
│   ├── domain-services/
│   ├── event-sourcing/
│   ├── caching/
│   ├── logging/
│   ├── monitoring/
│   ├── external-services/
│   ├── adapters/
│   ├── dto/
│   ├── providers/
│   └── errors/
└── shared/
    ├── components/
    ├── directives/
    ├── pipes/
    ├── validators/
    ├── services/
    ├── models/
    ├── utils/
    ├── constants/
    ├── enums/
    ├── types/
    └── interfaces/
```

**VIOLATION consequences:**
- Incorrect layer placement → Build rejection
- Missing required subdirectory → Immediate refactoring required

## Naming Convention Enforcement

ALL files MUST follow strict naming patterns per layer. Deviations are FORBIDDEN.

### Domain Layer Patterns (MANDATORY)

| Type | Pattern | Example | Violation Consequence |
|------|---------|---------|----------------------|
| Entity | `{name}.entity.ts` | `workspace.entity.ts` | File rejected |
| Value Object | `{name}.value-object.ts` | `workspace-id.value-object.ts` | File rejected |
| Aggregate | `{name}.aggregate.ts` | `workspace.aggregate.ts` | File rejected |
| Event | `{name}.event.ts` | `workspace-created.event.ts` | File rejected |
| Command | `{action}-{entity}.command.ts` | `create-workspace.command.ts` | File rejected |
| Query | `{action}-{entity}.query.ts` | `get-workspace.query.ts` | File rejected |
| Enum | `{name}.enum.ts` | `workspace-type.enum.ts` | File rejected |
| Interface | `{name}.interface.ts` | `workspace.repository.interface.ts` | File rejected |

### Application Layer Patterns (MANDATORY)

| Type | Pattern | Example | Violation Consequence |
|------|---------|---------|----------------------|
| Store | `{feature}.store.ts` | `workspace.store.ts` | File rejected |
| Models | `{feature}.models.ts` | `workspace.models.ts` | File rejected |
| Command Handler | `{action}-{entity}.handler.ts` | `create-workspace.handler.ts` | File rejected |
| Query Handler | `{action}-{entity}.handler.ts` | `get-workspace.handler.ts` | File rejected |
| Mapper | `{source}-to-{target}.mapper.ts` | `workspace-to-dto.mapper.ts` | File rejected |
| Service | `{feature}.service.ts` | `workspace-guard.service.ts` | File rejected |

### Infrastructure Layer Patterns (MANDATORY)

| Type | Pattern | Example | Violation Consequence |
|------|---------|---------|----------------------|
| Repository | `{entity}-firestore.repository.ts` | `workspace-firestore.repository.ts` | File rejected |
| Converter | `{entity}.firestore-converter.ts` | `workspace.firestore-converter.ts` | File rejected |
| DTO | `{entity}-firebase.dto.ts` | `workspace-firebase.dto.ts` | File rejected |
| Query Builder | `{entity}-query.builder.ts` | `workspace-query.builder.ts` | File rejected |
| Service Impl | `{feature}-impl.service.ts` | `workspace-guard-impl.service.ts` | File rejected |

### Presentation Layer Patterns (MANDATORY)

| Type | Pattern | Example | Violation Consequence |
|------|---------|---------|----------------------|
| Component | `{name}.component.ts` | `workspace-list.component.ts` | File rejected |
| Page | `{name}-page.component.ts` | `workspace-detail-page.component.ts` | File rejected |
| Layout | `{name}-layout.component.ts` | `workspace-layout.component.ts` | File rejected |

### Shared Layer Patterns (MANDATORY)

| Type | Pattern | Example | Violation Consequence |
|------|---------|---------|----------------------|
| Component | `{name}.component.ts` | `avatar.component.ts` | File rejected |
| Directive | `{name}.directive.ts` | `has-permission.directive.ts` | File rejected |
| Pipe | `{name}.pipe.ts` | `date-ago.pipe.ts` | File rejected |
| Service | `{feature}.service.ts` | `dialog.service.ts` | File rejected |
| Util | `{category}.utils.ts` | `array.utils.ts` | File rejected |

## CRITICAL: Dependency Direction Rules

Dependencies MUST flow inward. Reverse dependencies are FORBIDDEN.

### Allowed Dependency Paths

```
Presentation → Application (ALLOWED)
Presentation → Shared (ALLOWED)

Application → Domain (ALLOWED)
Application → Shared (ALLOWED)

Domain → (NOTHING) (ALLOWED)

Infrastructure → Domain (ALLOWED)
Infrastructure → Shared (ALLOWED)

Shared → (NOTHING) (ALLOWED)
```

**VIOLATION consequences:** Circular dependency detected → Build failure

### FORBIDDEN Dependency Paths

```
Domain → Application (FORBIDDEN)
Domain → Infrastructure (FORBIDDEN)
Domain → Presentation (FORBIDDEN)

Infrastructure → Application (FORBIDDEN)
Infrastructure → Presentation (FORBIDDEN)

Application → Infrastructure (FORBIDDEN - use dependency injection via domain interfaces)
```

**VIOLATION consequences:**
- Forbidden import detected → IMMEDIATE build rejection
- Circular reference → Architecture corruption
- Direct infrastructure access → Security vulnerability

## Layer Content Constraints

### Domain Layer (ZERO framework dependencies)

**REQUIRED contents:**
- Entities (business objects with identity)
- Value Objects (immutable objects)
- Aggregates (consistency boundaries)
- Domain Events (business-significant occurrences)
- Repository Interfaces (persistence contracts)
- Domain Services (business logic)

**FORBIDDEN contents:**
- Angular dependencies
- Firebase dependencies
- HTTP clients
- I/O operations
- Framework-specific code

**VIOLATION consequences:** Framework dependency in domain → Architecture violation → IMMEDIATE refactoring

### Application Layer (Orchestration ONLY)

**REQUIRED contents:**
- NgRx Signals Stores (state management)
- Command Handlers (write operations)
- Query Handlers (read operations)
- Application Services (orchestration)
- Data Mappers (domain ↔ DTO transformations)
- Effects (async operations via rxMethod)

**FORBIDDEN contents:**
- Direct Firebase calls
- Business rules
- UI logic

**VIOLATION consequences:**
- Business rule in application layer → Domain model violation
- Direct Firebase access → Security breach
- UI logic → Layer separation failure

### Infrastructure Layer (External system integration)

**REQUIRED contents:**
- Repository Implementations (Firestore, etc.)
- Firebase Converters (domain ↔ Firestore)
- External Service Adapters
- Event Store Implementations
- Storage Services
- Authentication Services

**FORBIDDEN contents:**
- Business rules
- UI components
- Direct state management

**VIOLATION consequences:**
- Business logic → Domain model corruption
- UI component → Layer boundary violation

### Presentation Layer (UI ONLY)

**REQUIRED contents:**
- Angular Components
- Templates
- Layouts
- Pages
- Component-specific logic

**FORBIDDEN contents:**
- Business rules
- Direct Firebase calls
- Direct repository access

**VIOLATION consequences:**
- Business rule → Domain bypass
- Direct Firebase call → Security vulnerability
- Direct repository access → Architecture violation

### Shared Layer (Utilities ONLY)

**REQUIRED contents:**
- UI Components (reusable)
- Directives
- Pipes
- Validators
- Utility Functions
- Shared Services

**FORBIDDEN contents:**
- Business rules
- Layer-specific logic

**VIOLATION consequences:** Layer-specific logic → Shared contamination

## Store Hierarchy Enforcement

NgRx Signals stores MUST follow hierarchical organization. Flat store structures are FORBIDDEN.

**REQUIRED hierarchy:**

```
GlobalShell (Root Level) - MUST exist
├── Auth Store
├── Config Store
├── Layout Store
└── Router Store

WorkspaceList Store (Account Level) - MUST exist if multi-workspace
└── Current Workspace ID

Workspace Store (Context Store) - MUST exist per workspace
├── Workspace Data
├── Permissions
└── Preferences

Feature Stores (Module Level) - MUST exist per feature
├── Tasks Store
├── Documents Store
├── Members Store
└── ...

Entity Stores (Entity Level) - MUST exist per entity type
├── Task Entity Store
├── Document Entity Store
└── ...
```

### Store Naming (MANDATORY)

| Store Type | Pattern | Example | Violation |
|------------|---------|---------|-----------|
| Global | `{feature}.store.ts` | `auth.store.ts` | File rejected |
| Context | `{context}.store.ts` | `workspace.store.ts` | File rejected |
| Feature | `{feature}s.store.ts` | `tasks.store.ts` | File rejected |
| Entity | `{entity}-entity.store.ts` | `task-entity.store.ts` | File rejected |

**VIOLATION consequences:** Incorrect store naming → Build rejection

## File Organization (MANDATORY)

### Component Organization (REQUIRED structure)

```
feature-name/
├── feature-name.component.ts (REQUIRED)
├── feature-name.component.html (REQUIRED)
├── feature-name.component.scss (REQUIRED)
├── feature-name.component.spec.ts (REQUIRED)
└── index.ts (REQUIRED)
```

**VIOLATION consequences:** Missing required file → Component incomplete → Build failure

### Store Organization (REQUIRED structure)

```
feature/
├── feature.store.ts (REQUIRED)
├── feature.models.ts (REQUIRED)
├── feature.selectors.ts (OPTIONAL)
└── index.ts (REQUIRED)
```

**VIOLATION consequences:** Missing store or models file → State management incomplete

### Domain Organization (REQUIRED structure)

```
entity-name/
├── entities/ (REQUIRED)
│   ├── entity.entity.ts (REQUIRED)
│   └── index.ts (REQUIRED)
├── value-objects/ (REQUIRED)
│   ├── value.value-object.ts (REQUIRED)
│   └── index.ts (REQUIRED)
├── enums/ (IF APPLICABLE)
│   ├── type.enum.ts
│   └── index.ts
├── aggregates/ (IF APPLICABLE)
│   ├── aggregate.aggregate.ts
│   └── index.ts
└── index.ts (REQUIRED)
```

**VIOLATION consequences:** Missing entity or value object → Domain model incomplete

## CRITICAL: Import Pattern Enforcement

Path aliases MUST be used for ALL cross-directory imports. Relative paths across layers are FORBIDDEN.

### REQUIRED Import Patterns

```typescript
// Presentation Layer
import { Component } from '@angular/core';
import { WorkspaceStore } from '@application/store/workspace'; // REQUIRED
import { Workspace } from '@domain/workspace'; // REQUIRED
import { AvatarComponent } from '@shared/components/ui/avatar'; // REQUIRED
// FORBIDDEN: import from @infrastructure

// Application Layer
import { inject } from '@angular/core';
import { Workspace } from '@domain/workspace'; // REQUIRED
import { IWorkspaceRepository } from '@domain/repositories'; // REQUIRED
import { ArrayUtils } from '@shared/utils/array'; // REQUIRED
// FORBIDDEN: import from @infrastructure

// Domain Layer
import { AccountId } from '@domain/account'; // REQUIRED
// FORBIDDEN: import from @application, @infrastructure, @presentation

// Infrastructure Layer
import { inject } from '@angular/core';
import { Workspace } from '@domain/workspace'; // REQUIRED
import { IWorkspaceRepository } from '@domain/repositories'; // REQUIRED
import { DateUtils } from '@shared/utils/date'; // REQUIRED
```

### FORBIDDEN Import Patterns

```typescript
// FORBIDDEN - relative path across layers
import { Workspace } from '../../../domain/workspace/entities/workspace.entity';

// FORBIDDEN - direct infrastructure import from application
import { WorkspaceFirestoreRepository } from '@infrastructure/persistence/workspace';

// FORBIDDEN - domain importing from outer layers
import { WorkspaceStore } from '@application/store/workspace';
```

**VIOLATION consequences:**
- Relative path import → Refactoring required
- Cross-layer violation → Architecture corruption
- Domain layer importing framework code → Build rejection

## Testing Structure (MANDATORY)

ALL implementation files MUST have corresponding test files in the same directory.

**REQUIRED test file structure:**

```
{feature}/
├── {feature}.component.ts
├── {feature}.component.spec.ts (REQUIRED)
├── {feature}.store.ts
├── {feature}.store.spec.ts (REQUIRED)
└── ...
```

**VIOLATION consequences:** Missing test file → Code incomplete → Deployment blocked

### Test Naming Convention (MANDATORY)

```typescript
describe('FeatureName', () => {
  describe('MethodName', () => {
    it('should do something when condition', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

**VIOLATION consequences:** Incorrect test naming → Test suite rejected

## TypeScript Enforcement

### REQUIRED Configuration

- `strict` mode MUST be enabled in `tsconfig.json`
- Explicit types MUST be used (`any` is FORBIDDEN)
- `readonly` MUST be used for immutable properties
- Type guards and union types MUST be used for type narrowing

**VIOLATION consequences:**
- `strict` mode disabled → Build rejection
- `any` type usage → Type safety violation
- Missing `readonly` on immutable properties → Data integrity risk

## Angular Component Standards (MANDATORY)

- Standalone components REQUIRED
- Angular Signals REQUIRED for reactivity
- `OnPush` change detection REQUIRED
- Angular style guide compliance REQUIRED

**VIOLATION consequences:** Non-standalone component → Migration required

## NgRx Signals Standards (MANDATORY)

- `signalStore` REQUIRED for ALL state management
- `patchState` REQUIRED for ALL mutations
- `computed()` REQUIRED for derived state
- `rxMethod` REQUIRED for async operations

**VIOLATION consequences:**
- Direct state mutation → State corruption
- Missing `computed()` for derived state → Performance degradation

## Firebase Integration Standards (MANDATORY)

- Converters REQUIRED for data transformation
- Query builders REQUIRED for complex queries
- Transactions REQUIRED for atomic operations
- Batch writes REQUIRED for bulk updates

**VIOLATION consequences:**
- Missing converter → Data mapping failure
- Direct query without builder → Query inconsistency
