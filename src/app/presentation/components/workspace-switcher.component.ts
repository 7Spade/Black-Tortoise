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
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { WorkspaceFacade } from '@application/facades';
import { WorkspaceCreateResult } from '@application/models/workspace-create-result.model';
import { WorkspaceCreateTriggerComponent } from './workspace-create-trigger.component';

@Component({
  selector: 'app-workspace-switcher',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    WorkspaceCreateTriggerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      /**
 * Workspace Header Controls Styles
 * Using Material 3 Design Tokens (--mat-sys-*)
 */

      .workspace-switcher {
        position: relative;
      }

      .workspace-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: var(--mat-sys-surface-container, #f3edf7);
        border: 1px solid var(--mat-sys-outline, #79747e);
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.875rem;
        color: var(--mat-sys-on-surface, #1d1b20);
        transition: all 0.2s;
        min-width: 200px;

        &:hover {
          background: var(--mat-sys-surface-container-high, #ece6f0);
          border-color: var(--mat-sys-primary, #6750a4);
        }

        .workspace-name {
          font-weight: 500;
          flex: 1;
        }
      }

      .workspace-menu {
        position: absolute;
        top: calc(100% + 0.5rem);
        left: 0;
        background: var(--mat-sys-surface-container, #f3edf7);
        border: 1px solid var(--mat-sys-outline-variant, #cac4d0);
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        min-width: 280px;
        z-index: 1000;
      }

      .workspace-menu-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        width: 100%;
        padding: 0.75rem 1rem;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 0.875rem;
        color: var(--mat-sys-on-surface, #1d1b20);
        text-align: left;
        transition: background 0.2s;

        &:hover {
          background: var(--mat-sys-surface-container-high, #ece6f0);
        }

        &.active {
          background: var(--mat-sys-primary-container, #eaddff);
          color: var(--mat-sys-on-primary-container, #21005e);
        }

        &.disabled {
          cursor: default;
          opacity: 0.6;
          pointer-events: none;
          justify-content: center;
        }
      }

      .workspace-menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 999;
        cursor: default;
      }

      .workspace-menu-divider {
        height: 1px;
        background: var(--mat-sys-outline-variant, #cac4d0);
        margin: 0.25rem 0;
      }

      .menu-actions {
        padding: 0.25rem 0.5rem;
      }

      .no-workspace-label {
        font-size: 0.875rem;
        color: var(--mat-sys-on-surface-variant);
        white-space: nowrap;
      }
    `,
  ],
  template: `
    <!-- Workspace Switcher -->
    @if (facade.isAuthenticated()) {
      <div class="workspace-switcher">
        <button
          mat-button
          class="workspace-button"
          (click)="facade.toggleWorkspaceMenu()"
          aria-label="Switch workspace"
        >
          <mat-icon>folder</mat-icon>
          <span class="workspace-name">
            {{ facade.currentWorkspaceName() || '?¸æ?å·¥ä??€' }}
          </span>
          <mat-icon iconPositionEnd>expand_more</mat-icon>
        </button>

        @if (facade.showWorkspaceMenu()) {
          <div
            class="workspace-menu-overlay"
            (click)="facade.closeAllMenus()"
          ></div>
          <div class="workspace-menu">
            @for (
              workspace of facade.availableWorkspaces();
              track workspace.id
            ) {
              <button
                class="workspace-menu-item"
                [class.active]="facade.isWorkspaceActive(workspace.id)"
                (click)="facade.selectWorkspace(workspace.id)"
                type="button"
              >
                <span class="workspace-item-name">{{ workspace.name }}</span>
              </button>
            } @empty {
              <div class="workspace-menu-item disabled">
                <span class="no-workspace-label">æ²’æ?å·¥ä??€</span>
              </div>
            }
            <div class="divider"></div>
            <div class="menu-actions">
              <app-workspace-create-trigger
                (dialogResult)="onCreateWorkspace($event)"
              ></app-workspace-create-trigger>
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
  private readonly createTrigger = viewChild(WorkspaceCreateTriggerComponent, {
    read: WorkspaceCreateTriggerComponent,
  });

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
