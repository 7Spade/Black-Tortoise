/**
 * WorkspaceId Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 * 
 * Represents a workspace identifier with validation.
 */

export type WorkspaceId = string & { readonly __brand: 'WorkspaceId' };

export function createWorkspaceId(id: string): WorkspaceId {
  if (!id || id.trim().length === 0) {
    throw new Error('Workspace ID cannot be empty');
  }
  return id as WorkspaceId;
}
