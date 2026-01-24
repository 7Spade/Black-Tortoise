/**
 * Audit Store
 *
 * Layer: Application - Store
 * Purpose: Manages audit trail state using NgRx Signals
 * Architecture: Zone-less, Pure Reactive, Angular 20+
 *
 * Responsibilities:
 * - Audit log viewing
 * - Event history tracking
 * - Compliance reporting
 *
 * Note: Audit is read-only, subscribes to all workspace events
 */

import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

import { DomainEvent } from '@domain/event/domain-event';

export interface AuditEntry {
  readonly eventId: string;
  readonly eventType: string;
  readonly aggregateId: string;
  readonly userId: string;
  readonly userName?: string;
  readonly timestamp: Date;
  readonly action: string;
  readonly description: string;
  readonly metadata: Record<string, unknown>;
}

export interface AuditState {
  readonly entries: ReadonlyArray<AuditEntry>;
  readonly selectedEntry: AuditEntry | null;
  readonly filterEventType: string | null;
  readonly filterUserId: string | null;
  readonly filterAggregateId: string | null;
  readonly dateFrom: Date | null;
  readonly dateTo: Date | null;
  readonly searchQuery: string;
  readonly isLoading: boolean;
  readonly error: string | null;
}

const initialState: AuditState = {
  entries: [],
  selectedEntry: null,
  filterEventType: null,
  filterUserId: null,
  filterAggregateId: null,
  dateFrom: null,
  dateTo: null,
  searchQuery: '',
  isLoading: false,
  error: null,
};

export const AuditStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((state) => ({
    filteredEntries: computed(() => {
      let entries = state.entries();
      
      const eventType = state.filterEventType();
      if (eventType) {
        entries = entries.filter(e => e.eventType === eventType);
      }
      
      const userId = state.filterUserId();
      if (userId) {
        entries = entries.filter(e => e.userId === userId);
      }
      
      const aggregateId = state.filterAggregateId();
      if (aggregateId) {
        entries = entries.filter(e => e.aggregateId === aggregateId);
      }
      
      const dateFrom = state.dateFrom();
      if (dateFrom) {
        entries = entries.filter(e => e.timestamp >= dateFrom);
      }
      
      const dateTo = state.dateTo();
      if (dateTo) {
        entries = entries.filter(e => e.timestamp <= dateTo);
      }
      
      const query = state.searchQuery().toLowerCase();
      if (query) {
        entries = entries.filter(e =>
          e.action.toLowerCase().includes(query) ||
          e.description.toLowerCase().includes(query) ||
          e.eventType.toLowerCase().includes(query)
        );
      }
      
      return entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }),
    
    eventTypes: computed(() => {
      const types = new Set<string>();
      state.entries().forEach(e => types.add(e.eventType));
      return Array.from(types).sort();
    }),
    
    userIds: computed(() => {
      const users = new Set<string>();
      state.entries().forEach(e => users.add(e.userId));
      return Array.from(users).sort();
    }),
    
    entriesForAggregate: computed(() => (aggregateId: string) =>
      state.entries()
        .filter(e => e.aggregateId === aggregateId)
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    ),
    
    entriesForUser: computed(() => (userId: string) =>
      state.entries()
        .filter(e => e.userId === userId)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    ),
    
    recentEntries: computed(() =>
      state.entries()
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 50)
    ),
    
    totalEntries: computed(() => state.entries().length),
  })),

  withMethods((store) => ({
    /**
     * Add audit entry from domain event
     */
    addEntry(event: DomainEvent): void {
      const entry: AuditEntry = {
        eventId: event.eventId,
        eventType: event.eventType,
        aggregateId: event.aggregateId,
        userId: event.metadata.userId || 'system',
        timestamp: event.timestamp,
        action: formatAction(event.eventType),
        description: formatDescription(event),
        metadata: event.payload,
      };
      
      patchState(store, {
        entries: [...store.entries(), entry],
        error: null,
      });
    },

    /**
     * Load entries
     */
    loadEntries(entries: AuditEntry[]): void {
      patchState(store, { entries, error: null });
    },

    /**
     * Set filter event type
     */
    setEventTypeFilter(eventType: string | null): void {
      patchState(store, { filterEventType: eventType });
    },

    /**
     * Set filter user
     */
    setUserFilter(userId: string | null): void {
      patchState(store, { filterUserId: userId });
    },

    /**
     * Set filter aggregate
     */
    setAggregateFilter(aggregateId: string | null): void {
      patchState(store, { filterAggregateId: aggregateId });
    },

    /**
     * Set date range
     */
    setDateRange(from: Date | null, to: Date | null): void {
      patchState(store, { dateFrom: from, dateTo: to });
    },

    /**
     * Set search query
     */
    setSearchQuery(query: string): void {
      patchState(store, { searchQuery: query });
    },

    /**
     * Select entry
     */
    selectEntry(eventId: string): void {
      const entry = store.entries().find(e => e.eventId === eventId);
      patchState(store, { selectedEntry: entry || null });
    },

    /**
     * Clear selection
     */
    clearSelection(): void {
      patchState(store, { selectedEntry: null });
    },

    /**
     * Clear all filters
     */
    clearFilters(): void {
      patchState(store, {
        filterEventType: null,
        filterUserId: null,
        filterAggregateId: null,
        dateFrom: null,
        dateTo: null,
        searchQuery: '',
      });
    },

    /**
     * Reset store (on workspace switch)
     */
    reset(): void {
      patchState(store, initialState);
    },
  }))
);

/**
 * Format event type to human-readable action
 */
function formatAction(eventType: string): string {
  return eventType
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toLowerCase()
    .replace(/^./, str => str.toUpperCase());
}

/**
 * Format event description
 */
function formatDescription(event: DomainEvent): string {
  const payload = event.payload as Record<string, unknown>;
  
  switch (event.eventType) {
    case 'TaskCreated':
      return `Created task: ${payload['title']}`;
    case 'TaskCompleted':
      return `Completed task: ${payload['taskTitle']}`;
    case 'QCPassed':
      return `QC passed for task: ${payload['taskTitle']}`;
    case 'QCFailed':
      return `QC failed for task: ${payload['taskTitle']} - ${payload['failureReason']}`;
    case 'IssueCreated':
      return `Created issue: ${payload['title']}`;
    case 'IssueResolved':
      return `Resolved issue for task: ${payload['taskId']}`;
    case 'MemberAdded':
      return `Added member: ${payload['displayName']} (${payload['email']})`;
    case 'MemberRemoved':
      return `Removed member: ${payload['memberId']}`;
    case 'PermissionUpdated':
      return `Updated permissions for role: ${payload['roleName']}`;
    default:
      return event.eventType;
  }
}
