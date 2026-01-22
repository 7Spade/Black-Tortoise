import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationComponent } from './notification.component';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event when notification is dismissed', () => {
    let dismissedId = '';
    component.notificationDismissed.subscribe((id: string) => {
      dismissedId = id;
    });

    component.notifications.set([{ id: '1', message: 'Test', ts: Date.now() }]);
    component.dismiss('1');

    expect(dismissedId).toBe('1');
    expect(component.notifications().length).toBe(0);
  });
});
