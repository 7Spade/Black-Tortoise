/**
 * Identity Facade
 *
 * Layer: Application - Facade
 * Purpose: Coordinates identity feature presentation concerns
 * Architecture: Zone-less, Pure Reactive, Angular 20+
 *
 * Responsibilities:
 * - Manages identity UI state coordination
 * - Provides reactive signals for identity components (ViewModels)
 * - Coordinates between identity components and application/presentation layers
 * - No business logic - pure presentation orchestration
 */

import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityViewModel, UserAvatarViewModel } from '@application/models';
import { AuthStore } from '@application/stores/auth.store';
import { WorkspaceContextStore } from '@application/stores/workspace-context.store';

@Injectable({ providedIn: 'root' })
export class IdentityFacade {
  private readonly authStore = inject(AuthStore);
  private readonly workspaceContext = inject(WorkspaceContextStore);
  private readonly router = inject(Router);

  // Local identity UI state
  private readonly _showIdentityMenu = signal(false);
  private readonly _showAvatarMenu = signal(false);
  
  // Public signal for menu state
  readonly showIdentityMenu = this._showIdentityMenu.asReadonly();
  readonly showAvatarMenu = this._showAvatarMenu.asReadonly();

  // ViewModel: Identity
  readonly identityVm = computed<IdentityViewModel>(() => {
    const contextType = this.workspaceContext.currentIdentityType(); // 'user' | 'organization' | null
    const orgName = this.workspaceContext.currentOrganizationDisplayName();
    const userName = this.authStore.displayName();
    const isAuthenticated = this.authStore.isLoggedIn();

    // Map context type to VM type
    const mappedType: 'personal' | 'organization' = contextType === 'organization' ? 'organization' : 'personal';

    let displayName = 'Guest';
    let roleLabel: string | undefined = undefined;

    if (isAuthenticated) {
        if (mappedType === 'organization' && orgName) {
            displayName = orgName;
            roleLabel = 'Admin'; // TODO: Get actual role from context
        } else {
            displayName = userName || 'User';
        }
    }

    return {
        type: mappedType,
        displayName,
        roleLabel,
        isAuthenticated
    };
  });

  readonly organizations = computed(() => {
    const workspaces = this.workspaceContext.availableWorkspaces();
    const orgs = new Map<string, { id: string, name: string }>();
    workspaces.forEach(ws => {
      // Assuming workspace has organization details. 
      // If ownerType is organization, we can derive it.
      if (ws.ownerType === 'organization' && ws.organizationId && ws.organizationDisplayName) {
        orgs.set(ws.organizationId, { id: ws.organizationId, name: ws.organizationDisplayName });
      }
    });

    // Also include current organization if not in workspaces list yet?
    // Not strictly necessary if we assume consistency.

    return Array.from(orgs.values());
  });

  // ViewModel: User Avatar
  readonly userAvatarVm = computed<UserAvatarViewModel>(() => {
    const photoUrl = this.authStore.photoUrl();
    const displayName = this.authStore.displayName() || 'Guest';

    return {
        photoUrl,
        initials: this.getInitials(displayName),
        color: this.getColor(displayName)
    };
  });

  /**
   * Toggle identity menu
   */
  toggleIdentityMenu(): void {
    const currentState = this._showIdentityMenu();
    this.closeAllMenus();
    if (!currentState) {
        this._showIdentityMenu.set(true);
    }
  }
  
  /**
   * Toggle avatar menu
   */
  toggleAvatarMenu(): void {
    const currentState = this._showAvatarMenu();
    this.closeAllMenus();
    if (!currentState) {
        this._showAvatarMenu.set(true);
    }
  }

  /**
   * Close all menus
   */
  closeAllMenus(): void {
    this._showIdentityMenu.set(false);
    this._showAvatarMenu.set(false);
  }

  /**
   * Close identity menu
   */
  closeIdentityMenu(): void {
    this._showIdentityMenu.set(false);
  }

  /**
   * Close avatar menu
   */
  closeAvatarMenu(): void {
      this._showAvatarMenu.set(false);
  }

  /**
   * Handle identity selection
   */
  selectIdentity(identityType: 'personal'): void {
    this.closeAllMenus();
    const userId = this.authStore.currentUserId();
    if (userId) {
        this.workspaceContext.setIdentity(userId, 'user');
    }
  }

  /**
   * Handle organization selection
   */
  selectOrganization(organizationId: string, organizationName: string): void {
      this.closeAllMenus();
      this.workspaceContext.setIdentity(organizationId, 'organization');
      this.workspaceContext.setOrganization(organizationId, organizationName);
  }

  /**
   * Create new organization
   */
  createOrganization(displayName: string): void {
      this.closeAllMenus();
      this.workspaceContext.createOrganization({ displayName });
  }

  /**
   * Navigation Actions
   */
  async navigateToProfile(): Promise<void> {
      this.closeAllMenus();
      await this.router.navigate(['/profile']);
  }

  async navigateToSettings(): Promise<void> {
    this.closeAllMenus();
    await this.router.navigate(['/settings']);
  }

  /**
   * Handle sign out
   */
  async signOut(): Promise<void> {
    this.closeAllMenus();
    await this.authStore.logout();
    await this.router.navigate(['/']);
  }

  // --- Private Helpers ---

  private getInitials(name: string): string {
    if (!name) return '??';
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  private getColor(name: string): string {
    if (!name) return '#CCC';
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Simple color generation
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
  }
}
