/**
 * Calendar Store
 *
 * Layer: Application - Store
 * Purpose: Manages calendar view state using NgRx Signals
 * Architecture: Zone-less, Pure Reactive, Angular 20+
 *
 * Responsibilities:
 * - Calendar view management
 * - Event/task scheduling
 * - Date-based task filtering
 *
 * Note: Calendar is primarily a view aggregator over Tasks
 */

import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

export interface CalendarEvent {
  readonly eventId: string;
  readonly title: string;
  readonly description: string;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly relatedTaskId?: string;
  readonly type: 'task' | 'meeting' | 'deadline' | 'milestone';
  readonly color?: string;
}

export interface CalendarState {
  readonly events: ReadonlyArray<CalendarEvent>;
  readonly viewMode: 'month' | 'week' | 'day' | 'agenda';
  readonly currentDate: Date;
  readonly selectedDate: Date | null;
  readonly selectedEvent: CalendarEvent | null;
  readonly isLoading: boolean;
  readonly error: string | null;
}

const initialState: CalendarState = {
  events: [],
  viewMode: 'month',
  currentDate: new Date(),
  selectedDate: null,
  selectedEvent: null,
  isLoading: false,
  error: null,
};

export const CalendarStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((state) => ({
    visibleEvents: computed(() => {
      const mode = state.viewMode();
      const current = state.currentDate();
      const events = state.events();
      
      const start = new Date(current);
      const end = new Date(current);
      
      switch (mode) {
        case 'day':
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
          break;
        case 'week':
          start.setDate(current.getDate() - current.getDay());
          start.setHours(0, 0, 0, 0);
          end.setDate(start.getDate() + 6);
          end.setHours(23, 59, 59, 999);
          break;
        case 'month':
          start.setDate(1);
          start.setHours(0, 0, 0, 0);
          end.setMonth(start.getMonth() + 1);
          end.setDate(0);
          end.setHours(23, 59, 59, 999);
          break;
        case 'agenda':
          start.setHours(0, 0, 0, 0);
          end.setDate(current.getDate() + 30);
          end.setHours(23, 59, 59, 999);
          break;
      }
      
      return events.filter(event => 
        event.startDate <= end && event.endDate >= start
      );
    }),
    
    eventsForDate: computed(() => (date: Date) => {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      
      return state.events().filter(event =>
        event.startDate <= end && event.endDate >= start
      );
    }),
    
    upcomingDeadlines: computed(() => {
      const now = new Date();
      const future = new Date(now);
      future.setDate(now.getDate() + 7);
      
      return state.events()
        .filter(event => 
          event.type === 'deadline' &&
          event.endDate >= now &&
          event.endDate <= future
        )
        .sort((a, b) => a.endDate.getTime() - b.endDate.getTime());
    }),
    
    todayEvents: computed(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      
      return state.events().filter(event =>
        event.startDate < tomorrow && event.endDate >= today
      );
    }),
    
    eventsByType: computed(() => (type: CalendarEvent['type']) =>
      state.events().filter(event => event.type === type)
    ),
  })),

  withMethods((store) => ({
    /**
     * Add event
     */
    addEvent(event: CalendarEvent): void {
      patchState(store, {
        events: [...store.events(), event],
        error: null,
      });
    },

    /**
     * Update event
     */
    updateEvent(eventId: string, updates: Partial<CalendarEvent>): void {
      const events = store.events();
      const event = events.find(e => e.eventId === eventId);
      
      if (!event) {
        patchState(store, { error: `Event ${eventId} not found` });
        return;
      }
      
      const updatedEvent: CalendarEvent = { ...event, ...updates };
      
      patchState(store, {
        events: events.map(e => e.eventId === eventId ? updatedEvent : e),
        error: null,
      });
    },

    /**
     * Remove event
     */
    removeEvent(eventId: string): void {
      patchState(store, {
        events: store.events().filter(e => e.eventId !== eventId),
        error: null,
      });
    },

    /**
     * Set view mode
     */
    setViewMode(mode: 'month' | 'week' | 'day' | 'agenda'): void {
      patchState(store, { viewMode: mode });
    },

    /**
     * Set current date
     */
    setCurrentDate(date: Date): void {
      patchState(store, { currentDate: date });
    },

    /**
     * Navigate to next period
     */
    navigateNext(): void {
      const current = store.currentDate();
      const mode = store.viewMode();
      const next = new Date(current);
      
      switch (mode) {
        case 'day':
          next.setDate(current.getDate() + 1);
          break;
        case 'week':
          next.setDate(current.getDate() + 7);
          break;
        case 'month':
          next.setMonth(current.getMonth() + 1);
          break;
        case 'agenda':
          next.setDate(current.getDate() + 30);
          break;
      }
      
      patchState(store, { currentDate: next });
    },

    /**
     * Navigate to previous period
     */
    navigatePrevious(): void {
      const current = store.currentDate();
      const mode = store.viewMode();
      const prev = new Date(current);
      
      switch (mode) {
        case 'day':
          prev.setDate(current.getDate() - 1);
          break;
        case 'week':
          prev.setDate(current.getDate() - 7);
          break;
        case 'month':
          prev.setMonth(current.getMonth() - 1);
          break;
        case 'agenda':
          prev.setDate(current.getDate() - 30);
          break;
      }
      
      patchState(store, { currentDate: prev });
    },

    /**
     * Go to today
     */
    goToToday(): void {
      patchState(store, { currentDate: new Date() });
    },

    /**
     * Select date
     */
    selectDate(date: Date): void {
      patchState(store, { selectedDate: date });
    },

    /**
     * Select event
     */
    selectEvent(eventId: string): void {
      const event = store.events().find(e => e.eventId === eventId);
      patchState(store, { selectedEvent: event || null });
    },

    /**
     * Clear selection
     */
    clearSelection(): void {
      patchState(store, { selectedDate: null, selectedEvent: null });
    },

    /**
     * Load events
     */
    loadEvents(events: CalendarEvent[]): void {
      patchState(store, { events, error: null });
    },

    /**
     * Reset store (on workspace switch)
     */
    reset(): void {
      patchState(store, initialState);
    },
  }))
);
