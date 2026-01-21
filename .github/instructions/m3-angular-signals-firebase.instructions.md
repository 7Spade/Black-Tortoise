---
description: 'M3 + Angular Signals + Firebase integration enforcement: NgRx Signals for ALL state, Firebase via repositories ONLY, M3 components with signal templates, unidirectional data flow REQUIRED'
applyTo: '**/*.ts, **/*.html, **/*.scss'
---

# M3 + Angular Signals + Firebase Integration Rules

## CRITICAL: Architecture Enforcement

**Layer Isolation:**
- `presentation/` → UI components, Material components ONLY
- `application/` → Stores, facades, use-cases, CQRS handlers ONLY
- `domain/` → Entities, value objects, domain services ONLY (NO Angular, NO Firebase)
- `infrastructure/` → Firebase repositories, converters, auth services ONLY
- `shared/` → Utilities, constants, reusable types ONLY

**Unidirectional Data Flow:**
User → Component → Facade → UseCase → Domain → Repository → Firebase
FORBIDDEN reverse flow: Firebase calling components, repositories bypassing use-cases, domain accessing stores

**Core Rules:**
1. Domain MUST be pure TypeScript (zero framework dependencies)
2. Presentation MUST NOT import infrastructure
3. Infrastructure MUST NOT import application
4. ALL state MUST use `signalStore` with `patchState` mutations
5. ALL derived state MUST use `computed()`
6. ALL async operations MUST use `rxMethod` with `tapResponse`
7. Firebase access ONLY through repositories implementing domain interfaces
8. Components inject facades ONLY (NOT stores or use-cases directly)
9. Use-cases perform domain validation and inject repositories via interfaces
10. ALL UI MUST use Material Design 3 components with M3 color tokens (`--mat-sys-*`)
11. Templates MUST use Angular control flow (`@if`, `@for`, `@defer`) with signal invocation `()`
12. ALL lists MUST include `track` expression
13. Repositories MUST return Observables for real-time Firebase data
14. DI configuration MUST bind repository interfaces to Firebase implementations
15. FORBIDDEN: Direct Firebase imports in components/facades/stores, imperative state updates, class-based stores, RxJS BehaviorSubject for state, hardcoded colors, legacy directives (`*ngIf`, `*ngFor`), manual component subscriptions, AsyncPipe patterns, mixed NgRx patterns

**Forbidden Patterns IMMEDIATELY reject:**
- `import { Injectable } from '@angular/core'` in domain
- `import { Firestore } from '@angular/fire/firestore'` in components/facades/stores
- `this.items = newItems` instead of `patchState(store, { items })`
- `constructor(private store: FeatureStore)` in components (use facade)
- `@Effect() loadData$ = ...` (use NgRx Signals `rxMethod`)

**Violations cause:** Circular dependencies, untestable code, broken DDD boundaries, memory leaks, lost reactivity, state inconsistencies, tight coupling, accessibility failures
