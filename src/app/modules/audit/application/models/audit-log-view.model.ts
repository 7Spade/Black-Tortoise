export interface AuditLogView {
    readonly id: string;
    readonly timestamp: Date;
    readonly eventType: string;
    readonly actorId: string;
    readonly action: string;
    readonly details: Record<string, unknown> | string;
}
