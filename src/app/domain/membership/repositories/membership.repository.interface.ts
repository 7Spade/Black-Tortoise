import type { Observable } from 'rxjs';
import type { Team } from '../entities/team.entity';
import type { Partner } from '../entities/partner.entity';
import type { OrganizationMembership } from '../entities/organization-membership.entity';

/**
 * MembershipRepository defines the contract for membership persistence.
 */
export interface MembershipRepository {
  getTeams(organizationId: string): Observable<Team[]>;
  getPartners(organizationId: string): Observable<Partner[]>;
  getOrganizationMemberships(organizationId: string): Observable<OrganizationMembership[]>;
}
