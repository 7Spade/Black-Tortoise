/**
 * Workspace Create Dialog Component Tests
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { WorkspaceCreateDialogComponent } from './workspace-create-dialog.component';

describe('WorkspaceCreateDialogComponent', () => {
  let component: WorkspaceCreateDialogComponent;
  let fixture: ComponentFixture<WorkspaceCreateDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<WorkspaceCreateDialogComponent>>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        WorkspaceCreateDialogComponent,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkspaceCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty workspace name control', () => {
    expect(component.workspaceNameControl.value).toBe('');
    expect(component.workspaceNameControl.invalid).toBe(true);
  });

  it('should initialize with isSubmitting signal as false', () => {
    expect(component.isSubmitting()).toBe(false);
  });

  describe('Form Validation', () => {
    it('should be invalid when workspace name is empty', () => {
      component.workspaceNameControl.setValue('');
      expect(component.workspaceNameControl.invalid).toBe(true);
      expect(component.workspaceNameControl.hasError('required')).toBe(true);
    });

    it('should be valid with alphanumeric workspace name', () => {
      component.workspaceNameControl.setValue('My Project 123');
      expect(component.workspaceNameControl.valid).toBe(true);
    });

    it('should be valid with hyphens and underscores', () => {
      component.workspaceNameControl.setValue('my-project_v2');
      expect(component.workspaceNameControl.valid).toBe(true);
    });

    it('should be invalid with special characters', () => {
      component.workspaceNameControl.setValue('My@Project#');
      expect(component.workspaceNameControl.invalid).toBe(true);
      expect(component.workspaceNameControl.hasError('pattern')).toBe(true);
    });

    it('should be invalid when workspace name is whitespace only', () => {
      component.workspaceNameControl.setValue('   ');
      expect(component.workspaceNameControl.invalid).toBe(true);
      expect(component.workspaceNameControl.hasError('pattern')).toBe(true);
    });

    it('should be invalid when exceeding max length', () => {
      const longName = 'a'.repeat(101);
      component.workspaceNameControl.setValue(longName);
      expect(component.workspaceNameControl.invalid).toBe(true);
      expect(component.workspaceNameControl.hasError('maxlength')).toBe(true);
    });

    it('should be valid at max length boundary (100 chars)', () => {
      const maxName = 'a'.repeat(100);
      component.workspaceNameControl.setValue(maxName);
      expect(component.workspaceNameControl.valid).toBe(true);
    });
  });

  describe('Error Messages', () => {
    it('should return required error message', () => {
      component.workspaceNameControl.setValue('');
      component.workspaceNameControl.markAsTouched();
      expect(component.getErrorMessage()).toBe('Workspace name is required');
    });

    it('should return pattern error message', () => {
      component.workspaceNameControl.setValue('test@#$');
      component.workspaceNameControl.markAsTouched();
      expect(component.getErrorMessage()).toBe(
        'Only letters, numbers, spaces, hyphens, and underscores allowed'
      );
    });

    it('should return maxlength error message', () => {
      component.workspaceNameControl.setValue('a'.repeat(101));
      component.workspaceNameControl.markAsTouched();
      expect(component.getErrorMessage()).toBe(
        'Workspace name must not exceed 100 characters'
      );
    });

    it('should return empty string when control is valid', () => {
      component.workspaceNameControl.setValue('Valid Name');
      expect(component.getErrorMessage()).toBe('');
    });
  });

  describe('onCancel', () => {
    it('should close dialog with null result', () => {
      component.onCancel();
      expect(mockDialogRef.close).toHaveBeenCalledWith(null);
    });
  });

  describe('onSubmit', () => {
    it('should not submit when form is invalid', () => {
      component.workspaceNameControl.setValue('');
      component.onSubmit();
      
      expect(mockDialogRef.close).not.toHaveBeenCalled();
      expect(component.workspaceNameControl.touched).toBe(true);
    });

    it('should not submit when workspace name is only whitespace', () => {
      component.workspaceNameControl.setValue('   ');
      component.onSubmit();
      
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });

    it('should submit and close dialog with trimmed workspace name', () => {
      component.workspaceNameControl.setValue('  Test Workspace  ');
      component.onSubmit();
      
      expect(component.isSubmitting()).toBe(true);
      expect(mockDialogRef.close).toHaveBeenCalledWith({
        workspaceName: 'Test Workspace'
      });
    });

    it('should submit valid workspace name without trimming internal spaces', () => {
      component.workspaceNameControl.setValue('My Test Workspace');
      component.onSubmit();
      
      expect(mockDialogRef.close).toHaveBeenCalledWith({
        workspaceName: 'My Test Workspace'
      });
    });

    it('should set isSubmitting signal to true on submit', () => {
      component.workspaceNameControl.setValue('Valid Name');
      
      expect(component.isSubmitting()).toBe(false);
      component.onSubmit();
      expect(component.isSubmitting()).toBe(true);
    });
  });

  describe('FormControl Type Safety', () => {
    it('should have typed FormControl<string>', () => {
      // TypeScript compile-time check
      const value: string = component.workspaceNameControl.value;
      expect(typeof value).toBe('string');
    });

    it('should not allow null values (nonNullable: true)', () => {
      // With nonNullable: true, reset() uses empty string
      component.workspaceNameControl.reset();
      expect(component.workspaceNameControl.value).toBe('');
    });
  });

  describe('UI Rendering', () => {
    it('should display dialog title', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const title = compiled.querySelector('h2');
      expect(title?.textContent).toContain('Create Workspace');
    });

    it('should display description text', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const description = compiled.querySelector('.dialog-description');
      expect(description?.textContent).toContain('Enter a name for your new workspace');
    });

    it('should have Cancel and Create buttons', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const buttons = compiled.querySelectorAll('button');
      
      expect(buttons.length).toBeGreaterThanOrEqual(2);
      const buttonTexts = Array.from(buttons).map(b => b.textContent?.trim());
      expect(buttonTexts).toContain('Cancel');
      expect(buttonTexts).toContain('Create');
    });

    it('should disable Create button when form is invalid', () => {
      component.workspaceNameControl.setValue('');
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const createButton = Array.from(compiled.querySelectorAll('button'))
        .find(b => b.textContent?.includes('Create')) as HTMLButtonElement;
      
      expect(createButton.disabled).toBe(true);
    });

    it('should enable Create button when form is valid', () => {
      component.workspaceNameControl.setValue('Valid Name');
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const createButton = Array.from(compiled.querySelectorAll('button'))
        .find(b => b.textContent?.includes('Create')) as HTMLButtonElement;
      
      expect(createButton.disabled).toBe(false);
    });
  });

  describe('Material 3 Integration', () => {
    it('should use mat-form-field with outline appearance', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const formField = compiled.querySelector('mat-form-field');
      expect(formField).toBeTruthy();
      expect(formField?.getAttribute('appearance')).toBe('outline');
    });

    it('should use matInput directive', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const input = compiled.querySelector('input[matInput]');
      expect(input).toBeTruthy();
    });

    it('should display mat-hint', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const hint = compiled.querySelector('mat-hint');
      expect(hint?.textContent).toContain('Alphanumeric characters');
    });

    it('should display mat-error when invalid and touched', () => {
      component.workspaceNameControl.setValue('');
      component.workspaceNameControl.markAsTouched();
      fixture.detectChanges();
      
      const compiled = fixture.nativeElement as HTMLElement;
      const error = compiled.querySelector('mat-error');
      expect(error).toBeTruthy();
    });
  });
});
