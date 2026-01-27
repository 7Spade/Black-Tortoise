<!-- markdownlint-disable-file -->

# Task Details: Permissions Module Implementation

## Research Reference

**Source Research**: #file:../research/20260127-permissions-module-architecture-research.md

## Phase 1: Domain Layer Consolidation

### Task 1.1: Consolidate duplicate role entities into single aggregate

Merge `role-definition.aggregate.ts` and `role.entity.ts` into a unified `role.aggregate.ts` following DDD aggregate root pattern with domain events.

- **Files**:
  - src/app/domain/aggregates/role.aggregate.ts - NEW unified aggregate (replaces both existing files)
  - src/app/domain/aggregates/role-definition.aggregate.ts - DELETE after migration
  - src/app/domain/aggregates/role.entity.ts - DELETE after migration
  - src/app/domain/value-objects/role-metadata.vo.ts - NEW value object for metadata
  - src/app/domain/events/role-created.event.ts - NEW domain event
  - src/app/domain/events/role-updated.event.ts - NEW domain event
  - src/app/domain/events/role-deleted.event.ts - NEW domain event
- **Success**:
  - Single role aggregate with private constructor and static create/reconstruct methods
  - Domain events generated for create/update/delete operations
  - Permissions stored as Set<string> for efficient lookups
  - Metadata encapsulated in value object
  - All existing usages migrated to new aggregate
- **Research References**:
  - #file:../research/20260127-permissions-module-architecture-research.md (Lines 170-210) - Domain layer aggregate pattern
  - #file:../research/20260127-permissions-module-architecture-research.md (Lines 253-255) - Event generation requirements
- **Dependencies**:
  - None (foundation task)

### Task 1.2: Implement RoleFactory with policy enforcement

Create factory to enforce business rules during role creation, separating creation logic from aggregate.

- **Files**:
  - src/app/domain/factories/role.factory.ts - NEW factory class
- **Success**:
  - Factory enforces RoleNamingPolicy before creating roles
  - Factory enforces PermissionPolicy for permission sets
  - Static createCustomRole method for user-defined roles
  - Static createSystemRole method for predefined roles (Owner, Admin, Member, Viewer)
  - Clear error messages on policy violations
- **Research References**:
  - #file:../research/20260127-permissions-module-architecture-research.md (Lines 297-317) - Factory pattern implementation
  - docs/modulars/01-permissions-權限模組.md (Lines 42-52) - Custom role requirements
- **Dependencies**:
  - Task 1.1 completion (role aggregate)
  - Task 1.3 completion (naming policy)
  - Task 1.4 completion (permission policy)

### Task 1.3: Enhance RoleNamingPolicy with complete validation

Enhance existing permission-validation.policy.ts or create new role-naming.policy.ts with full specification compliance.

- **Files**:
  - src/app/domain/policies/role-naming.policy.ts - NEW policy class
- **Success**:
  - MIN_LENGTH = 3, MAX_LENGTH = 30 constants
  - RESERVED_NAMES = ['owner', 'admin', 'member', 'viewer'] constant
  - isSatisfiedBy(name: string): boolean method
  - assertIsValid(name: string): void method with clear error messages
  - Trim whitespace before validation
  - Case-insensitive reserved name checking
- **Research References**:
  - #file:../research/20260127-permissions-module-architecture-research.md (Lines 320-346) - Policy pattern implementation
  - docs/modulars/01-permissions-權限模組.md (Lines 43-45) - Naming rules specification
- **Dependencies**:
  - None (pure domain logic)

### Task 1.4: Create PermissionPolicy for granular permission validation

Create policy to validate permission strings match the resource:action format and contain valid actions.

- **Files**:
  - src/app/domain/policies/permission.policy.ts - NEW policy class
- **Success**:
  - Validates permission format matches "resource:action" pattern
  - Validates action is one of: read, create, update, delete, admin
  - Validates resource is non-empty string
  - assertValidPermissions(permissions: string[]): void method
  - isValidPermission(permission: string): boolean method
  - Clear error messages for invalid formats
- **Research References**:
  - #file:../research/20260127-permissions-module-architecture-research.md (Lines 293-307) - Permission validation requirements
  - docs/modulars/01-permissions-權限模組.md (Lines 28-30) - Permission format specification
