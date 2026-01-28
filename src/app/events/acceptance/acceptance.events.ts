import { DomainEvent } from '../domain-event.interface';

export const ACCEPTANCE_SOURCE = 'Acceptance';

export class AcceptanceStarted implements DomainEvent<{ taskId: string; acceptanceId?: string }> {
    readonly type = 'Acceptance.AcceptanceStarted';
    readonly source = ACCEPTANCE_SOURCE;
    readonly id = crypto.randomUUID();
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { taskId: string; acceptanceId?: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) { }
}

export class AcceptanceApproved implements DomainEvent<{ taskId: string; acceptanceId: string; feedback?: string }> {
    readonly type = 'Acceptance.AcceptanceApproved';
    readonly source = ACCEPTANCE_SOURCE;
    readonly id = crypto.randomUUID();
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { taskId: string; acceptanceId: string; feedback?: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) { }
}

export class AcceptanceRejected implements DomainEvent<{ taskId: string; acceptanceId: string; reasons: string[] }> {
    readonly type = 'Acceptance.AcceptanceRejected';
    readonly source = ACCEPTANCE_SOURCE;
    readonly id = crypto.randomUUID();
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { taskId: string; acceptanceId: string; reasons: string[] },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) { }
}
