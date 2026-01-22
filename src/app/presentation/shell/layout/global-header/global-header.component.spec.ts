/**
 * Global Header Component Tests
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GlobalHeaderComponent } from './global-header.component';

describe('GlobalHeaderComponent', () => {
  let component: GlobalHeaderComponent;
  let fixture: ComponentFixture<GlobalHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalHeaderComponent]
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

  it('should handle search query', () => {
    component.onSearchQuery('test');
    expect(component.searchQuery()).toBe('test');
  });

  it('should toggle theme', () => {
    const initialTheme = component.themeMode();
    component.toggleTheme();
    expect(component.themeMode()).not.toBe(initialTheme);
  });
});
