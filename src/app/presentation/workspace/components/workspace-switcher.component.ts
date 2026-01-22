/**
 * Workspace Switcher Component
 *
 * Layer: Presentation
 * Purpose: Workspace switcher controls for global header
 * Architecture: Zone-less, OnPush, Angular 20 control flow, Pure Reactive
 *
 * Responsibilities:
 * - UI controls only - emits user intent events for workspace switching
 * - Must NOT open dialog or interpret dialog result
 * - Must only call facade for app actions (switch/create workspace)
 * - Single responsibility: workspace management UI
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { WorkspaceFacade } from '@application/workspace/workspace.facade';
import { filter, tap } from 'rxjs/operators';
import { WorkspaceCreateResult } from '../models/workspace-create-result.model';
import { WorkspaceCreateTriggerComponent } from './workspace-create-trigger.component';

@Component({
  selector: 'app-workspace-switcher',
  standalone: true,
  imports: [CommonModule, WorkspaceCreateTriggerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./workspace-switcher.component.scss'],
  template: `
    <!-- Workspace Switcher -->
    @if (facade.hasWorkspace()) {
      <div class="workspace-switcher">
        <button
          class="workspace-button"
          (click)="facade.toggleWorkspaceMenu()"
          aria-label="Switch workspace"
          type="button">
          <span class="material-icons">folder</span>
          <span class="workspace-name">
            {{ facade.currentWorkspaceName() }}
          </span>
          <span class="material-icons">expand_more</span>
        </button>

        @if (facade.showWorkspaceMenu()) {
          <div class="workspace-menu">
            @for (workspace of facade.availableWorkspaces(); track workspace.id) {
              <button
                class="workspace-menu-item"
                [class.active]="facade.isWorkspaceActive(workspace.id)"
                (click)="facade.selectWorkspace(workspace.id)"
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

    <!-- WorkspaceCreateTriggerComponent - hidden, used programmatically -->
    <app-workspace-create-trigger />
  `,
})
export class WorkspaceSwitcherComponent {
  readonly facade = inject(WorkspaceFacade);

  // Reference to trigger component
  private readonly createTrigger = viewChild(WorkspaceCreateTriggerComponent);

  toggleWorkspaceMenu(): void {
    this.facade.toggleWorkspaceMenu();
  }

  /**
   * Emit user intent: switch workspace
   * Delegates to facade for app action
   */
  selectWorkspace(workspaceId: string): void {
    this.facade.selectWorkspace(workspaceId);
  }

  /**
   * Emit user intent: create new workspace
   * Uses WorkspaceCreateTriggerComponent to open dialog
   * Processes result via facade - NO business logic here
   */
  createNewWorkspace(): void {
    const trigger = this.createTrigger();
    if (!trigger) {
      return;
    }

    // Trigger opens dialog and returns Observable<unknown>
    trigger.openDialog().pipe(
      // Filter and type-narrow to WorkspaceCreateResult
      filter((result): result is WorkspaceCreateResult =>
        result !== null &&
        result !== undefined &&
        typeof result === 'object' &&
        'workspaceName' in result &&
        typeof (result as WorkspaceCreateResult).workspaceName === 'string' &&
        !!(result as WorkspaceCreateResult).workspaceName
      ),
      // Delegate to facade for app action
      tap((result) => {
        this.facade.createWorkspace(result);
      })
    ).subscribe({
      error: () => {
        // Use facade to set error
        this.facade.handleError('Failed to process dialog result');
      }
    });
  }
}
