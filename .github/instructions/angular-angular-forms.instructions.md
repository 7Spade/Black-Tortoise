---
description: 'Angular Forms: Reactive Forms with typed controls, validation, and NgRx Signals integration patterns'
applyTo: '**/*.ts'
---

# @angular/forms Implementation Instructions

## CRITICAL: Reactive Forms Requirement

**REQUIRED:**
- Use Reactive Forms with `FormControl<T>` for typed forms
- NEVER use template-driven forms for multi-field forms
- All form controls MUST have explicit types

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
- `FormControl` without type parameter
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
- NEVER modify state in validators
- Pure functions ONLY

**FORBIDDEN:**
- Side effects in validators
- Async validators for synchronous checks
- State mutation in validator functions

## NgRx Signals Integration

**REQUIRED store pattern:**
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
```

**FORBIDDEN:**
- Manual form submission without store integration
- Missing loading state management
- No error state handling

## Form Reset

**REQUIRED:**
- Reset form on successful submission
- Clear error state on reset
- NEVER preserve form data after success

**FORBIDDEN:**
- Partial form resets
- Preserving submitted data
- Missing error state cleanup

## Submit Button State

**REQUIRED:**
- `[disabled]="form.invalid || submitting()"`
- Visual feedback during submission
- Accessibility labels for loading state

**FORBIDDEN:**
- Always-enabled submit buttons
- Missing loading indicators
- Submit without disabled state

## Form Value Changes

**REQUIRED:**
- Use `valueChanges` with `toSignal()` for reactive updates
- NEVER subscribe manually to value changes
- Use `debounceTime()` for search/filter inputs

**FORBIDDEN:**
- Manual subscriptions without cleanup
- Missing debounce on frequent updates
- Synchronous processing of value changes

## Dynamic Forms

**REQUIRED:**
- Use `FormArray` for dynamic form fields
- Type all array elements
- Provide removal and addition methods

**FORBIDDEN:**
- Untyped form arrays
- Direct array manipulation
- Missing array controls management

## Testing

**REQUIRED:**
- Test form validation rules
- Test form submission flow
- Verify error message display
- Test form reset behavior

**FORBIDDEN:**
- Skipping validation tests
- Missing submission error tests
- Incomplete form state verification

## Enforcement Checklist

**REQUIRED:**
- Reactive Forms with `FormControl<T>`
- Validators on all inputs
- Error display after touched
- NgRx Signals integration
- `rxMethod` for submission
- Submit button `[disabled]="form.invalid || submitting()"`
- Form reset on success
- `toSignal()` for value changes

**FORBIDDEN:**
- Template-driven forms for complex cases
- Untyped form controls
- Missing validation
- Manual subscriptions
- Form state outside signals
- Always-enabled submit buttons
