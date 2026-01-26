import { InjectionToken } from '@angular/core';
import { OrganizationRepository } from '@domain/repositories/organization.repository';

/**
 * Injection Token for Organization Repository
 * 
 * Layer: Application
 * Purpose: Allows dependency injection of the abstract domain repository.
 */
export const ORGANIZATION_REPOSITORY = new InjectionToken<OrganizationRepository>('ORGANIZATION_REPOSITORY');
