import { DomainEvent } from '../domain-event.interface';

export const AUDIT_SOURCE = 'Audit';

export class AuditLogRecorded implements DomainEvent<{ logId: string; action: string; resourceId: string; performedBy: string; details: any }> {
    readonly type = 'Audit.AuditLogRecorded';
    readonly source = AUDIT_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { logId: string; action: string; resourceId: string; performedBy: string; details: any },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.resourceId;
    }
}

export class AuditAlertTriggered implements DomainEvent<{ alertId: string; reason: string; severity: string }> {
    readonly type = 'Audit.AuditAlertTriggered';
    readonly source = AUDIT_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { alertId: string; reason: string; severity: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.alertId;
    }
}
