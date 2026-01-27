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
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, tap } from 'rxjs';
import {
  OrganizationCreateDialogComponent,
  OrganizationCreateResult,
} from './organization-create-dialog.component';

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
  styleUrls: ['./organization-create-trigger.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationCreateTriggerComponent {
  private readonly dialog = inject(MatDialog);

  /**
   * Output for dialog results
   */
  readonly dialogResult = output<OrganizationCreateResult>();

  /**
   * Opens the organization creation dialog
   * Emits result via output signal
   */
  readonly openDialog = rxMethod<void>(
    pipe(
      exhaustMap(() =>
        this.dialog
          .open<
            OrganizationCreateDialogComponent,
            any,
            OrganizationCreateResult
          >(OrganizationCreateDialogComponent, {
            width: '600px',
            data: {
              /* initial data */
            },
            autoFocus: false,
          })
          .afterClosed(),
      ),
      tap((result) => {
        if (result) {
          this.dialogResult.emit(result);
        }
      }),
    ),
  );
}
