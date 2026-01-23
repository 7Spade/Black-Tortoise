---
goal: Refactor workspace-related code to proper DDD layers (domain/application/infrastructure/presentation)
version: 1.0
date_created: 2025-01-23
last_updated: 2025-01-23
owner: Architecture Team
status: 'Planned'
tags: ['refactor', 'architecture', 'ddd', 'workspace']
---

# Introduction

![Status: Planned](https://img.shields.io/badge/status-Planned-blue)

This plan provides a minimal-change, stepwise checklist to refactor workspace-related code into proper DDD layers. The goal is to eliminate duplication (WorkspaceEntity vs WorkspaceAggregate), consolidate workspace state in the application layer, and enforce proper layer boundaries while maintaining backward compatibility.

## 1. Requirements & Constraints

**Layer Boundaries:**
- **REQ-001**: Presentation layer must only import from Application layer (facades/stores)
- **REQ-002**: Application layer must only import from Domain layer
- **REQ-003**: Infrastructure layer implements Application/Domain interfaces
- **REQ-004**: Domain layer has zero dependencies on outer layers

**State Management:**
- **REQ-005**: Application layer (WorkspaceContextStore) must hold all workspace state
- **REQ-006**: Domain layer must be stateless (pure functions and interfaces)
- **REQ-007**: Use @ngrx/signals for reactive state management in Application layer

**Duplication Elimination:**
- **CON-001**: WorkspaceEntity and WorkspaceAggregate represent same concept with different shapes
- **CON-002**: Must consolidate to single source of truth in Domain layer
- **CON-003**: WorkspaceContext exists in both domain/workspace and application/stores

**Backward Compatibility:**
- **GUD-001**: All changes must maintain existing public APIs
- **GUD-002**: No breaking changes to component interfaces
- **GUD-003**: Incremental refactoring with working state after each phase

**Architecture Patterns:**
- **PAT-001**: Use functional domain model (pure functions over classes)
- **PAT-002**: Use dependency injection tokens for infrastructure dependencies
- **PAT-003**: Signal-based reactive programming (zone-less)
- **PAT-004**: Repository pattern for persistence abstractions

## 2. Implementation Steps

### Phase 1: Domain Layer Consolidation

**GOAL-001**: Consolidate WorkspaceEntity and WorkspaceAggregate into single domain model

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Review differences between `workspace.entity.ts` (has moduleIds, organizationDisplayName) and `workspace.aggregate.ts` (has WorkspaceId VO, isActive, version) | | |
| TASK-002 | Create unified `WorkspaceAggregate` interface in `domain/aggregates/workspace.aggregate.ts` with all fields: id (string), name, organizationId, organizationDisplayName, ownerId, ownerType, moduleIds, isActive, version, createdAt, updatedAt | | |
| TASK-003 | Update `domain/aggregates/workspace.aggregate.ts` factory function `createWorkspace()` to accept all required fields and return unified aggregate | | |
| TASK-004 | Mark `domain/workspace/workspace.entity.ts` as deprecated with @deprecated JSDoc comment pointing to WorkspaceAggregate | | |
| TASK-005 | Update `domain/value-objects/workspace-id.vo.ts` to be optional helper (not required in aggregate) | | |

### Phase 2: Application Layer Updates

**GOAL-002**: Update Application layer to use consolidated domain model and maintain state

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-006 | Update `application/workspace/create-workspace.use-case.ts` to import and use WorkspaceAggregate instead of WorkspaceEntity | | |
| TASK-007 | Update `application/workspace/switch-workspace.use-case.ts` to use WorkspaceAggregate | | |
| TASK-008 | Update `application/stores/workspace-context.store.ts` state interface to use WorkspaceAggregate type for currentWorkspace and availableWorkspaces | | |
| TASK-009 | Update `application/workspace/workspace.facade.ts` computed signals to work with WorkspaceAggregate | | |
| TASK-010 | Update `application/facades/workspace-host.facade.ts` to use WorkspaceAggregate | | |
| TASK-011 | Verify all Application layer files use WorkspaceAggregate instead of WorkspaceEntity | | |

### Phase 3: Remove Domain Workspace Context Duplication

**GOAL-003**: Eliminate WorkspaceContext from domain layer (state belongs in Application)

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-012 | Review usage of `domain/workspace/workspace-context.ts` - identify all imports | | |
| TASK-013 | Move workspace permissions logic from domain WorkspaceContext to application layer as separate concern (e.g., workspace-permissions.model.ts) | | |
| TASK-014 | Update `application/stores/workspace-context.store.ts` to include permissions in state if needed | | |
| TASK-015 | Mark `domain/workspace/workspace-context.ts` as deprecated | | |
| TASK-016 | Remove imports of domain WorkspaceContext from application layer files | | |

### Phase 4: Infrastructure Layer Alignment

**GOAL-004**: Ensure Infrastructure layer implements Application interfaces correctly

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-017 | Review `infrastructure/runtime/workspace-runtime.factory.ts` - ensure it uses WorkspaceAggregate type | | |
| TASK-018 | Update `application/interfaces/workspace-runtime-factory.interface.ts` to use WorkspaceAggregate in method signatures | | |
| TASK-019 | Update `application/tokens/workspace-runtime.token.ts` to reference correct interface | | |
| TASK-020 | Verify `infrastructure/runtime/workspace-runtime.factory.ts` implements updated interface | | |
| TASK-021 | If workspace repository exists in infrastructure, update to implement `domain/repositories/workspace.repository.ts` interface with WorkspaceAggregate | | |

### Phase 5: Presentation Layer Cleanup

**GOAL-005**: Ensure Presentation layer only imports from Application layer

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-022 | Scan all files in `presentation/workspace/` for any @domain imports | | |
| TASK-023 | Scan all files in `presentation/containers/workspace-host/` for any @domain imports | | |
| TASK-024 | Scan all files in `presentation/shared/components/workspace-switcher/` for any @domain imports | | |
| TASK-025 | Replace any direct domain imports with facade/store usage from @application | | |
| TASK-026 | Update component types to use facade-exposed signals instead of domain types | | |

### Phase 6: Remove Deprecated Files

**GOAL-006**: Clean up deprecated domain files after migration complete

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-027 | Verify zero imports of `domain/workspace/workspace.entity.ts` across codebase | | |
| TASK-028 | Verify zero imports of `domain/workspace/workspace-context.ts` across codebase | | |
| TASK-029 | Delete `src/app/domain/workspace/workspace.entity.ts` | | |
| TASK-030 | Delete `src/app/domain/workspace/workspace-context.ts` | | |
| TASK-031 | Update `domain/workspace/index.ts` barrel export to remove deleted files | | |

### Phase 7: Verification & Testing

**GOAL-007**: Ensure refactoring maintains functionality and layer boundaries

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-032 | Run build: `npm run build` - verify zero TypeScript errors | | |
| TASK-033 | Run linter: `npm run lint` - verify zero violations | | |
| TASK-034 | Run architectural boundary check script if available | | |
| TASK-035 | Manually test workspace creation via UI | | |
| TASK-036 | Manually test workspace switching via UI | | |
| TASK-037 | Verify workspace state persists across navigation | | |
| TASK-038 | Run unit tests: `npm run test` (if tests exist) | | |

## 3. Alternatives

- **ALT-001**: Keep both WorkspaceEntity and WorkspaceAggregate and use mapper functions - Rejected because it adds unnecessary complexity and maintains duplication
- **ALT-002**: Create separate read/write models (CQRS) - Rejected as overkill for current requirements; can be added later if needed
- **ALT-003**: Move all state to services instead of @ngrx/signals store - Rejected because signals provide better reactivity and align with Angular 20+ patterns

## 4. Dependencies

- **DEP-001**: @ngrx/signals library (already in use for WorkspaceContextStore)
- **DEP-002**: Angular 20+ dependency injection with inject() function
- **DEP-003**: TypeScript path aliases (@domain, @application, @infrastructure, @presentation)
- **DEP-004**: No new external dependencies required

## 5. Files

**Domain Layer:**
- **FILE-001**: `src/app/domain/aggregates/workspace.aggregate.ts` - Update to unified model
- **FILE-002**: `src/app/domain/workspace/workspace.entity.ts` - Deprecate then delete
- **FILE-003**: `src/app/domain/workspace/workspace-context.ts` - Deprecate then delete
- **FILE-004**: `src/app/domain/repositories/workspace.repository.ts` - Update signatures to WorkspaceAggregate
- **FILE-005**: `src/app/domain/services/workspace-domain.service.ts` - Update to use WorkspaceAggregate

**Application Layer:**
- **FILE-006**: `src/app/application/stores/workspace-context.store.ts` - Update state types
- **FILE-007**: `src/app/application/workspace/create-workspace.use-case.ts` - Update imports
- **FILE-008**: `src/app/application/workspace/switch-workspace.use-case.ts` - Update imports
- **FILE-009**: `src/app/application/workspace/workspace.facade.ts` - Update computed signals
- **FILE-010**: `src/app/application/facades/workspace-host.facade.ts` - Update types
- **FILE-011**: `src/app/application/interfaces/workspace-runtime-factory.interface.ts` - Update signatures
- **FILE-012**: `src/app/application/models/workspace-permissions.model.ts` - Create new file for permissions

**Infrastructure Layer:**
- **FILE-013**: `src/app/infrastructure/runtime/workspace-runtime.factory.ts` - Update to use WorkspaceAggregate

**Presentation Layer:**
- **FILE-014**: `src/app/presentation/workspace/components/*.ts` - Verify no domain imports
- **FILE-015**: `src/app/presentation/workspace/dialogs/*.ts` - Verify no domain imports
- **FILE-016**: `src/app/presentation/containers/workspace-host/*.ts` - Verify no domain imports
- **FILE-017**: `src/app/presentation/shared/components/workspace-switcher/*.ts` - Verify no domain imports

## 6. Testing

- **TEST-001**: Unit test WorkspaceAggregate factory functions with all fields
- **TEST-002**: Unit test WorkspaceContextStore state transitions
- **TEST-003**: Unit test CreateWorkspaceUseCase with new aggregate
- **TEST-004**: Unit test SwitchWorkspaceUseCase with new aggregate
- **TEST-005**: Integration test workspace creation flow (facade → use case → store)
- **TEST-006**: Integration test workspace switching flow
- **TEST-007**: Component test workspace switcher with mocked facade
- **TEST-008**: Component test workspace create dialog with mocked facade

## 7. Risks & Assumptions

**Risks:**
- **RISK-001**: Breaking changes if WorkspaceEntity is used in persistence layer - Mitigation: Check all repository implementations first
- **RISK-002**: Type incompatibilities during migration may cause build failures - Mitigation: Incremental approach, one file at a time
- **RISK-003**: Loss of workspace context data if state shape changes - Mitigation: Careful mapping of all fields during consolidation

**Assumptions:**
- **ASSUMPTION-001**: WorkspaceEntity and WorkspaceAggregate can be safely merged without data loss
- **ASSUMPTION-002**: No external APIs depend on WorkspaceEntity shape
- **ASSUMPTION-003**: Workspace runtime factory can work with consolidated type
- **ASSUMPTION-004**: All presentation components already use facades (no direct domain access)

## 8. Related Specifications / Further Reading

- [QUICK_START_DDD.md](../QUICK_START_DDD.md) - DDD layer boundaries and import rules
- [DDD_ARCHITECTURE_AUDIT_EXECUTIVE_SUMMARY.md](../DDD_ARCHITECTURE_AUDIT_EXECUTIVE_SUMMARY.md) - Architecture audit findings
- [integrated-system-spec.md](../integrated-system-spec.md) - Workspace semantic rules
- [Angular Signals Documentation](https://angular.dev/guide/signals) - Signal-based state management
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html) - DDD principles by Martin Fowler
