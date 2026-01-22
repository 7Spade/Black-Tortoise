/**
 * Global Header Component
 * 
 * Layer: Presentation
 * Purpose: Global header layout - composes child components
 * Architecture: Zone-less, OnPush, Angular 20 control flow, M3 tokens
 * 
 * Header Layout (from integrated-system-spec.md §6.2):
 * - Left: Logo + Workspace Switcher (via WorkspaceHeaderControlsComponent)
 * - Center: Search Input (via SearchComponent)
 * - Right: Notifications (via NotificationComponent) + Theme + Folder + Org/User Placeholders
 * 
 * Responsibilities:
 * - Layout only - no MatDialog, no afterClosed, no use case calls
 * - Composes child components for workspace controls, search, notifications, theme
 * - Manages local UI state (notifications visibility) via signals
 * - Delegates theme management to ThemeToggleComponent
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { WorkspaceHeaderControlsComponent } from '../../../features/workspace/components/workspace-header-controls.component';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { ThemeToggleComponent } from '../../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-global-header',
  standalone: true,
  imports: [
    CommonModule, 
    WorkspaceHeaderControlsComponent, 
    SearchComponent, 
    NotificationComponent,
    ThemeToggleComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './global-header.component.html',
  styleUrls: ['./global-header.component.scss']
})
export class GlobalHeaderComponent {
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
  
  constructor() {
    // Initialize notification count
    this.notificationCount.set(0);
  }
}
