import { DomainEvent } from '../domain-event.interface';

export const ISSUES_SOURCE = 'Issues';

export class IssueCreated implements DomainEvent<{ issueId: string; title: string; reporterId: string }> {
    readonly type = 'Issues.IssueCreated';
    readonly source = ISSUES_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { issueId: string; title: string; reporterId: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.issueId;
    }
}

export class IssueResolved implements DomainEvent<{ issueId: string; resolverId: string }> {
    readonly type = 'Issues.IssueResolved';
    readonly source = ISSUES_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { issueId: string; resolverId: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.issueId;
    }
}
// Helpers for backward compatibility
export function createIssueCreatedEvent(payload: { issueId: string; title: string; reporterId: string }, correlationId: string, causationId?: string | null): IssueCreated {
    return new IssueCreated(payload, correlationId, causationId ?? undefined);
}

export function createIssueResolvedEvent(payload: { issueId: string; resolverId: string }, correlationId: string, causationId?: string | null): IssueResolved {
    return new IssueResolved(payload, correlationId, causationId ?? undefined);
}
export class IssueClosed implements DomainEvent<{ issueId: string }> {
    readonly type = 'Issues.IssueClosed';
    readonly source = ISSUES_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { issueId: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.issueId;
    }
}

export class IssueReopened implements DomainEvent<{ issueId: string; reason: string }> {
    readonly type = 'Issues.IssueReopened';
    readonly source = ISSUES_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { issueId: string; reason: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.issueId;
    }
}
