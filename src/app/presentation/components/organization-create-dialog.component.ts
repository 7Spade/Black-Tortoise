import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface DialogData {
  name: string;
}

@Component({
  selector: 'app-organization-create-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>Create Organization</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Organization Name</mat-label>
        <input matInput [(ngModel)]="data.name" placeholder="Ex. Acme Corp" cdkFocusInitial>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-flat-button color="primary" [mat-dialog-close]="data.name" [disabled]="!data.name">Create</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-top: 1rem;
    }
  `]
})
export class OrganizationCreateDialogComponent {
  readonly dialogRef = inject(MatDialogRef<OrganizationCreateDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA) || { name: '' };

  onNoClick(): void {
    this.dialogRef.close();
  }
}
