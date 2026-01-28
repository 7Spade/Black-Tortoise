/**
 * Refresh Dashboard Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

export interface RefreshDashboardCommand {
  workspaceId: string;
  force: boolean;
}
