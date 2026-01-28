// Just a simple move of content.
// d:\GitHub\7s\Black-Tortoise\src\app\application\commands\create-audit-entry.command.ts

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
