import { DomainEvent } from '../domain-event.interface';

export const QUALITY_SOURCE = 'Quality';

export class QCStarted implements DomainEvent<{ taskId: string; qcId?: string }> {
    readonly type = 'Quality.QCStarted';
    readonly source = QUALITY_SOURCE;
    readonly id = crypto.randomUUID();
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { taskId: string; qcId?: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) { }
}

export class QCPassed implements DomainEvent<{ taskId: string; qcId: string; notes?: string }> {
    readonly type = 'Quality.QCPassed';
    readonly source = QUALITY_SOURCE;
    readonly id = crypto.randomUUID();
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { taskId: string; qcId: string; notes?: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) { }
}

export class QCFailed implements DomainEvent<{ taskId: string; qcId: string; reasons: string[] }> {
    readonly type = 'Quality.QCFailed';
    readonly source = QUALITY_SOURCE;
    readonly id = crypto.randomUUID();
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { taskId: string; qcId: string; reasons: string[] },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) { }
}
