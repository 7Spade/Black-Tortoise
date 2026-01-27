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

import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { WorkspaceEventBus } from '@domain/types';

export interface DailyEntry {
  readonly id: string;
  readonly date: string; // ISO date string (YYYY-MM-DD)
  readonly userId: string;
  readonly taskIds: string[];
  readonly headcount: number;
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
     * Total headcount for selected date
     */
    selectedDateHeadcount: computed(() => {
      const date = state.selectedDate();
      return state.entries()
        .filter(e => e.date === date)
        .reduce((sum, e) => sum + e.headcount, 0);
    }),

    /**
     * Entries by date
     */
    getEntriesByDate: computed(() => (date: string) =>
      state.entries().filter(e => e.date === date)
    ),

    /**
     * Total headcount by user
     */
    getTotalHeadcountByUser: computed(() => (userId: string) =>
      state.entries()
        .filter(e => e.userId === userId)
        .reduce((sum, e) => sum + e.headcount, 0)
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
     * Set error
     */
    setError(error: string | null): void {
      patchState(store, { error, isLogging: false });
    },
  })),

  withHooks({
    onInit(store) {
      const eventBus = inject(WorkspaceEventBus);

      // Subscribe to WorkspaceSwitched - clear all state
      eventBus.on('WorkspaceSwitched', () => {
        patchState(store, initialState);
      });

      // Subscribe to TaskProgressUpdated - auto-create entry based on progress delta
      eventBus.on('TaskProgressUpdated', (event) => {
        const { taskId, progress, userId } = event.payload;
        const today = new Date().toISOString().split('T')[0] ?? '';
        
        // Auto-calculate headcount based on progress increment (simple heuristic)
        const progressIncrement = progress > 0 ? Math.min(progress / 100, 0.25) : 0;
        
        if (progressIncrement > 0) {
          const newEntry: DailyEntry = {
            id: crypto.randomUUID(),
            date: today,
            userId: userId ?? 'unknown',
            taskIds: [taskId],
            headcount: progressIncrement,
            notes: `Auto-logged from task progress update (${progress}%)`,
            createdAt: new Date(),
          };

          patchState(store, {
            entries: [...store.entries(), newEntry],
          });
        }
      });

      // Subscribe to DailyEntryCreated - add entry to state
      eventBus.on('DailyEntryCreated', (event) => {
        const { entryId, date, userId, taskIds, headcount, notes } = event.payload;
        
        const newEntry: DailyEntry = {
          id: entryId,
          date,
          userId,
          taskIds: [...taskIds],
          headcount,
          notes,
          createdAt: new Date(event.timestamp),
        };

        // Check if entry already exists (idempotency)
        const exists = store.entries().some(e => e.id === entryId);
        if (!exists) {
          patchState(store, {
            entries: [...store.entries(), newEntry],
          });
        }
      });
    }
  })
);
