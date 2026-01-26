import { Organization } from '@domain/entities/organization.entity';
import { OrganizationId } from '@domain/value-objects/organization-id.vo';
import { UserId } from '@domain/value-objects/user-id.vo';

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
