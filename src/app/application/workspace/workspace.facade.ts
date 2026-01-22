/**
 * Workspace Presentation Facade
 *
 * Layer: Application - Facade
 * Purpose: Coordinates workspace feature presentation concerns
 * Architecture: Zone-less, Pure Reactive, Angular 20+
 *
 * Responsibilities:
 * - Manages workspace UI state coordination
 * - Provides reactive signals for workspace components
 * - Coordinates between workspace components and application/presentation layers
 * - No business logic - pure presentation orchestration
 */

import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderFacade } from '@application/facades/header.facade';
import { WorkspaceContextStore } from '@application/stores/workspace-context.store';
import { PresentationStore } from '@presentation/shared';

@Injectable({ providedIn: 'root' })
export class WorkspaceFacade {
  private readonly router = inject(Router);
  private readonly presentation = inject(PresentationStore);
  private readonly workspaceContext = inject(WorkspaceContextStore);
  private readonly headerFacade = inject(HeaderFacade);

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
   */
  selectWorkspace(workspaceId: string): void {
    this.closeAllMenus();
    this.headerFacade.switchWorkspace(workspaceId);
  }

  /**
   * Handle workspace creation
   */
  createWorkspace(result: any): void {
    this.closeAllMenus();
    this.headerFacade.createWorkspace(result);
  }

  /**
   * Handle error in workspace operations
   */
  handleError(message: string): void {
    this.workspaceContext.setError(message);
  }

  /**
   * Check if workspace is currently active
   */
  isWorkspaceActive(workspaceId: string): boolean {
    return this.currentWorkspace()?.id === workspaceId;
  }
}