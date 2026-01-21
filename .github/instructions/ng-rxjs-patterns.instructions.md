---
description: 'RxJS subscription cleanup, operator selection, error handling enforcement'
applyTo: '**'
---

# RxJS Rules

## CRITICAL: Subscription Cleanup

MUST use cleanup mechanisms:
1. `toSignal()` for components
2. `takeUntil(destroy$)` + `ngOnDestroy()` when manual subscription required
3. `AsyncPipe` for templates

NEVER manual `.subscribe()` without cleanup.

## Operator Selection

| Use Case | Operator |
|----------|----------|
| Cancel previous (search, filters) | `switchMap` |
| Parallel operations | `mergeMap` |
| Sequential operations | `concatMap` |
| Block concurrent (submit buttons) | `exhaustMap` |

## Error Handling

ALL observables MUST include `catchError` or `tapResponse`.
NEVER unhandled errors in streams.

## Signal Interop

Observable → Signal: `toSignal(obs$, { initialValue })`
Signal → Observable: `toObservable(signal)`
NEVER manual bridging.

## Multicast

Expensive operations MUST use `shareReplay()` or `share()`.
