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
 */

import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WorkspaceContextStore } from '@application/stores/workspace-context.store';

@Component({
  selector: 'app-global-header',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './global-header.component.html',
  styleUrls: ['./global-header.component.scss']
})
export class GlobalHeaderComponent {
  readonly workspaceContext = inject(WorkspaceContextStore);
  private readonly router = inject(Router);
  
  // Local UI state using signals
  readonly showWorkspaceMenu = signal(false);
  readonly showIdentityMenu = signal(false);
  
  toggleWorkspaceMenu(): void {
    this.showWorkspaceMenu.update(v => !v);
    this.showIdentityMenu.set(false);
  }
  
  toggleIdentityMenu(): void {
    this.showIdentityMenu.update(v => !v);
    this.showWorkspaceMenu.set(false);
  }
  
  selectWorkspace(workspaceId: string): void {
    this.workspaceContext.switchWorkspace(workspaceId);
    this.showWorkspaceMenu.set(false);
    this.router.navigate(['/workspace']).catch(() => {
      this.workspaceContext.setError('Failed to navigate to workspace');
    });
  }
  
  createNewWorkspace(): void {
    const name = prompt('Enter workspace name:');
    if (name?.trim()) {
      this.workspaceContext.createWorkspace(name.trim());
      this.showWorkspaceMenu.set(false);
      this.router.navigate(['/workspace']).catch(() => {
        this.workspaceContext.setError('Failed to navigate to workspace');
      });
    }
  }
}
