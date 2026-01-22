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

import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { WorkspaceContextStore } from '@application/stores/workspace-context.store';
import { 
  WorkspaceCreateDialogComponent, 
  WorkspaceCreateDialogResult 
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
  readonly workspaceContext = inject(WorkspaceContextStore);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  
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
    // Business logic: switch workspace (application layer)
    this.workspaceContext.switchWorkspace(workspaceId);
    
    // Presentation concern: navigate to workspace view
    this.showWorkspaceMenu.set(false);
    this.router.navigate(['/workspace']).catch(() => {
      this.workspaceContext.setError('Failed to navigate to workspace');
    });
  }
  
  async createNewWorkspace(): Promise<void> {
    // Open Material 3 dialog
    const dialogRef = this.dialog.open(WorkspaceCreateDialogComponent, {
      width: '500px',
      disableClose: false,
      autoFocus: true,
    });

    const result = await firstValueFrom(
      dialogRef.afterClosed<WorkspaceCreateDialogResult | null>()
    );

    if (result?.workspaceName) {
      // Business logic: create workspace (application layer)
      this.workspaceContext.createWorkspace(result.workspaceName);
      
      // Presentation concern: navigate to workspace view
      this.showWorkspaceMenu.set(false);
      this.router.navigate(['/workspace']).catch(() => {
        this.workspaceContext.setError('Failed to navigate to workspace');
      });
    }
  }
}
