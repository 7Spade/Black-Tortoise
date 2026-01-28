import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WorkspaceCreateResult } from '@workspace/application';
import { WorkspaceStore } from '@workspace/application';

@Injectable({ providedIn: 'root' })
export class HeaderFacade {
  private readonly workspaceStore = inject(WorkspaceStore);
  private readonly router = inject(Router);

  /**
   * Switch to a different workspace
   * @param workspaceId - ID of the workspace to switch to
   */
  switchWorkspace(workspaceId: string): void {
    this.workspaceStore.switchWorkspace(workspaceId);
    this.router.navigate(['/workspace']).catch(() => {
      this.workspaceStore.setError('Failed to navigate to workspace');
    });
  }

  /**
   * Create a new workspace from dialog result
   * @param result - Dialog result containing workspace name
   */
  createWorkspace(result: WorkspaceCreateResult): void {
    this.workspaceStore.createWorkspace({ 
      name: result.workspaceName 
    });
    // Navigation is handled by side-effects or user action
    // this.router.navigate(['/workspace']); 
  }
}

