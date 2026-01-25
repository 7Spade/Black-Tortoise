/**
 * Workspace Menu Component
 *
 * Layer: Presentation - Shared Components
 * Purpose: Dropdown menu for workspace switcher
 * Architecture: Zone-less, OnPush, Angular 20 control flow, Pure Reactive
 *
 * Responsibilities:
 * - Display list of available workspaces
 * - Show create workspace option
 * - Emit workspace selection and create events
 * - Pure presentation - no business logic
 * - Single responsibility: workspace menu display
 */

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceListItemComponent } from './workspace-list-item.component';
import { WorkspaceItem } from './types';

@Component({
  selector: 'app-workspace-menu',
  standalone: true,
  imports: [CommonModule, WorkspaceListItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workspace-menu" role="menu">
      <div class="workspace-list">
        @for (workspace of workspaces(); track workspace.id) {
          <app-workspace-list-item
            [workspace]="workspace"
            [isActive]="workspace.id === activeWorkspaceId()"
            (itemClick)="workspaceSelect.emit($event)"
          />
        }
      </div>
      
      <div class="menu-divider"></div>
      
      <button
        class="create-workspace-button"
        (click)="createWorkspace.emit()"
        type="button">
        <span class="material-icons">add</span>
        <span>Create Workspace</span>
      </button>
    </div>
  `,
  styles: [`
    .workspace-menu {
      position: absolute;
      top: calc(100% + 0.5rem);
      left: 0;
      min-width: 280px;
      background: var(--mat-sys-surface-container, #f3edf7);
      border: 1px solid var(--mat-sys-outline-variant, #c4c7c5);
      border-radius: 0.75rem;
      box-shadow: 
        0 2px 4px rgba(0, 0, 0, 0.1),
        0 8px 16px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      z-index: 1000;
    }

    .workspace-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .menu-divider {
      height: 1px;
      background: var(--mat-sys-outline-variant, #c4c7c5);
      margin: 0.25rem 0;
    }

    .create-workspace-button {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      width: 100%;
      border: none;
      background: transparent;
      color: var(--mat-sys-primary, #6750a4);
      font-size: 0.875rem;
      font-weight: 500;
      text-align: left;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .create-workspace-button:hover {
      background: var(--mat-sys-surface-container-high, #ece6f0);
    }

    .create-workspace-button .material-icons {
      font-size: 1.125rem;
    }
  `]
})
export class WorkspaceMenuComponent {
  // Inputs
  readonly workspaces = input.required<WorkspaceItem[]>();
  readonly activeWorkspaceId = input<string | null>(null);

  // Outputs
  readonly workspaceSelect = output<string>();
  readonly createWorkspace = output<void>();
}
