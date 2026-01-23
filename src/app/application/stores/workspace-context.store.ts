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
import { CreateWorkspaceUseCase } from '@application/workspace/create-workspace.use-case';
import { SwitchWorkspaceUseCase } from '@application/workspace/switch-workspace.use-case';
import { WORKSPACE_RUNTIME_FACTORY } from '@application/tokens/workspace-runtime.token';
import { OrganizationEntity } from '@domain/organization/organization.entity';
import { WorkspaceEntity } from '@domain/workspace/workspace.entity';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

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
    const createWorkspaceUseCase = inject(CreateWorkspaceUseCase);
    const switchWorkspaceUseCase = inject(SwitchWorkspaceUseCase);
    const runtimeFactory = inject(WORKSPACE_RUNTIME_FACTORY);
    let demoRuntimeInitialized = false;
    
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
      createWorkspace(name: string, moduleIds?: string[]): WorkspaceEntity {
        const identityId = store.currentIdentityId();
        const identityType = store.currentIdentityType();
        const organizationId = store.currentOrganizationId() ?? 'org-demo-001';
        const organizationDisplayName = store.currentOrganizationDisplayName() ?? 'Demo Organization';
        
        if (!identityId || !identityType) {
          patchState(store, { error: 'No identity selected' });
          throw new Error('Cannot create workspace: No identity selected');
        }
        
        // Execute use case with all modules if not specified
        const workspace = createWorkspaceUseCase.execute({
          name,
          organizationId,
          organizationDisplayName,
          ownerId: identityId,
          ownerType: identityType,
          moduleIds: moduleIds ?? ALL_MODULE_IDS,
        });
        
        // Create runtime for new workspace
        runtimeFactory.createRuntime(workspace);
        
        // Add to available workspaces
        patchState(store, {
          availableWorkspaces: [...store.availableWorkspaces(), workspace],
          error: null,
        });
        
        return workspace;
      },
      
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
        switchWorkspaceUseCase.execute({
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
      loadWorkspaces(workspaces: ReadonlyArray<WorkspaceEntity>): void {
        patchState(store, {
          availableWorkspaces: workspaces,
          error: null,
        });
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
      
      /**
       * Load demo data for demonstration
       * Updated to include all 11 modules
       */
      loadDemoData(): void {
        if (demoRuntimeInitialized) {
          return;
        }

        // Demo identity
        const demoUserId = 'user-demo-001';
        const demoOrganizationId = 'org-demo-001';
        const demoOrganizationName = 'Demo Organization';
        const demoOrganization: OrganizationEntity = {
          id: demoOrganizationId,
          displayName: demoOrganizationName,
        };
        
        patchState(store, {
          currentIdentityId: demoUserId,
          currentIdentityType: 'user',
          currentOrganizationId: demoOrganization.id,
          currentOrganizationDisplayName: demoOrganization.displayName,
        });
        
        // Create demo workspaces with all 11 modules
        const workspace1 = createWorkspaceUseCase.execute({
          name: 'Personal Projects',
          organizationId: demoOrganizationId,
          organizationDisplayName: demoOrganizationName,
          ownerId: demoUserId,
          ownerType: 'user',
          moduleIds: ALL_MODULE_IDS,
        });
        
        const workspace2 = createWorkspaceUseCase.execute({
          name: 'Team Collaboration',
          organizationId: demoOrganizationId,
          organizationDisplayName: demoOrganizationName,
          ownerId: demoUserId,
          ownerType: 'user',
          moduleIds: ALL_MODULE_IDS,
        });
        
        // Create runtimes
        runtimeFactory.createRuntime(workspace1);
        runtimeFactory.createRuntime(workspace2);
        
        // Update state
        patchState(store, {
          availableWorkspaces: [workspace1, workspace2],
          currentWorkspace: workspace1,
          activeModuleId: 'overview',
          currentOrganizationId: demoOrganizationId,
          currentOrganizationDisplayName: demoOrganizationName,
          isLoading: false,
          error: null,
        });

        demoRuntimeInitialized = true;
      },
    };
  }),
  
  withHooks({
    onInit(store) {
      const demoMode = globalThis?.location?.pathname?.startsWith('/demo') ?? false;
      if (!demoMode) {
        store.loadDemoData();
      }
    },
    
    onDestroy() {
      console.log('[WorkspaceContextStore] Destroyed');
    },
  }),
);
