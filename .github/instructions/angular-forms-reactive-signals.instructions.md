---
description: 'Angular 20 Reactive Forms and Signals Integration Best Practices'
applyTo: '**/*.component.ts,**/forms/*.ts,**/services/*.ts'
---

# Angular 20 Reactive Forms + Signals Integration

## Core Concepts

Angular's reactive forms system is based on RxJS Observables, while Signals are a new reactive primitive introduced in Angular 16+. Integrating both requires understanding data flow transformation and state synchronization mechanisms.

## Integration Patterns

### Observable to Signal Conversion
Use `toSignal()` to convert form Observable streams to Signals:
- `valueChanges` → Form value change Signal
- `statusChanges` → Form status Signal
- Custom validator async results → Signal

### Signal-driven Form Logic
- Use `computed()` to derive form state
- Use `effect()` to synchronize form with external state
- Maintain unidirectional data flow

### Integration with @ngrx/signals
- Use SignalStore to manage form-related state uniformly
- Use `rxMethod` to handle form submission and other async operations
- Use `withMethods` to encapsulate form logic

## Architectural Layering Principles

### Component Layer
- Hold FormControl/FormGroup instances
- Convert Observables to Signals
- Handle only UI interaction logic
- Delegate business logic to Service/Store

### Service/Store Layer
- Manage global state related to forms
- Handle form submission, validation, and other business logic
- Interact with backend APIs
- Provide Signal interface to Component

### Data Flow Direction
```
User Input → FormControl → Observable → Signal → UI Update
                              ↓
                         Service/Store (Business Logic)
                              ↓
                          API Call
```

## Form Validation Strategy

### Synchronous Validation
- Built-in validators (required, email, min, max, etc.)
- Custom synchronous validator functions
- Use Signal to respond to validation results

### Asynchronous Validation
- Use AsyncValidator interface
- Backend validation (e.g., checking if username already exists)
- Convert to Signal to track validation state

### Validation Error Handling
- Use `computed()` to calculate error messages
- Conditional error display (with `@if`)
- Multi-language error message support

## State Management Patterns

### Local State (Component-scoped)
Applicable scenarios:
- Simple forms (less than 5 fields)
- No need for cross-component sharing
- No complex business logic

Management approach:
- Use `toSignal()` directly in Component
- Use local signals to manage auxiliary state

### Global State (Application-scoped)
Applicable scenarios:
- Complex multi-step forms
- Need to maintain state across pages
- Multiple components share form data
- Need undo/redo functionality

Management approach:
- Use @ngrx/signals SignalStore
- Unified state update logic
- Centralized side-effect handling

## Form Submission Flow

### Standard Flow
1. User triggers submission
2. Validate form validity
3. Update submitting state (isSubmitting)
4. Call Service/Store method
5. Use rxMethod to handle async operations
6. Handle success/failure response
7. Update UI state (success message, error message)
8. Optional: reset form or navigate

### Error Handling
- Use `tapResponse` to handle success/failure
- Store error messages in Signal
- Provide user-friendly error feedback
- Consider retry mechanism

### Loading State
- Maintain `isSubmitting` Signal
- Disable submit button to avoid duplicate submission
- Show loading indicator
- Keep UI responsive

## Dynamic Form Handling

### FormArray Management
- Dynamically add/remove form controls
- Use Signal to track array length
- Render dynamic fields with `@for`
- Use appropriate track expression

### Conditional Fields
- Show/hide fields based on other field values
- Use `computed()` to determine display logic
- Dynamically enable/disable controls
- Conditional validation rules

### Nested Forms
- Use FormGroup nested structure
- Child form componentization
- Use ControlValueAccessor integration
- Maintain type safety

## Performance Optimization

### Avoid Unnecessary Computation
- Use `computed()` instead of getter
- Use `effect()` carefully (avoid side effect loops)
- Use `untracked()` appropriately to break dependencies

### Reduce Subscriptions
- Prefer `toSignal()` over manual subscription
- Let Angular automatically manage subscription lifecycle
- Avoid memory leaks

### Form Value Change Throttling
- Use RxJS operators (debounceTime, throttleTime)
- Avoid excessive API calls
- Balance responsiveness and performance

## TypeScript Type Safety

### Strongly Typed Forms
- Use generics to define FormControl<T>
- Use interfaces to define form structure
- Enable `nonNullable` option to avoid null values
- Complete type inference

### Type Guards
- Validators return type-safe errors
- Use TypeScript strict mode
- Avoid any type

## Common Patterns and Anti-patterns

### ✅ Good Patterns
- Use `toSignal()` to convert Observable
- Handle business logic in Store
- Use `computed()` to derive state
- Maintain unidirectional data flow
- Centralize error handling

### ❌ Avoid
- Manual subscription to valueChanges (unless necessary)
- Call API directly in Component
- Mix Signals with traditional state management
- Forget to set `initialValue`
- Use complex expressions in templates

## Testing Strategy

### Unit Tests
- Test form validation logic
- Test Signal computation logic
- Mock Service/Store dependencies
- Use TestBed setup

### Integration Tests
- Test form submission flow
- Test error handling
- Test state synchronization
- Simulate user interaction

## Accessibility Considerations

- Proper label and input association
- Error messages linked with aria-describedby
- Accessibility hints for form validation state
- Keyboard navigation support
- Screen reader-friendly error messages

## Migration Recommendations

### Migrating from Traditional Forms
1. Keep existing FormControl/FormGroup structure
2. Gradually convert Observable subscriptions to `toSignal()`
3. Introduce SignalStore to manage complex state
4. Refactor business logic to Service/Store
5. Update tests

### Progressive Adoption
- Use Signals for new features
- Gradually refactor existing functionality
- Maintain backward compatibility
- Team training and documentation updates