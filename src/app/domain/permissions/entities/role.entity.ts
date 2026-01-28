import { Entity } from '@domain/base/entity';
import { RoleId } from '../value-objects/role-id.vo';
import { PermissionId } from '../value-objects/permission-id.vo';

/**
 * Role Entity
 * 
 * Defines a role within the permission system.
 */
export class Role extends Entity<RoleId> {
    private constructor(
        id: RoleId,
        public readonly name: string,
        public readonly description: string,
        private _permissionIds: Set<string>
    ) {
        super(id);
    }

    public static create(id: RoleId, name: string, description: string): Role {
        return new Role(id, name, description, new Set());
    }

    public get permissionIds(): ReadonlyArray<string> {
        return Array.from(this._permissionIds);
    }

    public assignPermission(permissionId: PermissionId): void {
        this._permissionIds.add(permissionId.value);
    }

    public revokePermission(permissionId: PermissionId): void {
        this._permissionIds.delete(permissionId.value);
    }
}
