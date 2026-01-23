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

import { WorkspaceId } from '../value-objects/workspace-id.vo';
import { WorkspaceAggregate } from '../aggregates/workspace.aggregate';

export interface WorkspaceRepository {
  /**
   * Find a workspace by its ID
   * @returns The workspace if found, undefined otherwise
   */
  findById(id: WorkspaceId): Promise<WorkspaceAggregate | undefined>;

  /**
   * Find all workspaces owned by a user or organization
   */
  findByOwnerId(ownerId: string, ownerType: 'user' | 'organization'): Promise<WorkspaceAggregate[]>;

  /**
   * Find all workspaces in an organization
   */
  findByOrganizationId(organizationId: string): Promise<WorkspaceAggregate[]>;

  /**
   * Find all active workspaces
   */
  findAllActive(): Promise<WorkspaceAggregate[]>;

  /**
   * Save a workspace (create or update)
   */
  save(workspace: WorkspaceAggregate): Promise<void>;

  /**
   * Delete a workspace by ID
   */
  delete(id: WorkspaceId): Promise<void>;

  /**
   * Check if a workspace exists
   */
  exists(id: WorkspaceId): Promise<boolean>;

  /**
   * Count total workspaces
   */
  count(): Promise<number>;

  /**
   * Count workspaces by owner
   */
  countByOwner(ownerId: string): Promise<number>;
}
