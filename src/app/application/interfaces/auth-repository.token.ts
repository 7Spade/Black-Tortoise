import { InjectionToken } from '@angular/core';
import { AuthRepository } from '@domain/repositories';

/**
 * Injection Token for Auth Repository
 * 
 * Allows the Infrastructure layer implementation to be injected
 * while depending only on the Domain layer interface.
 */
export const AUTH_REPOSITORY = new InjectionToken<AuthRepository>('AUTH_REPOSITORY');
