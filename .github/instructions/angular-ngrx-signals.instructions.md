---
description: 'NgRx Signals: reactive state management with signalStore, patchState, computed, and rxMethod patterns'
applyTo: '**/*.ts'
---

# @ngrx/signals Implementation Instructions

## CRITICAL: State Management Library

**REQUIRED:**
- ONLY use `@ngrx/signals` for state management
- NEVER use traditional NgRx (actions/reducers/effects)
- NEVER use RxJS subjects for application state

**FORBIDDEN:**
- `createAction`, `createReducer`, `createEffect` patterns
- `BehaviorSubject` or `ReplaySubject` for state
- Custom state management solutions

## Store Declaration

**REQUIRED:**
- Use `signalStore()` with `withState()` for state initialization
- Initialize ALL fields (NEVER `undefined`)
- Use `null` or `false` for optional/empty initial values
- Provide store at root OR component level

**FORBIDDEN:**
- State outside `signalStore`
- Uninitialized state fields
- `undefined` as initial value
- State in component properties

## State Mutation

**REQUIRED:**
- Use `patchState(store, { field: value })` for ALL mutations
- NEVER direct assignment or mutation
- Immutable update patterns ONLY

**FORBIDDEN:**
- `store.field = value` direct assignment
- Array mutations (`.push()`, `.splice()`)
- Object mutations
- Mutating nested objects

## Derived State

**REQUIRED:**
- Use `computed()` within `withComputed()` for derived values
- Pure functions ONLY in computed signals
- NEVER side effects or mutations

**FORBIDDEN:**
- Side effects in `computed()`
- Service calls in `computed()`
- DOM manipulation in `computed()`
- Async operations in `computed()`
- Modifying signals in `computed()`

## Async Operations

**REQUIRED:**
- Use `rxMethod()` for all async operations
- Use `tapResponse()` for success/error handling
- NEVER use `async/await` in stores
- NEVER use `.subscribe()` in stores

**FORBIDDEN:**
- `async/await` in store methods
- Manual subscriptions
- Promises in state management
- `catchError` without `tapResponse`

## RxJS Operator Selection

**REQUIRED operator for scenario:**
- Search/filters: `switchMap` (cancel previous)
- Independent operations: `mergeMap` (run parallel)
- Sequential operations: `concatMap` (ordered)
- Save/submit: `exhaustMap` (prevent double-click)

**FORBIDDEN:**
- Wrong operator for use case
- Missing operator selection consideration
- `switchMap` for independent operations

## Store Structure Pattern

**REQUIRED store composition:**
```typescript
export const FeatureStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ signals }) => ({ derived })),
  withMethods((store, service = inject(Service)) => ({
    action: rxMethod<Input>(pipe(...))
  })),
  withHooks({ onInit, onDestroy })
);
```

**FORBIDDEN:**
- Missing `providedIn` for global stores
- Unorganized store composition
- Methods without proper typing

## Error Handling

**REQUIRED pattern:**
```typescript
rxMethod<T>(
  pipe(
    tap(() => patchState(store, { loading: true })),
    switchMap((input) => service.call(input)),
    tapResponse({
      next: (data) => patchState(store, { data, loading: false }),
      error: (error) => patchState(store, { error: error.message, loading: false })
    })
  )
)
```

**FORBIDDEN:**
- Missing error handling
- Silent error failures
- Errors without state updates

## Loading State Management

**REQUIRED:**
- `loading: boolean` signal for async operations
- Set loading before operation
- Clear loading in both success and error

**FORBIDDEN:**
- Missing loading indicators
- Loading state without cleanup
- Multiple loading flags per operation

## Store Lifecycle

**REQUIRED:**
- Use `withHooks.onInit()` for initialization
- Use `withHooks.onDestroy()` for cleanup
- NEVER logic in store construction

**FORBIDDEN:**
- Initialization outside `onInit()`
- Missing cleanup in `onDestroy()`
- Side effects during store creation

## Component Integration

**REQUIRED:**
- Inject store in components: `store = inject(FeatureStore)`
- Access signals with invocation: `store.field()`
- NEVER manual subscriptions to store signals

**FORBIDDEN:**
- Subscribing to store signals
- Accessing signals without `()`
- Store logic in components

## Testing

**REQUIRED:**
- Mock store dependencies in tests
- Test store methods independently
- Verify state changes with signals
- Test error scenarios

**FORBIDDEN:**
- Testing store implementation details
- Skipping error case tests
- Missing async operation tests

## Performance Optimization

**REQUIRED:**
- Minimize computed signal complexity
- Use `OnPush` change detection with signals
- NEVER manual change detection

**FORBIDDEN:**
- Complex logic in computed signals
- Default change detection with signals
- `ChangeDetectorRef` usage

## Type Safety

**REQUIRED:**
- Type all state interfaces
- Type all method parameters
- Type all computed return values
- Type all `rxMethod` inputs

**FORBIDDEN:**
- `any` types in state
- Untyped method parameters
- Missing generic types

## Enforcement Checklist

**REQUIRED:**
- `signalStore()` with `withState()`
- All fields initialized (no `undefined`)
- `patchState()` for ALL mutations
- `computed()` for derived state (pure functions)
- `rxMethod()` with `tapResponse()` for async
- Correct RxJS operator selection
- Loading and error state management
- `withHooks` for lifecycle
- Type safety throughout

**FORBIDDEN:**
- Traditional NgRx patterns
- Direct state mutation
- Side effects in `computed()`
- `async/await` in stores
- `.subscribe()` in stores
- `undefined` in state
- Manual change detection
- Missing error handling
