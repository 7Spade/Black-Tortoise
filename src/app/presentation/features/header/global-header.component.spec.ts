/**
 * Global Header Component Tests
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GlobalHeaderComponent } from './global-header.component';
import { WorkspaceContextStore } from '@application/stores/workspace-context.store';
import { provideRouter } from '@angular/router';

describe('GlobalHeaderComponent', () => {
  let component: GlobalHeaderComponent;
  let fixture: ComponentFixture<GlobalHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalHeaderComponent],
      providers: [
        provideRouter([]),
        WorkspaceContextStore
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle notifications', () => {
    expect(component.showNotifications()).toBe(false);
    component.toggleNotifications();
    expect(component.showNotifications()).toBe(true);
    component.toggleNotifications();
    expect(component.showNotifications()).toBe(false);
  });

  it('should handle search query', () => {
    component.onSearchQuery('test query');
    expect(component.searchQuery()).toBe('test query');
  });

  it('should decrement notification count on dismissal', () => {
    component.notificationCount.set(3);
    component.onNotificationDismissed('test-id');
    expect(component.notificationCount()).toBe(2);
  });

  it('should not go below 0 notifications', () => {
    component.notificationCount.set(0);
    component.onNotificationDismissed('test-id');
    expect(component.notificationCount()).toBe(0);
  });

  it('should render workspace controls when input is true', () => {
    fixture.componentRef.setInput('showWorkspaceControls', true);
    fixture.detectChanges();
    expect(component.showWorkspaceControls()).toBe(true);
  });

  it('should not render workspace controls when input is false', () => {
    fixture.componentRef.setInput('showWorkspaceControls', false);
    fixture.detectChanges();
    expect(component.showWorkspaceControls()).toBe(false);
  });
});
