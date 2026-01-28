/**
 * Reopen Issue Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 * 
 * Request to reopen a resolved or closed issue.
 */

export interface ReopenIssueCommand {
  readonly issueId: string;
  readonly workspaceId: string;
  readonly reopenedBy: string;
  readonly reopenReason?: string;
  readonly correlationId?: string;
  readonly causationId?: string;
}
