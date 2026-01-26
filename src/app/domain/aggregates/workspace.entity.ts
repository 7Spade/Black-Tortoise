/**
 * Workspace Entity
 * 
 * Layer: Domain
 * DDD Pattern: Entity (Aggregate Root)
 * 
 * Workspace represents a logical container for organizing related work.
 * It is owned by either a User or Organization and contains multiple modules.
 * 
 * Semantic Rules (from integrated-system-spec.md):
 * - Workspace = logical container / runtime scope
 * - Only User or Organization can own a Workspace
 * - Team/Partner are organizational filters, not owners
 * - Context is managed by Workspace
 * - Event Bus is scoped per Workspace
 */

export interface WorkspaceEntity {
  readonly id: string;
  readonly name: string;
  readonly ownerId: string;
  readonly ownerType: 'user' | 'organization';
  readonly moduleIds: string[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Factory function to create a new Workspace
 */
export function createWorkspaceEntity(
  id: string,
  name: string,
  ownerId: string,
  ownerType: 'user' | 'organization',
  moduleIds: string[] = []
): WorkspaceEntity {
  return {
    id,
    name,
    ownerId,
    ownerType,
    moduleIds,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Add module to workspace
 */
export function addModuleToWorkspace(
  workspace: WorkspaceEntity,
  moduleId: string
): WorkspaceEntity {
  if (workspace.moduleIds.includes(moduleId)) {
    return workspace;
  }
  
  return {
    ...workspace,
    moduleIds: [...workspace.moduleIds, moduleId],
    updatedAt: new Date(),
  };
}

/**
 * Remove module from workspace
 */
export function removeModuleFromWorkspace(
  workspace: WorkspaceEntity,
  moduleId: string
): WorkspaceEntity {
  return {
    ...workspace,
    moduleIds: workspace.moduleIds.filter(id => id !== moduleId),
    updatedAt: new Date(),
  };
}
