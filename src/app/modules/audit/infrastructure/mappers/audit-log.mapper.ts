import { AuditLogEntity } from '@domain/aggregates/audit-log.aggregate';
import { AuditLogDto } from '@audit/infrastructure/models/audit-log.dto.ts';

export class AuditLogMapper {
    static toDto(entity: AuditLogEntity): AuditLogDto {
        return {
            id: entity.id,
            workspaceId: entity.workspaceId,
            eventId: entity.eventId,
            eventType: entity.eventType,
            userId: entity.userId,
            action: entity.action,
            details: entity.details,
            timestamp: entity.timestamp
        };
    }

    static toEntity(dto: AuditLogDto): AuditLogEntity {
        return {
            id: dto.id,
            workspaceId: dto.workspaceId,
            eventId: dto.eventId,
            eventType: dto.eventType,
            userId: dto.userId,
            action: dto.action,
            details: dto.details,
            timestamp: dto.timestamp
        };
    }
}
