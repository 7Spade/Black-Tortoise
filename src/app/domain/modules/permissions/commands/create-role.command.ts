/**
 * Create Role Command
 * 
 * Layer: Domain
 * DDD Pattern: Command
 */

export interface CreateRoleCommand {
  id: string;
  workspaceId: string;
  name: string;
  permissions: string[];
}
