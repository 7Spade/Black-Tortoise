# Permissions Module Design

## 1. Responsibilities
- Manage Workspace Permission Matrix (RBAC).
- Manage Custom Roles.
- Handle "What can be done" (Authorization), not "Who is who" (Authentication).

## 2. Architecture
- **Store**: `PermissionsStore` (SignalStore).
- **Service**: `PermissionsService` (Application Layer).
- **Infrastructure**: `PermissionsFirestoreRepository`.

## 3. Data Structures
### Entities
- `Role`: id, name, description, permissions[], color, isSystem, priority.
- `Permission`: code, resource, action.
- `PermissionMatrix`: Map<RoleId, Set<PermissionId>>.

## 4. Key Logic & Signals
- **State**: `roles` (EntityMap), `matrix` (Map), `loading` (boolean).
- **Computed**: 
  - `canEdit = computed(...)`: Reactive permission check.
  - `effectivePermissions`: Union of capabilities for current user.
- **Methods**: `createRole`, `updateRole`, `assignPermissions`.

## 5. UI Specifications
- **Permission Matrix**: 
  - MatTable/Grid with Sticky Headers.
  - Rows: Roles / Columns: Resources.
  - Optimistic updates for checkboxes.
- **Role Management**:
  - CRUD Dialogs for Roles.
  - Color pickers for role tagging.

## 6. Events
- **Publish**: `RoleCreated`, `RoleUpdated`, `PermissionGranted`, `PermissionRevoked`.
- **Subscribe**: `MemberRoleChanged` (from MembersModule) -> Update cache.

## 7. File Tree
```
src/app/
  application/
    stores/
      permissions.store.ts
    services/
      permissions.service.ts
  domain/
    permissions/
      entities/
        role.entity.ts
        permission.entity.ts
      repositories/
        permissions.repository.ts
  infrastructure/
    permissions/
      permissions.firestore.repository.ts
      permissions.dto.ts
  presentation/
    permissions/
      components/
        permission-matrix/
        role-dialog/
      permissions.component.ts
      permissions.routes.ts
```
