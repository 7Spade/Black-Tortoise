/**
 * Application Context Store
 * 
 * Domain-Driven Design: Application Layer Store
 * Layer: Application (Global Shell)
 * Architecture: Zone-less, Signal-based State Management
 * 
 * This store manages the global application context using @ngrx/signals.
 * It provides reactive state management without Zone.js dependency.
 * 
 * Design Principles:
 * - Immutable state updates via patchState
 * - Computed signals for derived state
 * - Type-safe methods for state transitions
 * - Lifecycle hooks for initialization
 * - DDD boundary compliance (Identity → Workspace → Module)
 * 
 * Zone-less Compliance:
 * - All state changes are signal-based
 * - No manual change detection required
 * - UI automatically updates on signal changes
 * - Compatible with OnPush change detection strategy
 */

import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed } from '@angular/core';
import {
  ApplicationContextState,
  Identity,
  Workspace,
  ModuleType,
  ActiveModule,
  initialApplicationContextState,
} from './application-context.state';

/**
 * Application Context Store
 * 
 * Global singleton store that manages:
 * 1. Identity state (current authenticated entity)
 * 2. Workspace state (current and available workspaces)
 * 3. Module state (currently active module)
 * 4. Loading and error states
 * 
 * Usage:
 * ```typescript
 * // In component:
 * readonly appContext = inject(ApplicationContextStore);
 * 
 * // In template with signals:
 * @if (appContext.currentIdentity(); as identity) {
 *   <div>{{ identity.displayName }}</div>
 * }
 * 
 * @for (workspace of appContext.availableWorkspaces(); track workspace.id) {
 *   <div>{{ workspace.name }}</div>
 * }
 * ```
 */
