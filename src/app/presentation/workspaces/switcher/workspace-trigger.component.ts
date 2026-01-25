/**
 * Workspace Trigger Component
 *
 * Layer: Presentation - Shared Components
 * Purpose: Button trigger for workspace switcher menu
 * Architecture: Zone-less, OnPush, Angular 20 control flow, Pure Reactive
 *
 * Responsibilities:
 * - Display current workspace name and icon
 * - Emit click event to toggle menu
 * - Pure presentation - no business logic
 * - Single responsibility: workspace trigger button
 */

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-workspace-trigger',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="workspace-trigger"
      (click)="triggerClick.emit()"
      [attr.aria-expanded]="isOpen()"
      aria-label="Switch workspace"
      type="button">
      <span class="material-icons workspace-icon">folder</span>
      <span class="workspace-name">{{ workspaceName() }}</span>
      <span class="material-icons expand-icon">
        {{ isOpen() ? 'expand_less' : 'expand_more' }}
      </span>
    </button>
  `,
  styles: [`
    .workspace-trigger {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--mat-sys-outline-variant, #c4c7c5);
      border-radius: 0.5rem;
      background: var(--mat-sys-surface, #fef7ff);
      color: var(--mat-sys-on-surface, #1d1b20);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 180px;
    }

    .workspace-trigger:hover {
      background: var(--mat-sys-surface-container-high, #ece6f0);
      border-color: var(--mat-sys-outline, #79747e);
    }

    .workspace-trigger:focus {
      outline: 2px solid var(--mat-sys-primary, #6750a4);
      outline-offset: 2px;
    }

    .workspace-icon {
      font-size: 1.25rem;
      color: var(--mat-sys-primary, #6750a4);
    }

    .workspace-name {
      flex: 1;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .expand-icon {
      font-size: 1.25rem;
      color: var(--mat-sys-on-surface-variant, #49454f);
    }
  `]
})
export class WorkspaceTriggerComponent {
  // Inputs
  readonly workspaceName = input.required<string>();
  readonly isOpen = input<boolean>(false);

  // Outputs
  readonly triggerClick = output<void>();
}
