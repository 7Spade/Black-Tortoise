/**
 * Workspace Switcher Component
 *
 * Layer: Presentation
 * Purpose: Workspace switcher controls for global header
 * Architecture: Zone-less, OnPush, Angular 20 control flow, Pure Reactive, Signal-based
 *
 * Responsibilities:
 * - UI controls only - emits user intent events for workspace switching
 * - Uses signal output binding for dialog results (no manual subscribe)
 * - Delegates all workspace actions to facade
 * - Single responsibility: workspace management UI
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { WorkspaceFacade } from '@application/workspace';
import { WorkspaceCreateResult } from '@application/workspace/models/workspace-create-result.model';
import { WorkspaceCreateTriggerComponent } from '../create-trigger/workspace-create-trigger.component';

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
              (click)="openCreateDialog()"
              type="button">
              <span class="material-icons">add</span>
              <span>Create Workspace</span>
            </button>
          </div>
        }
      </div>
    }

    <!-- WorkspaceCreateTriggerComponent - signal-based dialog trigger -->
    <app-workspace-create-trigger (dialogResult)="onWorkspaceCreated($event)" />
  `,
})
export class WorkspaceSwitcherComponent {
  readonly facade = inject(WorkspaceFacade);

  // Reference to trigger component
  private readonly createTrigger = viewChild(WorkspaceCreateTriggerComponent, { read: WorkspaceCreateTriggerComponent });

  /**
   * Open create workspace dialog
   * Triggers dialog via WorkspaceCreateTriggerComponent
   * Result handled via signal output binding in template
   */
  openCreateDialog(): void {
    const trigger = this.createTrigger();
    if (trigger) {
      trigger.openDialog();
    }
  }

  /**
   * Handle workspace creation result from dialog
   * Called via signal output binding (dialogResult) in template
   * Pure reactive - no manual subscribe, no RxJS operators
   */
  onWorkspaceCreated(result: WorkspaceCreateResult): void {
    this.facade.createWorkspace(result);
  }
}