export const ApplicationContextStore = signalStore(
  { providedIn: 'root' }, // Global singleton at application shell level
  
  withState(initialApplicationContextState),
  
  withComputed((state) => ({
    /**
     * Computed: Is user authenticated?
     * Returns true if there is a current identity
     */
    isAuthenticated: computed(() => state.currentIdentity() !== null),
    
    /**
     * Computed: Has workspace context?
     * Returns true if there is a current workspace selected
     */
    hasWorkspaceContext: computed(() => state.currentWorkspace() !== null),
    
    /**
     * Computed: Active workspace modules
     * Returns the list of enabled modules in the current workspace
     */
    activeWorkspaceModules: computed(() => 
      state.currentWorkspace()?.enabledModules ?? []
    ),
    
    /**
     * Computed: Workspace count
     * Returns the number of available workspaces
     */
    workspaceCount: computed(() => state.availableWorkspaces().length),
    
    /**
     * Computed: Current identity display name
     * Returns the display name of current identity or 'Guest'
     */
    currentIdentityName: computed(() => 
      state.currentIdentity()?.displayName ?? 'Guest'
    ),
    
    /**
     * Computed: Current workspace name
     * Returns the name of current workspace or 'No Workspace'
     */
    currentWorkspaceName: computed(() => 
      state.currentWorkspace()?.name ?? 'No Workspace'
    ),
  })),
  
  withMethods((store) => ({
    /**
     * Set current identity
     * Updates the authenticated identity state
     * 
     * @param identity - The authenticated identity or null for logout
     */
    setIdentity(identity: Identity | null): void {
      patchState(store, { 
        currentIdentity: identity,
        error: null,
      });
    },
    
    /**
     * Set available workspaces
     * Updates the list of workspaces accessible by current identity
     * 
     * @param workspaces - Array of accessible workspaces
     */
    setAvailableWorkspaces(workspaces: ReadonlyArray<Workspace>): void {
      patchState(store, { 
        availableWorkspaces: workspaces,
        error: null,
      });
    },
    
    /**
     * Select workspace
     * Sets the current active workspace context
     * 
     * @param workspace - The workspace to activate
     */
    selectWorkspace(workspace: Workspace | null): void {
      patchState(store, { 
        currentWorkspace: workspace,
        currentModule: null, // Reset module when workspace changes
        error: null,
      });
    },
    
    /**
     * Select module
     * Sets the currently active module within the workspace
     * 
     * @param moduleType - The module type to activate
     */
    selectModule(moduleType: ModuleType): void {
      const currentWorkspace = store.currentWorkspace();
      
      if (!currentWorkspace) {
        patchState(store, { 
          error: 'Cannot select module: No workspace context',
        });
        return;
      }
      
      if (!currentWorkspace.enabledModules.includes(moduleType)) {
        patchState(store, { 
          error: `Module "${moduleType}" is not enabled in current workspace`,
        });
        return;
      }
      
      const moduleConfig: Record<ModuleType, { label: string; path: string }> = {
        overview: { label: 'Overview', path: '/overview' },
        documents: { label: 'Documents', path: '/documents' },
        tasks: { label: 'Tasks', path: '/tasks' },
        settings: { label: 'Settings', path: '/settings' },
        calendar: { label: 'Calendar', path: '/calendar' },
      };
      
      const config = moduleConfig[moduleType];
      const activeModule: ActiveModule = {
        type: moduleType,
        label: config.label,
        path: config.path,
      };
      
      patchState(store, { 
        currentModule: activeModule,
        error: null,
      });
    },
    
    /**
     * Set loading state
     * Updates the loading indicator
     * 
     * @param isLoading - Loading state
     */
    setLoading(isLoading: boolean): void {
      patchState(store, { isLoading });
    },
    
    /**
     * Set error state
     * Updates the error message
     * 
     * @param error - Error message or null to clear
     */
    setError(error: string | null): void {
      patchState(store, { error });
    },
    
    /**
     * Clear error
     * Resets the error state to null
     */
    clearError(): void {
      patchState(store, { error: null });
    },
    
    /**
     * Reset store
     * Resets all state to initial values (logout scenario)
     */
    reset(): void {
      patchState(store, initialApplicationContextState);
    },
    
    /**
     * Load demo data
     * Populates the store with sample data for demonstration
     * This method is for demo purposes only and should not be used in production
     */
    loadDemoData(): void {
      // Create demo identity (User)
      const demoIdentity: Identity = {
        id: 'user-001',
        type: 'user',
        displayName: 'John Doe',
        email: 'john.doe@example.com',
        avatarUrl: null,
      };
      
      // Create demo workspaces
      const demoWorkspaces: Workspace[] = [
        {
          id: 'ws-001',
          name: 'Personal Workspace',
          ownerId: 'user-001',
          ownerType: 'user',
          enabledModules: ['overview', 'documents', 'tasks', 'settings'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'ws-002',
          name: 'Team Projects',
          ownerId: 'org-001',
          ownerType: 'organization',
          enabledModules: ['overview', 'documents', 'tasks', 'calendar', 'settings'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'ws-003',
          name: 'Client Collaboration',
          ownerId: 'org-001',
          ownerType: 'organization',
          enabledModules: ['overview', 'documents'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      // Use explicit null check and type assertion for exactOptionalPropertyTypes
      const firstWorkspace: Workspace | null = demoWorkspaces[0] ?? null;
      
      patchState(store, {
        currentIdentity: demoIdentity,
        availableWorkspaces: demoWorkspaces as ReadonlyArray<Workspace>,
        currentWorkspace: firstWorkspace,
        currentModule: {
          type: 'overview' as ModuleType,
          label: 'Overview',
          path: '/overview',
        } as ActiveModule,
        isLoading: false,
        error: null,
      });
    },
  })),
  
  withHooks({
    /**
     * Lifecycle: onInit
     * Called when the store is first initialized
     * 
     * In a real application, this would:
     * 1. Check for existing auth session
     * 2. Load user workspaces
     * 3. Restore last active workspace/module
     * 
     * For demo purposes, we just log initialization
     */
    onInit(store) {
      console.log('[ApplicationContextStore] Initialized (zone-less mode)');
      console.log('[ApplicationContextStore] Ready for signal-based state management');
    },
    
    /**
     * Lifecycle: onDestroy
     * Called when the store is destroyed (app shutdown)
     */
    onDestroy() {
      console.log('[ApplicationContextStore] Destroyed');
    },
  }),
);
