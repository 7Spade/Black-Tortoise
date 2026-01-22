/**
 * Header Facade
 *
 * Layer: Presentation - Facade
 * Purpose: Coordinates header feature presentation concerns
 * Architecture: Zone-less, Pure Reactive, Angular 20+
 *
 * Responsibilities:
 * - Manages header UI state coordination
 * - Provides reactive signals for header components
 * - Coordinates between header components and application/presentation layers
 * - No business logic - pure presentation orchestration
 */

import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { WorkspaceContextStore } from '@application/stores/workspace-context.store';
import { PresentationStore } from '@presentation/shared';

@Injectable({ providedIn: 'root' })
export class HeaderPresentationFacade {
  private readonly router = inject(Router);
  private readonly presentation = inject(PresentationStore);
  private readonly workspaceContext = inject(WorkspaceContextStore);

  // Local header UI state
  private readonly _showNotifications = signal(false);

  // Computed signals for header UI
  readonly showNotifications = computed(() => this._showNotifications());
  readonly notificationCount = computed(() =>
    this.presentation.unreadNotificationsCount()
  );
  readonly searchQuery = computed(() =>
    this.presentation.searchQuery()
  );
  readonly hasWorkspace = computed(() =>
    this.workspaceContext.hasWorkspace()
  );

  /**
   * Toggle notifications panel
   */
  toggleNotifications(): void {
    this._showNotifications.update(v => !v);
  }

  /**
   * Set notifications panel visibility
   */
  setNotificationsVisible(visible: boolean): void {
    this._showNotifications.set(visible);
  }

  /**
   * Handle search query changes
   */
  onSearchQuery(query: string): void {
    this.presentation.setSearchQuery(query);
  }

  /**
   * Handle notification dismissal
   */
  onNotificationDismissed(notificationId: string): void {
    this.presentation.removeNotification(notificationId);
  }

  /**
   * Handle user menu item clicks
   */
  onUserMenuItemClicked(action: string): void {
    // Close notifications if open
    this._showNotifications.set(false);

    // Navigate based on menu action
    if (action === 'settings') {
      this.router.navigate(['/settings']);
    } else if (action === 'profile') {
      this.router.navigate(['/profile']);
    }
  }

  /**
   * Navigate to home
   */
  navigateHome(): void {
    // Clear search and close panels
    this.presentation.setSearchQuery('');
    this._showNotifications.set(false);
    this.router.navigate(['/']);
  }

  /**
   * Handle workspace switcher actions
   */
  onWorkspaceSwitched(workspaceId: string): void {
    // Close notifications if open
    this._showNotifications.set(false);
    // Additional header-specific logic can go here
  }

  /**
   * Handle workspace creation
   */
  onWorkspaceCreated(): void {
    // Close notifications if open
    this._showNotifications.set(false);
    // Additional header-specific logic can go here
  }
}