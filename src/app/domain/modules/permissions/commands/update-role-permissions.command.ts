/**
 * Update Role Permissions Command
 * 
 * Layer: Domain
 * DDD Pattern: Command
 */

export interface UpdateRolePermissionsCommand {
  roleId: string;
  permissions: string[];
}
