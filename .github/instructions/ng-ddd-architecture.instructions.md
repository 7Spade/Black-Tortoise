---
description: 'DDD pattern enforcement for Angular: layer dependencies, entity/value object/repository constraints, domain purity requirements'
applyTo: 'src/app/domain/**/*.ts, src/app/infrastructure/**/*.ts, src/app/application/**/*.ts'
---

# DDD Architecture Rules

## CRITICAL: Layer Dependency Direction

Dependencies MUST flow inward. Outward dependencies are FORBIDDEN.

**REQUIRED dependency flow:**
```
Presentation → Application → Domain
Infrastructure → Domain (implements interfaces ONLY)
```

**FORBIDDEN dependencies:**
- Domain → Application
- Domain → Infrastructure
- Domain → Presentation
- Application → Presentation
- Infrastructure → Presentation

**VIOLATION consequences:**
- Circular dependencies
- Untestable code
- Domain logic contamination
- Framework coupling

## CRITICAL: Domain Layer Purity

Domain layer MUST be pure TypeScript. Framework dependencies are FORBIDDEN.

**REQUIRED in domain layer:**
- Entities with identity and behavior
- Value objects for validation and immutability
- Domain events for state changes
- Repository interfaces (contracts ONLY)
- Domain services for cross-aggregate operations
- Pure TypeScript types and classes

**FORBIDDEN in domain layer:**
- Angular decorators (`@Injectable`, `@Component`, etc.)
- Firebase imports
- HTTP client usage
- Any I/O operations
- Framework-specific APIs
- Anemic domain models (data bags without behavior)

**VIOLATION consequences:**
- Framework coupling
- Untestable business logic
- Violation of DDD principles
- Inability to port domain logic

## Entity Enforcement

**REQUIRED entity structure:**
```typescript
export class Entity {
  private _id: EntityId;           // REQUIRED: Identity
  private _property: ValueObject;  // REQUIRED: Private fields
  
  static create(props): Entity {   // REQUIRED: Factory method
    const entity = new Entity();
    entity.addDomainEvent(/**/);   // REQUIRED: Domain event
    return entity;
  }
  
  mutateState(params): void {      // REQUIRED: Behavior methods
    this._property = /*...*/;
    this.addDomainEvent(/**/);     // REQUIRED: Event on mutation
  }
}
```

**REQUIRED:**
- Private fields with typed value objects
- Factory methods for construction
- Domain event emission on state changes
- Encapsulated behavior (not getters/setters)

**FORBIDDEN:**
- Public mutable fields
- Direct property access from outside
- Anemic models (data without behavior)
- Missing domain events

## Value Object Enforcement

**REQUIRED value object structure:**
```typescript
export class ValueObject {
  private constructor(private readonly _value: Type) {}
  
  static create(value: Type): ValueObject {
    // REQUIRED: Validation
    if (!isValid(value)) {
      throw new Error('Validation message');
    }
    return new ValueObject(value);
  }
  
  get value(): Type { return this._value; }
  
  equals(other: ValueObject): boolean {
    return this._value === other._value;
  }
}
```

**REQUIRED:**
- Immutability (readonly fields)
- Private constructor
- Static factory with validation
- Equality method
- No setters

**FORBIDDEN:**
- Mutable fields
- Public constructor without validation
- Missing validation logic
- Primitive obsession (use value objects instead)

## Repository Pattern Enforcement

**REQUIRED pattern:**
```typescript
// Domain layer - Interface ONLY
export interface IEntityRepository {
  findById(id: EntityId): Observable<Entity | null>;
  save(entity: Entity): Observable<Entity>;
  delete(id: EntityId): Observable<void>;
}

// Infrastructure layer - Implementation
@Injectable({ providedIn: 'root' })
export class EntityFirestoreRepository implements IEntityRepository {
  // REQUIRED: Implement interface methods
}
```

**REQUIRED:**
- Interface definition in domain layer
- Implementation in infrastructure layer
- Return domain entities (not DTOs)
- Observable return types for async operations

**FORBIDDEN:**
- Repository implementations in domain layer
- Domain layer importing infrastructure
- Returning raw database objects
- Synchronous repository methods

## Domain Event Enforcement

**REQUIRED event structure:**
```typescript
export class EntityStateChangedEvent {
  constructor(
    public readonly entityId: EntityId,
    public readonly occurredOn: Date = new Date()
  ) {}
}
```

**REQUIRED:**
- Emit events on ALL entity state mutations
- Immutable event data
- Timestamp of occurrence
- Event naming convention: `{Entity}{Action}Event`

**FORBIDDEN:**
- State changes without events
- Mutable event payloads
- Missing timestamp
- Framework-specific event types

## Enforcement Summary

**REQUIRED in domain layer:**
- Pure TypeScript ONLY
- Entity factory methods with events
- Value object validation
- Repository interfaces
- Domain events on mutations
- Encapsulated behavior

**FORBIDDEN in domain layer:**
- ANY framework imports
- I/O operations
- Anemic models
- Public mutable state
- Direct infrastructure access
- Missing domain events
