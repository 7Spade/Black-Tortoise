/**
 * Identity Facade
 *
 * Layer: Application - Facade
 * Purpose: Coordinates identity feature presentation concerns
 * Architecture: Zone-less, Pure Reactive, Angular 20+
 *
 * Responsibilities:
 * - Manages identity UI state coordination
 * - Provides reactive signals for identity components
 * - Coordinates between identity components and application/presentation layers
 * - No business logic - pure presentation orchestration
 */

import { computed, inject, Injectable, signal } from '@angular/core';
import { WorkspaceContextStore } from '@application/stores/workspace-context.store';

@Injectable({ providedIn: 'root' })
export class IdentityFacade {
  private readonly workspaceContext = inject(WorkspaceContextStore);

  // Local identity UI state
  private readonly _showIdentityMenu = signal(false);

  // Computed signals for identity UI
  readonly showIdentityMenu = computed(() => this._showIdentityMenu());
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
   * Toggle identity menu
   */
  toggleIdentityMenu(): void {
    this._showIdentityMenu.update(v => !v);
  }

  /**
   * Close identity menu
   */
  closeIdentityMenu(): void {
    this._showIdentityMenu.set(false);
  }

  /**
   * Handle identity selection
   */
  selectIdentity(identityType: 'personal' | 'organization'): void {
    this.closeIdentityMenu();
    // TODO: Implement identity switching logic
    // This would delegate to application layer for actual identity switching
  }

  /**
   * Handle sign out
   */
  signOut(): void {
    this.closeIdentityMenu();
    // TODO: Implement sign out logic
    // This would delegate to application layer for actual sign out
  }
}