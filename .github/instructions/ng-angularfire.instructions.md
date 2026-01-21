---
description: 'AngularFire enforcement: inject() pattern requirement, toSignal() for observables, async I/O, security rules validation, NO hardcoded secrets'
applyTo: '**/*.ts, **/environment*.ts'
---

# AngularFire Rules

## CRITICAL: Dependency Injection

ALL Firebase services MUST use inject() pattern. Direct SDK imports are FORBIDDEN.

**REQUIRED:**
```typescript
private firestore = inject(Firestore);
private auth = inject(Auth);
private storage = inject(Storage);
private functions = inject(Functions);
```

**FORBIDDEN:**
```typescript
import { getFirestore } from 'firebase/firestore';
const firestore = getFirestore(); // VIOLATION
```

**VIOLATION consequences:**
- Runtime initialization errors
- Breaks testability
- Prevents DI configuration

## CRITICAL: Secret Management

Firebase credentials MUST use environment variables. Hardcoded secrets are FORBIDDEN.

**REQUIRED:**
- Store credentials in environment files
- NEVER commit actual API keys to version control
- Use secrets management for production

**VIOLATION consequences:**
- Security breach
- Credential exposure
- Compliance violation

## Authentication Service Enforcement

**REQUIRED pattern:**
```typescript
private auth = inject(Auth);
user = toSignal(user(this.auth), { initialValue: null });
```

**REQUIRED for ALL auth operations:**
- async/await for authentication calls
- Error handling with specific error codes
- NEVER use synchronous auth operations

**FORBIDDEN:**
- Direct user observable subscription
- Synchronous auth checks
- Missing error handling
- Null assertions on currentUser (`this.auth.currentUser!.uid`)

**VIOLATION consequences:**
- Race conditions in auth state
- Memory leaks from unhandled subscriptions
- Runtime null pointer errors

## Auth Guard Constraints

**REQUIRED:**
- Functional guards with inject()
- Observable-based auth state check
- Navigation redirect on unauthorized access

**FORBIDDEN:**
- Class-based guards
- Synchronous auth checks
- Missing navigation on failure

## Firestore Service Enforcement

**REQUIRED pattern:**
```typescript
private firestore = inject(Firestore);
private collection = collection(this.firestore, 'collectionName');
```

**REQUIRED for ALL Firestore operations:**
- async/await for write operations (addDoc, updateDoc, deleteDoc)
- Observable return type for read operations
- Input validation BEFORE database calls
- Query constraints for filtered data

**FORBIDDEN:**
- Synchronous Firestore operations
- Missing input validation
- Unfiltered queries without where clauses
- Direct access without inject()

**VIOLATION consequences:**
- Blocking I/O operations
- Performance degradation
- Security vulnerabilities
- Data integrity issues

## CRITICAL: NgRx Signals Integration

**REQUIRED pattern for Firestore integration:**
```typescript
withMethods((store, service = inject(FirestoreService)) => ({
  loadData: rxMethod<string>(
    pipe(
      tap(() => patchState(store, { loading: true, error: null })),
      switchMap((id) => service.getData(id)),
      tapResponse({
        next: (data) => patchState(store, { data, loading: false }),
        error: (error: Error) => patchState(store, { error: error.message, loading: false })
      })
    )
  )
}))
```

**REQUIRED:**
- rxMethod for async operations
- tapResponse for error handling
- patchState for state updates
- Service injection via inject()

**FORBIDDEN:**
- Direct observable subscriptions
- Missing error handling in tapResponse
- Synchronous state updates
- Store-to-store direct manipulation

**VIOLATION consequences:**
- Memory leaks
- Unhandled errors
- State corruption
- Subscription management issues

## Cloud Storage Enforcement

**REQUIRED pattern:**
```typescript
private storage = inject(Storage);
```

**REQUIRED for ALL storage operations:**
- async/await for file operations
- Error handling with try/catch
- URL validation before access
- File size validation before upload

**FORBIDDEN:**
- Synchronous file operations
- Missing error handling
- Unvalidated file uploads
- Direct SDK imports

**VIOLATION consequences:**
- Blocking I/O operations
- Storage quota exhaustion
- Security vulnerabilities

## Cloud Functions Enforcement

**REQUIRED pattern:**
```typescript
private functions = inject(Functions);
const callable = httpsCallable(this.functions, 'functionName');
```

**REQUIRED:**
- async/await for function calls
- Timeout configuration for long operations
- Error handling with try/catch
- Input validation before invocation

