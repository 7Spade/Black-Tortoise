/**
 * Notification Facade
 * 
 * Layer: Application - Facade
 * Purpose: Single entry point for notification feature - receives notification intents,
 *          coordinates with PresentationStore for notification state management
 * Architecture: Zone-less, Pure Reactive, Signals as single source of truth
 * 
 * Responsibilities:
 * - Receives user notification intent events from UI (dismiss, click, mark read)
 * - Delegates notification state operations to PresentationStore
 * - Orchestrates notification flow (add, remove, mark read)
 * - No business logic - pure orchestration
 * 
 * Control Flow:
 * 1. Presentation forwards notification events → facade
 * 2. Facade updates PresentationStore state via methods
 * 3. Presentation consumes notification signals from PresentationStore
 */

import { inject, Injectable } from '@angular/core';
import { PresentationStore, NotificationItem } from '@application/stores/presentation.store';

@Injectable({ providedIn: 'root' })
export class NotificationFacade {
  private readonly presentationStore = inject(PresentationStore);

  /**
   * Dismiss (remove) a notification
   */
  dismissNotification(notificationId: string): void {
    this.presentationStore.removeNotification(notificationId);
  }

  /**
   * Handle notification click
   * Marks as read and optionally navigates to action URL
   */
  handleNotificationClick(notification: NotificationItem): void {
    this.presentationStore.markNotificationRead(notification.id);
    
    // Future: Handle navigation to actionUrl if provided
    // Can integrate with Router or emit domain events
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): void {
    this.presentationStore.markNotificationRead(notificationId);
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    this.presentationStore.markAllNotificationsRead();
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    this.presentationStore.clearAllNotifications();
  }

  /**
   * Add a new notification
   * Used by other application services to push notifications
   */
  addNotification(notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): void {
    this.presentationStore.addNotification(notification);
  }
}
