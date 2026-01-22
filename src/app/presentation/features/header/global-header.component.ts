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
 * - Right: Notifications + Theme + Folder + Org/User Placeholders
 * 
 * Navigation:
 * - Uses Angular Router directly (see ADR 0001-router-in-presentation-components.md)
 * - Router is a presentation-layer framework concern, not business logic
 * - Business logic delegated to WorkspaceContextStore (application layer)
 * 
 * State Management:
 * - Workspace context managed by WorkspaceContextStore (application layer)
 * - Local UI state (notifications, theme) managed via signals
 * - No async/await in presentation layer, pure reactive patterns
 */

import { Component, ChangeDetectionStrategy, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { filter, tap } from 'rxjs/operators';
import { SearchService, NotificationService } from '../../shared/services';
import { WorkspaceContextStore } from '@application/stores/workspace-context.store';
import { DOCUMENT } from '@angular/common';
import {
  WorkspaceCreateDialogComponent,
  WorkspaceCreateDialogResult,
} from './workspace-create-dialog.component';

@Component({
  selector: 'app-global-header',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './global-header.component.html',
  styleUrls: ['./global-header.component.scss']
})
export class GlobalHeaderComponent {
  // Inputs
  readonly showWorkspaceControls = input(true);
  
  // Injected dependencies
  readonly workspaceContext = inject(WorkspaceContextStore);
  private readonly searchService = inject(SearchService);
  private readonly notificationService = inject(NotificationService);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  
  // Local UI state using signals
  readonly showNotifications = signal(false);
  readonly notificationCount = signal(0);
  readonly themeMode = signal<'light' | 'dark'>('light');
  private readonly themeStorageKey = 'ui.theme';
  readonly searchQuery = signal('');
  readonly showWorkspaceMenu = signal(false);
  
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

  toggleTheme(): void {
    const next = this.themeMode() === 'dark' ? 'light' : 'dark';
    this.themeMode.set(next);
    localStorage.setItem(this.themeStorageKey, next);
    this.document.body.classList.remove('light', 'dark');
    this.document.body.classList.add(next);
  }

  /**
   * Workspace Switcher Logic (delegated to WorkspaceContextStore)
   */
  toggleWorkspaceMenu(): void {
    this.showWorkspaceMenu.update(v => !v);
  }

  selectWorkspace(workspaceId: string): void {
    this.workspaceContext.switchWorkspace(workspaceId);
    this.showWorkspaceMenu.set(false);
    this.router.navigate(['/workspace']).catch(() => {
      this.workspaceContext.setError('Failed to navigate to workspace');
    });
  }

  /**
   * Create new workspace via dialog
   * Pure reactive: Observable → filter → tap → subscribe
   * Type-safe without generics on afterClosed()
   */
  createNewWorkspace(): void {
    const dialogRef = this.dialog.open(WorkspaceCreateDialogComponent, {
      width: '500px',
      disableClose: false,
      autoFocus: true,
    });

    // Type-safe result handling without generics
    // afterClosed() returns Observable<WorkspaceCreateDialogResult | undefined>
    dialogRef.afterClosed().pipe(
      // Filter out null/undefined results (user cancelled)
      filter((result): result is WorkspaceCreateDialogResult => 
        result !== null && result !== undefined && !!result.workspaceName
      ),
      // Side effects: create workspace and navigate
      tap((result) => {
        this.workspaceContext.createWorkspace(result.workspaceName);
        this.showWorkspaceMenu.set(false);
        this.router.navigate(['/workspace']).catch(() => {
          this.workspaceContext.setError('Failed to navigate to workspace');
        });
      })
    ).subscribe({
      error: () => {
        this.workspaceContext.setError('Failed to process dialog result');
      }
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
