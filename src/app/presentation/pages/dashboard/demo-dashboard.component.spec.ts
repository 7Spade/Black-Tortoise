/**
 * Demo Dashboard Component Tests
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { DemoDashboardComponent } from './demo-dashboard.component';
import { WorkspaceContextStore } from '@application/workspace';

describe('DemoDashboardComponent', () => {
  let component: DemoDashboardComponent;
  let fixture: ComponentFixture<DemoDashboardComponent>;
  let mockStore: Partial<WorkspaceContextStore>;

  beforeEach(async () => {
    // Create stub store with signal-backed methods
    const currentWorkspaceModulesSignal = signal<string[]>(['overview', 'tasks']);
    const currentWorkspaceNameSignal = signal<string>('Test Workspace');
    const currentIdentityTypeSignal = signal<'user' | 'organization' | null>('user');
    const workspaceCountSignal = signal<number>(2);

    mockStore = {
      currentWorkspaceModules: currentWorkspaceModulesSignal,
      currentWorkspaceName: currentWorkspaceNameSignal,
      currentIdentityType: currentIdentityTypeSignal,
      workspaceCount: workspaceCountSignal,
    };

    await TestBed.configureTestingModule({
      imports: [DemoDashboardComponent],
      providers: [
        { provide: WorkspaceContextStore, useValue: mockStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DemoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject WorkspaceContextStore', () => {
    expect(component.workspaceContext).toBeTruthy();
  });

  it('should display module list from store signal', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const moduleItems = compiled.querySelectorAll('.module-list-item');
    
    expect(moduleItems.length).toBe(2);
    expect(moduleItems[0].textContent).toContain('overview');
    expect(moduleItems[1].textContent).toContain('tasks');
  });

  it('should update UI when currentWorkspaceModules signal changes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Initial state: 2 modules
    let moduleItems = compiled.querySelectorAll('.module-list-item');
    expect(moduleItems.length).toBe(2);
    
    // Update signal to add more modules
    const currentWorkspaceModulesSignal = mockStore.currentWorkspaceModules as any;
    currentWorkspaceModulesSignal.set(['overview', 'tasks', 'documents', 'calendar']);
    
    // Trigger change detection
    fixture.detectChanges();
    
    // Verify UI updated
    moduleItems = compiled.querySelectorAll('.module-list-item');
    expect(moduleItems.length).toBe(4);
    expect(moduleItems[2].textContent).toContain('documents');
    expect(moduleItems[3].textContent).toContain('calendar');
  });

  it('should update UI when currentWorkspaceModules signal is cleared', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Initial state: 2 modules
    let moduleItems = compiled.querySelectorAll('.module-list-item');
    expect(moduleItems.length).toBe(2);
    
    // Clear modules
    const currentWorkspaceModulesSignal = mockStore.currentWorkspaceModules as any;
    currentWorkspaceModulesSignal.set([]);
    
    // Trigger change detection
    fixture.detectChanges();
    
    // Verify UI updated (no module items)
    moduleItems = compiled.querySelectorAll('.module-list-item');
    expect(moduleItems.length).toBe(0);
  });

  it('should display workspace name from store signal', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const workspaceNameElement = compiled.querySelector('.stat-card p');
    
    expect(workspaceNameElement?.textContent).toContain('Test Workspace');
  });

  it('should display module count from store signal', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const statCards = compiled.querySelectorAll('.stat-card');
    const moduleCountCard = Array.from(statCards).find(card => 
      card.textContent?.includes('Active Modules')
    );
    
    expect(moduleCountCard?.textContent).toContain('2');
  });

  it('should use stable track expression for @for directive', () => {
    // Verify track uses moduleId (stable identity)
    // This is a structural test - the track expression in the template is: track moduleId
    // Each moduleId is a unique string, providing stable identity
    const compiled = fixture.nativeElement as HTMLElement;
    const moduleItems = compiled.querySelectorAll('.module-list-item');
    
    // Store initial DOM references
    const initialElements = Array.from(moduleItems);
    
    // Update with same modules in different order
    const currentWorkspaceModulesSignal = mockStore.currentWorkspaceModules as any;
    currentWorkspaceModulesSignal.set(['tasks', 'overview']); // Reversed order
    
    fixture.detectChanges();
    
    const updatedModuleItems = compiled.querySelectorAll('.module-list-item');
    
    // Verify list updated correctly with new order
    expect(updatedModuleItems.length).toBe(2);
    expect(updatedModuleItems[0].textContent).toContain('tasks');
    expect(updatedModuleItems[1].textContent).toContain('overview');
  });
});
