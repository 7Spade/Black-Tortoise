---
description: 'M3 + Angular Signals + Firebase Integration Enforcement - NgRx Signals, Material 3, Unidirectional Data Flow'
applyTo: '**/*.ts, **/*.html, **/*.scss'
---

# M3 + Angular Signals + Firebase Integration Rules

## CRITICAL: Architecture Enforcement

### Layer Isolation
- `presentation/` → UI components, Material 3 components only
- `application/` → Facades, Stores, Use-Cases, CQRS handlers only
- `domain/` → Entities, Value Objects, Domain Services only (NO Angular, NO Firebase)
- `infrastructure/` → Firebase repositories, converters, auth services only
- `shared/` → Utilities, constants, reusable types only

### Unidirectional Data Flow
User → Component → Facade → UseCase → Domain → Repository → Firebase  
FORBIDDEN: Reverse flow, repositories bypassing use-cases, domain accessing stores

## Core Rules
1. Domain must be pure TypeScript (zero framework dependencies)
2. Presentation must not import infrastructure
3. Infrastructure must not import application
4. All state must use `signalStore` with `patchState` mutations
5. All derived state must use `computed()`
6. All async operations must use `rxMethod` with `tapResponse`
7. Firebase access only via repositories implementing domain interfaces
8. Components inject facades only (never stores or use-cases directly)
9. Use-cases perform domain validation and inject repositories via interfaces
10. All UI must use Material 3 components with M3 color tokens (`--mat-sys-*`)
11. Templates must use Angular control flow (`@if`, `@for`, `@defer`) with signal invocation `()`
12. All lists must include `track` expression
13. Repositories must return Observables for real-time Firebase data
14. DI configuration must bind repository interfaces to Firebase implementations

### Forbidden Patterns
- Direct framework or Firebase imports in domain/components/facades/stores
- Imperative state updates (`this.items = newItems`) instead of `patchState(store, { items })`
- Constructor injection of stores in components (use facade instead)
- Legacy RxJS `@Effect()` patterns (use NgRx Signals `rxMethod`)
- Hardcoded colors instead of M3 tokens
- Legacy Angular directives (`*ngIf`, `*ngFor`) instead of `@if`, `@for`
- Manual component subscriptions; AsyncPipe patterns; mixed NgRx patterns

### Violations Cause
- Circular dependencies
- Broken DDD boundaries
- Untestable code
- Memory leaks
- Lost reactivity
- State inconsistencies
- Tight coupling
- Accessibility failures
