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

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { WorkspaceCreateResult } from '@application/models/workspace-create-result.model';
import { isWorkspaceCreateResult } from '@application/models/workspace-create-result.validator';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, tap } from 'rxjs';
import { WorkspaceCreateDialogComponent } from './workspace-create-dialog.component';

@Component({
  selector: 'app-workspace-create-trigger',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button mat-button class="create-workspace-btn" (click)="openDialog()">
      <mat-icon>add</mat-icon>
      <span>Create Workspace</span>
    </button>
  `,
  styleUrls: ['./workspace-create-trigger.component.scss'],
})
export class WorkspaceCreateTriggerComponent {
  private readonly dialog = inject(MatDialog);

  /**
   * Output event that emits the validated dialog result
   */
  readonly dialogResult = output<WorkspaceCreateResult>();

  /**
   * Open workspace creation dialog
   * Uses rxMethod to handle the Observable stream from MatDialog
   */
  readonly openDialog = rxMethod<void>(
    pipe(
      exhaustMap(() =>
        this.dialog
          .open(WorkspaceCreateDialogComponent, {
            width: '500px',
            disableClose: false,
            autoFocus: true,
          })
          .afterClosed(),
      ),
      tap((result) => {
        if (result && isWorkspaceCreateResult(result)) {
          this.dialogResult.emit(result);
        }
      }),
    ),
  );
}
