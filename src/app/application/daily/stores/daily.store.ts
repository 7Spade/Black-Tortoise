/**
 * Daily Store
 *
 * Layer: Application - Store
 * Purpose: Manages daily work log state using NgRx Signals
 * Architecture: Zone-less, Pure Reactive, Angular 20+
 *
 * Responsibilities:
 * - Daily timesheet/worklog management
 * - Time tracking and statistics
 * - Task activity correlation
 *
 * Event Flow:
 * - Publishes: DailyEntryCreated
 */

import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap } from 'rxjs';

import { EventBus } from '@domain/event-bus/event-bus.interface';
import { EventStore } from '@domain/event-store/event-store.interface';
import { createDailyEntryCreatedEvent } from '@domain/events/domain-events';

export interface DailyEntry {
  readonly entryId: string;
  readonly userId: string;
  readonly date: string;
  readonly taskIds: string[];
  readonly hoursLogged: number;
  readonly description: string;
  readonly createdAt: Date;
}

export interface DailyState {
  readonly entries: ReadonlyArray<DailyEntry>;
  readonly selectedDate: string;
  readonly activeTasks: string[];
  readonly isLoading: boolean;
  readonly error: string | null;
}

const initialState: DailyState = {
  entries: [],
  selectedDate: new Date().toISOString().split('T')[0],
  activeTasks: [],
  isLoading: false,
  error: null,
};

export const DailyStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((state) => ({
    todayEntries: computed(() => {
      const today = new Date().toISOString().split('T')[0];
      return state.entries().filter(entry => entry.date === today);
    }),
    
    selectedDateEntries: computed(() =>
      state.entries().filter(entry => entry.date === state.selectedDate())
    ),
    
    totalHoursToday: computed(() =>
      state.entries()
        .filter(entry => entry.date === new Date().toISOString().split('T')[0])
        .reduce((sum, entry) => sum + entry.hoursLogged, 0)
    ),
    
    totalHoursThisWeek: computed(() => {
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekStartStr = weekStart.toISOString().split('T')[0];
      
      return state.entries()
        .filter(entry => entry.date >= weekStartStr)
        .reduce((sum, entry) => sum + entry.hoursLogged, 0);
    }),
    
    entriesByDate: computed(() => {
      const grouped = new Map<string, DailyEntry[]>();
      state.entries().forEach(entry => {
        const entries = grouped.get(entry.date) || [];
        entries.push(entry);
        grouped.set(entry.date, entries);
      });
      return grouped;
    }),
  })),

  withMethods((store) => ({
    /**
     * Create daily entry
     */
    createEntry: rxMethod<{
      userId: string;
      date: string;
      taskIds: string[];
      hoursLogged: number;
      description: string;
      workspaceId: string;
      eventBus: EventBus;
      eventStore: EventStore;
    }>(
      pipe(
        tap(({ userId, date, taskIds, hoursLogged, description, workspaceId, eventBus, eventStore }) => {
          const entryId = crypto.randomUUID();
          
          const newEntry: DailyEntry = {
            entryId,
            userId,
            date,
            taskIds,
            hoursLogged,
            description,
            createdAt: new Date(),
          };
          
          // Create and publish event
          const event = createDailyEntryCreatedEvent(
            entryId,
            workspaceId,
            userId,
            date,
            taskIds,
            hoursLogged,
            description
          );
          
          // Append then publish
          eventStore.append(event).then(() => {
            eventBus.publish(event);
          });
          
          // Update state
          patchState(store, {
            entries: [...store.entries(), newEntry],
            error: null,
          });
        })
      )
    ),

    /**
     * Set selected date
     */
    setSelectedDate(date: string): void {
      patchState(store, { selectedDate: date });
    },

    /**
     * Set active tasks for quick fill
     */
    setActiveTasks(taskIds: string[]): void {
      patchState(store, { activeTasks: taskIds });
    },

    /**
     * Load entries for date range
     */
    loadEntries(entries: DailyEntry[]): void {
      patchState(store, { entries, error: null });
    },

    /**
     * Reset store (on workspace switch)
     */
    reset(): void {
      patchState(store, initialState);
    },
  }))
);
