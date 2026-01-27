# Black-Tortoise Core Agent Directives

> **Context**: Root Workspace
> **Applies to**: Entire Project
> **Architecture**: Angular 20+ (Zone-less) / DDD / Event Sourcing

## 🪒 Occam's Razor Principle (The Golden Rule)
> **"Entities should not be multiplied beyond necessity."**
*   **Simplicity**: The simplest solution that satisfies the architecture is the correct one.
*   **Minimalism**: Do not add layers, files, or abstractions "just in case". Every line of code must fight for its existence.
*   **Efficiency**: If a standard Angular feature solves it without violating DDD, use it. Do not reinvent the wheel.

## 🎯 Architecture Constitution

This project adheres to a strict **Zone-less, Pure Reactive** architecture.

### Core Principles (The 5 Laws)

1.  **Zone-less is Law**:
    *   Application bootstraps with `provideExperimentalZonelessChangeDetection()`.
    *   **FORBIDDEN**: `Zone.js` dependencies, `ngZone.run()`.
    *   **REQUIRED**: Logic must trigger Signal updates to drive View refresh.

2.  **Pure Signals in View**:
    *   Templates consumes **Signals ONLY**.
    *   **FORBIDDEN**: `AsyncPipe` (`| async`), `BehaviorSubject` in components.
    *   Observables must be converted to Signals (`toSignal`) at the **Application/Facade** boundary.

3.  **Strict DDD Layers & Dependency Direction**:
    *   **Dependency Flow**: `Domain` ⬅️ `Application` ⬅️ `Infrastructure` & `Presentation`.
    *   **Violation**: A layer referencing a layer "above" or "parallel" to it where forbidden.

4.  **Event-Driven Consistency**:
    *   Flow: **Append** (Store) → **Publish** (Bus) → **React** (Effects).
    *   Modules interact **ONLY** via the Workspace Event Bus.

5.  **Modern Control Flow**:
    *   **REQUIRED**: `@if`, `@for` (w/ track), `@switch`, `@defer`.
    *   **FORBIDDEN**: `*ngIf`, `*ngFor`, `*ngSwitch`.

## 📦 Core Dependencies (Fast Context)
*Based on `package.json`*

*   **Framework**: `@angular/core@~20.0.0` (Signals, Standalone, Zone-less)
*   **State**: `@ngrx/signals@~20.0.0` (SignalStore, patchState, rxMethod)
*   **UI Library**: `@angular/material@~20.0.0`, `@angular/cdk`
*   **Backend**: `@angular/fire@~20.0.0` (Firestore, Auth)
*   **Utilities**: `rxjs@~7.8` (Streams only), `date-fns` (if inst.)
*   **Testing**: `@playwright/test`

## 📂 Project Cartography (Strict DDD)

```text
src/app/
├── domain/                    🔒 PURE TS (No Angular/Fire imports except Injectable)
│   ├── entities/              (Rich Models, Logic included)
│   ├── value-objects/         (Immutable, Self-validating)
│   └── repositories/          (Interfaces returning Promise/Observable)
│
├── application/               🎯 STATE ORCHESTRATION (Angular Aware)
│   ├── stores/                (SignalStores)
│   ├── facades/               (ViewModel factories)
│   └── use-cases/             (Complex orchestration specific logic)
│
├── infrastructure/            ⚙️ IMPLEMENTATION (Everything External)
│   ├── firebase/              (Firestore Impls, Converters)
│   ├── adapters/              (Date, Browser APIs)
│   └── mappers/               (Domain <-> DTO)
│
└── presentation/              👁️ PASSIVE VIEW (Materials + Signals)
    ├── components/            (Dumb/Smart Components)
    ├── pages/                 (Route Entry Points)
    └── styles/                (Tailwind/SCSS Variables)
```

## 🤖 Navigation & Context
- [Domain Rules](src/app/domain/AGENTS.md) - Business Rules & Entities.
- [Application Rules](src/app/application/AGENTS.md) - Stores, State, & Events.
- [Infrastructure Rules](src/app/infrastructure/AGENTS.md) - Repositories & ACL.
- [Presentation Rules](src/app/presentation/AGENTS.md) - Components & UI.
