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
import { WorkspaceCreateResult } from '../models/workspace-create-result.model';
import { IdentityContextStore, OrganizationStore } from '@account/application';
import { WorkspaceStore } from '../stores/workspace.store';

@Injectable({ providedIn: 'root' })
export class WorkspaceFacade {
  private readonly router = inject(Router);
  private readonly workspaceStore = inject(WorkspaceStore);
  private readonly organizationStore = inject(OrganizationStore);
  private readonly identityContext = inject(IdentityContextStore);

  // Local workspace UI state
  private readonly _showWorkspaceMenu = signal(false);
  private readonly _showIdentityMenu = signal(false);

  // Computed signals for workspace UI
  readonly showWorkspaceMenu = computed(() => this._showWorkspaceMenu());
  readonly showIdentityMenu = computed(() => this._showIdentityMenu());
  readonly hasWorkspace = computed(() =>
    this.workspaceStore.hasWorkspace()
  );
  readonly availableWorkspaces = computed(() =>
    this.workspaceStore.availableWorkspaces()
  );
  readonly currentWorkspace = computed(() =>
    this.workspaceStore.currentWorkspace()
  );
  readonly currentWorkspaceName = computed(() =>
    this.workspaceStore.currentWorkspaceName()
  );
  readonly currentOrganizationName = computed(() =>
    this.organizationStore.currentOrganizationName()
  );
  readonly isAuthenticated = computed(() =>
    this.identityContext.isAuthenticated()
  );
  readonly currentIdentityType = computed(() =>
    this.identityContext.currentIdentityType()
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
   * Delegates to WorkspaceStore and handles navigation
   */
  selectWorkspace(workspaceId: string): void {
    this.closeAllMenus();
    this.workspaceStore.switchWorkspace(workspaceId);

    // Navigate to workspace route
    this.router.navigate(['/workspace']).catch(() => {
      this.workspaceStore.setError('Failed to navigate to workspace');
    });
  }

  /**
   * Handle workspace creation
   * Delegates to WorkspaceStore
   */
  createWorkspace(result: WorkspaceCreateResult): void {
    this.closeAllMenus();
    this.workspaceStore.createWorkspace({
      name: result.workspaceName
    });
    // Navigation is handled by side-effects or user action
    // State update is asynchronous
  }

  /**
   * Handle organization creation
   */
  createOrganization(name: string): void {
    this.closeAllMenus();
    this.organizationStore.createOrganization({ displayName: name });
  }

  /**
   * Check if workspace is currently active
   */
  isWorkspaceActive(workspaceId: string): boolean {
    return this.currentWorkspace()?.id.getValue() === workspaceId;
  }
}