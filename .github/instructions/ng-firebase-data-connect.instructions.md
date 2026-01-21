---
description: 'Firebase Data Connect enforcement: schema definition, SDK generation, authorization rules, and NgRx Signals integration constraints'
applyTo: '**'
---

# Firebase Data Connect Rules

## CRITICAL: SDK Generation

After ANY GraphQL schema modification → IMMEDIATELY regenerate TypeScript SDKs.

**REQUIRED:**
1. Execute: `firebase dataconnect:sdk:generate`
2. Verify SDK output location: `src/dataconnect-generated/`
3. Update NgRx Signals store integrations if SDK signatures changed

**FORBIDDEN:**
- Manual editing of generated SDK files
- Schema changes without SDK regeneration
- Committing code with outdated SDKs

**VIOLATION consequences:**
- Type mismatches at runtime
- Compilation errors
- Data access failures

## Schema Definition Constraints

**REQUIRED structure for all tables:**
```graphql
type Entity @table {
  id: UUID! @default(expr: "uuidV4()")
  createdAt: Timestamp! @default(expr: "request.time")
}
```

**Directive enforcement:**
- `@table` - REQUIRED for all database types
- `@unique` - REQUIRED for natural keys
- `@default` - REQUIRED for id and timestamps
- `@auth` - REQUIRED for ALL types (no public access by default)

**FORBIDDEN:**
- Tables without `@auth` directive
- Missing id or timestamp fields
- Undefined relationships between entities

## CRITICAL: Authorization Rules

ALL types MUST have `@auth` directive. No exceptions.

**REQUIRED authorization pattern:**
```graphql
type Entity @table @auth(
  rules: [
    { allow: OWNER, ownerField: "userId" },
    { allow: ADMIN }
  ]
) {
  userId: UUID!
  # other fields
}
```

**REQUIRED:**
- Owner-based access control via `ownerField`
- Explicit read/write/delete permissions
- Test coverage for authorization rules

**FORBIDDEN:**
- Public access without explicit authorization
- Missing `ownerField` for user data
- Untested authorization rules

## NgRx Signals Integration

**REQUIRED pattern:**
```typescript
withMethods((store, sdk = inject(DataConnectService)) => ({
  loadData: rxMethod<string>(
    pipe(
      switchMap((id) => sdk.getData(id)),
      tapResponse({
        next: (data) => patchState(store, { data, loading: false }),
        error: (error) => patchState(store, { error: error.message, loading: false })
      })
    )
  )
}))
```

**REQUIRED:**
- SDK injection via `inject()`
- `rxMethod` wrapper for async operations
- `tapResponse` for error handling
- `patchState` for state updates

**FORBIDDEN:**
- Direct SDK calls outside `rxMethod`
- Missing error handling
- Synchronous SDK usage

## Query Design Constraints

**REQUIRED:**
- Explicit field selection (avoid `SELECT *` equivalent)
- Parameterized queries via variables
- Input validation before execution

**EXAMPLE:**
```graphql
query GetUser($id: UUID!) {
  user(id: $id) {
    name
    email
    # ONLY needed fields
  }
}
```

**FORBIDDEN:**
- Over-fetching (requesting unnecessary fields)
- Hard-coded query values
- Unvalidated inputs
- Missing error handling

## Enforcement Summary

**IMMEDIATELY after schema change:**
1. Regenerate SDKs
2. Update store integrations
3. Verify compilation
4. Test authorization

**REQUIRED in ALL schemas:**
- `@table` directive
- `@auth` rules
- UUID id field
- Timestamp fields

**REQUIRED in ALL integrations:**
- `rxMethod` wrapper
- Error handling via `tapResponse`
- State management via `patchState`
- Input validation
