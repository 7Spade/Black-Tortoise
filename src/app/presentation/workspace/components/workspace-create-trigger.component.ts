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
 * - MatDialog.afterClosed() is framework boundary - uses toSignal for reactive handling
 */

import { ChangeDetectionStrategy, Component, effect, inject, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { WorkspaceCreateDialogComponent } from '@presentation/workspace/dialogs/workspace-create-dialog.component';
import { WorkspaceCreateResult } from '@application/models/workspace-create-result.model';
import { isWorkspaceCreateResult } from '@application/models/workspace-create-result.validator';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

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
   * Subject for dialog results (reactive stream from framework boundary)
   */
  private readonly _dialogResult$ = new Subject<unknown>();

  /**
   * Convert dialog result stream to signal with validation filter
   * Pure reactive: Observable -> Signal conversion via toSignal
   * Uses extracted type guard utility for validation
   */
  private readonly _validatedResult = toSignal(
    this._dialogResult$.pipe(
      filter(isWorkspaceCreateResult)
    ),
    { requireSync: false }
  );

  /**
   * Constructor with effect to emit validated results via output
   * Effect pattern for signal -> output emission
   * Effect only emits when signal changes to non-null value
   */
  constructor() {
    effect(() => {
      const result = this._validatedResult();
      if (result) {
        this.dialogResult.emit(result);
      }
    }, { allowSignalWrites: false });
  }

  /**
   * Open workspace creation dialog
   * MatDialog afterClosed() is framework boundary - push to Subject for reactive handling
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(WorkspaceCreateDialogComponent, {
      width: '500px',
      disableClose: false,
      autoFocus: true,
    });

    // Framework boundary: MatDialog Observable -> Subject (reactive stream)
    dialogRef.afterClosed().subscribe({
      next: (result) => this._dialogResult$.next(result),
      error: (error) => console.error('[WorkspaceCreateTriggerComponent] Dialog error:', error)
    });
  }
}
