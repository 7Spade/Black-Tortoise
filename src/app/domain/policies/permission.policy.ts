/**
 * Permission Policy
 * 
 * Layer: Domain
 * DDD Pattern: Policy
 * 
 * Enforces business rules for permission format and validation
 */

export class PermissionPolicy {
  private static readonly VALID_ACTIONS = ['read', 'create', 'update', 'delete', 'admin'];
  private static readonly PERMISSION_REGEX = /^[a-z][a-z0-9_-]*:[a-z]+$/i;

  /**
   * Check if permission string is valid
   */
  public static isValidPermission(permission: string): boolean {
    if (!permission) return false;

    // Check format: resource:action
    if (!this.PERMISSION_REGEX.test(permission)) return false;

    const [resource, action] = permission.split(':');

    // Validate resource is non-empty
    if (!resource || resource.trim().length === 0) return false;

    // Validate action is in allowed list
    if (!this.VALID_ACTIONS.includes(action.toLowerCase())) return false;

    return true;
  }

  /**
   * Assert all permissions are valid (throws on violation)
   */
  public static assertValidPermissions(permissions: string[]): void {
    if (!permissions || permissions.length === 0) {
      throw new Error('At least one permission is required');
    }

    const invalidPermissions = permissions.filter(
      (p) => !this.isValidPermission(p)
    );

    if (invalidPermissions.length > 0) {
      throw new Error(
        `Invalid permissions: ${invalidPermissions.join(', ')}. ` +
        `Format must be "resource:action" where action is one of: ${this.VALID_ACTIONS.join(', ')}`
      );
    }
  }

  /**
   * Parse permission into resource and action
   */
  public static parse(permission: string): { resource: string; action: string } | null {
    if (!this.isValidPermission(permission)) return null;

    const [resource, action] = permission.split(':');
    return { resource, action: action.toLowerCase() };
  }
}
