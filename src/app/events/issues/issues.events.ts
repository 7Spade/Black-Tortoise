import { DomainEvent } from '../domain-event.interface';

export const ISSUES_SOURCE = 'Issues';

export class IssueCreated implements DomainEvent<{ issueId: string; title: string; description?: string; severity: string; relatedTaskId?: string }> {
    readonly type = 'Issues.IssueCreated';
    readonly source = ISSUES_SOURCE;
    readonly id = crypto.randomUUID();
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { issueId: string; title: string; description?: string; severity: string; relatedTaskId?: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) { }
}

export class IssueResolved implements DomainEvent<{ issueId: string; resolution: string }> {
    readonly type = 'Issues.IssueResolved';
    readonly source = ISSUES_SOURCE;
    readonly id = crypto.randomUUID();
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { issueId: string; resolution: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) { }
}

export class IssueClosed implements DomainEvent<{ issueId: string }> {
    readonly type = 'Issues.IssueClosed';
    readonly source = ISSUES_SOURCE;
    readonly id = crypto.randomUUID();
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { issueId: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) { }
}

export class IssueReopened implements DomainEvent<{ issueId: string; reason: string }> {
    readonly type = 'Issues.IssueReopened';
    readonly source = ISSUES_SOURCE;
    readonly id = crypto.randomUUID();
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { issueId: string; reason: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) { }
}
