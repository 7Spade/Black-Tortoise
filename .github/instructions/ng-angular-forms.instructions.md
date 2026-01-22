---
description: 'Angular Forms: Reactive Forms, validation, NgRx Signals integration'
applyTo: '**'
---

# Angular Forms Rules

## CRITICAL: Reactive Forms Requirement

- Multi-field forms MUST use Reactive Forms with typed `FormControl<T>`
- Template-driven forms are FORBIDDEN

## Validation Rules

**REQUIRED:**
- Validators on all inputs (built-in: `required`, `email`, `min`, `max`, `pattern`)
- Show errors ONLY after field touched: `@if (control.invalid && control.touched)`
- Specific error messages per validation rule
- Disable submit button when form invalid

**Custom Validators:**
- Return `null` if valid, `ValidationErrors` object if invalid
- Must NOT modify state or produce side effects

## CRITICAL: NgRx Signals Integration

**Store Pattern REQUIRED:**
- Form instance stored in `signalStore` state
- Maintain `submitting` and `error` flags
- Use `rxMethod` with `tapResponse` for async submissions
- Reset form on success via `patchState`
- Update error state on failure

**FORBIDDEN:**
- Form state outside NgRx Signals
- Synchronous submissions
- Missing error handling
- Persisting form after success

## Submit Button State

- Button MUST be `[disabled]="form.invalid || submitting()"` with visual feedback during submission

**REQUIRED in ALL forms:**
- Typed Reactive Forms
- Validators + error display after touched
- NgRx Signals integration via `rxMethod`
- Submit button disabled when invalid or submitting
