/**
 * Organization Create Dialog Component
 * 
 * Layer: Presentation
 * Purpose: Material 3 dialog for creating new organization with reactive forms
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

/**
 * Result type for organization creation dialog
 */
export interface OrganizationCreateResult {
    organizationName: string;
}

/**
 * Organization Create Dialog Component
 */
@Component({
  selector: 'app-organization-create-dialog',
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
<div class="organization-create-dialog">
  <h2 mat-dialog-title class="dialog-title">Create Organization</h2>
  
  <mat-dialog-content class="dialog-content">
    <p class="dialog-description">
      Enter a name for your new organization. You can change this later.
    </p>
    
    <mat-form-field appearance="outline" class="organization-name-field">
      <mat-label>Organization Name</mat-label>
      <input 
        matInput 
        type="text"
        [formControl]="organizationNameControl"
        placeholder="e.g., Acme Corp"
        autocomplete="off"
        maxlength="100"
        autofocus
        (keydown.enter)="!organizationNameControl.invalid && !isSubmitting() && onSubmit()">
      @if (organizationNameControl.invalid && organizationNameControl.touched) {
        <mat-error>{{ getErrorMessage() }}</mat-error>
      }
      <mat-hint>Alphanumeric characters, spaces, hyphens, and underscores only</mat-hint>
    </mat-form-field>
  </mat-dialog-content>
  
  <mat-dialog-actions class="dialog-actions">
    <button 
      mat-button 
      type="button"
      (click)="onCancel()"
      [disabled]="isSubmitting()">
      Cancel
    </button>
    <button 
      mat-raised-button 
      type="submit"
      color="primary"
      (click)="onSubmit()"
      [disabled]="organizationNameControl.invalid || isSubmitting()">
      Create
    </button>
  </mat-dialog-actions>
</div>
  `,
  styles: [`
/**
 * Organization Create Dialog Styles
 * Using Material 3 Design Tokens Only (--mat-sys-*)
 */

.organization-create-dialog {
  display: flex;
  flex-direction: column;
  min-width: 400px;
  max-width: 500px;
}

.dialog-title {
  color: var(--mat-sys-on-surface, #1d1b20);
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0;
  padding: 1.5rem 1.5rem 1rem;
}

.dialog-content {
  padding: 0 1.5rem 1rem;
  color: var(--mat-sys-on-surface-variant, #49454f);
}

.dialog-description {
  margin: 0 0 1.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--mat-sys-on-surface-variant, #49454f);
}

.organization-name-field {
  width: 100%;
}

.dialog-actions {
  padding: 1rem 1.5rem 1.5rem;
  justify-content: flex-end;
  gap: 0.5rem;
}

/* Material form field M3 token overrides (if needed) */
::ng-deep .organization-create-dialog {
  .mat-mdc-form-field {
    --mdc-outlined-text-field-container-shape: 8px;
  }
  
  .mat-mdc-form-field-focus-overlay {
    background-color: var(--mat-sys-on-surface, #1d1b20);
  }
  
  .mat-mdc-text-field-wrapper {
    background-color: var(--mat-sys-surface, #fef7ff);
  }
}
  `],
})
export class OrganizationCreateDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<OrganizationCreateDialogComponent>);

  /**
   * Organization name form control
   * Typed as FormControl<string> for type safety
   */
  readonly organizationNameControl = new FormControl<string>('', {
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
    if (this.organizationNameControl.invalid) {
      this.organizationNameControl.markAsTouched();
      return;
    }

    const organizationName = this.organizationNameControl.value.trim();
    
    if (!organizationName) {
      return;
    }

    this.isSubmitting.set(true);

    const result: OrganizationCreateResult = {
      organizationName,
    };

    this.dialogRef.close(result);
  }

  /**
   * Get error message for organization name field
   */
  getErrorMessage(): string {
    const control = this.organizationNameControl;

    if (control.hasError('required')) {
      return 'Organization name is required';
    }

    if (control.hasError('maxlength')) {
      return 'Organization name must not exceed 100 characters';
    }

    if (control.hasError('pattern')) {
      return 'Only letters, numbers, spaces, hyphens, and underscores allowed';
    }

    return '';
  }
}
