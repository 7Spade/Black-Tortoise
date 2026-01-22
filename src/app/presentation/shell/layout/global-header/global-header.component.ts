/**
 * Global Header Component
 * 
 * Layer: Presentation
 * Purpose: Global header layout - composes child components
 * Architecture: Zone-less, OnPush, Angular 20 control flow, M3 tokens
 * 
 * Header Layout (comment_new 3783888611):
 * - Left: Logo only (single line "Black Tortoise")
 * - Center: Workspace Switcher + Search + Notifications + Theme Toggle
 * - Right: User Avatar with menu (settings/profile links)
 * 
 * Responsibilities:
 * - Layout only - no MatDialog, no afterClosed, no use case calls
 * - Composes child components for workspace controls, search, notifications, theme, user avatar
 * - Manages local UI state (notifications visibility) via signals
 * - Delegates theme management to ThemeToggleComponent
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { WorkspaceHeaderControlsComponent } from '../../../features/workspace/components/workspace-header-controls.component';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { ThemeToggleComponent } from '../../../shared/components/theme-toggle/theme-toggle.component';
import { UserAvatarComponent } from '../../../features/user-avatar/user-avatar.component';

@Component({
  selector: 'app-global-header',
  standalone: true,
  imports: [
    CommonModule, 
    WorkspaceHeaderControlsComponent, 
    SearchComponent, 
    NotificationComponent,
    ThemeToggleComponent,
    UserAvatarComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './global-header.component.html',
  styleUrls: ['./global-header.component.scss']
})
export class GlobalHeaderComponent {
  private readonly router = inject(Router);
  
  // Inputs
  readonly showWorkspaceControls = input(true);
  
  // Local UI state using signals
  readonly showNotifications = signal(false);
  readonly notificationCount = signal(0);
  readonly searchQuery = signal('');
  
  toggleNotifications(): void {
    this.showNotifications.update(v => !v);
  }

  onSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  onNotificationDismissed(id: string): void {
    // Handle notification dismissal
    this.notificationCount.update(count => Math.max(0, count - 1));
  }
  
  onUserMenuItemClicked(action: string): void {
    // Navigate based on menu action
    if (action === 'settings') {
      this.router.navigate(['/settings']);
    } else if (action === 'profile') {
      this.router.navigate(['/profile']);
    }
  }
  
  constructor() {
    // Initialize notification count
    this.notificationCount.set(0);
  }
}
