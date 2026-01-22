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
 * - Composes child components for workspace controls
 * - Manages local UI state (notifications, theme) via signals
 */

import { Component, ChangeDetectionStrategy, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { WorkspaceHeaderControlsComponent } from '../../../workspace/components/workspace-header-controls.component';
import { SearchComponent } from '../../../../shared/components/search/search.component';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';

@Component({
  selector: 'app-global-header',
  standalone: true,
  imports: [CommonModule, WorkspaceHeaderControlsComponent, SearchComponent, NotificationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './global-header.component.html',
  styleUrls: ['./global-header.component.scss']
})
export class GlobalHeaderComponent {
  // Inputs
  readonly showWorkspaceControls = input(true);
  
  // Injected dependencies
  private readonly document = inject(DOCUMENT);
  
  // Local UI state using signals
  readonly showNotifications = signal(false);
  readonly notificationCount = signal(0);
  readonly themeMode = signal<'light' | 'dark'>('light');
  private readonly themeStorageKey = 'ui.theme';
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

  toggleTheme(): void {
    const next = this.themeMode() === 'dark' ? 'light' : 'dark';
    this.themeMode.set(next);
    localStorage.setItem(this.themeStorageKey, next);
    this.document.body.classList.remove('light', 'dark');
    this.document.body.classList.add(next);
  }
  
  constructor() {
    const storedTheme = localStorage.getItem(this.themeStorageKey);
    const initialTheme = storedTheme === 'dark' ? 'dark' : 'light';
    this.themeMode.set(initialTheme);
    this.document.body.classList.remove('light', 'dark');
    this.document.body.classList.add(initialTheme);

    // Initialize notification count
    this.notificationCount.set(0);
  }
}
