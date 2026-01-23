import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NotificationFacade } from '@application/facades/notification.facade';
import { PresentationStore, NotificationItem } from '@application/stores/presentation.store';

/**
 * NotificationComponent
 * 
 * Layer: Presentation - Shared Component
 * Purpose: Pure UI component for notification list - no state ownership, no business logic
 * Architecture: Zone-less, Pure Reactive, Signals as single source of truth
 * 
 * DDD Compliance:
 * - Presentation consumes state from Application layer (PresentationStore)
 * - Forwards all user events to Application facade (NotificationFacade)
 * - No local state ownership (removed notifications signal)
 * - No business logic (no filtering, no mutation)
 * 
 * Control Flow:
 * 1. User clicks dismiss → facade.dismissNotification()
 * 2. User clicks notification → facade.handleNotificationClick()
 * 3. Facade updates PresentationStore
 * 4. Component reads notifications() signal from store
 * 5. Template binds to store signals (single source of truth)
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
  // Application layer dependencies
  private readonly facade = inject(NotificationFacade);
  protected readonly store = inject(PresentationStore);

  /**
   * Handle notification dismissal - forward to facade
   */
  dismiss(id: string): void {
    this.facade.dismissNotification(id);
  }

  /**
   * Handle notification click - forward to facade
   */
  onClick(notification: NotificationItem): void {
    this.facade.handleNotificationClick(notification);
  }

  /**
   * Mark notification as read - forward to facade
   */
  markAsRead(id: string): void {
    this.facade.markAsRead(id);
  }
}
