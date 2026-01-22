/**
 * Workspace Header Controls Component Tests
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, EMPTY } from 'rxjs';
import { WorkspaceHeaderControlsComponent } from './workspace-header-controls.component';
import { WorkspaceContextStore } from '@application/stores/workspace-context.store';
import { HeaderFacade } from '../facade/header.facade';
import { WorkspaceCreateTriggerComponent } from './workspace-create-trigger.component';
import { WorkspaceCreateResult } from '../models/workspace-create-result.model';

describe('WorkspaceHeaderControlsComponent', () => {
  let component: WorkspaceHeaderControlsComponent;
  let fixture: ComponentFixture<WorkspaceHeaderControlsComponent>;
  let mockFacade: jasmine.SpyObj<HeaderFacade>;
  let mockWorkspaceStore: jasmine.SpyObj<WorkspaceContextStore>;

  beforeEach(async () => {
    // Create spies
    mockFacade = jasmine.createSpyObj('HeaderFacade', ['switchWorkspace', 'createWorkspace']);
    
    mockWorkspaceStore = jasmine.createSpyObj('WorkspaceContextStore', 
      ['setError'],
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
    
    await TestBed.configureTestingModule({
      imports: [WorkspaceHeaderControlsComponent],
      providers: [
        { provide: HeaderFacade, useValue: mockFacade },
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
    it('should call facade to switch workspace', () => {
      component.selectWorkspace('ws-2');
      
      expect(component.showWorkspaceMenu()).toBe(false);
      expect(mockFacade.switchWorkspace).toHaveBeenCalledWith('ws-2');
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
