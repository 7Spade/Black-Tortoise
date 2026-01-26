/**
 * Create Audit Entry Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

export interface CreateAuditEntryCommand {
  id: string;
  workspaceId: string;
  eventId: string;
  eventType: string;
  userId: string;
  action: string;
  details: string;
}
