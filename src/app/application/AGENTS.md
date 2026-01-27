# Application Layer Agent Directives

> **Context**: `src/app/application`
> **Role**: State Orchestration & Event Management

## 🧠 Signal State Management (NgRx Signals)

### 1. SignalStore is King
*   **Standard**: All state must reside in `signalStore`.
*   **Pattern**:
    *   `withState()`: For the core data.
    *   `withComputed()`: For derived data (Selectors).
    *   `withMethods()`: For Actions/Reducers.
    *   `rxMethod()`: For bridging Async/Observable streams (Effects).
*   **FORBIDDEN**: Functional `input()`/`output()` in Stores. `BehaviorSubject` based services.

### 2. The "Event Chain" Protocol
Strict adherence to the constitution's flow:
1.  **Append**: Store method calls `eventStore.append(event)`. (Persist the fact)
2.  **Publish**: Store publishes to `EventBus`. (Notify system)
3.  **React**: Other Stores/Effects respond to the event via `rxMethod`.

### 3. Facade Pattern (The ViewModel Factory)
*   **Role**: Prepare data for the Presentation layer.
*   **Rule**: **Output Signals ONLY**.
*   **Conversion**: Maps Domain Entities -> UI ViewModels.
*   **Isolation**: Components should not inject Stores directly if transformation is needed. Provide a clean `vm` (ViewModel) signal.

### 4. Zone-less Reactivity
*   **Avoid**: Manual `subscribe()`.
*   **Use**: `tapResponse` operator within `rxMethod` to handle side effects and lifecycle safety.
