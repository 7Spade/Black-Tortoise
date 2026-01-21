import type { Observable } from 'rxjs';
import type { User } from '../entities/user.entity';
import type { Organization } from '../entities/organization.entity';
import type { Bot } from '../entities/bot.entity';

/**
 * IdentityRepository defines the contract for identity persistence.
 */
export interface IdentityRepository {
  getUsers(): Observable<User[]>;
  getOrganizations(): Observable<Organization[]>;
  getBots(): Observable<Bot[]>;
}
