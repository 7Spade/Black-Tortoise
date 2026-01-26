import { AggregateRoot } from '../base/aggregate-root';
import { UserId } from '../value-objects/user-id.vo';
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
        public readonly ownerId: UserId
    ) {
        super(id);
    }

    static create(
        id: WorkspaceId, 
        name: string, 
        ownerId: UserId
    ): Workspace {
        return new Workspace(id, name, ownerId);
    }
}
