/**
 * Role Entity
 * 
 * Layer: Domain
 * DDD Pattern: Entity
 * 
 * Represents a role that can be assigned to users within a workspace or organization.
 * Roles define permissions and access levels.
 */

export type Permission = 
  | 'read' 
  | 'write' 
  | 'delete' 
  | 'admin' 
  | 'manage_members' 
  | 'manage_workspace';

export interface RoleEntity {
  readonly id: string;
  readonly name: string;
  readonly description?: string | undefined;
  readonly permissions: Permission[];
  readonly isSystemRole: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Create a new Role entity
 */
export function createRole(
  id: string,
  name: string,
  permissions: Permission[],
  description?: string,
  isSystemRole: boolean = false
): RoleEntity {
  return {
    id,
    name,
    description,
    permissions,
    isSystemRole,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Add permission to role
 */
export function addPermissionToRole(
  role: RoleEntity,
  permission: Permission
): RoleEntity {
  if (role.permissions.includes(permission)) {
    return role;
  }
  
  return {
    ...role,
    permissions: [...role.permissions, permission],
    updatedAt: new Date(),
  };
}

/**
 * Remove permission from role
 */
export function removePermissionFromRole(
  role: RoleEntity,
  permission: Permission
): RoleEntity {
  return {
    ...role,
    permissions: role.permissions.filter(p => p !== permission),
    updatedAt: new Date(),
  };
}

/**
 * Update role details
 */
export function updateRole(
  role: RoleEntity,
  name?: string,
  description?: string
): RoleEntity {
  return {
    ...role,
    name: name ?? role.name,
    description: description ?? role.description,
    updatedAt: new Date(),
  };
}

/**
 * Check if role has specific permission
 */
export function hasPermission(
  role: RoleEntity,
  permission: Permission
): boolean {
  return role.permissions.includes(permission);
}
