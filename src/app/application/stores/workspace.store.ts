/**
 * Workspace Signal Store
 * 
 * Layer: Application
 * Architecture: Zone-less, Signal-based State Management
 * Purpose: Manages workspace aggregate state
 * 
 * Single Responsibility: Workspace state and operations
 * This store manages workspaces, current workspace selection, and module activation.
 */

import { computed, inject } from '@angular/core';
import { CreateWorkspaceHandler } from '@application/handlers/create-workspace.handler';
import { SwitchWorkspaceHandler } from '@application/handlers/switch-workspace.handler';
import { WORKSPACE_REPOSITORY } from '@application/interfaces/workspace-repository.token';
import { WORKSPACE_RUNTIME_FACTORY } from '@application/interfaces/workspace-runtime.token';
import { AcceptanceStore } from '@application/stores/acceptance.store';
import { AuditStore } from '@application/stores/audit.store';
import { DailyStore } from '@application/stores/daily.store';
import { DocumentsStore } from '@application/stores/documents.store';
import { IdentityContextStore } from '@account/application';
import { IssuesStore } from '@application/stores/issues.store';
import { MembersStore } from '@application/stores/members.store';
import { OrganizationStore } from '@account/application';
import { OverviewStore } from '@application/stores/overview.store';
import { PermissionsStore } from '@application/stores/permissions.store';
import { QualityControlStore } from '@application/stores/quality-control.store';
import { SettingsStore } from '@application/stores/settings.store';
import { TasksStore } from '@application/stores/tasks.store';
import { WorkspaceEntity } from '@domain/aggregates';
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
 * Workspace State
 */
export interface WorkspaceState {
  readonly currentWorkspace: WorkspaceEntity | null;
  readonly availableWorkspaces: ReadonlyArray<WorkspaceEntity>;
  readonly activeModuleId: string | null;
  readonly isLoading: boolean;
  readonly error: string | null;
}

/**
 * Initial State
 */
const initialState: WorkspaceState = {
  currentWorkspace: null,
  availableWorkspaces: [],
  activeModuleId: null,
  isLoading: false,
  error: null,
};

/**
 * All 11 standard workspace modules
 */
const ALL_MODULE_IDS: string[] = [
  'overview',
  'documents',
  'tasks',
  'calendar',
  'daily',
  'quality-control',
  'acceptance',
  'issues',
  'members',
  'permissions',
  'audit',
  'settings',
];

/**
 * Workspace Store
 * 
 * Manages workspace aggregate state.
 * Integrates with domain layer through handlers and repositories.
 * Depends on IdentityContextStore for owner context.
 */
