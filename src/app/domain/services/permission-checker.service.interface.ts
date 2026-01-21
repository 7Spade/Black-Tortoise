import type { WorkspaceId } from '@domain/workspace/value-objects/workspace-id.value-object';
import type { IdentityId } from '@domain/identity/value-objects/identity-id.value-object';

/**
 * PermissionChecker is a domain service for cross-aggregate permission logic.
 */
export interface PermissionChecker {
  /**
   * Check if an identity has permission to access a workspace.
   */
  canAccessWorkspace(identityId: IdentityId, workspaceId: WorkspaceId): boolean;

  /**
   * Check if an identity can modify a workspace.
   */
  canModifyWorkspace(identityId: IdentityId, workspaceId: WorkspaceId): boolean;

  /**
   * Check if an identity can delete a workspace.
   */
  canDeleteWorkspace(identityId: IdentityId, workspaceId: WorkspaceId): boolean;
}
