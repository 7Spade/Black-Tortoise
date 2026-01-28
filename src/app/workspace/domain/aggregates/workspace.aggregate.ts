/**
 * Workspace Aggregate Root
 * 
 * Layer: Domain
 * DDD Pattern: Aggregate Root
 * 
 * The Workspace aggregate is the central entity for managing workspace-related operations.
 * It encapsulates workspace state, enforces business rules, and emits domain events.
 * This aggregate follows event sourcing principles for state reconstruction.
 */

import { WorkspaceId } from '../value-objects/workspace-id.vo';

export interface WorkspaceAggregate {
  readonly id: WorkspaceId;
  readonly name: string;
  readonly ownerId: string;
  readonly ownerType: 'user' | 'organization';
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly version: number;
}

/**
 * Create a new Workspace aggregate
 */
export function createWorkspace(
  id: WorkspaceId,
  name: string,
  ownerId: string,
  ownerType: 'user' | 'organization'
): WorkspaceAggregate {
  if (!name || name.trim().length === 0) {
    throw new Error('Workspace name cannot be empty');
  }

  if (!ownerId || ownerId.trim().length === 0) {
    throw new Error('Workspace owner ID cannot be empty');
  }

  return {
    id,
    name: name.trim(),
    ownerId,
    ownerType,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1,
  };
}

/**
 * Rename workspace
 */
export function renameWorkspace(
  workspace: WorkspaceAggregate,
  newName: string
): WorkspaceAggregate {
  if (!newName || newName.trim().length === 0) {
    throw new Error('Workspace name cannot be empty');
  }

  return {
    ...workspace,
    name: newName.trim(),
    updatedAt: new Date(),
    version: workspace.version + 1,
  };
}

/**
 * Deactivate workspace
 */
export function deactivateWorkspace(
  workspace: WorkspaceAggregate
): WorkspaceAggregate {
  if (!workspace.isActive) {
    throw new Error('Workspace is already deactivated');
  }

  return {
    ...workspace,
    isActive: false,
    updatedAt: new Date(),
    version: workspace.version + 1,
  };
}

/**
 * Reactivate workspace
 */
export function reactivateWorkspace(
  workspace: WorkspaceAggregate
): WorkspaceAggregate {
  if (workspace.isActive) {
    throw new Error('Workspace is already active');
  }

  return {
    ...workspace,
    isActive: true,
    updatedAt: new Date(),
    version: workspace.version + 1,
  };
}

/**
 * Transfer workspace ownership
 */
export function transferWorkspaceOwnership(
  workspace: WorkspaceAggregate,
  newOwnerId: string,
  newOwnerType: 'user' | 'organization'
): WorkspaceAggregate {
  if (!newOwnerId || newOwnerId.trim().length === 0) {
    throw new Error('New owner ID cannot be empty');
  }

  return {
    ...workspace,
    ownerId: newOwnerId,
    ownerType: newOwnerType,
    updatedAt: new Date(),
    version: workspace.version + 1,
  };
}
