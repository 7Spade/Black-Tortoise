/**
 * Audit Validation Policy
 * 
 * Layer: Domain
 * DDD Pattern: Policy
 */

/**
 * Validate audit entry
 */
export function validateAuditEntry(
  workspaceId: string,
  userId: string,
  action: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!workspaceId) errors.push('Workspace ID is required');
  if (!userId) errors.push('User ID is required');
  if (!action) errors.push('Action is required');

  return { valid: errors.length === 0, errors };
}
