/**
 * Auth Signal Store
 * 
 * Layer: Application
 * Purpose: Manage authentication state using NgRx Signals
 * Architecture: Zone-less, Reactive
 * 
 * Responsibilities:
 * - Hold current user state
 * - Handle login/register/logout actions
 * - Expose derived state (isLoggedIn, etc.)
 */

import { computed, inject } from '@angular/core';
import { AUTH_REPOSITORY } from '@application/interfaces';
import { UserEntity } from '@domain/aggregates';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';

interface AuthState {
  user: UserEntity | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  initialized: false
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  
  withComputed(({ user }) => ({
    isLoggedIn: computed(() => !!user()),
    currentUserId: computed(() => user()?.id ?? null),
  })),

  withMethods((store, authRepo = inject(AUTH_REPOSITORY)) => ({
    
    /**
     * Connect to the Auth Stream
     */
    connect: rxMethod<void>(
      pipe(
        switchMap(() => authRepo.authState$),
        tapResponse({
          next: (user) => patchState(store, { user, initialized: true, loading: false }),
          error: (err: any) => patchState(store, { error: err.message, initialized: true, loading: false })
        })
      )
    ),

    /**
     * Login Action
     */
    async login(email: string, password: string) {
      patchState(store, { loading: true, error: null });
      try {
        await authRepo.login(email, password);
        // Successful login will trigger authState$ stream update
      } catch (err: any) {
        patchState(store, { error: err.message, loading: false });
      }
    },

    /**
     * Register Action
     */
    async register(email: string, password: string, displayName: string) {
      patchState(store, { loading: true, error: null });
      try {
        await authRepo.register(email, password, displayName);
        // Successful register will trigger authState$ stream update
      } catch (err: any) {
        patchState(store, { error: err.message, loading: false });
      }
    },

    /**
     * Logout Action
     */
    async logout() {
      patchState(store, { loading: true, error: null });
      try {
        await authRepo.logout();
      } catch (err: any) {
        patchState(store, { error: err.message, loading: false });
      }
    },

    /**
     * Reset Password Action
     */
    async resetPassword(email: string) {
      patchState(store, { loading: true, error: null });
      try {
        await authRepo.resetPassword(email);
        patchState(store, { loading: false }); // No state change other than loading
      } catch (err: any) {
        patchState(store, { error: err.message, loading: false });
      }
    }
  })),

  withHooks({
    onInit(store) {
      // Auto-connect to auth stream on creation
      store.connect();
    }
  })
);
