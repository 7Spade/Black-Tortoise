---
description: 'Firebase Data Connect enforcement: schema definition, SDK generation, authorization rules, and NgRx Signals integration constraints'
applyTo: '**'
---

# Firebase Data Connect Rules

## CRITICAL: Schema Modification Workflow

After ANY GraphQL schema change → IMMEDIATELY:
1. `firebase dataconnect:sdk:generate` → verify `src/dataconnect-generated/`
2. Update NgRx Signals stores if SDK signatures changed
3. NEVER manually edit generated files or commit outdated SDKs

**Violation:** Type mismatches, compilation errors, data access failures

## Schema Requirements

| Directive | Usage | Violation |
|-----------|-------|-----------|
| `@table` | ALL database types | Schema rejected |
| `@auth` | ALL types (no public access) | Security breach |
| `@default` | `id: UUID! @default(expr: "uuidV4()")`, `createdAt: Timestamp! @default(expr: "request.time")` | Missing audit trail |
| `@unique` | Natural keys | Data integrity failure |

**Authorization pattern:**
- `@auth(rules: [{ allow: OWNER, ownerField: "userId" }, { allow: ADMIN }])`
- MUST specify `ownerField` for user data + test coverage
- FORBIDDEN: Public access, missing owner field, untested rules

## NgRx Signals Integration

ALL SDK calls MUST use:
- `inject(DataConnectService)` for DI
- `rxMethod` wrapper for async operations
- `tapResponse` for error handling
- `patchState` for state updates

FORBIDDEN: Direct SDK calls, synchronous usage, missing error handling

## Query Design

- Select ONLY needed fields (no over-fetching)
- Use parameterized variables (no hardcoded values)
- Validate inputs before execution
