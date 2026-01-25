# Architecture Lock Implementation - PR Comment 3796307372

## Overview

This document describes the ESLint-based architecture lock implementation that enforces event-sourced DDD architecture boundaries and state mutation control across the Black-Tortoise workspace.

## Implementation Date

January 25, 2025

## Changes Summary

### 1. ESLint Configuration Enhancement (`eslint.config.js`)

The ESLint configuration has been updated to enforce strict architectural boundaries per PR Comment 3796307372.

#### Architecture Rules Enforced

**Presentation Layer** (`src/app/presentation/`)
- ✅ No imports of EventBus/EventStore/PublishEventUseCase internals
- ✅ No direct calls to `publish()`, `append()`, `publishBatch()`, or `appendBatch()` APIs
- ✅ No state mutation APIs (`patchState`, `Store.set`, `Store.update`) except in test files
- ✅ Use Application facades, stores (read-only), or IModuleEventBus for event communication
- ✅ No Domain or Infrastructure imports (use Application layer as facade)
- ✅ Test files allowed to import RxJS for mocking Angular Material components

**Application Layer** (`src/app/application/`)
- ✅ Can create domain events but must not mutate presentation stores directly
- ✅ Stores (`*.store.ts`) can define mutation methods using `patchState`/`set`/`update`
- ✅ Store mutation methods should ONLY be called from `*.event-handlers.ts` or `*.projection.ts`
- ✅ Other application files must not call `patchState`/`set`/`update` directly
- ✅ No Infrastructure or Presentation imports
- ✅ Orchestrates Domain via use cases and facades

**Domain Layer** (`src/app/domain/`)
- ✅ No framework imports (Angular/NgRx/RxJS)
- ✅ No Application/Infrastructure/Presentation imports
- ✅ Pure TypeScript domain logic only
- ⚠️ DomainEvent must have `correlationId` and `causationId` (nullable only for root events)
  - NOTE: Cannot be fully automated with current ESLint - relies on TypeScript interface + manual review

**Infrastructure Layer** (`src/app/infrastructure/`)
- ✅ No Presentation imports
- ✅ Can import Application interfaces for dependency inversion pattern
- ✅ No imports of Application use cases, facades, or stores
- ✅ Adapters implement Domain interfaces only

**Shared Layer** (`src/app/shared/`)
- ✅ No Domain/Application/Infrastructure/Presentation imports
- ✅ Framework-agnostic and dependency-free

### 2. Application Layer Index File (`src/app/application/tasks/index.ts`)

**Created**: Public API barrel export for the tasks feature module

**Purpose**: 
- Re-export domain types for Presentation layer (DDD boundary compliance)
- Prevent Presentation from directly importing Domain types
- Application acts as a facade between Presentation and Domain

**Exports**:
```typescript
// Store
export { TasksStore } from './stores/tasks.store';
export type { TasksState } from './stores/tasks.store';

// Use Cases
export { CreateTaskUseCase } from './use-cases/create-task.use-case';
export { SubmitTaskForQCUseCase } from './use-cases/submit-task-for-qc.use-case';

// Event Handlers
export { registerTasksEventHandlers } from './handlers/tasks.event-handlers';

// Domain types re-exported for Presentation layer
export type { TaskEntity, TaskStatus, TaskPriority } from '@domain/task/task.entity';
export { createTask, updateTaskStatus } from '@domain/task/task.entity';
```

### 3. Presentation Component Update (`src/app/presentation/containers/workspace-modules/tasks.module.ts`)

**Changed**: Updated imports to use Application layer facade instead of direct Domain imports

**Before**:
```typescript
import { createTask, TaskEntity, TaskPriority, TaskStatus } from '@domain/task/task.entity';
```

**After**:
```typescript
import { TasksStore, TaskEntity, TaskPriority, TaskStatus, createTask } from '@application/tasks';
```

**Benefit**: Presentation now depends on Application layer only, maintaining proper DDD boundaries

