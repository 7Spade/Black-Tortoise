# Black-Tortoise Core Agent Directives

> **Context**: Root Workspace
> **Applies to**: Entire Project
> **Architecture**: Angular 20+ (Zone-less) / DDD / Event Sourcing

## 🎯 Architecture Constitution

This project adheres to a strict **Zone-less, Pure Reactive** architecture.

### core_principles (The 5 Laws)

1.  **Zone-less is Law**:
    *   Application bootstraps with `provideExperimentalZonelessChangeDetection()`.
    *   **FORBIDDEN**: `Zone.js` dependencies, `ngZone.run()`.
    *   **REQUIRED**: Logic must trigger Signal updates to drive View refresh.

2.  **Pure Signals in View**:
    *   Templates consumes **Signals ONLY**.
    *   **FORBIDDEN**: `AsyncPipe` (`| async`), `BehaviorSubject` in components.
    *   Observables must be converted to Signals (`toSignal`) at the **Application/Facade** boundary.

3.  **Strict DDD Layers**:
    *   **Domain**: Pure TS, framework-agnostic.
    *   **Application**: SignalStores & Orchestration.
    *   **Infrastructure**: Implementation details (Firestore/API).
    *   **Presentation**: Passive View (renders VM Signals).

4.  **Event-Driven Consistency**:
    *   Flow: **Append** (Store) → **Publish** (Bus) → **React** (Effects).
    *   Modules interact **ONLY** via the Workspace Event Bus.

5.  **Modern Control Flow**:
    *   **REQUIRED**: `@if`, `@for` (w/ track), `@switch`, `@defer`.
    *   **FORBIDDEN**: `*ngIf`, `*ngFor`, `*ngSwitch`.

## 🤖 Navigation & Context
- [Domain Rules](src/app/domain/AGENTS.md) - Business Rules & Entities.
- [Application Rules](src/app/application/AGENTS.md) - Stores, State, & Events.
- [Infrastructure Rules](src/app/infrastructure/AGENTS.md) - Repositories & ACL.
- [Presentation Rules](src/app/presentation/AGENTS.md) - Components & UI.
