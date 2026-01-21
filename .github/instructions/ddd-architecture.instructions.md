---
description: 'DDD layer boundary enforcement: dependency direction rules, layer isolation constraints, and cross-layer violation detection'
applyTo: '**'
---

# DDD Architecture Rules

## CRITICAL: Dependency Direction Law

Dependencies MUST flow inward only. Outer layers depend on inner layers, never reverse.

```
presentation → application → domain
infrastructure → domain (implements interfaces)
shared ← ALL layers (read-only)
```

**VIOLATION consequences:**
- Circular dependencies
- Unmockable code
- Framework lock-in
- Untestable business logic

## Domain Layer Constraints

**MUST contain ONLY:**
- Entity / Aggregate
- Value Object
- Domain Service (stateless business logic)
- Domain Event
- Repository Interface (NO implementations)
- Business rules / invariants / state machines

**FORBIDDEN dependencies:**
- `application` layer
- `infrastructure` layer
- `presentation` layer
- Framework code (Angular / Firebase / RxJS / HTTP / DI)
- ANY I/O operations
- ANY external library imports

**ALLOWED dependencies:**
- Domain layer itself (same layer)
- `shared` layer (pure utilities, primitives, Result/Either types)

**VIOLATION consequences:**
- Domain logic becomes framework-dependent
- Business rules cannot be tested in isolation
- Technology changes force domain rewrites

## Application Layer Constraints

**MUST contain ONLY:**
- Use Case / Command / Query handlers
- Application Service (orchestration only)
- Workflow / Transaction boundary coordination
- Domain Event handlers (application-level)

**FORBIDDEN dependencies:**
- `presentation` layer (components, router, UI state)
- Infrastructure implementations (FirestoreService, HttpClient, concrete repositories)

**ALLOWED dependencies:**
- `domain` layer
- Repository interfaces (from domain)
- `shared` layer

**MUST delegate to domain for business logic. NO business rules in application services.**

**VIOLATION consequences:**
- Anemic domain model
- Duplicated business logic
- Application layer becomes untestable God object

## Infrastructure Layer Constraints

**MUST contain ONLY:**
- Repository implementations (implements domain interfaces)
- HTTP / API adapters
- Auth / Cache / Logger implementations
- External service integrations
- Framework-specific code

**MUST implement domain interfaces. MUST NOT be imported by domain or application layers.**

**ALLOWED dependencies:**
- `domain` layer (to implement interfaces)
- `application` layer (rare, for adapters only)
- Framework libraries (Angular, @angular/fire, HTTP, Storage)
- `shared` layer

**VIOLATION consequences:**
- Domain/Application layers become coupled to infrastructure
- Cannot swap implementations
- Testing requires real infrastructure

## Presentation Layer Constraints

**MUST contain ONLY:**
- Components
- Pages / Views
- View Models (presentation state only)
- Route Guards (delegates to application)

**FORBIDDEN:**
- Business logic implementation
- Direct infrastructure access
- Direct repository calls
- Domain entity mutation

**ALLOWED dependencies:**
- `application` layer (Use Cases / Facades)
- `shared` layer (DTOs, View Model types)
- Framework libraries (Angular, UI libraries, Router)

**MUST delegate ALL business operations to application layer.**

**VIOLATION consequences:**
- Business logic scattered across UI
- Untestable business rules
- UI changes break domain logic

## Shared Layer Constraints

**MUST contain ONLY:**
- Pure utility functions (no side effects)
- Primitive type helpers
- Result / Either types
- Error base classes
- Domain-agnostic helpers (Date, Money, ID formatting)

**FORBIDDEN:**
- Business logic / domain rules
- Entities / Aggregates
- Use Cases / Services
- Framework-specific code
- State management

**MUST NOT depend on ANY other layer.**

**VIOLATION consequences:**
- Shared layer becomes domain dumping ground
- Circular dependencies emerge
- Utility layer polluted with business logic

## Repository Pattern Enforcement

**Interface declaration:**
- MUST be defined in domain layer
- MUST use domain types (entities, value objects)
- NO framework types in interface signatures

**Implementation:**
- MUST exist in infrastructure layer
- MUST implement domain interface
- MAY use framework-specific code

**Dependency Injection:**
- Application layer MUST inject interface type
- Infrastructure provides concrete implementation
- NEVER import concrete repository in application/domain

**VIOLATION: Application importing concrete repository**
```typescript
// FORBIDDEN
import { FirestoreRepository } from '@infrastructure/repositories';

// REQUIRED
import { IRepository } from '@domain/repositories';
```

## Cross-Layer Violation Detection

**IMMEDIATELY reject code containing:**

| Violation | Layer | Forbidden Import |
|-----------|-------|------------------|
| Domain importing framework | `domain/**/*.ts` | `@angular/*`, `firebase/*`, `rxjs/*` |
| Domain importing outer layer | `domain/**/*.ts` | `@application/*`, `@infrastructure/*`, `@presentation/*` |
| Application importing infrastructure | `application/**/*.ts` | `@infrastructure/*` (concrete implementations) |
| Application importing presentation | `application/**/*.ts` | `@presentation/*` |
| Shared importing ANY layer | `shared/**/*.ts` | `@domain/*`, `@application/*`, `@infrastructure/*`, `@presentation/*` |

## Enforcement Summary

**REQUIRED in ALL code:**
- Inward-only dependencies (presentation → application → domain)
- Domain layer purity (zero framework dependencies)
- Repository pattern (interface in domain, implementation in infrastructure)
- Application layer orchestration ONLY (no business logic)
- Presentation delegates ALL operations to application

**FORBIDDEN in ALL code:**
- Outward dependencies (domain → application, application → infrastructure)
- Framework code in domain layer
- Business logic in application or presentation layers
- Direct infrastructure access from application/presentation
- Circular dependencies between layers
- Shared layer dependencies on other layers
