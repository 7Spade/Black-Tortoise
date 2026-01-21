---
description: 'NgRx Signals state management enforcement: signalStore, patchState, computed, rxMethod requirements. Traditional NgRx FORBIDDEN.'
applyTo: '**'
---

# NgRx Signals Rules

## CRITICAL: State Management Library Constraint

ONLY `@ngrx/signals` is permitted for state management.

**FORBIDDEN:**
- Traditional NgRx (actions, reducers, effects, `@ngrx/store`, `@ngrx/effects`)
- Custom state management solutions
- Direct RxJS state management

**VIOLATION consequences:**
- Build failure
- Code review rejection
- Architectural integrity compromise

## CRITICAL: State Declaration

ALL state MUST be declared via `signalStore()` with `withState()`.

**REQUIRED structure:**
```typescript
export const FeatureStore = signalStore(
  { providedIn: 'root' },  // OR omit for component-scoped
  withState(initialState)
);
```

**REQUIRED initial state:**
- Complete interface definition
- ALL fields initialized
- Use `null` for absent values (NEVER `undefined`)
- Use `false` for boolean flags (NEVER `undefined`)

**FORBIDDEN:**
- State outside `signalStore()`
- Uninitialized state fields
- `undefined` in initial state
- Class properties for state storage

**VIOLATION consequences:**
- Type errors at compile time
- Runtime null reference errors
- State inconsistency

## CRITICAL: State Mutation

ALL state mutations MUST use `patchState()`. Direct mutation is FORBIDDEN.

**REQUIRED mutation pattern:**
```typescript
withMethods((store) => ({
  updateField(value: Type) {
    patchState(store, { fieldName: value });
  }
}))
```

**FORBIDDEN mutations:**
```typescript
// Direct property assignment
store.fieldName = value;

// Direct array mutation
store.items().push(newItem);

// Direct object mutation
store.config().property = value;
```

**VIOLATION consequences:**
- Change detection failure
- Signal reactivity broken
- State inconsistency across consumers

## CRITICAL: Derived State

ALL derived state MUST use `computed()` within `withComputed()`.

**REQUIRED pattern:**
```typescript
withComputed(({ sourceSignal1, sourceSignal2 }) => ({
  derivedValue: computed(() => {
    // Pure computation ONLY
    return sourceSignal1() + sourceSignal2();
  })
}))
```

**FORBIDDEN in computed():**
- Side effects (logging, network calls, storage operations)
- State mutations
- External service calls
- DOM manipulation
- Async operations

**VIOLATION consequences:**
- Unpredictable execution timing
- Memory leaks
- Infinite update loops

## CRITICAL: Async Operations

ALL async operations MUST use `rxMethod()` from `@ngrx/signals/rxjs-interop`.

**REQUIRED pattern:**
```typescript
withMethods((store, service = inject(Service)) => ({
  asyncOperation: rxMethod<InputType>(
    pipe(
      tap(() => patchState(store, { loading: true, error: null })),
      switchMap((input) => service.call(input)),
      tapResponse({
        next: (result) => patchState(store, { data: result, loading: false }),
        error: (error: Error) => patchState(store, { error: error.message, loading: false })
      })
    )
  )
}))
```

**FORBIDDEN:**
- `async/await` in store methods
- Promise-based state updates
- Direct Observable subscriptions
- `subscribe()` calls in methods

**VIOLATION consequences:**
- Memory leaks from unmanaged subscriptions
- State updates after component destruction
- Error handling bypass

## RxJS Operator Selection

When operator choice affects concurrency → IMMEDIATELY select correct operator.

**REQUIRED operator selection:**

| Trigger | Required Operator | Forbidden Alternative |
|---------|-------------------|----------------------|
| Search input, autocomplete, filters | `switchMap` | `mergeMap`, `concatMap`, `exhaustMap` |
| Independent parallel operations | `mergeMap` | `switchMap`, `concatMap` |
| Sequential ordered operations | `concatMap` | `switchMap`, `mergeMap` |
| Prevent double-submission (save/submit buttons) | `exhaustMap` | `switchMap`, `mergeMap` |

**VIOLATION consequences:**
- Race conditions
- Data corruption
- Performance degradation

## Error Handling Constraint

ALL rxMethod pipelines MUST use `tapResponse` for error handling.

**REQUIRED:**
```typescript
tapResponse({
  next: (result) => patchState(store, { result, loading: false }),
  error: (error: Error) => patchState(store, { error: error.message, loading: false })
})
```

**FORBIDDEN:**
```typescript
// catchError in rxMethod
catchError((error) => {
  return of(null);
})
```

**VIOLATION consequences:**
- Unhandled errors propagate to global handler
- State becomes inconsistent
- Loading flags stuck in true state

## State Initialization Constraints

When initializing state → ALL fields MUST have explicit values.

**REQUIRED:**
```typescript
interface State {
  items: Item[];
  selectedId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: State = {
  items: [],           // Empty array, NOT undefined
  selectedId: null,    // null, NOT undefined
  loading: false,      // false, NOT undefined
  error: null          // null, NOT undefined
};
```

**FORBIDDEN:**
```typescript
const initialState = {
  items: [],
  selectedId: undefined,  // FORBIDDEN
  loading: undefined      // FORBIDDEN
};
```

## Enforcement Summary

**REQUIRED in ALL stores:**
- `signalStore()` for store creation
- `withState()` for state definition
- `patchState()` for ALL mutations
- `computed()` for ALL derived state
- `rxMethod()` for ALL async operations
- `tapResponse()` for error handling
- Correct RxJS operator per concurrency requirement

**FORBIDDEN in ALL stores:**
- Traditional NgRx patterns (actions, reducers, effects)
- Direct state mutation
- Side effects in `computed()`
- `async/await` for state updates
- `subscribe()` calls
- `catchError` in rxMethod pipelines
- `undefined` in initial state
- Wrong operator selection causing race conditions