- **Dependencies**:
  - None (pure domain logic)

## Phase 2: Application Layer Enhancement

### Task 2.1: Create PermissionContextProvider (abstract + implementation)

Implement context provider pattern for cross-module permission queries without tight coupling.

- **Files**:
  - src/app/application/providers/permission-context.provider.ts - NEW abstract class
  - src/app/application/providers/permission-context-provider.impl.ts - NEW implementation
  - src/app/application/providers/index.ts - Export barrel for providers (if following pattern)
- **Success**:
  - Abstract class defines: hasPermission(userId, permission), getUserRole(userId), getRolePermissions(roleId)
  - Implementation injects PermissionsStore and provides query methods
  - No direct store exposure to consuming modules
  - Type-safe return values
  - Null-safe handling for missing data
- **Research References**:
  - #file:../research/20260127-permissions-module-architecture-research.md (Lines 258-288) - Context provider pattern
  - docs/modulars/01-permissions-權限模組.md (Lines 154-161) - Provider specification
- **Dependencies**:
  - PermissionsStore exists and has computed selectors

### Task 2.2: Create mapper classes for DTO and Firestore conversions

Implement mappers to separate domain entities from DTOs and Firestore documents.

- **Files**:
  - src/app/application/mappers/role-to-dto.mapper.ts - NEW application layer mapper
  - src/app/infrastructure/mappers/role-firestore.mapper.ts - NEW infrastructure layer mapper
  - src/app/application/dtos/role.dto.ts - NEW DTO interface
  - src/app/infrastructure/models/firestore-role.document.ts - NEW Firestore document interface
- **Success**:
  - RoleToDtoMapper.toDto(entity: RoleAggregate): RoleDto converts domain to DTO
  - RoleToDtoMapper.fromDto(dto: RoleDto): RoleAggregate converts DTO to domain
  - RoleFirestoreMapper.toDomain(doc: FirestoreRoleDocument): RoleAggregate for reading
  - RoleFirestoreMapper.toFirestore(entity: RoleAggregate): FirestoreRoleDocument for writing
  - Proper handling of Set<string> permissions to/from arrays
  - Date conversions handled correctly
  - Type safety enforced (no any/unknown)
- **Research References**:
  - #file:../research/20260127-permissions-module-architecture-research.md (Lines 349-394) - Mapper pattern implementation
  - docs/modulars/01-permissions-權限模組.md (Lines 349-394) - Specification for mappers
- **Dependencies**:
  - Task 1.1 completion (consolidated role aggregate)

### Task 2.3: Enhance PermissionsStore with event bus integration

Add event bus injection, event publishing for mutations, and event subscription for workspace switches.

- **Files**:
  - src/app/application/stores/permissions.store.ts - MODIFY existing store
- **Success**:
  - Inject WorkspaceEventBus in withMethods
  - Inject WorkspaceContextProvider in withMethods
  - grantPermission method publishes PermissionChanged event with correlationId
  - revokePermission method publishes PermissionChanged event with correlationId
  - withHooks.onInit subscribes to WorkspaceSwitched event
  - WorkspaceSwitched handler calls reset() to clear state
  - All events include correlationId (generate if not provided)
  - Event payloads are pure data (no functions/services/UI references)
- **Research References**:
  - #file:../research/20260127-permissions-module-architecture-research.md (Lines 131-164) - Event bus integration pattern
  - docs/modulars/01-permissions-權限模組.md (Lines 182-217) - Event integration specification
- **Dependencies**:
  - WorkspaceEventBus interface and implementation exists
  - WorkspaceContextProvider exists

### Task 2.4: Create InjectionToken for repository dependency injection

Create proper Angular dependency injection token for repository interface to enable loose coupling.

- **Files**:
  - src/app/application/ports/role-repository.port.ts - NEW interface definition
  - src/app/application/tokens/role-repository.token.ts - NEW injection token
- **Success**:
  - IRoleRepository interface defines: findById, save, findByWorkspaceId, delete methods
  - ROLE_REPOSITORY_TOKEN created with InjectionToken<IRoleRepository>
  - Token includes descriptive name for debugging
  - Repository methods return Promises with proper domain entities
  - Type safety enforced with generic constraints
