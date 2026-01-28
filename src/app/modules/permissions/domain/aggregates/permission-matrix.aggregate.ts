import { AggregateRoot } from '@domain/base/aggregate-root';
import { UserId } from '@domain/value-objects/user-id.vo';
import { WorkspaceId } from '@domain/value-objects/workspace-id.vo';
import { Role } from '@permissions/domain/entities/role.entity';
import { Permission } from '@permissions/domain/entities/permission.entity';

/**
 * Permission Matrix Aggregate
 * 
 * Manages the RBAC matrix for a workspace.
 * 
 * Hierarchy:
 * PermissionMatrix
 *   -> Roles
 *   -> Permissions
 */
export class PermissionMatrixAggregate extends AggregateRoot<WorkspaceId> {
    private _roles: Map<string, Role>;
    private _permissions: Map<string, Permission>;

    private constructor(id: WorkspaceId) {
        super(id);
        this._roles = new Map();
        this._permissions = new Map();
    }

    public static create(workspaceId: WorkspaceId): PermissionMatrixAggregate {
        return new PermissionMatrixAggregate(workspaceId);
    }

    public get roles(): ReadonlyArray<Role> {
        return Array.from(this._roles.values());
    }

    public get permissions(): ReadonlyArray<Permission> {
        return Array.from(this._permissions.values());
    }

    public addRole(role: Role): void {
        if (this._roles.has(role.id.value)) {
            throw new Error('Role already exists');
        }
        this._roles.set(role.id.value, role);
    }

    public removeRole(roleId: string): void {
        this._roles.delete(roleId);
    }

    // Additional methods for permission assignment logic...
}
