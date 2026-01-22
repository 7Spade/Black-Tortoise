/**
 * Global Header Component Tests
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { GlobalHeaderComponent } from './global-header.component';
import { WorkspaceContextStore } from '@application/stores/workspace-context.store';
import { SearchService } from '../../shared/services/search.service';
import { NotificationService } from '../../shared/services/notification.service';

describe('GlobalHeaderComponent', () => {
  let component: GlobalHeaderComponent;
  let fixture: ComponentFixture<GlobalHeaderComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSearchService: jasmine.SpyObj<SearchService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    // Create spies
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockSearchService = jasmine.createSpyObj('SearchService', ['search']);
    mockNotificationService = jasmine.createSpyObj('NotificationService', ['getNotifications']);
    
    // Default successful navigation
    mockRouter.navigate.and.returnValue(Promise.resolve(true));
    mockNotificationService.getNotifications.and.returnValue([]);
    
    await TestBed.configureTestingModule({
      imports: [GlobalHeaderComponent],
      providers: [
        WorkspaceContextStore,
        { provide: Router, useValue: mockRouter },
        { provide: SearchService, useValue: mockSearchService },
        { provide: NotificationService, useValue: mockNotificationService }
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
    expect(component.showNotifications()).toBe(false);
    component.toggleNotifications();
    expect(component.showNotifications()).toBe(true);
  });

  it('should call search service on input', () => {
    const event = { target: { value: 'query' } } as unknown as Event;
    component.onSearchInput(event);
    expect(mockSearchService.search).toHaveBeenCalledWith('query');
  });

  it('should refresh notification count on toggle', () => {
    mockNotificationService.getNotifications.and.returnValue([
      { id: '1', message: 'Test' }
    ]);
    component.toggleNotifications();
    expect(component.notificationCount()).toBe(1);
  });

  it('should navigate to settings on openSettings', () => {
    mockRouter.navigate.and.returnValue(Promise.resolve(true));
    component.openSettings();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/settings']);
  });
});
