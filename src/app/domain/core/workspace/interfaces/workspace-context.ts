/**
 * Workspace Context
 * 
 * Layer: Domain
 * Purpose: Represents the runtime context of an active workspace
 * 
 * The workspace context contains the current workspace state and
 * provides access to the workspace-scoped event bus.
 */

import { WorkspaceEntity } from '../aggregates/workspace.entity';

export interface WorkspaceContext {
  readonly workspace: WorkspaceEntity;
  readonly activeModuleId: string | null;
  readonly permissions: WorkspacePermissions;
}

export interface WorkspacePermissions {
  readonly canEditWorkspace: boolean;
  readonly canManageModules: boolean;
  readonly canInviteMembers: boolean;
  readonly canDeleteWorkspace: boolean;
}

/**
 * Create default workspace context
 */
export function createWorkspaceContext(
  workspace: WorkspaceEntity,
  permissions: WorkspacePermissions = createDefaultPermissions()
): WorkspaceContext {
  return {
    workspace,
    activeModuleId: null,
    permissions,
  };
}

/**
 * Create default permissions (read-only)
 */
export function createDefaultPermissions(): WorkspacePermissions {
  return {
    canEditWorkspace: false,
    canManageModules: false,
    canInviteMembers: false,
    canDeleteWorkspace: false,
  };
}

/**
 * Activate module in context
 */
export function activateModule(
  context: WorkspaceContext,
  moduleId: string
): WorkspaceContext {
  if (!context.workspace.moduleIds.includes(moduleId)) {
    throw new Error(`Module ${moduleId} is not enabled in workspace ${context.workspace.id}`);
  }
  
  return {
    ...context,
    activeModuleId: moduleId,
  };
}
