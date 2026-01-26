/**
 * OrganizationCreateTrigger Component
 * 
 * Layer: Presentation
 * Purpose: Trigger component for opening organization creation dialog
 * Architecture: Zone-less, OnPush, Standalone, Pure Signal-based
 * 
 * Responsibilities:
 * - Provides API to open organization creation dialog
 * - Emits dialog result via signal output
 * - No business logic - only dialog coordination
 * 
 * Constitution Compliance:
 * - No RxJS imports (removed Observable)
 * - Pure signal-based API
 * - Zone-less compatible
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-organization-create-trigger',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organization-create-trigger.component.html',
  styleUrls: ['./organization-create-trigger.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationCreateTriggerComponent {
  /**
   * Output for dialog results
   */
  readonly dialogResult = output<unknown>();
  
  /**
   * Loading state
   */
  readonly isOpen = signal(false);
  
  /**
   * Opens the organization creation dialog
   * Emits result via output signal
   */
  openDialog(): void {
    this.isOpen.set(true);
    // TODO: Implement dialog opening logic with MatDialog
    // Use toSignal() pattern like WorkspaceCreateTriggerComponent
    // Convert afterClosed() Observable to signal and emit via dialogResult output
  }
}
