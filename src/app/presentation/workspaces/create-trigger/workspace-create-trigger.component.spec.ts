import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkspaceCreateTriggerComponent } from './workspace-create-trigger.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { of } from 'rxjs';
import { WorkspaceCreateResult } from '@application/workspace/models/workspace-create-result.model';

describe('WorkspaceCreateTriggerComponent', () => {
  let component: WorkspaceCreateTriggerComponent;
  let fixture: ComponentFixture<WorkspaceCreateTriggerComponent>;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceCreateTriggerComponent, MatDialogModule],
      providers: [
        provideExperimentalZonelessChangeDetection(),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkspaceCreateTriggerComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have MatDialog injected', () => {
    expect(dialog).toBeTruthy();
  });

  it('should open dialog when openDialog is called', () => {
    const dialogRefMock = {
      afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of(null))
    } as unknown as MatDialogRef<any>;
    
    spyOn(dialog, 'open').and.returnValue(dialogRefMock);
    
    component.openDialog();
    
    expect(dialog.open).toHaveBeenCalled();
    expect(dialogRefMock.afterClosed).toHaveBeenCalled();
  });

  it('should emit dialogResult when valid result is returned', (done) => {
    const validResult: WorkspaceCreateResult = { workspaceName: 'Test Workspace' };
    const dialogRefMock = {
      afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of(validResult))
    } as unknown as MatDialogRef<any>;
    
    spyOn(dialog, 'open').and.returnValue(dialogRefMock);
    
    // Subscribe to the output
    component.dialogResult.subscribe((result) => {
      expect(result).toEqual(validResult);
      done();
    });
    
    component.openDialog();
  });

  it('should not emit dialogResult when invalid result is returned', (done) => {
    const invalidResult = { invalid: 'data' };
    const dialogRefMock = {
      afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of(invalidResult))
    } as unknown as MatDialogRef<any>;
    
    spyOn(dialog, 'open').and.returnValue(dialogRefMock);
    
    let emitted = false;
    component.dialogResult.subscribe(() => {
      emitted = true;
    });
    
    component.openDialog();
    
    setTimeout(() => {
      expect(emitted).toBe(false);
      done();
    }, 100);
  });

  it('should not emit dialogResult when null is returned', (done) => {
    const dialogRefMock = {
      afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of(null))
    } as unknown as MatDialogRef<any>;
    
    spyOn(dialog, 'open').and.returnValue(dialogRefMock);
    
    let emitted = false;
    component.dialogResult.subscribe(() => {
      emitted = true;
    });
    
    component.openDialog();
    
    setTimeout(() => {
      expect(emitted).toBe(false);
      done();
    }, 100);
  });
});
