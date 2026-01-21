---
description: 'Angular Forms enforcement: Reactive Forms usage, validation rules, NgRx Signals integration, and form state management constraints'
applyTo: '**'
---

# Angular Forms Rules

## CRITICAL: Reactive Forms Requirement

For multi-field forms with validation → MUST use Reactive Forms. Template-driven forms are FORBIDDEN.

**REQUIRED configuration:**
```typescript
userForm = new FormGroup({
  name: new FormControl<string>('', [Validators.required]),
  email: new FormControl<string>('', [Validators.required, Validators.email]),
  age: new FormControl<number | null>(null, [Validators.min(18)])
});
```

**REQUIRED:**
- Typed `FormControl<T>` for type safety
- Explicit validators array
- Proper initial values

**FORBIDDEN:**
- Template-driven forms for complex scenarios
- Untyped form controls
- Missing validation

**VIOLATION consequences:**
- Type safety loss
- Difficult testing
- State management complexity

## Validation Enforcement

**REQUIRED validators for ALL inputs:**
- Built-in: `Validators.required`, `Validators.email`, `Validators.min`, `Validators.max`, `Validators.pattern`
- Custom validators for business rules

**REQUIRED error display pattern:**
```html
@if (form.controls.email.invalid && form.controls.email.touched) {
  <mat-error>
    @if (form.controls.email.hasError('required')) {
      Email is required
    }
    @if (form.controls.email.hasError('email')) {
      Invalid email format
    }
  </mat-error>
}
```

**REQUIRED:**
- Show errors ONLY after field is touched
- Specific error messages per validation rule
- Disable submit when form invalid

**FORBIDDEN:**
- Validation without error display
- Generic error messages
- Submitting invalid forms

## Custom Validator Pattern

**REQUIRED structure:**
```typescript
function minAgeValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const age = calculateAge(control.value);
    return age >= minAge 
      ? null 
      : { minAge: { required: minAge, actual: age } };
  };
}
```

**REQUIRED:**
- Return `null` for valid state
- Return `ValidationErrors` object for invalid state
- Descriptive error keys

**FORBIDDEN:**
- Validators without proper return types
- Side effects in validators
- Validators that modify form state

## CRITICAL: NgRx Signals Integration

**REQUIRED store pattern:**
```typescript
export const FormStore = signalStore(
  withState({ 
    form: new FormGroup({/*...*/}), 
    submitting: false,
    error: null as string | null
  }),
  withMethods((store, service = inject(Service)) => ({
    submit: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { submitting: true, error: null })),
        switchMap(() => service.save(store.form().value)),
        tapResponse({
          next: () => {
            store.form().reset();
            patchState(store, { submitting: false });
          },
          error: (error: Error) => patchState(store, { 
            error: error.message, 
            submitting: false 
          })
        })
      )
    )
  }))
);
```

**REQUIRED:**
- Form instance in store state
- `submitting` and `error` flags
- `rxMethod` for submission
- Form reset on success
- Error state update on failure

**FORBIDDEN:**
- Form state outside NgRx Signals
- Synchronous submission
- Missing error handling
- Form state persistence after success

## Form Submission Constraints

**REQUIRED pre-submission checks:**
1. Validate form: `form.valid`
2. Set loading state
3. Execute submission
4. Handle success: reset form, show message
5. Handle error: display error, preserve form data

**FORBIDDEN:**
- Submitting invalid forms
- Missing loading state
- Unhandled submission errors
- Form data loss on error

## Submit Button State

**REQUIRED button configuration:**
```html
<button 
  type="submit"
  [disabled]="form.invalid || submitting()"
  (click)="submit()">
  Submit
</button>
```

**REQUIRED:**
- Disabled when form invalid
- Disabled during submission
- Visual feedback for disabled state

**FORBIDDEN:**
- Submit button always enabled
- Missing loading indicator
- Multiple submissions allowed

## Enforcement Summary

**REQUIRED in ALL forms:**
- Reactive Forms for complex scenarios
- Typed form controls
- Validators on all inputs
- Error display after touched
- NgRx Signals integration
- Submit button state management

**FORBIDDEN in ALL forms:**
- Template-driven forms with validation
- Unvalidated inputs
- Synchronous submission
- Missing error handling
- Form state outside store
