/**
 * Create Role Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

export interface CreateRoleCommand {
  id: string;
  workspaceId: string;
  name: string;
  permissions: string[];
}
