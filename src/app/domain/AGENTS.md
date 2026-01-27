# Domain Layer Agent Directives

> **Context**: `src/app/domain`
> **Role**: Business Rule Guardian (Pure TypeScript)
> **Dependency**: **NONE**. Cannot import App, Infra, or Presentation.

## 🪒 Occam's Razor Principle
*   **No Data Bags**: An Entity without methods is generally a DTO (which belongs in Infra or App). If it's in Domain, it MUST enforce rules.
*   **Minimal Abstraction**: Don't create a "Base Entity" unless 3+ entities share *identical* behavior.
*   **Purity**: If it requires a library to work (other than simple Utils), it's probably not Domain.

## 🛑 STRICT COMPLIANCE RULES

### 1. Zero Framework Dependency
*   **Rule**: The Domain layer must not know Angular, Firestore, or the UI exists.
*   **Exception**: `Injectable` tokens (from `@angular/core`) are allowed **ONLY** for Dependency Injection definitions.
*   **FORBIDDEN**: `Router`, `HttpClient`, `foundations/`, `signals` (unless standard deep signal), `Store`.

### 2. Entity & Aggregate Design
*   **Rich Domain Models**: Entities must contain business logic (methods), not just data bags.
*   **Immutability**: Prefer `readonly` properties. State changes via methods that return new instances or void (if internal state managed carefully).
*   **Identity**: All Entities must have a strongly-typed ID (Context-specific Value Object).
*   **Factories**:
    *   `create()`: Static factory for new instances (Business intent).
    *   `reconstruct()`: Static factory for loading (Hydration intent).

### 3. Pure Reactive Contracts
*   **Domain Events**: Defined here as pure data structures.
*   **Repository Interfaces**:
    *   Must define **WHAT** (Get User), not **HOW** (Http Get User).
    *   Return `Promise<T>` for async operations (loading data).
    *   Return `Observable<T>` **ONLY** for continuous streams (if strictly necessary by domain requirements).

### 4. Value Objects
*   **Mandatory**: Use Value Objects for all primitives with rules (Email, Money, SKU).
*   **Validation**: Validation logic lives inside the constructor or factory of the Value Object.
