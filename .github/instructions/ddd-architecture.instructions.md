---
description: 'DDD Layer Boundary Enforcement Rules - Dependency Direction, Layer Isolation, Cross-Layer Violation Detection'
applyTo: '**'
---

# DDD Architecture Rules

## CRITICAL: Dependency Direction Law
Dependencies MUST flow inward only: `presentation → application → domain`, `infrastructure → domain`, `shared ← ALL`.  

**VIOLATION:** Circular dependencies, unmockable code, framework lock-in, untestable business logic.

## Layer Constraints

| Layer | MUST Contain | FORBIDDEN Dependencies | Violations |
|-------|--------------|------------------------|------------|
| **Domain** | Entities, Value Objects, Aggregates, Domain Services, Domain Events, Repository Interfaces, Business Rules | `application`, `infrastructure`, `presentation`, framework code (Angular/Firebase/RxJS), I/O, external libraries | Framework-dependent domain, untestable business logic |
| **Application** | Use Cases, Command/Query Handlers, Orchestration Services, Workflows | `presentation`, concrete infrastructure implementations (FirestoreService, HttpClient, repository impls) | Anemic domain, duplicated business logic, God object |
| **Infrastructure** | Repository implementations, HTTP/API adapters, Auth/Cache/Logger, External services, Framework code | MUST NOT be imported by domain/application | Domain/Application coupled to infrastructure, cannot swap implementations |
| **Presentation** | Components, Pages, View Models, Route Guards | Business logic, direct infrastructure, direct repository calls, domain mutation | Scattered business logic, untestable rules, UI breaks domain |
| **Shared** | Pure utilities, Primitive helpers, Result/Either types, Error base classes | Business logic, Entities, Use Cases, Framework code, State management, ANY other layer | Shared becomes domain dumping ground, circular dependencies |

## Repository Pattern Enforcement
- **Interface:** Defined in Domain, uses domain types only, NO framework types.  
- **Implementation:** Defined in Infrastructure, implements domain interface.  
- **Injection:** Application injects interface type, NEVER concrete repository.

## Cross-Layer Violation Detection

| Violation | Layer | Forbidden Import |
|-----------|-------|------------------|
| Domain importing framework | `domain/**/*.ts` | `@angular/*`, `firebase/*`, `rxjs/*` |
| Domain importing outer layer | `domain/**/*.ts` | `@application/*`, `@infrastructure/*`, `@presentation/*` |
| Application importing infrastructure | `application/**/*.ts` | `@infrastructure/*` (concrete implementations) |
| Application importing presentation | `application/**/*.ts` | `@presentation/*` |
| Shared importing ANY layer | `shared/**/*.ts` | `@domain/*`, `@application/*`, `@infrastructure/*`, `@presentation/*` |

## Enforcement Summary
- **REQUIRED:** Inward-only dependencies, domain layer purity (zero framework), repository pattern (interface in domain), application orchestration ONLY, presentation delegates ALL to application.
- **FORBIDDEN:** Outward dependencies, framework in domain, business logic in application/presentation, direct infrastructure access, circular dependencies, shared layer dependencies on other layers.
