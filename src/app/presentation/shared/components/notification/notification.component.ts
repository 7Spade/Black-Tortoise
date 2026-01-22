import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, signal, output, input } from '@angular/core';

export interface NotificationItem {
  readonly id: string;
  readonly message: string;
  readonly type?: 'info' | 'warning' | 'error';
  readonly ts: number;
}

/**
 * NotificationComponent
 * - Presentation layer shared notification list component (for displaying toast / list)
 * - Component manages UI level notification display; notification source (add/remove) should be provided by application layer or service.
 * - Design points:
 *   1) Keep notifications in a simple pure data array (id, message, type, timestamp).
 *   2) Do not directly call backend in the component. Add/remove should be done through injected store/service. Only local demo API is provided here.
 */
@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  // Inputs
  readonly initialNotifications = input<ReadonlyArray<NotificationItem>>([]);
  
  // Outputs - component events
  readonly notificationDismissed = output<string>();
  readonly notificationClicked = output<NotificationItem>();
  
  // Local state
  notifications = signal<NotificationItem[]>([]);

  constructor() {
    // Initialize with default empty array
    this.notifications.set([]);
  }

  dismiss(id: string): void {
    this.notifications.update(arr => arr.filter(n => n.id !== id));
    this.notificationDismissed.emit(id);
  }

  onClick(notification: NotificationItem): void {
    this.notificationClicked.emit(notification);
  }

  getCount(): number {
    return this.notifications().length;
  }
}
