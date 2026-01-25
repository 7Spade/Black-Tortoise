/**
 * Workspace Create Trigger Component
 * 
 * Layer: Presentation - Components
 * Purpose: Sole place that opens workspace creation dialog and emits results
 * Architecture: Zone-less, OnPush, Pure Reactive, Signal-based, NO RxJS
 * 
 * Responsibilities:
 * - Opens MatDialog with WorkspaceCreateDialogComponent
 * - Emits dialog result via signal output
 * - NO result interpretation or business logic
 * - NO knowledge of workspace/org/auth
 * 
 * Constitution Compliance:
 * - No RxJS imports (removed Subject, filter)
 * - No manual subscribe calls
 * - Pure signal-based using effect for dialog result handling
 * - Framework boundary (MatDialog) converted to signal via toSignal
 */

import { ChangeDetectionStrategy, Component, effect, inject, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { WorkspaceCreateResult } from '@application/workspace/models/workspace-create-result.model';
import { isWorkspaceCreateResult } from '@application/workspace/models/workspace-create-result.validator';
import { WorkspaceCreateDialogComponent } from '@presentation/workspaces/dialogs/workspace-create-dialog.component';

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
   * Signal to track latest dialog result from current dialog instance
   */
  private readonly _latestDialogResult = signal<unknown | null>(null);

  /**
   * Constructor with effect to emit validated results via output
   * Effect pattern for signal validation and emission
   */
  constructor() {
    effect(() => {
      const result = this._latestDialogResult();
      if (result && isWorkspaceCreateResult(result)) {
        this.dialogResult.emit(result);
        // Reset after emission
        this._latestDialogResult.set(null);
      }
    }, { allowSignalWrites: false });
  }

  /**
   * Open workspace creation dialog
   * Framework boundary: MatDialog Observable -> Signal (via toSignal on individual call)
   * No manual subscribe - uses toSignal for reactive handling
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(WorkspaceCreateDialogComponent, {
      width: '500px',
      disableClose: false,
      autoFocus: true,
    });

    // Framework boundary: Convert MatDialog afterClosed Observable to signal
    // toSignal automatically subscribes and unsubscribes
    const resultSignal = toSignal(dialogRef.afterClosed());
    
    // Effect to handle dialog result and update local signal
    // This effect will clean up automatically when the signal completes
    effect(() => {
      const result = resultSignal();
      if (result !== undefined) {
        this._latestDialogResult.set(result);
      }
    }, { allowSignalWrites: true });
  }
}
