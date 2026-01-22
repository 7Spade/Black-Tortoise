/**
 * Global Header Component
 * 
 * Layer: Presentation
 * Purpose: Global header skeleton with workspace/identity switchers
 * Architecture: Zone-less, OnPush, Angular 20 control flow, M3 tokens
 * 
 * Header Layout (from integrated-system-spec.md §6.2):
 * - Left: Logo + Workspace Switcher
 * - Center: Search Input (placeholder)
 * - Right: Notifications + Settings + Identity Switcher
 * 
 * Navigation:
 * - Uses Angular Router directly (see ADR 0001-router-in-presentation-components.md)
 * - Router is a presentation-layer framework concern, not business logic
 * - Business logic delegated to WorkspaceContextStore (application layer)
 */

import { Component, ChangeDetectionStrategy, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../shared/services/search.service';
import { NotificationService } from '../../shared/services/notification.service';
import { WorkspaceHeaderControlsComponent } from './workspace-header-controls.component';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-global-header',
  standalone: true,
  imports: [CommonModule, WorkspaceHeaderControlsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './global-header.component.html',
  styleUrls: ['./global-header.component.scss']
})
export class GlobalHeaderComponent {
  readonly showWorkspaceControls = input(true);
  private readonly searchService = inject(SearchService);
  private readonly notificationService = inject(NotificationService);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  
  // Local UI state using signals
  readonly showNotifications = signal(false);
  readonly notificationCount = signal(0);
  readonly themeMode = signal<'light' | 'dark'>('light');
  private readonly themeStorageKey = 'ui.theme';
  readonly searchQuery = signal('');
  
  toggleNotifications(): void {
    this.showNotifications.update(v => !v);
    const notifications = this.notificationService.getNotifications();
    this.notificationCount.set(notifications.length);
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    this.searchQuery.set(value);
    this.searchService.search(value);
  }

  openSettings(): void {
    this.showNotifications.set(false);
    this.router.navigate(['/settings']).catch(() => {
      console.info('[Settings] Not implemented');
    });
  }

  toggleTheme(): void {
    const next = this.themeMode() === 'dark' ? 'light' : 'dark';
    this.themeMode.set(next);
    localStorage.setItem(this.themeStorageKey, next);
    this.document.body.classList.remove('light', 'dark');
    this.document.body.classList.add(next);
  }
  
  selectWorkspace(workspaceId: string): void {
    // Business logic: switch workspace (application layer)
    this.workspaceContext.switchWorkspace(workspaceId);
    
    // Presentation concern: navigate to workspace view
    this.showWorkspaceMenu.set(false);
    this.router.navigate(['/workspace']).catch(() => {
      this.workspaceContext.setError('Failed to navigate to workspace');
    });
  }
  
  constructor() {
    const storedTheme = localStorage.getItem(this.themeStorageKey);
    const initialTheme = storedTheme === 'dark' ? 'dark' : 'light';
    this.themeMode.set(initialTheme);
    this.document.body.classList.remove('light', 'dark');
    this.document.body.classList.add(initialTheme);

    const notifications = this.notificationService.getNotifications();
    this.notificationCount.set(notifications.length);
  }
}
