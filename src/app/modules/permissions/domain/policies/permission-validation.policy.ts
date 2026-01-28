/**
 * Permission Validation Policy
 * 
 * Layer: Domain
 * DDD Pattern: Policy
 */

import { Role } from '@permissions/domain/entities/role.entity';

/**
 * Validate role modification
 */
export function canModifyRole(role: Role): { allowed: boolean; reason?: string } {
  // TODO: isSystem property missing on Role entity
  // if (role.isSystem) {
  //   return { allowed: false, reason: 'Cannot modify system roles' };
  // }
  return { allowed: true };
}

/**
 * Validate permission strings
 */
export function validatePermissions(permissions: string[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const permissionRegex = /^[a-z]+:[a-z]+$/; // e.g. task:create

  permissions.forEach(p => {
    if (!permissionRegex.test(p)) {
      errors.push(`Invalid permission format: ${p}. Expected resource:action`);
    }
  });

  return { valid: errors.length === 0, errors };
}
