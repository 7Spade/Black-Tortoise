/**
 * Audit Store
 *
 * Layer: Application - Store
 * Purpose: Manages audit log state using NgRx Signals
 * Architecture: Zone-less, Pure Reactive, Angular 20+, NO RxJS
 *
 * Responsibilities:
 * - Track all workspace activities
 * - Maintain audit trail
 * - Filter and search audit logs
 *
 * Event Integration:
 * - Reacts to: ALL domain events (via event bus)
 * - Publishes: None (read-only module)
 *
 * Clean Architecture Compliance:
 * - Single source of truth for audit logs
 * - All state updates via patchState
 * - No RxJS subscriptions
 * - Pure signal-based reactivity
 */

import { computed, inject } from '@angular/core';
import { EVENT_BUS } from '@application/interfaces';
import { DomainEvent } from '@events';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';

export interface AuditEntry {
  readonly id: string;
  readonly timestamp: Date;
  readonly eventType: string;
  readonly actorId: string;
  readonly actorName: string;
  readonly resource: string;
  readonly action: string;
  readonly details: Record<string, unknown>;
  readonly correlationId: string;
}

export interface AuditState {
  readonly entries: ReadonlyArray<AuditEntry>;
  readonly filter: {
    readonly eventType: string | null;
    readonly actorId: string | null;
    readonly resource: string | null;
    readonly startDate: Date | null;
    readonly endDate: Date | null;
  };
  readonly isLoading: boolean;
  readonly error: string | null;
}

const initialState: AuditState = {
  entries: [],
  filter: {
    eventType: null,
    actorId: null,
    resource: null,
    startDate: null,
    endDate: null,
  },
  isLoading: false,
  error: null,
};

/**
 * Audit Store
 *
 * Application-level store for audit log management using NgRx Signals.
 */
export const AuditStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((state) => ({
    /**
     * Filtered entries
     */
    filteredEntries: computed(() => {
      let entries = state.entries();
      const filter = state.filter();

      if (filter.eventType) {
        entries = entries.filter((e) => e.eventType === filter.eventType);
      }

      if (filter.actorId) {
        entries = entries.filter((e) => e.actorId === filter.actorId);
      }

      if (filter.resource) {
        entries = entries.filter((e) => e.resource === filter.resource);
      }

      if (filter.startDate) {
        entries = entries.filter((e) => e.timestamp >= filter.startDate!);
      }

      if (filter.endDate) {
        entries = entries.filter((e) => e.timestamp <= filter.endDate!);
      }

      return entries;
    }),

    /**
     * Entries by event type
     */
    getEntriesByEventType: computed(
      () => (eventType: string) =>
        state.entries().filter((e) => e.eventType === eventType),
    ),

    /**
     * Entries by actor
     */
    getEntriesByActor: computed(
      () => (actorId: string) =>
        state.entries().filter((e) => e.actorId === actorId),
    ),

    /**
     * Recent entries (last 100)
     */
    recentEntries: computed(() => state.entries().slice(-100)),

    /**
     * Total entry count
     */
    totalEntries: computed(() => state.entries().length),

    /**
     * Has entries
     */
    hasEntries: computed(() => state.entries().length > 0),
  })),

  withMethods((store) => {
    const eventBus = inject(EVENT_BUS);

    return {
      /**
       * Process incoming domain event
       */
      processEvent(event: DomainEvent<any>): void {
        const payload = event.payload || {};
        const actorId =
          payload.createdById ||
          payload.updatedById ||
          payload.deletedById ||
          payload.actorId ||
          'system';

        const resourceId =
          payload.taskId ||
          payload.documentId ||
          payload.issueId ||
          payload.workspaceId ||
          'unknown';

        const newEntry: AuditEntry = {
          id: crypto.randomUUID(),
          timestamp: new Date(event.timestamp),
          eventType: event.type,
          actorId,
          actorName: actorId === 'system' ? 'System' : `User ${actorId}`, // In real app, resolve name
          resource: resourceId,
          action: event.type, // Simplified mapping
          details: payload,
          correlationId: event.correlationId || event.eventId,
        };

        patchState(store, {
          entries: [newEntry, ...store.entries()],
        });
      },

      /**
       * Add audit entry
       */
      addEntry(entry: Omit<AuditEntry, 'id'>): void {
        const newEntry: AuditEntry = {
          ...entry,
          id: crypto.randomUUID(),
        };

        patchState(store, {
          entries: [...store.entries(), newEntry],
        });
      },

      /**
       * Add multiple entries
       */
      addEntries(entries: Array<Omit<AuditEntry, 'id'>>): void {
        const newEntries: AuditEntry[] = entries.map((e) => ({
          ...e,
          id: crypto.randomUUID(),
        }));

        patchState(store, {
          entries: [...store.entries(), ...newEntries],
        });
      },

      /**
       * Set filter
       */
      setFilter(filter: Partial<AuditState['filter']>): void {
        patchState(store, {
          filter: { ...store.filter(), ...filter },
        });
      },

      /**
       * Clear filter
       */
      clearFilter(): void {
        patchState(store, {
          filter: {
            eventType: null,
            actorId: null,
            resource: null,
            startDate: null,
            endDate: null,
          },
        });
      },

      /**
       * Reset (Clear on Workspace Switch)
       */
      reset(): void {
        patchState(store, initialState);
      },

      /**
       * Clear all entries (workspace switch)
       * @deprecated Use reset() instead
       */
      clearEntries(): void {
        this.reset();
      },

      /**
       * Set loading
       */
      setLoading(isLoading: boolean): void {
        patchState(store, { isLoading });
      },

      /**
       * Set error
       */
      setError(error: string | null): void {
        patchState(store, { error, isLoading: false });
      },
    };
  }),

  withHooks({
    onInit(store) {
      const eventBus = inject(EVENT_BUS);
      // Subscribe to all events and convert to audit entries
      eventBus.subscribeAll((event) => {
        store.processEvent(event);
      });
    },
  }),
);
