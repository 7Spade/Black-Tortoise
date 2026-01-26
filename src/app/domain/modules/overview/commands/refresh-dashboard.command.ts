/**
 * Refresh Dashboard Command
 * 
 * Layer: Domain
 * DDD Pattern: Command
 */

export interface RefreshDashboardCommand {
  workspaceId: string;
  force: boolean;
}
