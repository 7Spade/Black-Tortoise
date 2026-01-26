/**
 * Daily Store
 *
 * Layer: Application - Store
 * Purpose: Manages daily work log state using NgRx Signals
 * Architecture: Zone-less, Pure Reactive, Angular 20+, NO RxJS
 *
 * Responsibilities:
 * - Track daily work entries
 * - Manage time logging
 * - Calculate work statistics
 *
 * Event Integration:
 * - Reacts to: TaskCompleted
 * - Publishes: DailyEntryCreated
 *
 * Clean Architecture Compliance:
 * - Single source of truth for daily entries
 * - All state updates via patchState
 * - No RxJS subscriptions
 * - Pure signal-based reactivity
 */

import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

export interface DailyEntry {
  readonly id: string;
  readonly date: string; // ISO date string (YYYY-MM-DD)
  readonly userId: string;
  readonly taskIds: string[];
  readonly hoursLogged: number;
  readonly notes?: string;
  readonly createdAt: Date;
}

export interface DailyState {
  readonly entries: ReadonlyArray<DailyEntry>;
  readonly selectedDate: string | null;
  readonly isLogging: boolean;
  readonly error: string | null;
}

const initialState: DailyState = {
  entries: [],
  selectedDate: null,
  isLogging: false,
  error: null,
};

/**
 * Daily Store
 *
 * Application-level store for daily work log management using NgRx Signals.
 */
export const DailyStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((state) => ({
    /**
     * Entries for selected date
     */
    selectedDateEntries: computed(() => {
      const date = state.selectedDate();
      return date ? state.entries().filter(e => e.date === date) : [];
    }),

    /**
     * Total hours for selected date
     */
    selectedDateHours: computed(() => {
      const date = state.selectedDate();
      return state.entries()
        .filter(e => e.date === date)
        .reduce((sum, e) => sum + e.hoursLogged, 0);
    }),

    /**
     * Entries by date
     */
    getEntriesByDate: computed(() => (date: string) =>
      state.entries().filter(e => e.date === date)
    ),

    /**
     * Total hours by user
     */
    getTotalHoursByUser: computed(() => (userId: string) =>
      state.entries()
        .filter(e => e.userId === userId)
        .reduce((sum, e) => sum + e.hoursLogged, 0)
    ),

    /**
     * Has entries
     */
    hasEntries: computed(() => state.entries().length > 0),
  })),

  withMethods((store) => ({
    /**
     * Create daily entry
     */
    createEntry(entry: Omit<DailyEntry, 'id' | 'createdAt'>): void {
      const newEntry: DailyEntry = {
        ...entry,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };

      patchState(store, {
        entries: [...store.entries(), newEntry],
        isLogging: false,
      });
    },

    /**
     * Update entry
     */
    updateEntry(entryId: string, updates: Partial<Omit<DailyEntry, 'id' | 'createdAt'>>): void {
      patchState(store, {
        entries: store.entries().map(e =>
          e.id === entryId ? { ...e, ...updates } : e
        ),
      });
    },

    /**
     * Delete entry
     */
    deleteEntry(entryId: string): void {
      patchState(store, {
        entries: store.entries().filter(e => e.id !== entryId),
      });
    },

    /**
     * Select date
     */
    selectDate(date: string | null): void {
      patchState(store, { selectedDate: date });
    },

    /**
     * Clear all entries (workspace switch)
     */
    clearEntries(): void {
      patchState(store, {
        entries: [],
        selectedDate: null,
        isLogging: false,
        error: null,
      });
    },

    /**
     * Set error
     */
    setError(error: string | null): void {
      patchState(store, { error, isLogging: false });
    },
  }))
);
