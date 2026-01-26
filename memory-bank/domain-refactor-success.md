# Copilot Memory Bank - Session Update 

## Structural Analysis - Domain Layer Refactor

### Event
- **Refactor**: "Zero Cognition" Rebuild of Domain Layer.
- **Pattern**: Transitioned from Feature-Based (Modules) to Technical-Based (Buckets).
- **Date**: 2026-01-26

### Changes
- **Directory Structure**:
  - `src/app/domain/modules/*` -> REMOVED.
  - `src/app/domain/core/*` -> REMOVED.
  - `src/app/domain/shared/*` -> REMOVED.
  - **New Roots**:
    - `src/app/domain/aggregates/`
    - `src/app/domain/entities/`
    - `src/app/domain/events/`
    - `src/app/domain/factories/`
    - `src/app/domain/policies/`
    - `src/app/domain/repositories/`
    - `src/app/domain/services/`
    - `src/app/domain/types/`
    - `src/app/domain/value-objects/`

- **Import Aliases (tsconfig.json)**:
  - `@domain/aggregates`
  - `@domain/entities`
  - `@domain/events`
  - ...and so on for each bucket.
  - **Constraint**: Always import from the specific bucket alias, not the general `@domain/*` if possible.

- **Naming Conventions Enforced**:
  - Repositories: Singular (e.g., `DocumentRepository`, not `DocumentsRepository`).
  - Files: Technical suffix mandatory (`.aggregate.ts`, `.repository.ts`).

### Active Constraints
- **Zero Cognition**: No "guessing" where a domain file lives. If it's an Aggregate, it lives in `aggregates/`.
- **Circular Imports**: Watch out for Aggr -> ValueObject -> Aggr loops. Use imports strictly: `Entity` depends on `ValueObject`, not vice-versa.
- **Strict Exports**: Each bucket must have an `index.ts` exporting *everything* public inside it.

## Verification
- `pnpm build` -> **PASS**.
- `tsconfig.json` -> Updated.

