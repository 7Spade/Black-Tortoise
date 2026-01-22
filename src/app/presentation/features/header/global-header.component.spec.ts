/**
 * Global Header Component Tests
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { GlobalHeaderComponent } from './global-header.component';
import { WorkspaceContextStore } from '@application/stores/workspace-context.store';
import { 
  WorkspaceCreateDialogComponent,
  WorkspaceCreateDialogResult 
} from './workspace-create-dialog.component';

describe('GlobalHeaderComponent', () => {
  let component: GlobalHeaderComponent;
  let fixture: ComponentFixture<GlobalHeaderComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<WorkspaceCreateDialogComponent>>;

  beforeEach(async () => {
    // Create spies
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    
    // Default successful navigation
    mockRouter.navigate.and.returnValue(Promise.resolve(true));
    
    await TestBed.configureTestingModule({
      imports: [GlobalHeaderComponent],
      providers: [
        WorkspaceContextStore,
        { provide: Router, useValue: mockRouter },
        { provide: MatDialog, useValue: mockDialog }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject WorkspaceContextStore', () => {
    expect(component.workspaceContext).toBeTruthy();
  });

  it('should toggle workspace menu', () => {
    expect(component.showWorkspaceMenu()).toBe(false);
    component.toggleWorkspaceMenu();
    expect(component.showWorkspaceMenu()).toBe(true);
    component.toggleWorkspaceMenu();
    expect(component.showWorkspaceMenu()).toBe(false);
  });

  it('should toggle identity menu', () => {
    expect(component.showIdentityMenu()).toBe(false);
    component.toggleIdentityMenu();
    expect(component.showIdentityMenu()).toBe(true);
    component.toggleIdentityMenu();
    expect(component.showIdentityMenu()).toBe(false);
  });

  it('should close other menu when toggling', () => {
    component.toggleWorkspaceMenu();
    expect(component.showWorkspaceMenu()).toBe(true);
    component.toggleIdentityMenu();
    expect(component.showWorkspaceMenu()).toBe(false);
    expect(component.showIdentityMenu()).toBe(true);
  });

  it('should switch workspace and navigate', async () => {
    const workspaceId = 'workspace-123';
    
    component.selectWorkspace(workspaceId);
    
    expect(component.showWorkspaceMenu()).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/workspace']);
  });

  it('should handle navigation error when switching workspace', async () => {
    const workspaceId = 'workspace-123';
    mockRouter.navigate.and.returnValue(Promise.reject('Navigation failed'));
    
    spyOn(component.workspaceContext, 'setError');
    
    component.selectWorkspace(workspaceId);
    
    // Wait for promise rejection
    await new Promise(resolve => setTimeout(resolve, 10));
    
    expect(component.workspaceContext.setError).toHaveBeenCalledWith(
      'Failed to navigate to workspace'
    );
  });

  describe('createNewWorkspace with MatDialog', () => {
    it('should open dialog when creating workspace', () => {
      mockDialogRef.afterClosed.and.returnValue(of(null));
      mockDialog.open.and.returnValue(mockDialogRef);
      
      component.createNewWorkspace();
      
      expect(mockDialog.open).toHaveBeenCalledWith(
        WorkspaceCreateDialogComponent,
        {
          width: '500px',
          disableClose: false,
          autoFocus: true,
        }
      );
    });

    it('should create workspace and navigate when dialog returns result', async () => {
      const dialogResult: WorkspaceCreateDialogResult = {
        workspaceName: 'Test Workspace'
      };
      
      mockDialogRef.afterClosed.and.returnValue(of(dialogResult));
      mockDialog.open.and.returnValue(mockDialogRef);
      
      spyOn(component.workspaceContext, 'createWorkspace');
      
      await component.createNewWorkspace();
      
      expect(component.workspaceContext.createWorkspace).toHaveBeenCalledWith('Test Workspace');
      expect(component.showWorkspaceMenu()).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/workspace']);
    });

    it('should not create workspace when dialog is cancelled', async () => {
      mockDialogRef.afterClosed.and.returnValue(of(null));
      mockDialog.open.and.returnValue(mockDialogRef);
      
      spyOn(component.workspaceContext, 'createWorkspace');
      
      await component.createNewWorkspace();
      
      expect(component.workspaceContext.createWorkspace).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should handle navigation error when creating workspace', async () => {
      const dialogResult: WorkspaceCreateDialogResult = {
        workspaceName: 'Test Workspace'
      };
      
      mockDialogRef.afterClosed.and.returnValue(of(dialogResult));
      mockDialog.open.and.returnValue(mockDialogRef);
      mockRouter.navigate.and.returnValue(Promise.reject('Navigation failed'));
      
      spyOn(component.workspaceContext, 'setError');
      
      await component.createNewWorkspace();
      
      // Wait for promise rejection
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(component.workspaceContext.setError).toHaveBeenCalledWith(
        'Failed to navigate to workspace'
      );
    });
  });
});
