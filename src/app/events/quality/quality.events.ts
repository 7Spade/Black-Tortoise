import { DomainEvent } from '../domain-event.interface';

export const QUALITY_SOURCE = 'Quality';

export class QCStarted implements DomainEvent<{ taskId: string; qcId?: string }> {
    readonly type = 'Quality.QCStarted';
    readonly source = QUALITY_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { taskId: string; qcId?: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.taskId;
    }
}

// Helpers for backward compatibility
export function createQCStartedEvent(payload: { taskId: string; qcId?: string }, correlationId: string, causationId?: string | null): QCStarted {
    return new QCStarted(payload, correlationId, causationId ?? undefined);
}

export class QCPassed implements DomainEvent<{ taskId: string; qcId: string; notes?: string }> {
    readonly type = 'Quality.QCPassed';
    readonly source = QUALITY_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { taskId: string; qcId: string; notes?: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.taskId;
    }
}

export function createQCPassedEvent(payload: { taskId: string; qcId: string; notes?: string }, correlationId: string, causationId?: string | null): QCPassed {
    return new QCPassed(payload, correlationId, causationId ?? undefined);
}

export class QCFailed implements DomainEvent<{ taskId: string; qcId: string; reasons: string[] }> {
    readonly type = 'Quality.QCFailed';
    readonly source = QUALITY_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { taskId: string; qcId: string; reasons: string[] },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.taskId;
    }
}

export function createQCFailedEvent(payload: { taskId: string; qcId: string; reasons: string[] }, correlationId: string, causationId?: string | null): QCFailed {
    return new QCFailed(payload, correlationId, causationId ?? undefined);
}
