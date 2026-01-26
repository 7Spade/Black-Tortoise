# Application Layer Convergence Report

## Objective
Harmonize the Application Layer (`src/app/application`) with the strict DDD and Repository Pattern established in the Domain and Infrastructure layers during the Auth and Workspace implementation phases.

## Changes Implemented

### 1. Repository Tokens
Created Injection Tokens for all Domain Repositories in `@application/interfaces` to enable Dependency Injection without linking to concrete Infrastructure implementations (Dependency Inversion Principle).

**New Tokens:**
- `TASK_REPOSITORY`
- `ISSUE_REPOSITORY`
- `ACCEPTANCE_REPOSITORY`
- `MEMBER_REPOSITORY`
- `DOCUMENT_REPOSITORY`
- `QUALITY_CONTROL_REPOSITORY`
- `SETTINGS_REPOSITORY`
- `DAILY_REPOSITORY`
- `OVERVIEW_REPOSITORY`
- `AUDIT_LOG_REPOSITORY`
- `PERMISSION_REPOSITORY`

### 2. Store Refactoring
Refactored key Application Stores to use these tokens instead of in-memory dummy logic. The stores now act as proper "Read Models" that sync with the Backend (via Repository) and state is managed via `NgRx Signals`.

**Refactored Stores:**
- `TasksStore` (`tasks.store.ts`)
  - Injects `TASK_REPOSITORY`.
  - Implements `loadByWorkspace` using `rxMethod`.
  - Implements `addTask`, `updateTask`, `deleteTask` using Repository `save`/`delete`.
  - Uses `WorkspaceId` Value Object for strict typing.
- `IssuesStore` (`issues.store.ts`)
  - Injects `ISSUE_REPOSITORY`.
  - Implements `loadByWorkspace`.
  - CRUD operations backed by Repository.
  - Strict Enum usage for Status/Priority.
- `AcceptanceStore` (`acceptance.store.ts`)
  - Injects `ACCEPTANCE_REPOSITORY`.
  - Updated to use `AcceptanceCheckEntity` Aggregate.
  - Implements `loadByWorkspace`.

### 3. Domain Interface Update
- Updated `AcceptanceRepository` to include `findByWorkspaceId` to support Application requirements.

## Convergence Status
The Application Layer is now architecturally "Converged". It relies on Domain Interfaces for data access and is ready to be connected to real Infrastructure implementations (Firestore) without further architectural changes.

## Next Steps
- Implement the concrete Repositories in `infrastructure/persistence`.
- Wire up the Dependency Injection in `app.config.ts`.
- Verify End-to-End flow.
