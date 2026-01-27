/**
 * Organization Signal Store
 * 
 * Layer: Application
 * Architecture: Zone-less, Signal-based State Management
 * Purpose: Manages organization aggregate state
 * 
 * Single Responsibility: Organization state and operations
 * This store manages organizations available to the user and current organization context.
 */

import { computed, effect, inject } from '@angular/core';
import { CreateOrganizationHandler } from '@application/handlers/create-organization.handler';
import { ORGANIZATION_REPOSITORY } from '@application/interfaces/organization-repository.token';
import { IdentityContextStore } from '@application/stores/identity-context.store';
import { Organization } from '@domain/entities/organization.entity';
import { UserId } from '@domain/value-objects/user-id.vo';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, from, of, pipe, switchMap, tap } from 'rxjs';

/**
 * Organization State
 */
export interface OrganizationState {
  readonly availableOrganizations: ReadonlyArray<Organization>;
  readonly currentOrganizationId: string | null;
  readonly currentOrganizationDisplayName: string | null;
  readonly isLoading: boolean;
  readonly error: string | null;
}

/**
 * Initial State
 */
const initialState: OrganizationState = {
  availableOrganizations: [],
  currentOrganizationId: null,
  currentOrganizationDisplayName: null,
  isLoading: false,
  error: null,
};

/**
 * Organization Store
 * 
 * Manages organization aggregate state.
 * Integrates with domain layer through handlers and repositories.
 */
export const OrganizationStore = signalStore(
  { providedIn: 'root' },
  
  withState(initialState),
  
  withComputed((state) => ({
    /**
     * Has current organization
     */
    hasCurrentOrganization: computed(() => state.currentOrganizationId() !== null),
    
    /**
     * Current organization name (with fallback)
     */
    currentOrganizationName: computed(() =>
      state.currentOrganizationDisplayName() ?? 'Organization'
    ),
    
    /**
     * Organization count
     */
    organizationCount: computed(() => state.availableOrganizations().length),
  })),
  
  withMethods((store) => {
    const createOrganizationHandler = inject(CreateOrganizationHandler);
    const organizationRepository = inject(ORGANIZATION_REPOSITORY);
    const identityContext = inject(IdentityContextStore);
    
    return {
      /**
       * Set current organization (for context switching)
       */
      setCurrentOrganization(organizationId: string, displayName: string): void {
        patchState(store, {
          currentOrganizationId: organizationId,
          currentOrganizationDisplayName: displayName,
          error: null,
        });
      },
      
      /**
       * Clear current organization
       */
      clearCurrentOrganization(): void {
        patchState(store, {
          currentOrganizationId: null,
          currentOrganizationDisplayName: null,
        });
      },
      
      /**
       * Load available organizations for the current user
       */
      loadOrganizations: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(() => {
            const identityId = identityContext.currentIdentityId();
            const identityType = identityContext.currentIdentityType();
            
            // Only load orgs for user context
            if (!identityId || identityType !== 'user') {
              patchState(store, { isLoading: false });
              return of([]);
            }
            
            return from(organizationRepository.findByOwner(UserId.create(identityId))).pipe(
              tapResponse({
                next: (organizations) => patchState(store, {
                  availableOrganizations: organizations,
                  isLoading: false,
                  error: null,
                }),
                error: (err: unknown) => {
                  console.error('[OrganizationStore] Failed to load organizations', err);
                  patchState(store, {
                    isLoading: false,
                    error: err instanceof Error ? err.message : 'Failed to load organizations',
                  });
                },
              })
            );
          })
        )
      ),
      
      /**
       * Create new organization
       */
      createOrganization: rxMethod<{ displayName: string }>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          exhaustMap((command) => {
            const ownerId = identityContext.currentIdentityId();
            
            if (!ownerId) {
              patchState(store, {
                isLoading: false,
                error: 'No authenticated user',
              });
              return of(null);
            }
            
            return from(createOrganizationHandler.execute({
              displayName: command.displayName,
              ownerId: ownerId,
            })).pipe(
              tapResponse({
                next: (org) => {
                  patchState(store, {
                    currentOrganizationId: org.id.toString(),
                    currentOrganizationDisplayName: org.displayName,
                    availableOrganizations: [...store.availableOrganizations(), org],
                    isLoading: false,
                    error: null,
                  });
                },
                error: (err: unknown) => {
                  console.error('[OrganizationStore] Failed to create organization', err);
                  patchState(store, {
                    isLoading: false,
                    error: err instanceof Error ? err.message : 'Failed to create organization',
                  });
                },
              })
            );
          })
        )
      ),
      
      /**
       * Find organization by ID
       */
      findOrganizationById(organizationId: string): Organization | undefined {
        return store.availableOrganizations().find(o => o.id.toString() === organizationId);
      },
      
      /**
       * Set loading state
       */
      setLoading(isLoading: boolean): void {
        patchState(store, { isLoading });
      },
      
      /**
       * Set error
       */
      setError(error: string | null): void {
        patchState(store, { error });
      },
      
      /**
       * Reset store
       */
      reset(): void {
        patchState(store, initialState);
      },
    };
  }),
  
  withHooks({
    onInit(store) {
      const identityContext = inject(IdentityContextStore);
      
      // Auto-load organizations when in user context
      effect(() => {
        if (identityContext.isUserContext()) {
          store.loadOrganizations();
        }
      });
    },
  }),
);
