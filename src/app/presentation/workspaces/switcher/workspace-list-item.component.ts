/**
 * Workspace List Item Component
 *
 * Layer: Presentation - Shared Components
 * Purpose: Individual workspace item in switcher menu
 * Architecture: Zone-less, OnPush, Angular 20 control flow, Pure Reactive
 *
 * Responsibilities:
 * - Display workspace item with icon and name
 * - Show active state visually
 * - Emit click event
 * - Pure presentation - no business logic
 * - Single responsibility: workspace list item display
 */

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceItem } from './types';

@Component({
  selector: 'app-workspace-list-item',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="workspace-item"
      [class.active]="isActive()"
      (click)="itemClick.emit(workspace().id)"
      type="button">
      <span class="material-icons item-icon">folder</span>
      <span class="item-name">{{ workspace().name }}</span>
      @if (isActive()) {
        <span class="material-icons check-icon">check</span>
      }
    </button>
  `,
  styles: [`
    .workspace-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 1rem;
      width: 100%;
      border: none;
      background: transparent;
      color: var(--mat-sys-on-surface, #1d1b20);
      font-size: 0.875rem;
      text-align: left;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .workspace-item:hover {
      background: var(--mat-sys-surface-container-high, #ece6f0);
    }

    .workspace-item.active {
      background: var(--mat-sys-secondary-container, #e8def8);
      color: var(--mat-sys-on-secondary-container, #1d192b);
    }

    .item-icon {
      font-size: 1.125rem;
      color: var(--mat-sys-on-surface-variant, #49454f);
    }

    .workspace-item.active .item-icon {
      color: var(--mat-sys-on-secondary-container, #1d192b);
    }

    .item-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .check-icon {
      font-size: 1.125rem;
      color: var(--mat-sys-primary, #6750a4);
    }
  `]
})
export class WorkspaceListItemComponent {
  // Inputs
  readonly workspace = input.required<WorkspaceItem>();
  readonly isActive = input<boolean>(false);

  // Outputs
  readonly itemClick = output<string>();
}
