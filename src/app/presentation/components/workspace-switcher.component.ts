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
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { WorkspaceFacade } from '@application/facades';
import { WorkspaceCreateResult } from '@application/models/workspace-create-result.model';
import { WorkspaceCreateTriggerComponent } from './workspace-create-trigger.component';

@Component({
  selector: 'app-workspace-switcher',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, WorkspaceCreateTriggerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./workspace-switcher.component.scss'],
  template: `
    <!-- Workspace Switcher -->
    @if (facade.isAuthenticated()) {
      <div class="workspace-switcher">
        <button
          mat-button
          class="workspace-button"
          (click)="facade.toggleWorkspaceMenu()"
          aria-label="Switch workspace">
          <mat-icon>folder</mat-icon>
          <span class="workspace-name">
            {{ facade.currentWorkspaceName() || '選擇工作區' }}
          </span>
          <mat-icon iconPositionEnd>expand_more</mat-icon>
        </button>

        @if (facade.showWorkspaceMenu()) {
          <div class="workspace-menu-overlay" (click)="facade.closeAllMenus()"></div>
          <div class="workspace-menu">
            @for (workspace of facade.availableWorkspaces(); track workspace.id) {
              <button
                class="workspace-menu-item"
                [class.active]="facade.isWorkspaceActive(workspace.id)"
                (click)="facade.selectWorkspace(workspace.id)"
                type="button">
                <span class="workspace-item-name">{{ workspace.name }}</span>
                @if (workspace.organizationDisplayName) {
                   <span class="workspace-org-name">{{ workspace.organizationDisplayName }}</span>
                }
              </button>
            } @empty {
              <div class="workspace-menu-item disabled">
                 <span class="no-workspace-label">沒有工作區</span>
              </div>
            }
            <div class="divider"></div>
            <div class="menu-actions">
              <app-workspace-create-trigger (dialogResult)="onCreateWorkspace($event)"></app-workspace-create-trigger>
            </div>
          </div>
        }
      </div>
    }
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

  onCreateWorkspace(result: unknown): void {
     // This method handles the output from the template binding
     // Since WorkspaceCreateResult is a type, we might need casting if output is generic
     this.onWorkspaceCreated(result as WorkspaceCreateResult);
  }
}
