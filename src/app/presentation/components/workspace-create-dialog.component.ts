/**
 * Workspace Create Dialog Component
 *
 * Layer: Presentation
 * Purpose: Material 3 dialog for creating new workspace with reactive forms
 * Architecture: Zone-less, OnPush, Angular 20, Standalone, M3 tokens only
 *
 * Replaces browser prompt() with proper Material Design dialog
 */

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { WorkspaceCreateResult } from '@application/models/workspace-create-result.model';

/**
 * Workspace Create Dialog Component
 */
@Component({
  selector: 'app-workspace-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="workspace-create-dialog">
      <h2 mat-dialog-title class="dialog-title">Create Workspace</h2>

      <mat-dialog-content class="dialog-content">
        <p class="dialog-description">
          Enter a name for your new workspace. You can change this later.
        </p>

        <mat-form-field appearance="outline" class="workspace-name-field">
          <mat-label>Workspace Name</mat-label>
          <input
            matInput
            type="text"
            [formControl]="workspaceNameControl"
            placeholder="e.g., Personal Projects"
            autocomplete="off"
            maxlength="100"
            autofocus
            (keydown.enter)="
              !workspaceNameControl.invalid && !isSubmitting() && onSubmit()
            "
          />
          @if (workspaceNameControl.invalid && workspaceNameControl.touched) {
            <mat-error>{{ getErrorMessage() }}</mat-error>
          }
          <mat-hint
            >Alphanumeric characters, spaces, hyphens, and underscores
            only</mat-hint
          >
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions class="dialog-actions">
        <button
          mat-button
          type="button"
          (click)="onCancel()"
          [disabled]="isSubmitting()"
        >
          Cancel
        </button>
        <button
          mat-raised-button
          type="submit"
          color="primary"
          (click)="onSubmit()"
          [disabled]="workspaceNameControl.invalid || isSubmitting()"
        >
          Create
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styleUrls: ['./workspace-create-dialog.component.scss'],
})
export class WorkspaceCreateDialogComponent {
  private readonly dialogRef = inject(
    MatDialogRef<WorkspaceCreateDialogComponent>,
  );

  /**
   * Workspace name form control
   * Typed as FormControl<string> for type safety
   */
  readonly workspaceNameControl = new FormControl<string>('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.maxLength(100),
      Validators.pattern(/^(?=.*\S)[a-zA-Z0-9\s\-_]+$/), // Alphanumeric + spaces, must contain non-space
    ],
  });

  /**
   * Signal for form submission state
   */
  readonly isSubmitting = signal(false);

  /**
   * Cancel and close dialog
   */
  onCancel(): void {
    this.dialogRef.close(null);
  }

  /**
   * Submit form and close with result
   */
  onSubmit(): void {
    if (this.workspaceNameControl.invalid) {
      this.workspaceNameControl.markAsTouched();
      return;
    }

    const workspaceName = this.workspaceNameControl.value.trim();

    if (!workspaceName) {
      return;
    }

    this.isSubmitting.set(true);

    const result: WorkspaceCreateResult = {
      workspaceName,
    };

    this.dialogRef.close(result);
  }

  /**
   * Get error message for workspace name field
   */
  getErrorMessage(): string {
    const control = this.workspaceNameControl;

    if (control.hasError('required')) {
      return 'Workspace name is required';
    }

    if (control.hasError('maxlength')) {
      return 'Workspace name must not exceed 100 characters';
    }

    if (control.hasError('pattern')) {
      return 'Only letters, numbers, spaces, hyphens, and underscores allowed';
    }

    return '';
  }
}
