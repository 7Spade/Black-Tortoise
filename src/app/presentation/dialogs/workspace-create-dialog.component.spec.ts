import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkspaceCreateDialogComponent } from './workspace-create-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('WorkspaceCreateDialogComponent', () => {
  let component: WorkspaceCreateDialogComponent;
  let fixture: ComponentFixture<WorkspaceCreateDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<WorkspaceCreateDialogComponent>>;

  beforeEach(async () => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        WorkspaceCreateDialogComponent,
        NoopAnimationsModule
      ],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: MatDialogRef, useValue: dialogRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkspaceCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty workspace name control initially', () => {
    expect(component.workspaceNameControl.value).toBe('');
  });

  it('should close dialog with null when cancelled', () => {
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalledWith(null);
  });

  it('should not submit when form is invalid', () => {
    component.workspaceNameControl.setValue('');
    component.onSubmit();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should submit and close with result when form is valid', () => {
    component.workspaceNameControl.setValue('Test Workspace');
    component.onSubmit();
    expect(dialogRef.close).toHaveBeenCalledWith({
      workspaceName: 'Test Workspace'
    });
  });

  it('should validate required field', () => {
    component.workspaceNameControl.setValue('');
    component.workspaceNameControl.markAsTouched();
    expect(component.workspaceNameControl.hasError('required')).toBe(true);
    expect(component.getErrorMessage()).toBe('Workspace name is required');
  });

  it('should validate max length', () => {
    component.workspaceNameControl.setValue('a'.repeat(101));
    component.workspaceNameControl.markAsTouched();
    expect(component.workspaceNameControl.hasError('maxlength')).toBe(true);
    expect(component.getErrorMessage()).toBe('Workspace name must not exceed 100 characters');
  });

  it('should validate pattern', () => {
    component.workspaceNameControl.setValue('Invalid@Name!');
    component.workspaceNameControl.markAsTouched();
    expect(component.workspaceNameControl.hasError('pattern')).toBe(true);
    expect(component.getErrorMessage()).toBe('Only letters, numbers, spaces, hyphens, and underscores allowed');
  });
});
