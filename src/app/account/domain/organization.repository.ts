import { Organization } from './organization.entity';
import { UserId } from './user-id.vo';
import { OrganizationId } from './organization-id.vo';

/**
 * Organization Repository Interface
 * 
 * Layer: Domain
 * Purpose: Abstract persistence operations for Organization entity.
 */
export interface OrganizationRepository {
  /**
   * Save an organization (create or update)
   */
  save(organization: Organization): Promise<void>;

  /**
   * Find organization by ID
   */
  findById(id: OrganizationId): Promise<Organization | null>;

  /**
   * Find organizations owned by a user
   */
  findByOwner(ownerId: UserId): Promise<Organization[]>;
}
