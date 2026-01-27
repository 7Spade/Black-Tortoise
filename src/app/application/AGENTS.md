# Application Layer Agent Directives

> **Context**: `src/app/application`
> **Role**: State Orchestration & Event Management
> **Dependency**: Depends on `Domain`. Used by `Presentation` & `Infrastructure`.

## 🪒 Occam's Razor Principle
*   **Direct Stores**: If a component simply needs a list of items, expose it from the Store. Do not create a specific "Service" just to wrap a Store method unless orchestration is complex.
*   **YAGNI**: "You Ain't Gonna Need It". Don't pre-optimize for "switching state management later". Use `signalStore` methods directly.

## 🧠 Signal State Management (NgRx Signals)

### 1. SignalStore is King
*   **Standard**: All state must reside in `signalStore`.
*   **Structure**:
    *   `withState()`: The Single Source of Truth.
    *   `withComputed()`: Efficient derived selectors.
    *   `withMethods()`: Actions (Mutations) & Effects (Async Orchestration).
    *   `rxMethod()`: The **ONLY** place where RxJS streams (Observables) are managed. Use `tapResponse` for safety.
*   **FORBIDDEN**: `BehaviorSubject`-based services. Functional `input()` in stores.

### 2. The "Event Chain" Protocol
Strict adherence to Event Sourcing flow:
1.  **Append**: Store method calls `eventStore.append(event)`. (Persist the fact)
2.  **Publish**: Store publishes to `EventBus`. (Notify system)
3.  **React**: Other Stores/Effects respond to the event via `rxMethod`.

### 3. Facade Pattern (The ViewModel Factory)
*   **Pattern**: If UI needs complex combination of 2+ Stores (e.g., User + Workspace), create a Facade.
*   **Rule**: Returns **Read-Only Signals**.
*   **Isolation**: Transforms `Domain Entities` -> `UI ViewModels` to prevent Domain leakage into templates.

### 4. Zone-less Reactivity
*   **Avoid**: Manual `.subscribe()`.
*   **Use**: `tapResponse` operator to safely handle side effects without breaking the reactive graph.