### 4. Package Configuration (`package.json`)

**Added**: `"type": "module"` to package.json

**Purpose**: Eliminate Node.js warning about module type detection for ESLint config file

## Architecture Lock Rules Reference

### ESLint Rules Applied

| Rule Type | Files | Purpose |
|-----------|-------|---------|
| `no-restricted-imports` | All layers | Enforce DDD layer boundaries |
| `no-restricted-syntax` | Presentation | Prevent direct event bus/store API calls |
| `no-restricted-syntax` | Application (non-stores/handlers) | Prevent direct state mutations outside event handlers |

### File Patterns

| Pattern | Purpose |
|---------|---------|
| `**/*.event-handlers.ts` | Event handler files - allowed to mutate state |
| `**/*.projection.ts` | Projection files - allowed to mutate state |
| `**/*.store.ts` | Store definition files - allowed to define mutation methods |
| `**/*.spec.ts` | Test files - allowed RxJS imports for Angular Material mocking |

## Validation

### ESLint Check
```bash
npm run lint
```

**Status**: ✅ Passing (0 errors, 0 warnings)

### Before/After Comparison

**Before Implementation**:
- 107 ESLint errors (architecture violations)
- Direct Domain imports in Presentation
- Infrastructure importing Application concrete types
- RxJS in Presentation test files flagged as error

**After Implementation**:
- 0 ESLint errors
- Clean DDD layer boundaries
- Application facade pattern enforced
- Test files properly configured

## Limitations and Alternatives

### DomainEvent correlationId/causationId Enforcement

**Requirement**: All DomainEvent creators must include `correlationId` and `causationId` (nullable only for root events)

**Current Status**: ⚠️ **Cannot be fully automated with ESLint**

**Why**: ESLint operates on AST patterns and cannot validate function parameter requirements at call sites with sufficient accuracy.

**Current Enforcement**:
1. TypeScript interface requires these fields (compile-time check)
2. Manual code review required
3. Comment added to ESLint config documenting limitation

**Alternatives for Full Automation**:
1. Custom TypeScript compiler plugin
2. Custom AST-based linter (e.g., using ts-morph)
3. Runtime validation in event factory functions
4. CI/CD integration test that validates event creation patterns

**Recommendation**: Accept TypeScript interface + manual review as sufficient for now. Consider custom tooling if violations become frequent.

## Migration Guide

### For Existing Components

If you have a Presentation component that imports Domain types:

1. **Create Application layer barrel export** (`src/app/application/<feature>/index.ts`)
   ```typescript
   // Re-export domain types
   export type { MyEntity } from '@domain/my-feature/my.entity';
   export { createMyEntity } from '@domain/my-feature/my.entity';
   ```

2. **Update Presentation imports**
   ```typescript
   // Before
   import { MyEntity } from '@domain/my-feature/my.entity';
   
   // After
   import { MyEntity } from '@application/my-feature';
   ```

3. **Run ESLint to verify**
   ```bash
   npm run lint
   ```

### For New Features

1. Always create an Application layer barrel export (`index.ts`)
2. Presentation imports from `@application/<feature>` only
3. Never import from `@domain` or `@infrastructure` in Presentation
4. Store mutations only in `*.event-handlers.ts` or `*.projection.ts`

## Enforcement

- **Error Level**: All violations are ESLint **errors** (not warnings)
- **CI/CD**: ESLint runs as part of `npm run lint` and should be in CI pipeline
- **Per-file Disables**: Discouraged for architecture rules (requires review)

## References

- PR Comment: 3796307372
- DDD Layer Boundaries: memory-bank/2.jsonl
- Signals Architecture: memory-bank/3.jsonl

## Maintainers

- ESLint configuration: `/eslint.config.js`
- Architecture documentation: `/ARCHITECTURE_LOCK_IMPLEMENTATION.md` (this file)

---

**Document Version**: 1.0  
**Last Updated**: January 25, 2025
