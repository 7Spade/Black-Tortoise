import { APP_INITIALIZER, EnvironmentProviders, inject, makeEnvironmentProviders } from '@angular/core';
import { registerAcceptanceEventHandlers } from '@acceptance/application/handlers/acceptance.event-handlers';
import { registerNotificationEventHandlers } from '@application/handlers/notification.event-handlers';
import { EVENT_BUS } from '@application/interfaces';
import { registerDailyEventHandlers } from '@daily/application/handlers/daily.event-handlers';
import { registerIssuesEventHandlers } from '@issues/application/handlers/issues.event-handlers';
import { registerQualityControlEventHandlers } from '@quality-control/application/handlers/quality-control.event-handlers';
import { registerTasksEventHandlers } from '@tasks/application/handlers/tasks.event-handlers';

/**
 * Register all Application Layer Event Handlers
 *
 * This function bootstraps the domain event subscribers for all modules.
 * It is called via APP_INITIALIZER to ensure listeners are active before the app starts.
 */
export function initializeEventHandlers(): () => void {
  // Execute registration immediately within the injection context of the factory
  const eventBus = inject(EVENT_BUS);

  console.log('[EventRegistry] Initializing domain event handlers...');

  // Register Module Handlers
  // These functions use inject() internally, so they must run here
  registerTasksEventHandlers(eventBus);
  registerQualityControlEventHandlers(eventBus);
  registerAcceptanceEventHandlers(eventBus);
  registerIssuesEventHandlers(eventBus);
  registerDailyEventHandlers(eventBus);
  
  // Register Core/Shared Handlers
  registerNotificationEventHandlers(eventBus);

  console.log('[EventRegistry] All handlers registered successfully.');

  // Return no-op function as APP_INITIALIZER requires a result
  return () => {};
}

/**
 * Provider for Event Handler Initialization
 */
export function provideEventHandlers(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: APP_INITIALIZER,
      useFactory: initializeEventHandlers,
      multi: true
    }
  ]);
}
