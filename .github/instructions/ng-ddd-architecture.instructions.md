---
description: 'DDD pattern enforcement for Angular: layer dependencies, entity/value object/repository constraints, domain purity requirements'
applyTo: 'src/app/domain/**/*.ts, src/app/infrastructure/**/*.ts, src/app/application/**/*.ts'
---

# DDD Architecture Rules

## CRITICAL: Layer Dependency Direction

Dependencies MUST flow inward ONLY: `Presentation → Application → Domain`, `Infrastructure → Domain (interfaces ONLY)`

**FORBIDDEN:** Domain/Application → Presentation, Domain → Application/Infrastructure, Infrastructure → Application/Presentation

**VIOLATION:** Circular dependencies, untestable code, framework coupling

## Core Rules

| Pattern | REQUIRED | FORBIDDEN |
|---------|----------|-----------|
| **Domain Purity** | Pure TypeScript, entities, value objects, events, repository interfaces, domain services | Angular/Firebase imports, I/O, HTTP, decorators, anemic models |
| **Entity** | Private fields, factory methods, domain events on mutations, behavior encapsulation | Public mutable fields, direct access, missing events, anemic data bags |
| **Value Object** | Immutable (readonly), private constructor, static factory with validation, equals() | Mutable fields, public constructor, missing validation, primitive obsession |
| **Repository** | Interface in domain, implementation in infrastructure, return domain entities, Observable types | Implementation in domain, domain importing infrastructure, raw DB objects, sync methods |
| **Domain Event** | Emit on ALL mutations, immutable data, timestamp, naming: `{Entity}{Action}Event` | State changes without events, mutable payloads, missing timestamp |

## Enforcement Summary

**Domain layer MUST:**
1. Be pure TypeScript (zero framework dependencies)
2. Use factory methods for entity creation
3. Emit domain events on ALL state mutations
4. Validate via value objects
5. Define repository interfaces ONLY

**Domain layer FORBIDDEN:**
1. Framework imports (Angular, Firebase, RxJS decorators)
2. I/O operations or HTTP calls
3. Public mutable state
4. Anemic models without behavior
5. Repository implementations
