import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { exhaustMap, pipe, tap } from 'rxjs';
import type {
  AuthCredentials,
  AuthProfileUpdate,
  AuthStatus,
} from '@domain/identity/entities/auth-user.entity';
import type { AuthUser } from '@domain/identity/entities/auth-user.entity';
import { AUTH_REPOSITORY } from '@application/tokens/repository.tokens';
import type { AuthRepository } from '@domain/identity/repositories/auth.repository.interface';

export interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: 'initializing',
  loading: false,
  error: null,
};

const toErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ status, user }) => ({
    isAuthenticated: computed(() => status() === 'authenticated'),
    userId: computed(() => user()?.id.getValue() ?? null),
  })),
  withMethods((store, repository = inject<AuthRepository>(AUTH_REPOSITORY)) => ({
    clearError(): void {
      patchState(store, { error: null });
    },
    syncAuthState: rxMethod<void>(
      pipe(
        exhaustMap(() => repository.authState()),
        tapResponse({
          next: (user) =>
            patchState(store, {
              user,
              status: user ? 'authenticated' : 'unauthenticated',
              loading: false,
              error: null,
            }),
          error: (error: unknown) =>
            patchState(store, {
              error: toErrorMessage(error),
              status: 'error',
              loading: false,
            }),
        }),
      ),
    ),
    signIn: rxMethod<AuthCredentials>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        exhaustMap((credentials) => repository.signIn(credentials)),
        tapResponse({
          next: (user) =>
            patchState(store, {
              user,
              status: 'authenticated',
              loading: false,
              error: null,
            }),
          error: (error: unknown) =>
            patchState(store, {
              error: toErrorMessage(error),
              status: 'error',
              loading: false,
            }),
        }),
      ),
    ),
    signUp: rxMethod<AuthCredentials>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        exhaustMap((credentials) => repository.signUp(credentials)),
        tapResponse({
          next: (user) =>
            patchState(store, {
              user,
              status: 'authenticated',
              loading: false,
              error: null,
            }),
          error: (error: unknown) =>
            patchState(store, {
              error: toErrorMessage(error),
              status: 'error',
              loading: false,
            }),
        }),
      ),
    ),
    signOut: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        exhaustMap(() => repository.signOut()),
        tapResponse({
          next: () =>
            patchState(store, {
              user: null,
              status: 'unauthenticated',
              loading: false,
              error: null,
            }),
          error: (error: unknown) =>
            patchState(store, {
              error: toErrorMessage(error),
              status: 'error',
              loading: false,
            }),
        }),
      ),
    ),
    sendPasswordReset: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        exhaustMap((email) => repository.sendPasswordReset(email)),
        tapResponse({
          next: () => patchState(store, { loading: false, error: null }),
          error: (error: unknown) =>
            patchState(store, {
              error: toErrorMessage(error),
              status: 'error',
              loading: false,
            }),
        }),
      ),
    ),
    updateProfile: rxMethod<AuthProfileUpdate>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        exhaustMap((update) => repository.updateProfile(update)),
        tapResponse({
          next: (user) =>
            patchState(store, {
              user,
              status: 'authenticated',
              loading: false,
              error: null,
            }),
          error: (error: unknown) =>
            patchState(store, {
              error: toErrorMessage(error),
              status: 'error',
              loading: false,
            }),
        }),
      ),
    ),
  })),
  withHooks({
    onInit(store) {
      store.syncAuthState();
    },
  }),
);