- **Research References**:
  - #file:../research/20260127-permissions-module-architecture-research.md (Lines 397-411) - Repository interface pattern
  - docs/modulars/01-permissions-權限模組.md (Lines 397-411) - Dependency inversion specification
- **Dependencies**:
  - Task 1.1 completion (role aggregate)

## Phase 3: Infrastructure Layer Enhancement

### Task 3.1: Enhance repository to use consolidated role aggregate

Update existing permission.repository.impl.ts to use new role aggregate and mappers.

- **Files**:
  - src/app/infrastructure/repositories/permission.repository.impl.ts - MODIFY existing repository
- **Success**:
  - Implements IRoleRepository interface
  - Uses RoleFirestoreMapper for all conversions
  - findById returns RoleAggregate | null
  - save uses RoleFirestoreMapper.toFirestore for persistence
  - findByWorkspaceId filters by workspaceId and returns array of RoleAggregate
  - delete removes document by ID
  - Proper error handling for Firestore operations
  - No direct use of any/unknown types
- **Research References**:
  - #file:../research/20260127-permissions-module-architecture-research.md (Lines 413-436) - Repository implementation pattern
  - docs/modulars/01-permissions-權限模組.md (Lines 413-436) - Infrastructure layer specification
- **Dependencies**:
  - Task 1.1 completion (role aggregate)
  - Task 2.2 completion (mappers)
  - Task 2.4 completion (repository interface)

### Task 3.2: Add proper domain event handling in repository

Implement domain event collection and dispatch after successful Firestore operations.

- **Files**:
  - src/app/infrastructure/repositories/permission.repository.impl.ts - MODIFY existing repository
  - src/app/infrastructure/event-dispatchers/domain-event.dispatcher.ts - NEW if doesn't exist
- **Success**:
  - Repository collects domain events from aggregates after save
  - Events dispatched to WorkspaceEventBus after successful Firestore commit
  - Events cleared from aggregate after dispatch
  - Transactional consistency (events only dispatched on success)
  - correlationId preserved through event chain
- **Research References**:
  - #file:../research/20260127-permissions-module-architecture-research.md (Lines 170-210) - Domain event pattern
  - docs/workspace-modular-architecture.constitution.md - Event flow: Append → Publish → React
- **Dependencies**:
  - Task 3.1 completion (enhanced repository)
  - WorkspaceEventBus exists

## Phase 4: Presentation Layer - Permission Matrix UI

### Task 4.1: Create permission matrix component with Material table

Build 2D permission matrix UI showing roles (rows) and resources/actions (columns).

- **Files**:
  - src/app/presentation/components/permission-matrix/permission-matrix.component.ts - NEW component
  - src/app/presentation/components/permission-matrix/permission-matrix.component.html - NEW template
  - src/app/presentation/components/permission-matrix/permission-matrix.component.scss - NEW styles
- **Success**:
  - Uses mat-table with displayedColumns for resources/actions
  - Rows generated from PermissionsStore.roles() signal
  - Cells display mat-checkbox for permission toggles
  - ChangeDetectionStrategy.OnPush for performance
  - Modern template syntax (@for with track, @if)
  - Injects PermissionsStore for data
  - Responsive layout for different screen sizes
- **Research References**:
  - #file:../research/20260127-permissions-module-architecture-research.md (Lines 293-307) - Permission matrix requirements
  - docs/modulars/01-permissions-權限模組.md (Lines 25-38) - Matrix specification
- **Dependencies**:
  - PermissionsStore with computed signals
  - @angular/material installed

### Task 4.2: Implement sticky headers for matrix navigation

Add CSS-based sticky positioning for table headers to maintain visibility during scroll.

- **Files**:
  - src/app/presentation/components/permission-matrix/permission-matrix.component.scss - MODIFY styles
  - src/app/presentation/components/permission-matrix/permission-matrix.component.html - MODIFY template
- **Success**:
  - mat-header-row has position: sticky with appropriate top value
  - First column (role names) has position: sticky with appropriate left value
  - z-index layering ensures headers overlap correctly
  - Scrollable container with defined max-height
  - Headers remain visible during vertical and horizontal scroll
  - Styling consistent with Material M3 design
