import { DestroyRef, computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { exhaustMap, filter, pipe, tap } from 'rxjs';
import type { WorkspaceOwnerType } from '@domain/identity/identity.types';
import type { WorkspaceModule } from '@domain/modules/entities/workspace-module.entity';
import type { Workspace } from '@domain/workspace/entities/workspace.entity';
import {
  AppEventBus,
  WorkspaceOwnerSelection,
} from '@application/event-bus/app-event-bus.service';
import {
  MODULE_REPOSITORY,
  WORKSPACE_REPOSITORY,
} from '@application/tokens/repository.tokens';
import type { ModuleRepository } from '@domain/modules/repositories/module.repository.interface';
import type { WorkspaceRepository } from '@domain/workspace/repositories/workspace.repository.interface';

export interface WorkspaceState {
  workspaces: Workspace[];
  modules: WorkspaceModule[];
  activeOwner: WorkspaceOwnerSelection | null;
  loading: boolean;
  error: string | null;
}

const initialState: WorkspaceState = {
  workspaces: [],
  modules: [],
  activeOwner: null,
  loading: false,
  error: null,
};

export const WorkspaceStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ activeOwner, workspaces }) => ({
    hasOwner: computed(() => activeOwner() !== null),
    workspaceCount: computed(() => workspaces().length),
  })),
  withMethods(
    (
      store,
      repository = inject<WorkspaceRepository>(WORKSPACE_REPOSITORY),
      moduleRepository = inject<ModuleRepository>(MODULE_REPOSITORY),
    ) => ({
      setActiveOwner(ownerType: WorkspaceOwnerType, ownerId: string): void {
        patchState(store, { activeOwner: { ownerId, ownerType } });
      },
      connectOwnerSelection: rxMethod<WorkspaceOwnerSelection>(
        pipe(
          filter((selection) => selection.ownerId.length > 0),
          tap((selection) =>
            patchState(store, {
              activeOwner: selection,
              loading: true,
              error: null,
            }),
          ),
          exhaustMap((selection) =>
            repository.getWorkspacesByOwner(
              selection.ownerType,
              selection.ownerId,
            ),
          ),
          tapResponse({
            next: (workspaces) =>
              patchState(store, { workspaces, loading: false }),
            error: (error: Error) =>
              patchState(store, { error: error.message, loading: false }),
          }),
        ),
      ),
      loadModules: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          exhaustMap((workspaceId) =>
            moduleRepository.getWorkspaceModules(workspaceId),
          ),
          tapResponse({
            next: (modules) => patchState(store, { modules, loading: false }),
            error: (error: Error) =>
              patchState(store, { error: error.message, loading: false }),
          }),
        ),
      ),
    }),
  ),
  withHooks({
    onInit(store) {
      const eventBus = inject(AppEventBus);
      const destroyRef = inject(DestroyRef);
      store.connectOwnerSelection(
        eventBus
          .onWorkspaceOwnerSelected()
          .pipe(takeUntilDestroyed(destroyRef)),
      );
    },
  }),
);
