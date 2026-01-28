import { AggregateRoot } from '@account/index';
import { UserId } from '@account/index';
import { WorkspaceId } from '../value-objects/workspace-id.vo';

/**
 * Workspace Aggregate Root
 * 
 * Layer: Domain
 * Purpose: Logical container for the 11 system business modules.
 * Pattern: Event Sourced Aggregate + Causality Tracking.
 */
export class Workspace extends AggregateRoot<WorkspaceId> {
    // State is reconstructed from events in a pure ES implementation.
    // However, for snapshot/current state access, we keep readonly fields.
    // In strict ES, these might be protected or mapped properties.

    constructor(
        id: WorkspaceId,
        public readonly name: string,
        public readonly ownerId: UserId,
        public readonly ownerType: 'user' | 'organization',
        public readonly moduleIds: string[] = [],
        public readonly createdAt: number = Date.now(),
        public readonly updatedAt: number = Date.now()
    ) {
        super(id);
    }

    static create(
        id: WorkspaceId,
        name: string,
        ownerId: UserId,
        ownerType: 'user' | 'organization',
        moduleIds: string[] = []
    ): Workspace {
        return new Workspace(id, name, ownerId, ownerType, moduleIds);
    }
}
