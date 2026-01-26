/**
 * Workspace Facade
 *
 * Layer: Application - Facade
 * Purpose: Coordinates workspace feature presentation concerns
 * Architecture: Zone-less, Pure Reactive, Angular 20+
 *
 * Responsibilities:
 * - Manages workspace UI state coordination
 * - Provides reactive signals for workspace components
 * - Delegates workspace operations directly to WorkspaceContextStore
 * - Handles navigation via Router
 * - No business logic - pure presentation orchestration
 */

import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { WorkspaceCreateResult } from '@application/models/workspace-create-result.model';
import { WorkspaceContextStore } from '@application/stores/workspace-context.store';

@Injectable({ providedIn: 'root' })
export class WorkspaceFacade {
  private readonly router = inject(Router);
  private readonly workspaceContext = inject(WorkspaceContextStore);

  // Local workspace UI state
  private readonly _showWorkspaceMenu = signal(false);
  private readonly _showIdentityMenu = signal(false);

  // Computed signals for workspace UI
  readonly showWorkspaceMenu = computed(() => this._showWorkspaceMenu());
  readonly showIdentityMenu = computed(() => this._showIdentityMenu());
  readonly hasWorkspace = computed(() =>
    this.workspaceContext.hasWorkspace()
  );
  readonly availableWorkspaces = computed(() =>
    this.workspaceContext.availableWorkspaces()
  );
  readonly currentWorkspace = computed(() =>
    this.workspaceContext.currentWorkspace()
  );
  readonly currentWorkspaceName = computed(() =>
    this.workspaceContext.currentWorkspaceName()
  );
  readonly currentOrganizationName = computed(() =>
    this.workspaceContext.currentOrganizationName()
  );
  readonly isAuthenticated = computed(() =>
    this.workspaceContext.isAuthenticated()
  );
  readonly currentIdentityType = computed(() =>
    this.workspaceContext.currentIdentityType()
  );

  /**
   * Toggle workspace menu
   */
  toggleWorkspaceMenu(): void {
    this._showWorkspaceMenu.update(v => !v);
    this._showIdentityMenu.set(false);
  }

  /**
   * Toggle identity menu
   */
  toggleIdentityMenu(): void {
    this._showIdentityMenu.update(v => !v);
    this._showWorkspaceMenu.set(false);
  }

  /**
   * Close all menus
   */
  closeAllMenus(): void {
    this._showWorkspaceMenu.set(false);
    this._showIdentityMenu.set(false);
  }

  /**
   * Handle workspace selection
   * Delegates to WorkspaceContextStore and handles navigation
   */
  selectWorkspace(workspaceId: string): void {
    this.closeAllMenus();
    this.workspaceContext.switchWorkspace(workspaceId);
    
    // Navigate to workspace route
    this.router.navigate(['/workspace']).catch(() => {
      this.workspaceContext.setError('Failed to navigate to workspace');
    });
  }

  /**
   * Handle workspace creation
   * Delegates to WorkspaceContextStore
   */
  createWorkspace(result: WorkspaceCreateResult): void {
    this.closeAllMenus();
    this.workspaceContext.createWorkspace({ 
      name: result.workspaceName 
    });
    // Navigation is handled by side-effects or user action
    // State update is asynchronous
  }

  /**
   * Check if workspace is currently active
   */
  isWorkspaceActive(workspaceId: string): boolean {
    return this.currentWorkspace()?.id === workspaceId;
  }
}