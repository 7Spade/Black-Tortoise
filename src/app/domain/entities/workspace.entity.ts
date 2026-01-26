import { OrganizationId } from '../value-objects/organization-id.vo';
import { UserId } from '../value-objects/user-id.vo';
import { WorkspaceId } from '../value-objects/workspace-id.vo';

/**
 * Workspace Entity
 * 
 * Layer: Domain
 * Purpose: Logical container for the 11 system business modules.
 * Ownership: Can belong to an Organization OR a User directly (if personal workspace allowed).
 */
export class Workspace {
    constructor(
        public readonly id: WorkspaceId,
        public readonly name: string,
        // It must have an owner (User)
        public readonly ownerId: UserId,
        // Ideally belongs to an organization, but could be null if personal
        public readonly organizationId: OrganizationId | null
    ) {}

    static create(
        id: WorkspaceId, 
        name: string, 
        ownerId: UserId, 
        organizationId: OrganizationId | null
    ): Workspace {
        return new Workspace(id, name, ownerId, organizationId);
    }
}
