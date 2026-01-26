/**
 * Workspace Context Signal Store
 * 
 * Layer: Application
 * Architecture: Zone-less, Signal-based State Management
 * Purpose: Global shell context for workspace/module management
 * 
 * This store manages the global workspace context using @ngrx/signals
 * and integrates with the DDD domain layer and use cases.
 */

import { computed, inject } from '@angular/core';
import { CreateWorkspaceHandler } from '@application/handlers/create-workspace.handler';
import { SwitchWorkspaceHandler } from '@application/handlers/switch-workspace.handler';
import { WORKSPACE_REPOSITORY } from '@application/interfaces/workspace-repository.token';
import { WORKSPACE_RUNTIME_FACTORY } from '@application/interfaces/workspace-runtime.token';
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
 * Workspace Context State
 */
export interface WorkspaceContextState {
  readonly currentIdentityId: string | null;
  readonly currentIdentityType: 'user' | 'organization' | null;
  readonly currentOrganizationId: string | null;
  readonly currentOrganizationDisplayName: string | null;
  readonly currentWorkspace: WorkspaceEntity | null;
  readonly availableWorkspaces: ReadonlyArray<WorkspaceEntity>;
  readonly activeModuleId: string | null;
  readonly isLoading: boolean;
  readonly error: string | null;
}

/**
 * Initial State
 */
const initialState: WorkspaceContextState = {
  currentIdentityId: null,
  currentIdentityType: null,
  currentOrganizationId: null,
  currentOrganizationDisplayName: null,
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
 * Workspace Context Store
 * 
 * Global singleton managing workspace and module context.
 * Integrates with DDD use cases and workspace runtime.
 */
export const WorkspaceContextStore = signalStore(
  { providedIn: 'root' },
  
  withState(initialState),
  
  withComputed((state) => ({
    /**
     * Is authenticated
     */
    isAuthenticated: computed(() => state.currentIdentityId() !== null),
    
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
    
    /**
     * Current organization display name
     */
    currentOrganizationName: computed(() =>
      state.currentOrganizationDisplayName() ??
      state.currentWorkspace()?.organizationDisplayName ??
      'Organization'
    ),
  })),
  
  withMethods((store) => {
    const createWorkspaceHandler = inject(CreateWorkspaceHandler);
    const switchWorkspaceHandler = inject(SwitchWorkspaceHandler);
    const runtimeFactory = inject(WORKSPACE_RUNTIME_FACTORY);
    const repository = inject(WORKSPACE_REPOSITORY);
    
    return {
      /**
       * Set current identity
       */
      setIdentity(identityId: string, identityType: 'user' | 'organization'): void {
        patchState(store, {
          currentIdentityId: identityId,
          currentIdentityType: identityType,
          error: null,
        });
        // Trigger load
        this.loadWorkspaces();
      },

      /**
       * Set current organization (display only)
       */
      setOrganization(organizationId: string, organizationDisplayName: string): void {
        patchState(store, {
          currentOrganizationId: organizationId,
          currentOrganizationDisplayName: organizationDisplayName,
          error: null,
        });
      },
      
      /**
       * Create new workspace
       */
      createWorkspace: rxMethod<{ name: string; moduleIds?: string[] }>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          exhaustMap(({ name, moduleIds }) => {
            const identityId = store.currentIdentityId();
            const identityType = store.currentIdentityType();
            const organizationId = store.currentOrganizationId() ?? 'org-default';
            const organizationDisplayName = store.currentOrganizationDisplayName() ?? 'Default Organization';
            
            if (!identityId || !identityType) {
              patchState(store, { error: 'No identity selected', isLoading: false });
              return of(null);
            }

            return from(createWorkspaceHandler.execute({
                name,
                organizationId,
                organizationDisplayName,
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
                    currentOrganizationId: workspace.organizationId,
                    currentOrganizationDisplayName: workspace.organizationDisplayName,
                    isLoading: false,
                    error: null,
                  });
                },
                error: (err: any) => patchState(store, { 
                  isLoading: false, 
                  error: err?.message || 'Failed to create workspace' 
                }),
              })
            );
          })
        )
      ),
      
      /**
       * Switch to workspace
       */
      switchWorkspace(workspaceId: string): void {
        const workspace = store.availableWorkspaces().find(w => w.id === workspaceId);
        
        if (!workspace) {
          patchState(store, { error: `Workspace ${workspaceId} not found` });
          return;
        }
        
        const previousWorkspaceId = store.currentWorkspace()?.id || null;
        
        // Execute use case
        switchWorkspaceHandler.execute({
          previousWorkspaceId,
          targetWorkspaceId: workspaceId,
        });
        
        // Ensure runtime exists
        runtimeFactory.createRuntime(workspace);
        
        // Update state
        patchState(store, {
          currentWorkspace: workspace,
          activeModuleId: null,
          currentOrganizationId: workspace.organizationId,
          currentOrganizationDisplayName: workspace.organizationDisplayName,
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
             const ownerId = store.currentIdentityId();
             const ownerType = store.currentIdentityType();

             if (!ownerId || !ownerType) {
                 return of([]);
             }

             return from(repository.findByOwnerId(ownerId, ownerType)).pipe(
               tapResponse({
                 next: (workspaces) => {
                   workspaces.forEach(ws => runtimeFactory.createRuntime(ws));
                   patchState(store, { 
                     availableWorkspaces: workspaces,
                     isLoading: false 
                   });
                 },
                 error: (err: any) => patchState(store, { 
                   isLoading: false, 
                   error: err?.message || 'Failed to load workspaces' 
                 })
               })
             );
          })
        )
      ),
      
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
    onInit(store) {
      // Auto-load if identity exists (or listener could be set up here if we had an AuthStore ref)
      console.log('[WorkspaceContextStore] Initialized');
    },
    
    onDestroy() {
      console.log('[WorkspaceContextStore] Destroyed');
    },
  }),
);



