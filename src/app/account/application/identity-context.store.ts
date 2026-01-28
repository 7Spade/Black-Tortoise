/**
 * Identity Context Signal Store
 * 
 * Layer: Application
 * Architecture: Zone-less, Signal-based State Management
 * Purpose: Manages current identity context (User vs Organization)
 * 
 * Single Responsibility: Identity selection and context switching
 * This store tracks WHO is currently acting (user or organization context).
 */

import { computed, effect, inject, untracked } from '@angular/core';
import { AuthStore } from '@application/stores/auth.store';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

/**
 * Identity Context State
 */
export interface IdentityContextState {
  readonly currentIdentityId: string | null;
  readonly currentIdentityType: 'user' | 'organization' | null;
}

/**
 * Initial State
 */
const initialState: IdentityContextState = {
  currentIdentityId: null,
  currentIdentityType: null,
};

/**
 * Identity Context Store
 * 
 * Manages the current acting identity context.
 * Automatically syncs with AuthStore for user authentication.
 */
export const IdentityContextStore = signalStore(
  { providedIn: 'root' },
  
  withState(initialState),
  
  withComputed((state) => ({
    /**
     * Is authenticated (has identity context)
     */
    isAuthenticated: computed(() => state.currentIdentityId() !== null),
    
    /**
     * Is in user context
     */
    isUserContext: computed(() => state.currentIdentityType() === 'user'),
    
    /**
     * Is in organization context
     */
    isOrganizationContext: computed(() => state.currentIdentityType() === 'organization'),
  })),
  
  withMethods((store) => ({
    /**
     * Set current identity context
     */
    setIdentity(identityId: string, identityType: 'user' | 'organization'): void {
      patchState(store, {
        currentIdentityId: identityId,
        currentIdentityType: identityType,
      });
    },
    
    /**
     * Clear identity context
     */
    clearIdentity(): void {
      patchState(store, initialState);
    },
    
    /**
     * Reset to initial state
     */
    reset(): void {
      patchState(store, initialState);
    },
  })),
  
  withHooks({
    onInit(store) {
      const authStore = inject(AuthStore);
      
      // Sync identity with auth state
      effect(() => {
        const userId = authStore.currentUserId();
        const currentId = untracked(() => store.currentIdentityId());
        const currentType = untracked(() => store.currentIdentityType());
        
        if (userId) {
          if (!currentId) {
            // Initial load: set user context
            console.log('[IdentityContextStore] Initializing identity from Auth:', userId);
            store.setIdentity(userId, 'user');
          } else if (currentType === 'user' && currentId !== userId) {
            // User changed: reset to new user context
            console.log('[IdentityContextStore] Auth user changed, updating identity:', userId);
            store.setIdentity(userId, 'user');
          }
          // If in organization context, maintain it unless user completely changed
        } else if (!userId && currentId) {
          // User logged out: clear identity
          console.log('[IdentityContextStore] Clearing identity (Auth logout)');
          store.clearIdentity();
        }
      });
    },
  }),
);
