import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { WorkspaceSwitcherComponent } from './workspace-switcher.component';

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

  it('should inject WorkspacePresentationFacade', () => {
    expect(component.facade).toBeDefined();
  });

  it('should call facade.toggleWorkspaceMenu when toggleWorkspaceMenu is called', () => {
    spyOn(component.facade, 'toggleWorkspaceMenu');
    component.toggleWorkspaceMenu();
    expect(component.facade.toggleWorkspaceMenu).toHaveBeenCalled();
  });

  it('should call facade.selectWorkspace when selectWorkspace is called', () => {
    spyOn(component.facade, 'selectWorkspace');
    component.selectWorkspace('test-id');
    expect(component.facade.selectWorkspace).toHaveBeenCalledWith('test-id');
  });

  it('should call createNewWorkspace and handle dialog result', () => {
    spyOn(component.facade, 'createWorkspace');
    spyOn(component.facade, 'handleError');
    // Mock the trigger
    const mockTrigger = {
      openDialog: jasmine.createSpy().and.returnValue({
        pipe: jasmine.createSpy().and.returnValue({
          subscribe: jasmine.createSpy()
        })
      })
    };
    (component as any).createTrigger = jasmine.createSpy().and.returnValue(mockTrigger);
    component.createNewWorkspace();
    expect(mockTrigger.openDialog).toHaveBeenCalled();
  });
});
