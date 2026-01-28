import { AggregateRoot } from '@domain/base/aggregate-root';
import { OrganizationId } from '@domain/value-objects/organization-id.vo';
import { UserId } from '@domain/value-objects/user-id.vo';

/**
 * Organization Entity (Minimal)
 *
 * Layer: Domain
 * Purpose: Minimal organization existence (id + ownerId + displayName)
 * Note: Only User/Organization can create Workspaces.
 */

export class Organization extends AggregateRoot<OrganizationId> {
    constructor(
        id: OrganizationId,
        public readonly ownerId: UserId,
        public readonly displayName: string
    ) {
        super(id);
    }

    static create(id: OrganizationId, ownerId: UserId, displayName: string): Organization {
        return new Organization(id, ownerId, displayName);
    }
}


