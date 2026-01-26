/**
 * Event Infrastructure Injection Tokens
 * 
 * Layer: Application
 * Purpose: DI tokens for Event Bus and Event Store abstractions
 * 
 * These tokens enable dependency injection of Infrastructure implementations
 * without creating hard dependencies on concrete classes.
 * 
 * Usage:
 * - In use cases: inject(EVENT_BUS) or inject(EVENT_STORE)
 * - In app.config.ts: provide concrete implementations (InMemoryEventBus, InMemoryEventStore)
 * 
 * Benefits:
 * - Type-safe dependency injection
 * - Singleton instances managed by Angular DI
 * - Easy to swap implementations (e.g., InMemory ??Firestore)
 * - Clean Architecture: Application depends on abstractions, not implementations
 */

import { InjectionToken } from '@angular/core';
import { EventBus } from '@domain/shared/events/event-bus/event-bus.interface';
import { EventStore } from '@domain/shared/events/event-store/event-store.interface';

/**
 * Event Bus Injection Token
 * 
 * Use this token to inject the EventBus implementation
 * 
 * Example:
 * ```typescript
 * private readonly eventBus = inject(EVENT_BUS);
 * ```
 */
export const EVENT_BUS = new InjectionToken<EventBus>(
  'EVENT_BUS',
  {
    providedIn: 'root',
    factory: () => {
      throw new Error(
        'EVENT_BUS must be provided in app.config.ts with a concrete implementation (e.g., InMemoryEventBus)'
      );
    }
  }
);

/**
 * Event Store Injection Token
 * 
 * Use this token to inject the EventStore implementation
 * 
 * Example:
 * ```typescript
 * private readonly eventStore = inject(EVENT_STORE);
 * ```
 */
export const EVENT_STORE = new InjectionToken<EventStore>(
  'EVENT_STORE',
  {
    providedIn: 'root',
    factory: () => {
      throw new Error(
        'EVENT_STORE must be provided in app.config.ts with a concrete implementation (e.g., InMemoryEventStore)'
      );
    }
  }
);

