/**
 * Event Store
 *
 * Layer: Application - Store
 * Purpose: Manages event state using NgRx Signals
 * Architecture: Zone-less, Pure Reactive, Angular 20+
 *
 * Responsibilities:
 * - Event publishing and subscription coordination
 * - Event history tracking (in-memory cache)
 * - Event metadata management
 * - Integration between EventBus and EventStore
 *
 * Event Lifecycle Management:
 * 1. Publish event via EventBus (real-time)
 * 2. Persist event via EventStore (history)
 * 3. Update local state cache (performance)
 * 4. Trigger reactive updates to subscribers
 *
 * Clean Architecture Compliance:
 * - Depends on Domain interfaces (EventBus, EventStore)
 * - Implements Application layer orchestration
 * - No direct Infrastructure dependencies (injected)
 */

import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, catchError, of } from 'rxjs';

import { DomainEvent } from '@domain/event/domain-event';
import { EventBus } from '@domain/event-bus/event-bus.interface';
import { EventStore } from '@domain/event-store/event-store.interface';

export interface EventState {
  readonly recentEvents: ReadonlyArray<DomainEvent>;
  readonly eventCount: number;
  readonly isPublishing: boolean;
  readonly error: string | null;
  readonly lastEventTimestamp: Date | null;
}

const initialState: EventState = {
  recentEvents: [],
  eventCount: 0,
  isPublishing: false,
  error: null,
  lastEventTimestamp: null,
};

/**
 * Event Store
 *
 * Application-level store for event management using NgRx Signals.
 * Coordinates between EventBus (real-time) and EventStore (persistence).
 */
export const EventStoreSignal = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((state) => ({
    /**
     * Has any events
     */
    hasEvents: computed(() => state.recentEvents().length > 0),

    /**
     * Events by type
     */
    getEventsByType: computed(() => (eventType: string) =>
      state.recentEvents().filter(e => e.eventType === eventType)
    ),

    /**
     * Events for workspace
     */
    getEventsForWorkspace: computed(() => (workspaceId: string) =>
      state.recentEvents().filter(e => e.workspaceId === workspaceId)
    ),

    /**
     * Latest event
     */
    latestEvent: computed(() => {
      const events = state.recentEvents();
      return events.length > 0 ? events[events.length - 1] : null;
    }),
  })),

  withMethods((store) => ({
    /**
     * Publish event to bus and store
     * 
     * Event Flow:
     * 1. Publish to EventBus (real-time notification)
     * 2. Append to EventStore (persistence)
     * 3. Update local cache
     */
    publishEvent: rxMethod<{ event: DomainEvent; eventBus: EventBus; eventStore: EventStore }>(
      pipe(
        tap(() => patchState(store, { isPublishing: true, error: null })),
        switchMap(({ event, eventBus, eventStore }) =>
          Promise.all([
            eventBus.publish(event),
            eventStore.append(event)
          ]).then(() => {
            // Update local cache
            patchState(store, {
              recentEvents: [...store.recentEvents(), event],
              eventCount: store.eventCount() + 1,
              lastEventTimestamp: event.timestamp,
              isPublishing: false,
            });
          })
        ),
        catchError((error) => {
          patchState(store, {
            error: error.message || 'Failed to publish event',
            isPublishing: false,
          });
          return of(null);
        })
      )
    ),

    /**
     * Load events from store
     */
    loadEvents: rxMethod<{ eventStore: EventStore; workspaceId?: string }>(
      pipe(
        switchMap(({ eventStore, workspaceId }) =>
          workspaceId
            ? eventStore.getEventsForWorkspace(workspaceId)
            : Promise.resolve([])
        ),
        tap((events) => {
          patchState(store, {
            recentEvents: events,
            eventCount: events.length,
            lastEventTimestamp: events.length > 0 
              ? events[events.length - 1].timestamp 
              : null,
          });
        }),
        catchError((error) => {
          patchState(store, {
            error: error.message || 'Failed to load events',
          });
          return of([]);
        })
      )
    ),

    /**
     * Clear recent events cache
     */
    clearCache(): void {
      patchState(store, {
        recentEvents: [],
        eventCount: 0,
        lastEventTimestamp: null,
        error: null,
      });
    },

    /**
     * Clear error
     */
    clearError(): void {
      patchState(store, { error: null });
    },
  }))
);
