---
description: 'AngularFire: Firebase integration for Authentication, Firestore, Storage, Functions with signals and reactive patterns'
applyTo: '**/*.ts'
---

# @angular/fire Implementation Instructions

## CRITICAL: Injection Pattern

**REQUIRED:**
- Use `inject()` for ALL Firebase services (Firestore, Auth, Storage, Functions)
- NEVER import Firebase SDK directly
- ALL Firebase operations MUST be in repository layer

**FORBIDDEN:**
- Direct Firebase SDK imports in components or application layer
- Hardcoded Firebase credentials in code

## Authentication Integration

**REQUIRED:**
- Use `toSignal()` with `initialValue` for auth state observables
- NEVER use manual subscriptions for auth state
- Auth state MUST be managed in NgRx Signals store

**FORBIDDEN:**
- Manual `authState()` subscriptions
- Synchronous auth operations
- Missing `initialValue` in `toSignal()`

## Firestore Operations

**REQUIRED:**
- All Firestore calls in repository implementations
- Use query constraints (where clauses) for filtered reads
- NEVER fetch entire collections without constraints
- Input validation BEFORE database operations

**FORBIDDEN:**
- Firestore operations in components or facades
- Unvalidated user input in queries
- Missing error handling on database operations

## Security Rules

**REQUIRED:**
- Security rules in `firestore.rules` and `storage.rules`
- NEVER use `allow read, write: if true` in production
- Test security rules with emulator

**VIOLATION:** Security breaches, unauthorized data access

## Observable to Signal Conversion

**REQUIRED pattern:**
- `toSignal(firestoreObservable$, { initialValue })` in stores
- Use `rxMethod()` for async Firebase operations
- Use `tapResponse()` for error handling

**FORBIDDEN:**
- Manual subscriptions to Firebase observables
- Missing error handling
- Undefined initial values

## Environment Configuration

**REQUIRED:**
- Firebase config in environment files
- NEVER hardcode API keys or project IDs
- Use environment variable replacement for builds

**FORBIDDEN:**
- Hardcoded credentials in version control
- Same config for dev and prod

## Storage Operations

**REQUIRED:**
- Validate file size and type BEFORE upload
- Use security rules for access control
- Handle upload errors with user feedback

**FORBIDDEN:**
- Unvalidated file uploads
- Missing error handling
- Direct file URL exposure without validation

## Cloud Functions Integration

**REQUIRED:**
- Use `httpsCallable()` with proper typing
- Configure timeout for functions
- Handle function errors explicitly

**FORBIDDEN:**
- Functions without timeout configuration
- Silent error swallowing
- Missing return type definitions

## Real-time Data Synchronization

**REQUIRED:**
- Use Firestore snapshot listeners in repositories
- Convert snapshots to domain entities
- NEVER expose Firestore documents directly

**FORBIDDEN:**
- Firestore types in domain layer
- Manual snapshot subscriptions
- Missing data transformation

## Error Handling

**REQUIRED:**
- Specific error codes (auth/*, storage/*, functions/*)
- User-friendly error messages
- Logging for debugging

**FORBIDDEN:**
- Generic error messages
- Exposing internal error details to users
- Silent error failures

## Testing

**REQUIRED:**
- Use Firebase emulators for local testing
- Mock Firebase services in unit tests
- Integration tests with emulator suite

**FORBIDDEN:**
- Testing against production Firebase
- Tests without proper cleanup
- Hardcoded test data in production database

## Enforcement Checklist

**REQUIRED:**
- `inject()` for all Firebase services
- Repository pattern for Firebase operations
- Security rules without open access
- `toSignal()` with `initialValue`
- Input validation before database operations
- Environment-based configuration
- Error handling with specific codes

**FORBIDDEN:**
- Direct SDK imports outside infrastructure
- Hardcoded credentials
- Manual observable subscriptions
- Missing security rules
- Unvalidated user input to Firebase
