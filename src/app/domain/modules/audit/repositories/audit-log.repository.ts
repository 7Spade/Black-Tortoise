
import { AuditLogEntity } from '../aggregates/audit-log.aggregate';

export interface AuditLogRepository {
  findById(id: string): Promise<AuditLogEntity | null>;
  findByWorkspaceId(workspaceId: string): Promise<AuditLogEntity[]>;
  save(entry: AuditLogEntity): Promise<void>;
}
