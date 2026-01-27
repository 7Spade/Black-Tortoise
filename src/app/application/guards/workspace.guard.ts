/**
 * Workspace Guard
 * 
 * Layer: Application
 * Responsibility: Protect workspace routes based on workspace readiness
 * Logic:
 * - Unknown/Loading -> ALLOW (Let UI handle loading state)
 * - Ready (workspace selected) -> ALLOW
 * - No workspace selected -> Redirect to workspace selection
 * 
 * NO SIDE EFFECTS: This guard only checks state, does not load or initialize
 */

import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { WorkspaceStore } from '@application/stores/workspace.store';

/**
 * Workspace Guard
 * 
 * Ensures a workspace is selected before accessing workspace-scoped routes
 */
export const canActivateWorkspace: CanActivateFn = () => {
  const store = inject(WorkspaceStore);
  const router = inject(Router);
  
  // Check if workspace is selected
  const hasWorkspace = store.hasWorkspace();
  const isLoading = store.isLoading();
  
  // Allow if loading (UI will show skeleton)
  if (isLoading) {
    return true;
  }
  
  // Allow if workspace is selected
  if (hasWorkspace) {
    return true;
  }
  
  // No workspace selected -> Redirect to workspace selection
  return router.createUrlTree(['/']);
};