- **Research References**:
  - #file:../research/20260127-permissions-module-architecture-research.md (Lines 293-307) - Sticky header requirement
  - docs/modulars/01-permissions-權限模組.md (Lines 33) - Matrix UI specification
- **Dependencies**:
  - Task 4.1 completion (matrix component)

### Task 4.3: Add mat-checkbox cells with optimistic updates

Implement checkbox binding to permission state with optimistic UI updates.

- **Files**:
  - src/app/presentation/components/permission-matrix/permission-matrix.component.ts - MODIFY component logic
  - src/app/presentation/components/permission-matrix/permission-matrix.component.html - MODIFY template
- **Success**:
  - Each cell checkbox bound to computed signal checking permission existence
  - Checkbox change handler calls store.grantPermission or store.revokePermission
  - Optimistic update: UI changes immediately before backend confirmation
  - Error handling with rollback on failure
  - Loading state visual feedback during backend save
  - Disabled state for system roles (Owner cannot be modified)
- **Research References**:
  - #file:../research/20260127-permissions-module-architecture-research.md (Lines 34, 114-130) - Optimistic update pattern
  - docs/modulars/01-permissions-權限模組.md (Lines 34) - Optimistic UI requirement
- **Dependencies**:
  - Task 4.1 completion (matrix component)
  - Task 2.3 completion (enhanced store)

### Task 4.4: Implement batch permission operations

Add multi-selection capability for bulk permission grant/revoke operations.

- **Files**:
  - src/app/presentation/components/permission-matrix/permission-matrix.component.ts - MODIFY component logic
  - src/app/presentation/components/permission-matrix/permission-matrix.component.html - MODIFY template
  - src/app/application/stores/permissions.store.ts - MODIFY store (add bulk methods)
- **Success**:
  - Selection model for multi-role selection (mat-checkbox in header)
  - Batch toolbar appears when roles selected
  - "Grant to Selected" button grants permission to all selected roles
  - "Revoke from Selected" button revokes permission from all selected roles
  - Single optimistic update for entire batch
  - Single event published with batch metadata
  - Clear selection after operation completes
- **Research References**:
  - #file:../research/20260127-permissions-module-architecture-research.md (Lines 35-36) - Batch operations requirement
  - docs/modulars/01-permissions-權限模組.md (Lines 35-36) - Batch operation specification
- **Dependencies**:
  - Task 4.3 completion (checkbox implementation)

## Phase 5: Presentation Layer - Role Management UI

### Task 5.1: Create custom role creation/editing dialog

Build Material dialog for creating and editing custom roles with form validation.

- **Files**:
  - src/app/presentation/dialogs/role-edit/role-edit.dialog.ts - NEW dialog component
  - src/app/presentation/dialogs/role-edit/role-edit.dialog.html - NEW template
  - src/app/presentation/dialogs/role-edit/role-edit.dialog.scss - NEW styles
- **Success**:
  - MatDialog implementation with MAT_DIALOG_DATA injection
  - Form fields: name (required), description (optional), permissions (multi-select)
  - Real-time validation using RoleNamingPolicy
  - Color picker for role marker (mat-menu with color swatches)
  - Permission multi-select with grouped options (by resource)
  - Submit disabled until form valid
  - Cancel and Save actions with confirmation
  - Modern reactive forms with signals
- **Research References**:
  - #file:../research/20260127-permissions-module-architecture-research.md (Lines 42-52) - Custom role requirements
  - docs/modulars/01-permissions-權限模組.md (Lines 42-52) - Role creation specification
- **Dependencies**:
  - Task 1.3 completion (naming policy)
  - @angular/material dialog module

### Task 5.2: Implement role templates (PM, Developer, Tester, Guest)

Add pre-configured role templates for common use cases.

- **Files**:
  - src/app/domain/templates/role.templates.ts - NEW template definitions
  - src/app/presentation/dialogs/role-edit/role-edit.dialog.ts - MODIFY to add template selection
  - src/app/presentation/dialogs/role-edit/role-edit.dialog.html - MODIFY template
- **Success**:
  - Role template constants with predefined permissions:
    - Project Manager: tasks:*, qc:approve, reports:read
    - Developer: tasks:create/read/update, code:*, qc:submit
    - Tester: tasks:read, qc:*, bugs:create
    - Guest: tasks:read, reports:read
  - Template selector dropdown in dialog
  - Selecting template pre-fills form with template values
  - User can modify template values before saving
  - Clear indication that it's starting from a template
