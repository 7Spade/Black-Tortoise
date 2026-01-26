/**
 * Update Role Permissions Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

export interface UpdateRolePermissionsCommand {
  roleId: string;
  permissions: string[];
}
