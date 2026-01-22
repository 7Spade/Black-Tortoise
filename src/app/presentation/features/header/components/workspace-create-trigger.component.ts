/**
 * Workspace Create Trigger Component
 * 
 * Layer: Presentation - Components
 * Purpose: Sole place that opens workspace creation dialog and emits results
 * Architecture: Zone-less, OnPush, Pure Reactive
 * 
 * Responsibilities:
 * - Opens MatDialog with WorkspaceCreateDialogComponent
 * - Returns Observable<unknown> from afterClosed WITHOUT generics
 * - NO result interpretation or business logic
 * - NO knowledge of workspace/org/auth
 */

import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { WorkspaceCreateDialogComponent } from '../dialogs/workspace-create-dialog.component';

@Component({
  selector: 'app-workspace-create-trigger',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
})
export class WorkspaceCreateTriggerComponent {
  private readonly dialog = inject(MatDialog);

  /**
   * Output event that emits the raw dialog result
   */
  readonly dialogResult = output<unknown>();

  /**
   * Open workspace creation dialog
   * Returns Observable<unknown> from afterClosed WITHOUT generics
   * Caller is responsible for filtering and interpreting results
   */
  openDialog(): Observable<unknown> {
    const dialogRef = this.dialog.open(WorkspaceCreateDialogComponent, {
      width: '500px',
      disableClose: false,
      autoFocus: true,
    });

    // afterClosed WITHOUT generics - returns Observable<unknown>
    return dialogRef.afterClosed();
  }
}
