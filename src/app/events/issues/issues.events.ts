import { DomainEvent } from '../domain-event.interface';

export const ISSUES_SOURCE = 'Issues';

export interface IssueCreatedPayload {
    issueId: string;
    title: string;
    reporterId: string;
    severity: string;  // Required by existing code
    description?: string;
    relatedTaskId?: string;
}

export class IssueCreated implements DomainEvent<IssueCreatedPayload> {
    readonly type = 'Issues.IssueCreated';
    readonly source = ISSUES_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: IssueCreatedPayload,
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.issueId;
    }
}

export interface IssueResolvedPayload {
    issueId: string;
    resolverId: string;
    resolution?: string; // Often requested
}

export class IssueResolved implements DomainEvent<IssueResolvedPayload> {
    readonly type = 'Issues.IssueResolved';
    readonly source = ISSUES_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: IssueResolvedPayload,
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.issueId;
    }
}

// Helpers for backward compatibility
export function createIssueCreatedEvent(payload: IssueCreatedPayload, correlationId: string, causationId?: string | null): IssueCreated {
    return new IssueCreated(payload, correlationId, causationId ?? undefined);
}

export function createIssueResolvedEvent(payload: IssueResolvedPayload, correlationId: string, causationId?: string | null): IssueResolved {
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
