import { DomainEvent } from '../domain-event.interface';

export const MEMBERS_SOURCE = 'Members';

export class MemberAdded implements DomainEvent<{ workspaceId: string; userId: string; role: string }> {
    readonly type = 'Members.MemberAdded';
    readonly source = MEMBERS_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { workspaceId: string; userId: string; role: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.workspaceId;
    }
}

// Helpers for backward compatibility
export function createMemberAddedEvent(payload: { workspaceId: string; userId: string; role: string }, correlationId: string, causationId?: string | null): MemberAdded {
    return new MemberAdded(payload, correlationId, causationId ?? undefined);
}

export class MemberRemoved implements DomainEvent<{ workspaceId: string; userId: string }> {
    readonly type = 'Members.MemberRemoved';
    readonly source = MEMBERS_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { workspaceId: string; userId: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.workspaceId;
    }
}
