import { inject } from '@angular/core';
import { NotificationFacade } from '@application/facades/notification.facade';
import { TaskCreatedEvent } from '@events';
import { EventBus } from '@domain/types';

/**
 * Register global notification event handlers
 * 
 * Maps Domain Events -> Notification Facade
 */
export function registerNotificationEventHandlers(eventBus: EventBus): void {
  const notificationFacade = inject(NotificationFacade);

  // Task Created
  eventBus.subscribe<TaskCreatedEvent['payload']>(
    'TaskCreated',
    (event) => {
      notificationFacade.addNotification({
        type: 'success',
        title: 'Task Created',
        message: `Task "${event.payload.title}" was created.`
      });
    }
  );

  // Task Completed (assuming this event exists based on previous context, even if unused)
  // If exact type isn't exported, we can use generic subscription or check domain events file
  eventBus.subscribe<any>(
    'TaskCompleted',
    (event) => {
      notificationFacade.addNotification({
        type: 'success',
        title: 'Task Completed',
        message: `Task "${event.payload.title}" has been completed!`
      });
    }
  );
}
