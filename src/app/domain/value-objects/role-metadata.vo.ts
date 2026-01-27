/**
 * Role Metadata Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 * 
 * Encapsulates metadata for role aggregate
 */

export interface RoleMetadata {
  readonly createdAt: number;
  readonly updatedAt: number;
  readonly color?: string;
  readonly description?: string;
}

/**
 * Create default role metadata
 */
export function createRoleMetadata(
  description?: string,
  color?: string
): RoleMetadata {
  const now = Date.now();
  return {
    createdAt: now,
    updatedAt: now,
    description,
    color,
  };
}

/**
 * Update role metadata with new timestamp
 */
export function updateRoleMetadata(
  metadata: RoleMetadata,
  updates: Partial<Pick<RoleMetadata, 'description' | 'color'>>
): RoleMetadata {
  return {
    ...metadata,
    ...updates,
    updatedAt: Date.now(),
  };
}
