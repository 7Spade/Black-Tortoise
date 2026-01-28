import { DomainEvent } from '../domain-event.interface';

export const MEMBERS_SOURCE = 'Members';

export class MemberInvited implements DomainEvent<{ memberId: string; email: string; role: string }> {
    readonly type = 'Members.MemberInvited';
    readonly source = MEMBERS_SOURCE;
    readonly id = crypto.randomUUID();
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { memberId: string; email: string; role: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) { }
}

export class MemberJoined implements DomainEvent<{ memberId: string; userId: string }> {
    readonly type = 'Members.MemberJoined';
    readonly source = MEMBERS_SOURCE;
    readonly id = crypto.randomUUID();
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { memberId: string; userId: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) { }
}

export class MemberRoleChanged implements DomainEvent<{ memberId: string; oldRole: string; newRole: string }> {
    readonly type = 'Members.MemberRoleChanged';
    readonly source = MEMBERS_SOURCE;
    readonly id = crypto.randomUUID();
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { memberId: string; oldRole: string; newRole: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) { }
}

export class MemberRemoved implements DomainEvent<{ memberId: string; reason?: string }> {
    readonly type = 'Members.MemberRemoved';
    readonly source = MEMBERS_SOURCE;
    readonly id = crypto.randomUUID();
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { memberId: string; reason?: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) { }
}
