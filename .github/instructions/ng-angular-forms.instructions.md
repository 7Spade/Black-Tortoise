---
description: 'Angular Forms: Reactive Forms, validation, NgRx Signals integration'
applyTo: '**'
---

# Angular Forms Rules

## CRITICAL: Reactive Forms Requirement

Multi-field forms with validation MUST use Reactive Forms with typed `FormControl<T>`. Template-driven forms FORBIDDEN.

## Validation Rules

**REQUIRED:**
- Validators on ALL inputs (built-in: `required`, `email`, `min`, `max`, `pattern`)
- Show errors ONLY after field touched using `@if (control.invalid && control.touched)`
- Specific error messages per validation rule
- Disable submit when form invalid

**Custom validators:**
- Return `null` for valid, `ValidationErrors` object for invalid
- No side effects or state modification

## CRITICAL: NgRx Signals Integration

**REQUIRED store pattern:**
- Form instance in `signalStore` state
- `submitting` and `error` flags
- `rxMethod` for async submission with `tapResponse`
- Form reset on success via `patchState`
- Error state update on failure

**FORBIDDEN:**
- Form state outside NgRx Signals
- Synchronous submission
- Missing error handling
- Form persistence after success

## Submit Button State

Button MUST be `[disabled]="form.invalid || submitting()"` with visual feedback during submission.

**REQUIRED in ALL forms:**
- Reactive Forms with typed controls
- Validators + error display after touched
- NgRx Signals integration with rxMethod
- Submit button disabled when invalid/submitting
