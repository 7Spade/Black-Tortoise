---
description: 'Angular Core: signals, dependency injection, lifecycle hooks, decorators, and zone-less architecture patterns'
applyTo: '**/*.ts'
---

# @angular/core Implementation Instructions

## CRITICAL: Signal-First Architecture

**REQUIRED:**
- Use `signal()`, `computed()`, `effect()` for reactive state
- NEVER use `BehaviorSubject` or manual observables for component state
- Signal invocation MUST include `()` in templates
- Initialize all signals (NEVER leave undefined)

**FORBIDDEN:**
- RxJS subjects for local component state
- Manual change detection triggers
- Undefined signal values

## Dependency Injection

**REQUIRED:**
- Use `inject()` function in constructors and initialization
- Provider configuration in `app.config.ts` or component `providers`
- NEVER use `@Injectable()` without proper scope

**FORBIDDEN:**
- Constructor parameter injection in standalone components (use `inject()`)
- Circular dependencies between services
- Providing services at multiple levels unintentionally

## Lifecycle Hooks

**REQUIRED implementation:**
- `ngOnInit()` for initialization logic
- `ngOnDestroy()` for cleanup (subscriptions, event listeners)
- `ngOnChanges()` ONLY for `@Input()` change detection

**FORBIDDEN:**
- Logic in constructor (use `ngOnInit()`)
- Missing cleanup in `ngOnDestroy()`
- Using lifecycle hooks in services

## Component Decorators

**REQUIRED in Angular 20:**
- `standalone: true` for all components
- Explicit `imports` array for dependencies
- `changeDetection: ChangeDetectionStrategy.OnPush` with signals

**FORBIDDEN:**
- Non-standalone components in new code
- Default change detection with signals
- Module-based component declarations

## Input/Output Signal Functions

**REQUIRED in Angular 19+:**
- `input()` and `input.required()` for component inputs
- `output()` for component outputs
- `viewChild()` and `viewChildren()` for view queries
- `contentChild()` and `contentChildren()` for content queries

**FORBIDDEN:**
- `@Input()`, `@Output()`, `@ViewChild()`, `@ContentChild()` decorators
- Non-signal based input/output in new code

## Zone-less Configuration

**REQUIRED for zone-less:**
- `provideExperimentalZonelessChangeDetection()` in app config
- NEVER import `zone.js` in zone-less applications
- Signals MUST trigger change detection automatically

**FORBIDDEN:**
- Manual `ChangeDetectorRef` usage with signals
- Mixing zone.js with zone-less configuration

## Effects and Side Effects

**REQUIRED:**
- Use `effect()` for side effects triggered by signal changes
- Effects MUST NOT modify signals synchronously
- Cleanup MUST be handled in effect destruction

**FORBIDDEN:**
- Signal mutations inside effects
- Effects without proper cleanup
- Effects for computed values (use `computed()`)

## Template References

**REQUIRED:**
- Use `viewChild()` signal for single template references
- Use `viewChildren()` signal for query lists
- NEVER access view children in constructor

**FORBIDDEN:**
- Decorator-based view queries in new code
- Accessing view children before `ngAfterViewInit()`

## Performance Optimization

**REQUIRED:**
- `OnPush` change detection with signals
- Lazy loading with `@defer` blocks
- Pure components without side effects

**FORBIDDEN:**
- Default change detection strategy with signals
- Impure pipes in components
- Side effects in component getters

## Testing

**REQUIRED:**
- Mock dependencies using `TestBed`
- Test signal values and computed signals
- Verify lifecycle hook execution

**FORBIDDEN:**
- Testing private component methods
- Skipping cleanup verification in tests

## Enforcement Checklist

**REQUIRED:**
- Signal-based state management
- `inject()` for dependency injection
- Standalone components with explicit imports
- `OnPush` change detection
- Zone-less configuration
- `input()`, `output()`, `viewChild()` functions
- Proper lifecycle hook implementation
- Cleanup in `ngOnDestroy()`

**FORBIDDEN:**
- RxJS subjects for component state
- Decorator-based inputs/outputs/queries
- Zone.js in zone-less apps
- Manual change detection
- Missing `ngOnDestroy()` cleanup
