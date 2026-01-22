import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { WorkspaceContextStore } from '@application/stores/workspace-context.store';
import {
  WorkspaceCreateDialogComponent,
  WorkspaceCreateDialogResult,
} from './workspace-create-dialog.component';

@Component({
  selector: 'app-workspace-header-controls',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./workspace-header-controls.component.scss'],
  template: `
    <!-- Workspace Switcher -->
    @if (workspaceContext.hasWorkspace()) {
      <div class="workspace-switcher">
        <button 
          class="workspace-button" 
          (click)="toggleWorkspaceMenu()"
          aria-label="Switch workspace"
          type="button">
          <span class="material-icons">folder</span>
          <span class="workspace-name">
            {{ workspaceContext.currentWorkspaceName() }}
          </span>
          <span class="material-icons">expand_more</span>
        </button>
        
        @if (showWorkspaceMenu()) {
          <div class="workspace-menu">
            @for (workspace of workspaceContext.availableWorkspaces(); track workspace.id) {
              <button 
                class="workspace-menu-item"
                [class.active]="workspace.id === workspaceContext.currentWorkspace()?.id"
                (click)="selectWorkspace(workspace.id)"
                type="button">
                <span class="material-icons">folder</span>
                <span>{{ workspace.name }}</span>
              </button>
            }
            <div class="workspace-menu-divider"></div>
            <button 
              class="workspace-menu-item" 
              (click)="createNewWorkspace()"
              type="button">
              <span class="material-icons">add</span>
              <span>Create Workspace</span>
            </button>
          </div>
        }
      </div>
    }

    <!-- Identity Switcher -->
    <div class="identity-switcher">
      <button 
        class="identity-button" 
        (click)="toggleIdentityMenu()"
        aria-label="Switch identity"
        type="button">
        <span class="material-icons">account_circle</span>
        <span class="identity-type org-name">
          {{ workspaceContext.currentOrganizationName() }}
        </span>
        <span class="identity-type">
          @if (workspaceContext.isAuthenticated()) {
            {{ workspaceContext.currentIdentityType() }}
          } @else {
            Guest
          }
        </span>
        <span class="material-icons">expand_more</span>
      </button>
      
      @if (showIdentityMenu()) {
        <div class="identity-menu">
          <div class="identity-menu-item">
            <span class="material-icons">person</span>
            <span>Personal Account</span>
          </div>
          <div class="identity-menu-item">
            <span class="material-icons">business</span>
            <span>Organization</span>
          </div>
          <div class="identity-menu-divider"></div>
          <div class="identity-menu-item">
            <span class="material-icons">logout</span>
            <span>Sign Out</span>
          </div>
        </div>
      }
    </div>
  `,
})
export class WorkspaceHeaderControlsComponent {
  readonly workspaceContext = inject(WorkspaceContextStore);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

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

  async createNewWorkspace(): Promise<void> {
    const dialogRef = this.dialog.open(WorkspaceCreateDialogComponent, {
      width: '500px',
      disableClose: false,
      autoFocus: true,
    });

    let result: WorkspaceCreateDialogResult | null = null;

    try {
      result = await firstValueFrom(dialogRef.afterClosed());
    } catch {
      this.workspaceContext.setError('Failed to open workspace dialog');
      return;
    }

    if (result?.workspaceName) {
      this.workspaceContext.createWorkspace(result.workspaceName);
      this.showWorkspaceMenu.set(false);
      this.router.navigate(['/workspace']).catch(() => {
        this.workspaceContext.setError('Failed to navigate to workspace');
      });
    }
  }
}
