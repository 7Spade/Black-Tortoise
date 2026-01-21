---
description: 'NgRx Signals state management enforcement: signalStore, patchState, computed, rxMethod requirements. Traditional NgRx FORBIDDEN.'
applyTo: '**'
---

# NgRx Signals Rules

## CRITICAL: Core Requirements

| Rule | Requirement | Forbidden | Consequence |
|------|-------------|-----------|-------------|
| **State Library** | ONLY `@ngrx/signals` | Traditional NgRx (actions/reducers/effects), custom solutions, RxJS state | Build failure, architecture violation |
| **State Declaration** | `signalStore()` with `withState()`, all fields initialized with `null`/`false` (NEVER `undefined`) | State outside signalStore, uninitialized fields, `undefined` values | Type errors, runtime failures |
| **State Mutation** | `patchState(store, { field: value })` ONLY | Direct assignment (`store.field = val`), array mutation (`.push()`), object mutation | Broken reactivity, change detection failure |
| **Derived State** | `computed()` within `withComputed()`, pure functions ONLY | Side effects, mutations, service calls, DOM manipulation, async | Memory leaks, infinite loops |
| **Async Operations** | `rxMethod()` with `tapResponse()` for error handling | `async/await`, Promises, `subscribe()`, `catchError` | Memory leaks, unhandled errors |

## RxJS Operator Selection

**IMMEDIATELY select correct operator when concurrency matters:**

| Trigger | Required Operator | Forbidden Alternative |
|---------|-------------------|----------------------|
| Search input, autocomplete, filters | `switchMap` | `mergeMap`, `concatMap`, `exhaustMap` |
| Independent parallel operations | `mergeMap` | `switchMap`, `concatMap` |
| Sequential ordered operations | `concatMap` | `switchMap`, `mergeMap` |
| Prevent double-submission (save/submit) | `exhaustMap` | `switchMap`, `mergeMap` |

**Violation:** Race conditions, data corruption, performance degradation

## Enforcement Checklist

**REQUIRED:** `signalStore()` + `withState()` + `patchState()` + `computed()` + `rxMethod()` + `tapResponse()` + correct operator  
**FORBIDDEN:** Traditional NgRx, direct mutation, side effects in computed, async/await in stores, subscribe calls, undefined in state
