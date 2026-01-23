/**
 * Workspace Create Trigger Component
 * 
 * Layer: Presentation - Components
 * Purpose: Sole place that opens workspace creation dialog and emits results
 * Architecture: Zone-less, OnPush, Pure Reactive, Signal-based
 * 
 * Responsibilities:
 * - Opens MatDialog with WorkspaceCreateDialogComponent
 * - Emits dialog result via signal output
 * - NO result interpretation or business logic
 * - NO knowledge of workspace/org/auth
 * - Internal subscribe is acceptable for dialog result handling (framework boundary)
 */

import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WorkspaceCreateDialogComponent } from '@presentation/workspace/dialogs/workspace-create-dialog.component';
import { WorkspaceCreateResult } from '@application/models/workspace-create-result.model';

@Component({
  selector: 'app-workspace-create-trigger',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<!-- Workspace Create Trigger Component - Hidden trigger component -->`,
  styles: [`/* Workspace Create Trigger Component styles - This component has no visual representation */`],
})
export class WorkspaceCreateTriggerComponent {
  private readonly dialog = inject(MatDialog);

  /**
   * Output event that emits the validated dialog result
   */
  readonly dialogResult = output<WorkspaceCreateResult>();

  /**
   * Open workspace creation dialog
   * Emits result via dialogResult output signal
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(WorkspaceCreateDialogComponent, {
      width: '500px',
      disableClose: false,
      autoFocus: true,
    });

    // Internal subscribe is acceptable at framework boundary (MatDialog)
    // Emits only validated WorkspaceCreateResult via signal output
    dialogRef.afterClosed().subscribe({
      next: (result: unknown) => {
        // Type guard and validation
        if (
          result !== null &&
          result !== undefined &&
          typeof result === 'object' &&
          'workspaceName' in result &&
          typeof (result as WorkspaceCreateResult).workspaceName === 'string' &&
          (result as WorkspaceCreateResult).workspaceName.trim().length > 0
        ) {
          this.dialogResult.emit(result as WorkspaceCreateResult);
        }
      },
      error: (error) => {
        console.error('[WorkspaceCreateTriggerComponent] Dialog error:', error);
      }
    });
  }
}
