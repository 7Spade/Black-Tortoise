/**
 * Global Header Component Tests
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GlobalHeaderComponent } from './global-header.component';
import { SearchService } from '../../../shared/services/search.service';
import { NotificationService } from '../../../shared/services/notification.service';

describe('GlobalHeaderComponent', () => {
  let component: GlobalHeaderComponent;
  let fixture: ComponentFixture<GlobalHeaderComponent>;
  let mockSearchService: jasmine.SpyObj<SearchService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    // Create spies
    mockSearchService = jasmine.createSpyObj('SearchService', ['search']);
    mockNotificationService = jasmine.createSpyObj('NotificationService', ['getNotifications']);
    
    mockNotificationService.getNotifications.and.returnValue([]);
    
    await TestBed.configureTestingModule({
      imports: [GlobalHeaderComponent],
      providers: [
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

  it('should toggle notifications', () => {
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

  it('should toggle theme', () => {
    const initialTheme = component.themeMode();
    component.toggleTheme();
    expect(component.themeMode()).not.toBe(initialTheme);
  });
});
