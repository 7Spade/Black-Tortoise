# Domain Layer Agent Directives

> **Context**: `src/app/domain`
> **Role**: Business Rule Guardian (Pure TypeScript)

## 🛑 STRICT COMPLIANCE RULES

### 1. Zero Framework Dependency
*   **Rule**: The Domain layer must not know Angular, Firestore, or the UI exists.
*   **Exception**: `Injectable` tokens (from `@angular/core`) are allowed **ONLY** for Dependency Injection definitions in `repositories/` or `services/`.
*   **FORBIDDEN**: `Router`, `HttpClient`, `foundations/`, `signals`, `Store`.

### 2. Entity & Aggregate Design
*   **Rich Domain Models**: Entities must contain business logic (methods), not just data bags.
*   **Immutability**: Prefer `readonly` properties. State changes via methods.
*   **Identity**: All Entities must have a strongly-typed ID (Context-specific Value Object).
*   **Constructors**:
    *   `create()`: Static factory for new instances (generates ID, events).
    *   `reconstruct()`: Static factory for loading from DB (restores state, no events).

### 3. Pure Reactive Contracts
*   **Domain Events**: Defined here as pure data structures (interfaces/classes).
*   **Repository Interfaces**: Return `Promise<T>` or `Promise<void>`.
    *   *Note*: Domain is generally agnostic to "Reactive Streams". Data loading is usually async (Promise). Real-time updates are handled in Application Layer via Event Bus.

### 4. Value Objects
*   **Mandatory**: Use Value Objects for all primitives with rules (Email, Money, SKU).
*   **Validation**: Validation logic lives inside the Value Object (throw error on invalid).
