

export interface AuditLogEntity {
  readonly id: string;
  readonly workspaceId: string;
  readonly eventId: string;
  readonly eventType: string;
  readonly userId: string;
  readonly action: string;
  readonly details: string;
  readonly timestamp: number;
}

export function createAuditLog(
  id: string,
  workspaceId: string,
  eventId: string,
  eventType: string,
  userId: string,
  action: string,
  details: string
): AuditLogEntity {
  return {
    id,
    workspaceId,
    eventId,
    eventType,
    userId,
    action,
    details,
    timestamp: Date.now()
  };
}
