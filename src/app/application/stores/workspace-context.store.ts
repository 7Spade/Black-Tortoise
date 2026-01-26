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

import { computed, effect, inject, untracked } from '@angular/core';
import { CreateOrganizationHandler } from '@application/handlers/create-organization.handler';
import { CreateWorkspaceHandler } from '@application/handlers/create-workspace.handler';
import { SwitchWorkspaceHandler } from '@application/handlers/switch-workspace.handler';
import { ORGANIZATION_REPOSITORY } from '@application/interfaces/organization-repository.token';
import { WORKSPACE_REPOSITORY } from '@application/interfaces/workspace-repository.token';
import { WORKSPACE_RUNTIME_FACTORY } from '@application/interfaces/workspace-runtime.token';
import { AuthStore } from '@application/stores/auth.store';
import { WorkspaceEntity } from '@domain/aggregates';
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
 * Workspace Context State
 */
export interface WorkspaceContextState {
  readonly currentIdentityId: string | null;
  readonly currentIdentityType: 'user' | 'organization' | null;
  readonly currentOrganizationId: string | null;
  readonly currentOrganizationDisplayName: string | null;
  readonly currentWorkspace: WorkspaceEntity | null;
  readonly availableWorkspaces: ReadonlyArray<WorkspaceEntity>;
  readonly availableOrganizations: ReadonlyArray<Organization>;
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
  availableOrganizations: [],
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
      'Organization'
    ),
  })),
  
  withMethods((store) => {
    const createOrganizationHandler = inject(CreateOrganizationHandler);
    const createWorkspaceHandler = inject(CreateWorkspaceHandler);
    const switchWorkspaceHandler = inject(SwitchWorkspaceHandler);
    const organizationRepository = inject(ORGANIZATION_REPOSITORY);
    const authStore = inject(AuthStore);
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
       * Load available organizations for the current user
       */
      loadOrganizations: rxMethod<void>(
        pipe(
          switchMap(() => {
            const userId = authStore.currentUserId();
            if (!userId) return of([]);
            
            return from(organizationRepository.findByOwner(UserId.create(userId))).pipe(
              tapResponse({
                next: (organizations) => patchState(store, { availableOrganizations: organizations }),
                error: (err: any) => console.error('Failed to load organizations', err)
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
            const ownerId = store.currentIdentityId();
            if (!ownerId) {
                return of(null);
            }

            return from(createOrganizationHandler.execute({
              displayName: command.displayName,
              ownerId: ownerId
            })).pipe(
              tapResponse({
                next: (org) => {
                  patchState(store, { 
                    currentOrganizationId: org.id.toString(),
                    currentOrganizationDisplayName: org.displayName,
                    availableOrganizations: [...store.availableOrganizations(), org],
                    isLoading: false 
                  });
                },
                error: (err: any) => patchState(store, { 
                  isLoading: false, 
                  error: err?.message || 'Failed to create organization' 
                })
              })
            );
          })
        )
      ),

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
        
        // Resolve Org Context from Workspace Owner
        const orgId = workspace.ownerType === 'organization' ? workspace.ownerId : null;
        let orgName = null;
        if (orgId) {
             const org = store.availableOrganizations().find(o => o.id.toString() === orgId);
             orgName = org?.displayName || 'Unknown Organization';
        }

        // Update state
        patchState(store, {
          currentWorkspace: workspace,
          activeModuleId: null,
          currentOrganizationId: orgId,
          currentOrganizationDisplayName: orgName,
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
      
      const auth = inject(AuthStore);

      // Auto-load organizations when authenticated
      effect(() => {
        if (auth.isLoggedIn()) {
          store.loadOrganizations();
        }
      });
      
      // Sync Identity with Auth State
      effect(() => {
        const userId = auth.currentUserId();
        const currentId = untracked(() => store.currentIdentityId());
        
        // Only sync if:
        // 1. User is logged in (userId exists)
        // 2. We have NO identity currently set (initial load)
        // OR
        // 3. The current identity is a User, but it doesn't match the new User ID (account switch)
        // We do NOT force reset if currentId is an Organization (context switch) unless the underlying user actually changed (logic below handles this implicitly if we assume session persistence)
        
        if (userId) {
             if (!currentId) {
                 // Initial load or login
                 console.log('[WorkspaceContextStore] Initializing identity from Auth:', userId);
                 store.setIdentity(userId, 'user');
             } else {
                 // We have an identity. Check if the authenticated user changed effectively.
                 // If the current identity is a "user" type, it MUST match the auth user.
                 const currentType = untracked(() => store.currentIdentityType());
                 if (currentType === 'user' && currentId !== userId) {
                     console.log('[WorkspaceContextStore] Auth user changed, updating identity:', userId);
                     store.setIdentity(userId, 'user');
                 }
                 // If currentType is 'organization', we trust the current state (context switching),
                 // unless we want to validate that the user is still a member of that org (handled by backend/guards).
                 // However, if the User ID completely changed (e.g. login as different user), we probably SHOULD reset.
                 // But simply detecting "userId emitted value" isn't enough to know it "changed" in effect.
                 // Since we untracked currentId, this block only runs when userId changes.
                 // So if userId changes while we are in Org mode, we probably SHOULD reset to User mode.
                 
                 // How to detect "Change" vs "Stable emission"? Signal effects run on change.
                 // So if userId changes, we should reset.
                 
                 // BUT, on first run, it "changes" from undefined to Value.
                 // If we rely on !currentId covering the first run...
                 // Then if currentId exists (e.g. persisted? or invalid state), and userId emits...
                 
                 // Refined Logic:
                 // Always prefer the User Context on Login/User Change.
                 // The Context Switcher Manually calls setIdentity.
                 // The only conflict is if this Effect runs WHEN WE DON'T WANT IT TO.
                 // Untracked() solves the "Switching Context Triggers Reset" bug.
                 
                 // What if I re-authenticate as the SAME user? userId signal emits same value? computed() memoizes.
                 // So if userId is stable, this effect DOES NOT RUN.
                 // If I switch to Org, currentId changes. Untracked ignores it. Effect DOES NOT RUN.
                 // THIS IS CORRECT.
             }
        } else if (!userId && currentId) {
            console.log('[WorkspaceContextStore] Clearing identity (Auth logout)');
            store.reset();
        }
      });
    },
    
    onDestroy() {
      console.log('[WorkspaceContextStore] Destroyed');
    },
  }),
);