export const WorkspaceStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((state) => ({
    /**
     * Has workspace context
     */
    hasWorkspace: computed(() => state.currentWorkspace() !== null),

    /**
     * Current workspace modules
     */
    currentWorkspaceModules: computed(() =>
      state.currentWorkspace()?.moduleIds ?? []
    ),

    /**
     * Workspace count
     */
    workspaceCount: computed(() => state.availableWorkspaces().length),

    /**
     * Current workspace name
     */
    currentWorkspaceName: computed(() =>
      state.currentWorkspace()?.name ?? 'No Workspace'
    ),
  })),

  withMethods((store) => {
    const createWorkspaceHandler = inject(CreateWorkspaceHandler);
    const switchWorkspaceHandler = inject(SwitchWorkspaceHandler);
    const repository = inject(WORKSPACE_REPOSITORY);
    const runtimeFactory = inject(WORKSPACE_RUNTIME_FACTORY);
    const identityContext = inject(IdentityContextStore);
    const organizationStore = inject(OrganizationStore);

    // Module stores for cleanup
    const tasksStore = inject(TasksStore);
    const documentsStore = inject(DocumentsStore);
    const issuesStore = inject(IssuesStore);
    const membersStore = inject(MembersStore);
    const permissionsStore = inject(PermissionsStore);
    const auditStore = inject(AuditStore);
    const settingsStore = inject(SettingsStore);
    const overviewStore = inject(OverviewStore);
    const qualityControlStore = inject(QualityControlStore);
    const acceptanceStore = inject(AcceptanceStore);
    const dailyStore = inject(DailyStore);

    return {
      /**
       * Create new workspace
       */
      createWorkspace: rxMethod<{ name: string; moduleIds?: string[] }>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          exhaustMap(({ name, moduleIds }) => {
            const identityId = identityContext.currentIdentityId();
            const identityType = identityContext.currentIdentityType();

            if (!identityId || !identityType) {
              patchState(store, {
                error: 'No identity selected',
                isLoading: false,
              });
              return of(null);
            }

            return from(createWorkspaceHandler.execute({
              name,
              ownerId: identityId,
              ownerType: identityType,
              moduleIds: moduleIds ?? ALL_MODULE_IDS,
            })).pipe(
              tapResponse({
                next: (workspace) => {
                  runtimeFactory.createRuntime(workspace);
                  patchState(store, {
                    availableWorkspaces: [...store.availableWorkspaces(), workspace],
                    currentWorkspace: workspace,
                    isLoading: false,
                    error: null,
                  });
                },
                error: (err: unknown) => {
                  console.error('[WorkspaceStore] Failed to create workspace', err);
                  patchState(store, {
                    isLoading: false,
                    error: err instanceof Error ? err.message : 'Failed to create workspace',
                  });
                },
              })
            );
          })
        )
      ),

      /**
       * Switch to workspace
       * 
       * Orchestration order (workspace switch cleanup):
       * 1. Set loading/unknown state
       * 2. Stop all module runtimes
       * 3. Stop workspace event bus (destroyRuntime)
       * 4. Reset all module stores
       * 5. Start new workspace event bus (createRuntime)
       * 6. Start module runtimes (implicit via createRuntime)
       * 7. Set ready state
       */
      switchWorkspace(workspaceId: string): void {
        const workspace = store.availableWorkspaces().find(w => w.id === workspaceId);

        if (!workspace) {
          patchState(store, { error: `Workspace ${workspaceId} not found` });
          return;
        }

        const previousWorkspaceId = store.currentWorkspace()?.id || null;

        // 1. Set loading/unknown state (signal to UI: workspace switching)
        patchState(store, {
          isLoading: true,
          currentWorkspace: null,
          error: null
        });

        // 2-3. Stop all module runtimes and dispose workspace-scoped event bus
        if (previousWorkspaceId) {
          runtimeFactory.destroyRuntime(previousWorkspaceId);
        }

        // 4. Reset all module stores (clear workspace-scoped data)
        tasksStore.reset();
        documentsStore.reset();
        issuesStore.reset();
        membersStore.reset();
        permissionsStore.reset();
        auditStore.reset();
        settingsStore.reset();
        overviewStore.reset();
        qualityControlStore.reset();
        acceptanceStore.reset();
        dailyStore.reset();

        // Execute domain use case (business logic)
        switchWorkspaceHandler.execute({
          previousWorkspaceId,
          targetWorkspaceId: workspaceId,
        });

        // 5-6. Create new workspace runtime (starts new event bus and module runtimes)
        runtimeFactory.createRuntime(workspace);

        // Update organization context if workspace is org-owned
        if (workspace.ownerType === 'organization') {
          const org = organizationStore.findOrganizationById(workspace.ownerId);
          if (org) {
            organizationStore.setCurrentOrganization(
              org.id.toString(),
              org.displayName
            );
          }
        } else {
          // User-owned workspace: clear org context
          organizationStore.clearCurrentOrganization();
        }

        // 7. Set ready state (signal to UI: workspace ready)
        patchState(store, {
          currentWorkspace: workspace,
          activeModuleId: null,
          isLoading: false,
          error: null,
        });
      },

      /**
       * Activate module
       */
      activateModule(moduleId: string): void {
        const workspace = store.currentWorkspace();

        if (!workspace) {
          patchState(store, { error: 'No workspace selected' });
          return;
        }

        if (!workspace.moduleIds.includes(moduleId)) {
          patchState(store, { error: `Module ${moduleId} not enabled` });
          return;
        }

        patchState(store, {
          activeModuleId: moduleId,
          error: null,
        });
      },

      /**
       * Load available workspaces for current identity
       */
      loadWorkspaces: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(() => {
            const ownerId = identityContext.currentIdentityId();
            const ownerType = identityContext.currentIdentityType();

            if (!ownerId || !ownerType) {
              patchState(store, { isLoading: false });
              return of([]);
            }

            return from(repository.findByOwnerId(ownerId, ownerType)).pipe(
              tapResponse({
                next: (workspaces) => {
                  workspaces.forEach(ws => runtimeFactory.createRuntime(ws));
                  patchState(store, {
                    availableWorkspaces: workspaces,
                    isLoading: false,
                    error: null,
                  });
                },
                error: (err: unknown) => {
                  console.error('[WorkspaceStore] Failed to load workspaces', err);
                  patchState(store, {
                    isLoading: false,
                    error: err instanceof Error ? err.message : 'Failed to load workspaces',
                  });
                },
              })
            );
          })
        )
      ),

      /**
       * Find workspace by ID
       */
      findWorkspaceById(workspaceId: string): WorkspaceEntity | undefined {
        return store.availableWorkspaces().find(w => w.id === workspaceId);
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
        // Cleanup all runtimes
        runtimeFactory.destroyAll();

        patchState(store, initialState);
      },
    };
  }),

  withHooks({
    onInit() {
      console.log('[WorkspaceStore] Initialized');
    },

    onDestroy() {
      console.log('[WorkspaceStore] Destroyed');
    },
  }),
);
