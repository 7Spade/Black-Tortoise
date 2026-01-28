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
import { AUTH_REPOSITORY, AUTH_STREAM } from '@application/interfaces';
import { User } from '@account/index';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';

type AuthStatus = 'unknown' | 'anonymous' | 'authenticated';

interface AuthState {
  user: User | null;
  status: AuthStatus;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: 'unknown',
  loading: false,
  error: null
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({ user, status }) => ({
    isLoggedIn: computed(() => status() === 'authenticated'),
    isAnonymous: computed(() => status() === 'anonymous'),
    isUnknown: computed(() => status() === 'unknown'),
    currentUserId: computed(() => user()?.id?.toString() ?? null),
    displayName: computed(() => user()?.displayName ?? ''),
    email: computed(() => user()?.email?.toString() ?? ''),
    photoUrl: computed(() => user()?.photoUrl ?? null),
  })),

  withMethods((store) => {
    const authRepo = inject(AUTH_REPOSITORY);
    const authStream = inject(AUTH_STREAM);

    return {

      /**
       * Connect to the Auth Stream
       */
      connect: rxMethod<void>(
        pipe(
          switchMap(() => authStream.authState$),
          tapResponse({
            next: (user) => patchState(store, {
              user,
              status: user ? 'authenticated' : 'anonymous',
              loading: false
            }),
            error: (err: any) => patchState(store, {
              error: err.message,
              status: 'anonymous', // Fallback to anonymous on error
              loading: false
            })
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
    };
  }),

  withHooks({
    onInit(store) {
      // Auto-connect to auth stream on creation
      store.connect();
    }
  })
);
