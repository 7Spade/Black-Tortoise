---
description: 'RxJS reactive pattern enforcement: subscription lifecycle, operator selection, error handling, and Signal interop constraints'
applyTo: '**'
---

# RxJS Patterns Rules

## CRITICAL: Subscription Lifecycle

YOU MUST ensure observable cleanup in ALL cases. Memory leaks from unclosed subscriptions are CRITICAL ERRORS.

**REQUIRED cleanup mechanisms (in priority order):**
1. `toSignal()` - automatic cleanup, REQUIRED for component observables
2. `takeUntil(destroy$)` with `ngOnDestroy()` - REQUIRED when manual subscription is unavoidable
3. `AsyncPipe` - REQUIRED for template-bound observables when signals not applicable

**FORBIDDEN:**
- Manual `.subscribe()` without cleanup strategy
- Subscriptions in constructors without lifecycle hooks
- Nested subscriptions without proper cleanup chain

## Operator Selection Constraints

**IMMEDIATELY select operator based on concurrency requirement:**

| Trigger | Required Operator | Forbidden Alternative |
|---------|-------------------|----------------------|
| Search input, autocomplete, filters | `switchMap` | `mergeMap`, `concatMap`, `exhaustMap` |
| Independent parallel operations | `mergeMap` | `switchMap`, `concatMap` |
| Sequential ordered operations | `concatMap` | `switchMap`, `mergeMap` |
| Prevent double-submission (save/submit buttons) | `exhaustMap` | `switchMap`, `mergeMap` |

**VIOLATION consequences:**
- Wrong operator → race conditions, data corruption, or performance degradation

## CRITICAL: Error Handling

ALL observable streams MUST handle errors. Unhandled errors break reactive chains.

**REQUIRED error handling:**
```typescript
pipe(
  catchError((error) => {
    // Log for debugging
    console.error('Operation failed:', error);
    // Provide fallback or retry
    return of(fallbackValue);
    // OR retry(3)
  })
)
```

**FORBIDDEN:**
- Observable streams without `catchError`
- Error propagation that breaks parent streams
- Silent error swallowing without logging

## Observable-Signal Interop Rules

**Observable → Signal:**
- MUST use `toSignal(observable$, { initialValue: defaultValue })`
- Automatic subscription cleanup provided
- REQUIRED for component integration

**Signal → Observable:**
- MUST use `toObservable(signal)`
- Creates observable from signal value changes

**FORBIDDEN:**
- Manual subscription bridging between observables and signals
- Missing `initialValue` in `toSignal()` for synchronous rendering

## Subscription Cleanup Pattern (Manual)

ONLY IF `toSignal()` is not applicable:

```typescript
private destroy$ = new Subject<void>();

ngOnInit() {
  this.data$.pipe(takeUntil(this.destroy$)).subscribe(/*...*/);
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

**REQUIRED:**
- `destroy$` subject declaration
- `takeUntil(this.destroy$)` before ALL subscriptions
- `next()` and `complete()` in `ngOnDestroy()`

**FORBIDDEN:**
- Subscriptions without `takeUntil`
- Missing `ngOnDestroy` hook
- Incomplete cleanup (missing `next()` or `complete()`)

## Multicast Operators

**When operation is expensive:**
- MUST use `shareReplay()` for cached results across multiple subscribers
- MUST use `share()` for multicasting without replay buffer

**FORBIDDEN:**
- Duplicate HTTP requests due to missing multicast operators
- Expensive computations re-executed per subscriber

## Enforcement Summary

**REQUIRED in ALL code:**
- Observable cleanup via `toSignal()`, `takeUntil()`, or `AsyncPipe`
- Correct flattening operator per concurrency requirement
- `catchError` in ALL observable chains
- Multicast operators for expensive operations

**FORBIDDEN in ALL code:**
- Manual subscriptions without cleanup
- Missing error handling
- Wrong operator causing race conditions
- Observable re-execution without sharing
