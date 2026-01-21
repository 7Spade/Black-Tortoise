---
description: 'AngularFire enforcement: inject() pattern, toSignal() observables, async I/O, security rules, NO hardcoded secrets'
applyTo: '**/*.ts, **/environment*.ts'
---

# AngularFire Rules

## CRITICAL: Core Requirements

**REQUIRED for ALL Firebase code:**
1. `inject()` pattern for ALL services (Firestore, Auth, Storage, Functions) - NO direct SDK imports
2. `toSignal()` with `initialValue` for ALL observables - NO manual subscriptions
3. `async/await` for ALL I/O operations - NO synchronous Firebase calls
4. Security rules in `firestore.rules` and `storage.rules` - NO `allow read, write: if true`
5. Environment variables for credentials - NO hardcoded secrets in code or version control
6. Input validation BEFORE all database operations - validate userId, email, file size/type
7. Error handling with try/catch - specific error codes (auth/*, storage/*, functions/*)
8. rxMethod + tapResponse + patchState for NgRx Signals store integration
9. Functional guards with inject() for auth - NO class-based guards
10. Query constraints (where clauses) for all filtered Firestore reads
11. Timeout configuration for Cloud Functions - prevent resource exhaustion
12. File validation before Storage uploads (size, type, URL)

**FORBIDDEN:**
- Direct SDK imports (`getFirestore()`, etc.)
- Hardcoded API keys or credentials
- Open security rules (`if true`)
- Manual observable subscriptions
- Synchronous operations
- Null assertions (`currentUser!.uid`)
- Missing `initialValue` in `toSignal()`
- Unvalidated user input to Firebase
- Silent error swallowing

**Security Rules Template (Firestore):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /collection/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

**Security Rules Template (Storage):**
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

**VIOLATION consequences:**
Runtime errors, memory leaks, security breaches, data loss, compliance violations, performance degradation
