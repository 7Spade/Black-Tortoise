import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { WorkspaceSwitcherComponent } from './workspace-switcher.component';

describe('WorkspaceSwitcherComponent', () => {
  let component: WorkspaceSwitcherComponent;
  let fixture: ComponentFixture<WorkspaceSwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceHeaderControlsComponent],
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

  it('should close identity menu when workspace menu is opened', () => {
    component.toggleIdentityMenu();
    expect(component.showIdentityMenu()).toBe(true);
    component.toggleWorkspaceMenu();
    expect(component.showWorkspaceMenu()).toBe(true);
    expect(component.showIdentityMenu()).toBe(false);
  });

  it('should close workspace menu when identity menu is opened', () => {
    component.toggleWorkspaceMenu();
    expect(component.showWorkspaceMenu()).toBe(true);
    component.toggleIdentityMenu();
    expect(component.showIdentityMenu()).toBe(true);
    expect(component.showWorkspaceMenu()).toBe(false);
  });
});
