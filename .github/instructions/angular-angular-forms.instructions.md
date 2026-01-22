---
description: 'Angular Forms: Reactive Forms with typed controls, validation, and NgRx Signals integration patterns'
applyTo: '**/*.ts'
---

# @angular/forms Implementation Instructions

## Reactive Forms Requirement

**REQUIRED:**
- Use Reactive Forms with `FormControl<T>` for typed forms
- All form controls MUST have explicit types
- NEVER use template-driven forms for multi-field forms

**FORBIDDEN:**
- Template-driven forms for complex forms
- Untyped `FormControl` usage
- `any` type in form definitions

## Form Control Types

**REQUIRED:**
- `FormControl<string>` for text inputs
- `FormControl<number>` for numeric inputs
- `FormControl<boolean>` for checkboxes
- `FormControl<T | null>` for nullable controls
- `FormGroup<{...}>` for nested form structures
- `FormArray<FormControl<T>>` for dynamic lists

**FORBIDDEN:**
- FormControl without type parameter
- Implicit typing in forms
- Mixed types without union types

## Validation

**REQUIRED:**
- Validators on ALL inputs: `required`, `email`, `min`, `max`, `pattern`
- Show errors ONLY after field touched: `@if (control.invalid && control.touched)`
- Specific error messages per validation rule
- Submit button disabled when form invalid

**FORBIDDEN:**
- Forms without validation
- Generic error messages
- Showing errors before user interaction
- Enabled submit on invalid forms

## Custom Validators

**REQUIRED:**
- Return `null` for valid state
- Return `ValidationErrors` object for invalid state
- Pure functions ONLY
- NEVER modify state in validators

**FORBIDDEN:**
- Side effects in validators
- Async validators for synchronous checks
- State mutation in validator functions

## NgRx Signals Integration

**REQUIRED:**
- Form instance in `signalStore` state
- `submitting` signal for loading state
- `error` signal for error messages
- `rxMethod` for async form submission
- `tapResponse` for error handling
- Form reset on success via `patchState`

**FORBIDDEN:**
- Form state outside NgRx Signals
- Synchronous submission
- Missing error handling
- Form persistence after successful submission

## Form Submission Pattern

**REQUIRED:**
```typescript
submitForm: rxMethod<FormData>(
  pipe(
    tap(() => patchState(store, { submitting: true })),
    switchMap((data) => service.submit(data)),
    tapResponse({
      next: () => patchState(store, { submitting: false, form: createForm() }),
      error: (error) => patchState(store, { error: error.message, submitting: false })
    })
  )
)
