/**
 * Role Repository Interface
 * 
 * Layer: Application
 * DDD Pattern: Repository Port
 * 
 * Defines contract for role persistence operations
 */

import { RoleAggregate } from '@domain/aggregates/role.aggregate';

export interface IRoleRepository {
  /**
   * Find role by ID
   */
  findById(id: string): Promise<RoleAggregate | null>;

  /**
   * Save role (create or update)
   */
  save(role: RoleAggregate): Promise<void>;

  /**
   * Find all roles in workspace
   */
  findByWorkspaceId(workspaceId: string): Promise<RoleAggregate[]>;

  /**
   * Delete role by ID
   */
  delete(id: string): Promise<void>;
}
