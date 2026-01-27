# Infrastructure Layer Agent Directives

> **Context**: `src/app/infrastructure`
> **Role**: Anti-Corruption Layer (ACL) & Implementation
> **Dependency**: Depends on `Domain` (Interfaces) & `Application` (Ports).

## 🪒 Occam's Razor Principle
*   **Pragmatism**: If Firestore provides a feature (e.g., auto-generated IDs), adapt it simply. Don't fight the platform unless it violates Domain Purity.
*   **Direct Mapping**: Mappers should be simple pure functions. Don't build complex "Mapping Services" with state.

## ⚙️ Implementation Standards

### 1. Repository Implementation
*   **Adapters**: THIS is where the code meets the metal. Implement `Domain Repository Interfaces`.
*   **Separation**:
    *   `Domain Entity`: The clean business object.
    *   `Firestore DTO`: The uglier database shape (timestamps, foreign keys).
*   **Mappers**: **MANDATORY** bidirectional mappers (`toDomain`, `toDto`).
    *   *Constraint*: Do not leak Firestore types (Timestamp) into Domain Entities. Use `Date` or `ISO String`.

### 2. Firebase/External Integration
*   **Lockdown**: `@angular/fire` imports live here. Nowhere else.
*   **Stream Adaptation**: Convert Firebase `Observable` streams into `Promise` or signals compatible with Application Handlers.

### 3. Error Handling
*   **Anti-Corruption**: Catch infrastructure specific errors (`permission-denied`, `network-error`).
*   **Translation**: Throw typed `Domain Errors` (`UserPermissionError`) so the Application layer can handle them semantically.

### 4. DTOs
*   Define Data Transfer Objects here.
*   Use `readonly` interfaces for DTO definitions to match the actual DB schema.
