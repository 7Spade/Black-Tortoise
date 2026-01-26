/**
 * Workspace Domain Policy
 * 
 * Layer: Domain
 * DDD Pattern: Domain Policy
 * 
 * Encapsulates complex business logic that doesn't naturally fit within
 * a single aggregate or entity. Domain services are stateless and operate
 * on domain objects to enforce business rules and invariants.
 * 
 * This service handles workspace-specific business rules such as:
 * - Workspace naming validation
 * - Ownership transfer rules
 * - Workspace capacity limits
 * - Cross-workspace operations
 */

import { WorkspaceAggregate } from '../aggregates/workspace.aggregate';
import { WorkspaceId } from '../value-objects/workspace-id.vo';

/**
 * Validates workspace name according to business rules
 */
export function validateWorkspaceName(name: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!name || name.trim().length === 0) {
    errors.push('Workspace name cannot be empty');
  }

  if (name.length < 3) {
    errors.push('Workspace name must be at least 3 characters long');
  }

  if (name.length > 100) {
    errors.push('Workspace name cannot exceed 100 characters');
  }

  // Check for invalid characters (only allow alphanumeric, spaces, hyphens, underscores)
  const validNamePattern = /^[a-zA-Z0-9\s\-_]+$/;
  if (!validNamePattern.test(name)) {
    errors.push('Workspace name can only contain letters, numbers, spaces, hyphens, and underscores');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Check if a user can create more workspaces
 */
export function canCreateWorkspace(
  currentWorkspaceCount: number,
  maxWorkspaces: number
): boolean {
  return currentWorkspaceCount < maxWorkspaces;
}

/**
 * Check if workspace ownership transfer is allowed
 */
export function canTransferOwnership(
  workspace: WorkspaceAggregate,
  currentUserId: string,
  newOwnerId: string
): {
  isAllowed: boolean;
  reason?: string;
} {
  // Only current owner can transfer
  if (workspace.ownerId !== currentUserId) {
    return {
      isAllowed: false,
      reason: 'Only the current owner can transfer ownership',
    };
  }

  // Cannot transfer to self
  if (workspace.ownerId === newOwnerId) {
    return {
      isAllowed: false,
      reason: 'Cannot transfer ownership to the same owner',
    };
  }

  // Workspace must be active
  if (!workspace.isActive) {
    return {
      isAllowed: false,
      reason: 'Cannot transfer ownership of an inactive workspace',
    };
  }

  return { isAllowed: true };
}

/**
 * Calculate workspace capacity usage
 */
export function calculateWorkspaceCapacity(
  memberCount: number,
  taskCount: number,
  documentCount: number,
  storageUsed: number,
  limits: {
    maxMembers: number;
    maxTasks: number;
    maxDocuments: number;
    maxStorage: number;
  }
): {
  isWithinLimits: boolean;
  usage: {
    members: { count: number; limit: number; percentage: number };
    tasks: { count: number; limit: number; percentage: number };
    documents: { count: number; limit: number; percentage: number };
    storage: { used: number; limit: number; percentage: number };
  };
} {
  const membersPercentage = (memberCount / limits.maxMembers) * 100;
  const tasksPercentage = (taskCount / limits.maxTasks) * 100;
  const documentsPercentage = (documentCount / limits.maxDocuments) * 100;
  const storagePercentage = (storageUsed / limits.maxStorage) * 100;

  const isWithinLimits =
    memberCount <= limits.maxMembers &&
    taskCount <= limits.maxTasks &&
    documentCount <= limits.maxDocuments &&
    storageUsed <= limits.maxStorage;

  return {
    isWithinLimits,
    usage: {
      members: {
        count: memberCount,
        limit: limits.maxMembers,
        percentage: membersPercentage,
      },
      tasks: {
        count: taskCount,
        limit: limits.maxTasks,
        percentage: tasksPercentage,
      },
      documents: {
        count: documentCount,
        limit: limits.maxDocuments,
        percentage: documentsPercentage,
      },
      storage: {
        used: storageUsed,
        limit: limits.maxStorage,
        percentage: storagePercentage,
      },
    },
  };
}

/**
 * Check if a workspace can be deactivated
 */
export function canDeactivateWorkspace(
  workspace: WorkspaceAggregate,
  hasActiveTasks: boolean,
  hasActiveMembers: boolean
): {
  canDeactivate: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  if (hasActiveTasks) {
    warnings.push('Workspace has active tasks that will be archived');
  }

  if (hasActiveMembers) {
    warnings.push('Workspace members will lose access');
  }

  if (!workspace.isActive) {
    warnings.push('Workspace is already inactive');
  }

  // Can always deactivate, but warn about consequences
  return {
    canDeactivate: workspace.isActive,
    warnings,
  };
}

/**
 * Generate a unique workspace slug from name
 */
export function generateWorkspaceSlug(name: string, workspaceId: WorkspaceId): string {
  // Convert to lowercase and replace spaces/special chars with hyphens
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

  // Append a portion of the ID for uniqueness
  const idSuffix = workspaceId.getValue().substring(0, 8);
  
  return `${slug}-${idSuffix}`;
}

/**
 * Check if workspace name is available (not a duplicate)
 */
export function isWorkspaceNameAvailable(
  name: string,
  existingWorkspaces: WorkspaceAggregate[],
  excludeWorkspaceId?: WorkspaceId
): boolean {
  const normalizedName = name.toLowerCase().trim();
  
  return !existingWorkspaces.some(
    (workspace) =>
      workspace.name.toLowerCase().trim() === normalizedName &&
      (!excludeWorkspaceId || !workspace.id.equals(excludeWorkspaceId))
  );
}
