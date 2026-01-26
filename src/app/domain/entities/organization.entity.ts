/**
 * Organization Entity (Minimal)
 *
 * Layer: Domain
 * Purpose: Minimal organization existence (id + displayName)
 */

import { OrganizationId } from '../value-objects/organization-id.vo';
import { UserId } from '../value-objects/user-id.vo';

/**
 * Organization Entity (Minimal)
 *
 * Layer: Domain
 * Purpose: Minimal organization existence (id + ownerId + displayName)
 * Note: Only User/Organization can create Workspaces.
 */

export class Organization {
    constructor(
        public readonly id: OrganizationId,
        public readonly ownerId: UserId,
        public readonly displayName: string
    ) {}

    static create(id: OrganizationId, ownerId: UserId, displayName: string): Organization {
        return new Organization(id, ownerId, displayName);
    }
}


