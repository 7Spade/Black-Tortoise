import { Entity } from '@domain/base/entity';
import { PermissionId } from '../value-objects/permission-id.vo';
import { ResourceAction } from '../value-objects/resource-action.vo';

/**
 * Permission Entity
 * 
 * Represents a granular permission (resource + action).
 */
export class Permission extends Entity<PermissionId> {
    private constructor(
        id: PermissionId,
        public readonly resourceAction: ResourceAction,
        public readonly description: string
    ) {
        super(id);
    }

    public static create(id: PermissionId, resourceAction: ResourceAction, description: string): Permission {
        return new Permission(id, resourceAction, description);
    }
}
