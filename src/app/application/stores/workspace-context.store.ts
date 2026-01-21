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

import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { WorkspaceEntity } from '../../domain/workspace/workspace.entity';
import { ModuleType } from '../../domain/module/module.interface';
import { CreateWorkspaceUseCase } from '../workspace/create-workspace.use-case';
import { SwitchWorkspaceUseCase } from '../workspace/switch-workspace.use-case';
import { WorkspaceRuntimeFactory } from '../../infrastructure/runtime/workspace-runtime.factory';

/**
 * Workspace Context State
 */
export interface WorkspaceContextState {
  readonly currentIdentityId: string | null;
  readonly currentIdentityType: 'user' | 'organization' | null;
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
  currentWorkspace: null,
  availableWorkspaces: [],
  activeModuleId: null,
  isLoading: false,
  error: null,
};

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
  })),
  
  withMethods((store) => {
    const createWorkspaceUseCase = inject(CreateWorkspaceUseCase);
    const switchWorkspaceUseCase = inject(SwitchWorkspaceUseCase);
    const runtimeFactory = inject(WorkspaceRuntimeFactory);
    
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
       * Create new workspace
       */
      createWorkspace(name: string, moduleIds?: string[]): WorkspaceEntity {
        const identityId = store.currentIdentityId();
        const identityType = store.currentIdentityType();
        
        if (!identityId || !identityType) {
          patchState(store, { error: 'No identity selected' });
          throw new Error('Cannot create workspace: No identity selected');
        }
        
        // Execute use case
        const workspace = createWorkspaceUseCase.execute({
          name,
          ownerId: identityId,
          ownerType: identityType,
          moduleIds,
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
       */
      loadDemoData(): void {
        // Demo identity
        const demoUserId = 'user-demo-001';
        
        patchState(store, {
          currentIdentityId: demoUserId,
          currentIdentityType: 'user',
        });
        
        // Create demo workspaces
        const workspace1 = createWorkspaceUseCase.execute({
          name: 'Personal Projects',
          ownerId: demoUserId,
          ownerType: 'user',
          moduleIds: ['overview', 'documents', 'tasks', 'settings'],
        });
        
        const workspace2 = createWorkspaceUseCase.execute({
          name: 'Team Collaboration',
          ownerId: demoUserId,
          ownerType: 'user',
          moduleIds: ['overview', 'documents', 'tasks', 'calendar', 'settings'],
        });
        
        // Create runtimes
        runtimeFactory.createRuntime(workspace1);
        runtimeFactory.createRuntime(workspace2);
        
        // Update state
        patchState(store, {
          availableWorkspaces: [workspace1, workspace2],
          currentWorkspace: workspace1,
          activeModuleId: 'overview',
          isLoading: false,
          error: null,
        });
      },
    };
  }),
  
  withHooks({
    onInit(store) {
      console.log('[WorkspaceContextStore] Initialized (zone-less mode)');
    },
    
    onDestroy() {
      console.log('[WorkspaceContextStore] Destroyed');
    },
  }),
);
