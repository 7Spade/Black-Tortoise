import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { exhaustMap, pipe, tap } from 'rxjs';
import type { WorkspaceOwnerType } from '@domain/identity/identity.types';
import type { Bot } from '@domain/identity/entities/bot.entity';
import type { Organization } from '@domain/identity/entities/organization.entity';
import type { User } from '@domain/identity/entities/user.entity';
import type { Partner } from '@domain/membership/entities/partner.entity';
import type { Team } from '@domain/membership/entities/team.entity';
import { AppEventBus } from '@application/event-bus/app-event-bus.service';
import {
  IDENTITY_REPOSITORY,
  MEMBERSHIP_REPOSITORY,
} from '@application/tokens/repository.tokens';
import type { IdentityRepository } from '@domain/identity/repositories/identity.repository.interface';
import type { MembershipRepository } from '@domain/membership/repositories/membership.repository.interface';

export interface IdentityState {
  users: User[];
  organizations: Organization[];
  bots: Bot[];
  teams: Team[];
  partners: Partner[];
  activeWorkspaceOwner: {
    ownerId: string;
    ownerType: WorkspaceOwnerType;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: IdentityState = {
  users: [],
  organizations: [],
  bots: [],
  teams: [],
  partners: [],
  activeWorkspaceOwner: null,
  loading: false,
  error: null,
};

export const IdentityStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ activeWorkspaceOwner, organizations }) => ({
    hasWorkspaceOwner: computed(() => activeWorkspaceOwner() !== null),
    organizationCount: computed(() => organizations().length),
  })),
  withMethods(
    (
      store,
      repository = inject<IdentityRepository>(IDENTITY_REPOSITORY),
      membershipRepository = inject<MembershipRepository>(MEMBERSHIP_REPOSITORY),
      eventBus = inject(AppEventBus),
    ) => ({
      selectWorkspaceOwner(ownerType: WorkspaceOwnerType, ownerId: string): void {
        const selection = { ownerId, ownerType };
        patchState(store, { activeWorkspaceOwner: selection });
        eventBus.emit({
          type: 'workspace-owner-selected',
          payload: selection,
        });
      },
      loadUsers: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          exhaustMap(() => repository.getUsers()),
          tapResponse({
            next: (users) => patchState(store, { users, loading: false }),
            error: (error: Error) =>
              patchState(store, { error: error.message, loading: false }),
          }),
        ),
      ),
      loadOrganizations: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          exhaustMap(() => repository.getOrganizations()),
          tapResponse({
            next: (organizations) =>
              patchState(store, { organizations, loading: false }),
            error: (error: Error) =>
              patchState(store, { error: error.message, loading: false }),
          }),
        ),
      ),
      loadBots: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          exhaustMap(() => repository.getBots()),
          tapResponse({
            next: (bots) => patchState(store, { bots, loading: false }),
            error: (error: Error) =>
              patchState(store, { error: error.message, loading: false }),
          }),
        ),
      ),
      loadTeams: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          exhaustMap((organizationId) =>
            membershipRepository.getTeams(organizationId),
          ),
          tapResponse({
            next: (teams) => patchState(store, { teams, loading: false }),
            error: (error: Error) =>
              patchState(store, { error: error.message, loading: false }),
          }),
        ),
      ),
      loadPartners: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          exhaustMap((organizationId) =>
            membershipRepository.getPartners(organizationId),
          ),
          tapResponse({
            next: (partners) => patchState(store, { partners, loading: false }),
            error: (error: Error) =>
              patchState(store, { error: error.message, loading: false }),
          }),
        ),
      ),
    }),
  ),
);
