/**
 * Workspace Repository Interface
 * 
 * Layer: Domain
 * DDD Pattern: Repository Interface
 * 
 * Defines the contract for workspace persistence operations.
 * The actual implementation will be in the Infrastructure layer.
 * This interface is pure TypeScript with no framework dependencies.
 */

import { WorkspaceEntity } from '../aggregates/workspace.entity';

export interface WorkspaceRepository {
  /**
   * Find a workspace by its ID
   * @returns The workspace if found, undefined otherwise
   */
  findById(id: string): Promise<WorkspaceEntity | undefined>;

  /**
   * Find all workspaces owned by a user or organization
   */
  findByOwnerId(ownerId: string, ownerType: 'user' | 'organization'): Promise<WorkspaceEntity[]>;

  /**
   * Find all active workspaces
   */
  findAllActive(): Promise<WorkspaceEntity[]>;

  /**
   * Save a workspace (create or update)
   */
  save(workspace: WorkspaceEntity): Promise<void>;

  /**
   * Delete a workspace by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Check if a workspace exists
   */
  exists(id: string): Promise<boolean>;

  /**
   * Count total workspaces
   */
  count(): Promise<number>;

  /**
   * Count workspaces by owner
   */
  countByOwner(ownerId: string): Promise<number>;
}
