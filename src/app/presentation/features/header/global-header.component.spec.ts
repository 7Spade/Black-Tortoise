/**
 * Global Header Component Tests
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { GlobalHeaderComponent } from './global-header.component';
import { WorkspaceContextStore } from '@application/stores/workspace-context.store';

describe('GlobalHeaderComponent', () => {
  let component: GlobalHeaderComponent;
  let fixture: ComponentFixture<GlobalHeaderComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    
    await TestBed.configureTestingModule({
      imports: [GlobalHeaderComponent],
      providers: [
        WorkspaceContextStore,
        { provide: Router, useValue: mockRouter }
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
});
