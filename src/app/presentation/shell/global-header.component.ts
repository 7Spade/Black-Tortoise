/**
 * Global Header Component
 *
 * Layer: Presentation
 * Purpose: Global header layout - composes child components
 * Architecture: Zone-less, OnPush, Angular 20 control flow, M3 tokens
 *
 * Header Layout (Updated):
 * - Left: Logo (icon + text on single line)
 * - Center: Workspace Controls (left of search) + Search + Notifications + Theme Toggle
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

@Component({
  selector: 'app-global-header',
  standalone: true,
  imports: [
    CommonModule
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

  navigateHome(): void {
    this.router.navigate(['/']);
  }

  constructor() {
    // Initialize notification count
    this.notificationCount.set(0);
  }
}