- **Research References**:
  - #file:../research/20260127-permissions-module-architecture-research.md (Lines 44) - Template requirement
  - docs/modulars/01-permissions-權限模組.md (Lines 44) - Role template specification
- **Dependencies**:
  - Task 5.1 completion (role dialog)

### Task 5.3: Add role validation with real-time feedback

Implement live validation feedback as user types in role creation form.

- **Files**:
  - src/app/presentation/dialogs/role-edit/role-edit.dialog.ts - MODIFY validation logic
  - src/app/presentation/dialogs/role-edit/role-edit.dialog.html - MODIFY template
- **Success**:
  - Name field shows validation errors in real-time
  - Error messages: "Too short (min 3)", "Too long (max 30)", "Reserved name"
  - mat-error elements display below invalid fields
  - Visual indicators (red border) for invalid fields
  - Check for duplicate names against existing roles
  - Debounced validation to avoid excessive checking
  - Accessibility: error announcements via LiveAnnouncer
- **Research References**:
  - #file:../research/20260127-permissions-module-architecture-research.md (Lines 43-45) - Naming validation requirements
  - docs/modulars/01-permissions-權限模組.md (Lines 43-45) - Validation rules
- **Dependencies**:
  - Task 5.1 completion (role dialog)
  - Task 1.3 completion (naming policy)

### Task 5.4: Implement role deletion with safety checks

Add role deletion capability with protections for system roles and owner requirement.

- **Files**:
  - src/app/presentation/dialogs/role-delete-confirmation/role-delete-confirmation.dialog.ts - NEW dialog
  - src/app/presentation/components/permission-matrix/permission-matrix.component.ts - MODIFY to add delete action
  - src/app/application/stores/permissions.store.ts - MODIFY to add deleteRole method
- **Success**:
  - Delete button appears for custom roles only (not system roles)
  - Confirmation dialog shows role name and impact (members with this role)
  - Cannot delete Owner role (system protection)
  - Cannot delete last Owner role in workspace (policy check)
  - Success: role removed from store and Firestore
  - Event published: RoleDeleted with correlationId
  - Members with deleted role reassigned to default (Member) role
- **Research References**:
  - #file:../research/20260127-permissions-module-architecture-research.md (Lines 46-48) - Role deletion requirements
  - docs/modulars/01-permissions-權限模組.md (Lines 46-48) - Deletion safety specification
- **Dependencies**:
  - Task 5.1 completion (role dialog)
  - Task 2.3 completion (event integration)

## Phase 6: Testing and Optimization

### Task 6.1: Write unit tests for domain layer

Create comprehensive unit tests for domain entities, factories, and policies.

- **Files**:
  - src/app/domain/aggregates/role.aggregate.spec.ts - NEW test suite
  - src/app/domain/factories/role.factory.spec.ts - NEW test suite
  - src/app/domain/policies/role-naming.policy.spec.ts - NEW test suite
  - src/app/domain/policies/permission.policy.spec.ts - NEW test suite
- **Success**:
  - RoleAggregate tests: create generates events, reconstruct doesn't, permissions are immutable
  - RoleFactory tests: enforces naming policy, enforces permission policy, creates with metadata
  - RoleNamingPolicy tests: validates length (3-30), rejects reserved names, trims whitespace
  - PermissionPolicy tests: validates format (resource:action), validates actions, rejects invalid
  - All tests use AAA pattern (Arrange-Act-Assert)
  - No mocking of pure functions
  - 100% code coverage for policies
- **Research References**:
  - #file:../research/20260127-permissions-module-architecture-research.md (Lines 114-122) - Unit testing requirements
  - docs/modulars/01-permissions-權限模組.md (Lines 114-122) - Testing strategy
- **Dependencies**:
  - Phase 1 completion (domain layer)

### Task 6.2: Write integration tests for event flow

Create integration tests validating event publish/subscribe contracts.

- **Files**:
  - src/app/application/stores/permissions.store.spec.ts - NEW test suite
  - src/app/infrastructure/repositories/permission.repository.impl.spec.ts - NEW test suite
