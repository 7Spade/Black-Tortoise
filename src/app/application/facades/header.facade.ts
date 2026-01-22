/**
 * Header Facade
 * 
 * Layer: Application - Facade
 * Purpose: Application entry point for header feature - receives intent events,
 *          coordinates with WorkspaceContextStore for app actions (switch/create workspace, navigate)
 * Architecture: Zone-less, Pure Reactive, uses Router for navigation
 * 
 * Responsibilities:
 * - Receives user intent events from UI controls
 * - Delegates workspace operations to WorkspaceContextStore (application layer)
 * - Handles navigation via Router (presentation-layer framework concern)
 * - No new stores, no business logic - pure orchestration
 */

import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WorkspaceContextStore } from '@application/stores/workspace-context.store';
import { WorkspaceCreateResult } from '@application/models/workspace-create-result.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HeaderFacade {
  private readonly workspaceContext = inject(WorkspaceContextStore);
  private readonly router = inject(Router);

  /**
   * Switch to a different workspace
   * @param workspaceId - ID of the workspace to switch to
   */
  switchWorkspace(workspaceId: string): void {
    this.workspaceContext.switchWorkspace(workspaceId);
    this.router.navigate(['/workspace']).catch(() => {
      this.workspaceContext.setError('Failed to navigate to workspace');
    });
  }

  /**
   * Create a new workspace from dialog result
   * @param result - Dialog result containing workspace name
   */
  createWorkspace(result: WorkspaceCreateResult): void {
    this.workspaceContext.createWorkspace(result.workspaceName);
    this.router.navigate(['/workspace']).catch(() => {
      this.workspaceContext.setError('Failed to navigate to workspace');
    });
  }

  /**
   * Handle dialog result stream for workspace creation
   * Used by WorkspaceCreateTriggerComponent to process dialog results
   * @param result$ - Observable stream of dialog results
   */
  handleCreateWorkspaceResult(result$: Observable<WorkspaceCreateResult>): Observable<WorkspaceCreateResult> {
    return result$;
  }
}