**FORBIDDEN:**
- Synchronous function calls
- Missing timeout configuration
- Unvalidated inputs
- Missing error handling

**VIOLATION consequences:**
- Timeout errors
- Resource exhaustion
- Security vulnerabilities

## CRITICAL: Observable-to-Signal Conversion

ALL Firebase observables MUST be converted to signals using toSignal().

**REQUIRED:**
```typescript
user = toSignal(user(this.auth), { initialValue: null });
tasks = toSignal(this.service.getTasks(), { initialValue: [] });
```

**REQUIRED constraints:**
- initialValue REQUIRED for all toSignal() calls
- NEVER subscribe manually to Firebase observables
- Use computed() for derived state from signals

**FORBIDDEN:**
- Manual subscriptions to Firebase observables
- Missing initialValue in toSignal()
- Direct observable usage in components

**VIOLATION consequences:**
- Memory leaks from unmanaged subscriptions
- Missing cleanup on component destruction
- Synchronization issues

## CRITICAL: Security Rules Enforcement

ALL Firestore collections MUST have security rules defined. Open access is FORBIDDEN.

**REQUIRED in firestore.rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /collection/{docId} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == resource.data.userId;
    }
  }
}
```

**REQUIRED:**
- Authentication check (request.auth != null)
- Ownership validation (resource.data.userId == request.auth.uid)
- Field-level validation rules
- Rate limiting for writes

**FORBIDDEN:**
```javascript
allow read, write: if true; // CRITICAL VIOLATION
```

**VIOLATION consequences:**
- Data breach
- Unauthorized access
- Compliance violation
- Security audit failure

## CRITICAL: Storage Security Rules

ALL Storage paths MUST have security rules. Public access is FORBIDDEN.

**REQUIRED in storage.rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**FORBIDDEN:**
```javascript
allow read, write: if true; // CRITICAL VIOLATION
```

## Input Validation Enforcement

**REQUIRED for ALL Firebase operations:**
- Validate userId before queries
- Validate email format before auth operations
- Validate file size/type before uploads
- Sanitize input before Firestore writes

**FORBIDDEN:**
- Direct user input to Firebase without validation
- Trusting client-side validation only
- Missing type guards for external data

**VIOLATION consequences:**
- Invalid data in database
- Security vulnerabilities
- Data corruption

## Error Handling Requirements

**REQUIRED for ALL Firebase operations:**
- try/catch for async operations
- Specific error code handling (auth/*, storage/*, functions/*)
- Error state in stores via patchState
- User-friendly error messages

**FORBIDDEN:**
- Silent error swallowing
- Generic error messages
- Missing error handling in async operations
- console.log() as sole error handling

**VIOLATION consequences:**
- Undiagnosed failures
- Poor user experience
- Data loss

## Async Operation Constraints

**REQUIRED:**
- async/await for ALL I/O operations
- NEVER block main thread with synchronous Firebase calls
- Use rxMethod for store integrations
- Proper promise chaining

**FORBIDDEN:**
- Synchronous Firebase operations
- Blocking I/O operations
- Missing await on promises
- Unhandled promise rejections

**VIOLATION consequences:**
- Application freeze
- Performance degradation
- Race conditions

## Forbidden Actions

**NEVER:**
- Import Firebase SDK directly (`import { getFirestore } from 'firebase/firestore'`)
- Hardcode Firebase credentials in code
- Use `allow read, write: if true` in security rules
- Subscribe to Firebase observables without cleanup
- Use `!` null assertion on `currentUser`
- Omit `initialValue` in `toSignal()`
- Skip input validation before database operations
- Use synchronous Firebase operations
- Deploy without security rules
- Store secrets in version control

**VIOLATION consequences vary by action:**
- Security breaches
- Data loss
- Memory leaks
- Runtime errors
- Compliance violations

## Enforcement Summary

**REQUIRED in ALL Firebase code:**
- `inject()` for dependency injection
- `toSignal()` with `initialValue` for observables
- `async/await` for I/O operations
- Security rules in `firestore.rules` and `storage.rules`
- Input validation before operations
- Error handling with try/catch
- rxMethod for NgRx Signals integration

**FORBIDDEN in ALL Firebase code:**
- Direct SDK imports
- Hardcoded secrets
- Open security rules
- Manual observable subscriptions
- Synchronous operations
- Missing error handling
- Null assertions on auth state
