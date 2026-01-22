import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkspaceHeaderControlsComponent } from './workspace-header-controls.component';
import { WorkspaceContextStore } from '@application/stores/workspace-context.store';
import { HeaderFacade } from '../../header/facade/header.facade';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

describe('WorkspaceHeaderControlsComponent', () => {
  let component: WorkspaceHeaderControlsComponent;
  let fixture: ComponentFixture<WorkspaceHeaderControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceHeaderControlsComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideRouter([]),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkspaceHeaderControlsComponent);
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
