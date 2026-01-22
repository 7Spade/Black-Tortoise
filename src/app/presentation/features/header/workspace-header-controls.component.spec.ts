/**
 * Workspace Header Controls Component Tests
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of, EMPTY } from 'rxjs';
import { WorkspaceHeaderControlsComponent } from './workspace-header-controls.component';
import { WorkspaceContextStore } from '@application/stores/workspace-context.store';
import { WorkspaceCreateDialogResult } from './workspace-create-dialog.component';

describe('WorkspaceHeaderControlsComponent', () => {
  let component: WorkspaceHeaderControlsComponent;
  let fixture: ComponentFixture<WorkspaceHeaderControlsComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<any>>;
  let mockWorkspaceStore: jasmine.SpyObj<WorkspaceContextStore>;

  beforeEach(async () => {
    // Create spies
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    
    mockWorkspaceStore = jasmine.createSpyObj('WorkspaceContextStore', 
      ['switchWorkspace', 'createWorkspace', 'setError'],
      {
        hasWorkspace: () => true,
        currentWorkspaceName: () => 'Test Workspace',
        currentWorkspace: () => ({ id: 'ws-1', name: 'Test Workspace' }),
        availableWorkspaces: () => [
          { id: 'ws-1', name: 'Test Workspace' },
          { id: 'ws-2', name: 'Another Workspace' }
        ],
        isAuthenticated: () => true,
        currentIdentityType: () => 'user',
        currentOrganizationName: () => 'Test Org'
      }
    );
    
    // Default successful navigation
    mockRouter.navigate.and.returnValue(Promise.resolve(true));
    mockDialogRef.afterClosed.and.returnValue(EMPTY);
    mockDialog.open.and.returnValue(mockDialogRef);
    
    await TestBed.configureTestingModule({
      imports: [WorkspaceHeaderControlsComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: MatDialog, useValue: mockDialog },
        { provide: WorkspaceContextStore, useValue: mockWorkspaceStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkspaceHeaderControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject WorkspaceContextStore', () => {
    expect(component.workspaceContext).toBeTruthy();
  });

  describe('toggleWorkspaceMenu', () => {
    it('should toggle workspace menu', () => {
      expect(component.showWorkspaceMenu()).toBe(false);
      component.toggleWorkspaceMenu();
      expect(component.showWorkspaceMenu()).toBe(true);
      component.toggleWorkspaceMenu();
      expect(component.showWorkspaceMenu()).toBe(false);
    });

    it('should close identity menu when opening workspace menu', () => {
      component.showIdentityMenu.set(true);
      component.toggleWorkspaceMenu();
      expect(component.showIdentityMenu()).toBe(false);
    });
  });

  describe('toggleIdentityMenu', () => {
    it('should toggle identity menu', () => {
      expect(component.showIdentityMenu()).toBe(false);
      component.toggleIdentityMenu();
      expect(component.showIdentityMenu()).toBe(true);
      component.toggleIdentityMenu();
      expect(component.showIdentityMenu()).toBe(false);
    });

    it('should close workspace menu when opening identity menu', () => {
      component.showWorkspaceMenu.set(true);
      component.toggleIdentityMenu();
      expect(component.showWorkspaceMenu()).toBe(false);
    });
  });

  describe('selectWorkspace', () => {
    it('should switch workspace and navigate', () => {
      mockRouter.navigate.and.returnValue(Promise.resolve(true));
      
      component.selectWorkspace('ws-2');
      
      expect(mockWorkspaceStore.switchWorkspace).toHaveBeenCalledWith('ws-2');
      expect(component.showWorkspaceMenu()).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/workspace']);
    });

    it('should set error if navigation fails', (done) => {
      mockRouter.navigate.and.returnValue(Promise.reject(new Error('Navigation failed')));
      
      component.selectWorkspace('ws-2');
      
      setTimeout(() => {
        expect(mockWorkspaceStore.setError).toHaveBeenCalledWith('Failed to navigate to workspace');
        done();
      }, 10);
    });
  });

  describe('createNewWorkspace (Pure Reactive)', () => {
    it('should open dialog with correct config', () => {
      component.createNewWorkspace();
      
      expect(mockDialog.open).toHaveBeenCalledWith(
        jasmine.any(Function),
        {
          width: '500px',
          disableClose: false,
          autoFocus: true,
        }
      );
    });

    it('should create workspace when dialog returns valid result', (done) => {
      const result: WorkspaceCreateDialogResult = { workspaceName: 'New Workspace' };
      mockDialogRef.afterClosed.and.returnValue(of(result));
      mockRouter.navigate.and.returnValue(Promise.resolve(true));
      
      component.createNewWorkspace();
      
      setTimeout(() => {
        expect(mockWorkspaceStore.createWorkspace).toHaveBeenCalledWith('New Workspace');
        expect(component.showWorkspaceMenu()).toBe(false);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/workspace']);
        done();
      }, 10);
    });

    it('should not create workspace when dialog is cancelled (null)', (done) => {
      mockDialogRef.afterClosed.and.returnValue(of(null));
      
      component.createNewWorkspace();
      
      setTimeout(() => {
        expect(mockWorkspaceStore.createWorkspace).not.toHaveBeenCalled();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
        done();
      }, 10);
    });

    it('should not create workspace when dialog is cancelled (undefined)', (done) => {
      mockDialogRef.afterClosed.and.returnValue(of(undefined));
      
      component.createNewWorkspace();
      
      setTimeout(() => {
        expect(mockWorkspaceStore.createWorkspace).not.toHaveBeenCalled();
        expect(mockRouter.navigate).not.toHaveBeenCalled();
        done();
      }, 10);
    });

    it('should not create workspace when workspaceName is empty', (done) => {
      const result: WorkspaceCreateDialogResult = { workspaceName: '' };
      mockDialogRef.afterClosed.and.returnValue(of(result));
      
      component.createNewWorkspace();
      
      setTimeout(() => {
        expect(mockWorkspaceStore.createWorkspace).not.toHaveBeenCalled();
        done();
      }, 10);
    });

    it('should set error if navigation fails after workspace creation', (done) => {
      const result: WorkspaceCreateDialogResult = { workspaceName: 'New Workspace' };
      mockDialogRef.afterClosed.and.returnValue(of(result));
      mockRouter.navigate.and.returnValue(Promise.reject(new Error('Navigation failed')));
      
      component.createNewWorkspace();
      
      setTimeout(() => {
        expect(mockWorkspaceStore.createWorkspace).toHaveBeenCalledWith('New Workspace');
        expect(mockWorkspaceStore.setError).toHaveBeenCalledWith('Failed to navigate to workspace');
        done();
      }, 10);
    });
  });

  describe('UI Rendering', () => {
    it('should display workspace switcher when hasWorkspace is true', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const workspaceSwitcher = compiled.querySelector('.workspace-switcher');
      expect(workspaceSwitcher).toBeTruthy();
    });

    it('should display current workspace name', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const workspaceName = compiled.querySelector('.workspace-name');
      expect(workspaceName?.textContent?.trim()).toContain('Test Workspace');
    });

    it('should display identity switcher', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const identitySwitcher = compiled.querySelector('.identity-switcher');
      expect(identitySwitcher).toBeTruthy();
    });

    it('should display organization name', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const orgName = compiled.querySelector('.org-name');
      expect(orgName?.textContent?.trim()).toContain('Test Org');
    });
  });
});
