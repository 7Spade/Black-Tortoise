/**
 * Permission Context Provider
 * 
 * Layer: Application
 * Purpose: Abstract interface for cross-module permission queries
 * 
 * Other modules depend on this interface to check permissions
 * without directly coupling to PermissionsStore.
 */

/**
 * Abstract Permission Context Provider
 * 
 * Provides permission queries for other modules
 */
export abstract class PermissionContextProvider {
  /**
   * Check if user has specific permission
   */
  abstract hasPermission(userId: string, permission: string): boolean;

  /**
   * Get user's role ID
   */
  abstract getUserRole(userId: string): string | null;

  /**
   * Get all permissions for a role
   */
  abstract getRolePermissions(roleId: string): string[];

  /**
   * Check if role exists
   */
  abstract roleExists(roleId: string): boolean;
}
