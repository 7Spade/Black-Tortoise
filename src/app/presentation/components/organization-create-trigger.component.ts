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
import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OrganizationCreateDialogComponent } from './organization-create-dialog.component';

@Component({
  selector: 'app-organization-create-trigger',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
<!--
  Organization Create Trigger Template
  
  Hidden component - used programmatically to open dialog
-->
<div class="organization-create-trigger" [hidden]="true">
  <!-- Trigger component - no visible UI -->
</div>
  `,
  styles: [`
/**
 * Organization Create Trigger Styles
 */

.organization-create-trigger {
  display: none;
}
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationCreateTriggerComponent {
  private readonly dialog = inject(MatDialog);

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
    
    const dialogRef = this.dialog.open(OrganizationCreateDialogComponent, {
      width: '600px',
      data: { /* initial data */ },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
        this.isOpen.set(false);
        if (result) {
            this.dialogResult.emit(result);
        }
    });
  }
}