- **Success**:
  - PermissionsStore tests:
    - Given initial state, When grantPermission, Then PermissionChanged event published
    - Given roles loaded, When WorkspaceSwitched event, Then state reset
    - Given error state, When retry, Then loading state correct
  - Repository tests:
    - Given aggregate with events, When save, Then events dispatched after commit
    - Given Firestore error, When save, Then events not dispatched
  - Use TestBed for Angular DI
  - Mock WorkspaceEventBus for event verification
  - Given-When-Then pattern for clarity
- **Research References**:
  - #file:../research/20260127-permissions-module-architecture-research.md (Lines 119-122) - Integration testing requirements
  - docs/modulars/01-permissions-權限模組.md (Lines 119-122) - Event testing specification
- **Dependencies**:
  - Phase 2 completion (application layer)
  - Phase 3 completion (infrastructure layer)

### Task 6.3: Implement E2E tests for critical user flows

Create Playwright E2E tests for end-to-end user scenarios.

- **Files**:
  - e2e/permissions/create-role.spec.ts - NEW E2E test
  - e2e/permissions/grant-permission.spec.ts - NEW E2E test
  - e2e/permissions/workspace-switch.spec.ts - NEW E2E test
  - e2e/permissions/batch-operations.spec.ts - NEW E2E test
- **Success**:
  - Create role test: open dialog, fill form, save, verify role appears in matrix
  - Grant permission test: click checkbox, verify optimistic update, verify persistence
  - Workspace switch test: switch workspace, verify permissions cleared, verify reload
  - Batch operations test: select roles, grant permission, verify all updated
  - Verify Optimistic UI rollback on error (simulate network failure)
  - Test accessibility features (keyboard navigation, screen reader)
  - All tests run in headless mode for CI/CD
- **Research References**:
  - #file:../research/20260127-permissions-module-architecture-research.md (Lines 124-127) - E2E testing requirements
  - docs/modulars/01-permissions-權限模組.md (Lines 124-127) - E2E specification
- **Dependencies**:
  - Phase 4 completion (UI components)
  - Phase 5 completion (role management)

### Task 6.4: Apply performance optimizations (zone-less, OnPush, @defer)

Optimize components for maximum performance with modern Angular techniques.

- **Files**:
  - src/app/presentation/components/permission-matrix/permission-matrix.component.ts - MODIFY optimization
  - src/app/presentation/dialogs/role-edit/role-edit.dialog.ts - MODIFY optimization
  - src/app/presentation/pages/modules/permissions/permissions.component.ts - MODIFY optimization
- **Success**:
  - All components use ChangeDetectionStrategy.OnPush
  - Zone-less change detection enabled (provideExperimentalZonelessChangeDetection)
  - Heavy matrix view wrapped in @defer (on viewport)
  - Role dialog wrapped in @defer (on interaction)
  - Virtual scrolling for large role lists (>50 roles) with @angular/cdk/scrolling
  - Trackby functions for all @for loops (role.roleId)
  - Computed signals for all derived state (no getter functions)
  - Performance targets met: LCP < 2.5s, INP < 200ms, CLS < 0.1
- **Research References**:
  - #file:../research/20260127-permissions-module-architecture-research.md (Lines 75-81, 335-354) - Performance optimization requirements
  - docs/modulars/01-permissions-權限模組.md (Lines 75-81) - Performance specifications
- **Dependencies**:
  - Phase 4 completion (UI components)
  - Phase 5 completion (role management)

## Dependencies

- @angular/material - Material Design components
- @angular/cdk - CDK utilities
- @ngrx/signals - SignalStore
- @angular/fire - Firestore
- Tailwind CSS - Utility styling
- WorkspaceEventBus (internal)
- WorkspaceContextProvider (internal)

## Success Criteria

- Single consolidated role aggregate with domain events
- PermissionContextProvider implemented and available
- Event bus integration complete (publish/subscribe)
- Permission matrix UI functional with sticky headers
- Custom role creation/editing with validation
- Batch operations implemented
- All tests passing (unit, integration, E2E)
- Performance targets met (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- Type safety enforced (no any/unknown)
- Zone-less with OnPush strategy
- No cross-module store injection
