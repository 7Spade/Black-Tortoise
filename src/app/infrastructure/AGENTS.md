# Infrastructure Layer Agent Directives

> **Context**: `src/app/infrastructure`
> **Role**: Anti-Corruption Layer (ACL) & Implementation

## ⚙️ Implementation Standards

### 1. Repository Implementation
*   **Adapters**: Implements Domain Interfaces (`@domain/repositories`).
*   **Mappers**: **MANDATORY** separate Mapper classes to convert:
    *   `Domain Entity` <-> `Firestore Document`
    *   *Note*: Never leak Firestore timestamps or types into the Domain.
*   **Fetching**: Return `Promise` for single-shot actions.

### 2. Firebase/External Integration
*   **Isolation**: All `@angular/fire` imports MUST stay within this layer.
*   **Stream Adaptation**: Convert Firebase `Observable` streams into structures consumable by Application Handlers (usually handled via `rxMethod` in Stores).

### 3. Error Handling
*   **Translation**: Catch infrastructure errors (Network, Auth, Firebase) and throw typed **Domain Errors**.
*   **Strictness**: Do not let `unknown` errors bubble up to Application layer.

### 4. DTOs
*   Define Data Transfer Objects here.
*   Use `readonly` interfaces for DTO definitions.
