
import { AuditLogAggregate } from '@audit/domain/aggregates/audit-log.aggregate';
import { AuditLogId } from '@audit/domain/value-objects/audit-log-id.vo';
import { InjectionToken } from '@angular/core';

export interface AuditLogRepository {
    findById(id: AuditLogId): Promise<AuditLogAggregate | null>;
    save(auditLog: AuditLogAggregate): Promise<void>;
    findByWorkspace(workspaceId: string, limit?: number): Promise<AuditLogAggregate[]>;
    findByActor(userId: string): Promise<AuditLogAggregate[]>;
}

export const AUDIT_LOG_REPOSITORY = new InjectionToken<AuditLogRepository>('AUDIT_LOG_REPOSITORY');
