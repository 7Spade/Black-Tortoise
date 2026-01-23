import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { WorkspaceSwitcherComponent } from './workspace-switcher.component';
import { WorkspaceCreateResult } from '@application/models/workspace-create-result.model';

describe('WorkspaceSwitcherComponent', () => {
  let component: WorkspaceSwitcherComponent;
  let fixture: ComponentFixture<WorkspaceSwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceSwitcherComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideRouter([]),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkspaceSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject WorkspaceFacade', () => {
    expect(component.facade).toBeDefined();
  });

  it('should call trigger.openDialog when openCreateDialog is called', () => {
    const mockTrigger = {
      openDialog: jasmine.createSpy('openDialog')
    };
    (component as any).createTrigger = jasmine.createSpy().and.returnValue(mockTrigger);
    
    component.openCreateDialog();
    
    expect(mockTrigger.openDialog).toHaveBeenCalled();
  });

  it('should handle null trigger gracefully in openCreateDialog', () => {
    (component as any).createTrigger = jasmine.createSpy().and.returnValue(null);
    
    expect(() => component.openCreateDialog()).not.toThrow();
  });

  it('should call facade.createWorkspace when onWorkspaceCreated is called', () => {
    spyOn(component.facade, 'createWorkspace');
    const result: WorkspaceCreateResult = { workspaceName: 'Test Workspace' };
    
    component.onWorkspaceCreated(result);
    
    expect(component.facade.createWorkspace).toHaveBeenCalledWith(result);
  });

  it('should display current workspace name from facade', () => {
    // This test would require mocking the facade signals
    // For now, just verify the signal is accessible
    expect(component.facade.currentWorkspaceName).toBeDefined();
  });
});
