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
  styleUrls: ['./workspace-trigger.component.scss']
})
export class WorkspaceTriggerComponent {
  // Inputs
  readonly workspaceName = input.required<string>();
  readonly isOpen = input<boolean>(false);

  // Outputs
  readonly triggerClick = output<void>();
}
