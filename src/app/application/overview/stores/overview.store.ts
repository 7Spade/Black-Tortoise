/**
 * Overview Store
 *
 * Layer: Application - Store
 * Purpose: Manages workspace overview/dashboard state using NgRx Signals
 * Architecture: Zone-less, Pure Reactive, Angular 20+
 *
 * Responsibilities:
 * - Dashboard widget state
 * - Aggregated statistics
 * - Recent activity tracking
 *
 * Note: Overview is a read-only aggregator, does not publish events
 */

import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

export interface OverviewStats {
  readonly totalTasks: number;
  readonly tasksInProgress: number;
  readonly tasksCompleted: number;
  readonly openIssues: number;
  readonly pendingQC: number;
  readonly pendingAcceptance: number;
  readonly totalMembers: number;
  readonly totalDocuments: number;
}

export interface RecentActivity {
  readonly activityId: string;
  readonly type: string;
  readonly title: string;
  readonly description: string;
  readonly userId: string;
  readonly userName: string;
  readonly timestamp: Date;
}

export interface OverviewState {
  readonly stats: OverviewStats;
  readonly recentActivities: ReadonlyArray<RecentActivity>;
  readonly selectedTimeRange: 'today' | 'week' | 'month' | 'all';
  readonly isLoading: boolean;
  readonly error: string | null;
}

const initialState: OverviewState = {
  stats: {
    totalTasks: 0,
    tasksInProgress: 0,
    tasksCompleted: 0,
    openIssues: 0,
    pendingQC: 0,
    pendingAcceptance: 0,
    totalMembers: 0,
    totalDocuments: 0,
  },
  recentActivities: [],
  selectedTimeRange: 'week',
  isLoading: false,
  error: null,
};

export const OverviewStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((state) => ({
    taskCompletionRate: computed(() => {
      const total = state.stats().totalTasks;
      const completed = state.stats().tasksCompleted;
      return total > 0 ? Math.round((completed / total) * 100) : 0;
    }),
    
    tasksInProgressRate: computed(() => {
      const total = state.stats().totalTasks;
      const inProgress = state.stats().tasksInProgress;
      return total > 0 ? Math.round((inProgress / total) * 100) : 0;
    }),
    
    hasBlockingIssues: computed(() => state.stats().openIssues > 0),
    
    hasPendingReviews: computed(() => 
      state.stats().pendingQC > 0 || state.stats().pendingAcceptance > 0
    ),
    
    filteredActivities: computed(() => {
      const activities = state.recentActivities();
      const range = state.selectedTimeRange();
      
      if (range === 'all') {
        return activities;
      }
      
      const now = new Date();
      const cutoff = new Date(now);
      
      switch (range) {
        case 'today':
          cutoff.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoff.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoff.setMonth(now.getMonth() - 1);
          break;
      }
      
      return activities.filter(a => a.timestamp >= cutoff);
    }),
    
    activityCount: computed(() => state.recentActivities().length),
  })),

  withMethods((store) => ({
    /**
     * Update statistics
     */
    updateStats(stats: Partial<OverviewStats>): void {
      patchState(store, {
        stats: { ...store.stats(), ...stats },
        error: null,
      });
    },

    /**
     * Add activity
     */
    addActivity(activity: RecentActivity): void {
      const activities = [activity, ...store.recentActivities()];
      const limited = activities.slice(0, 100); // Keep last 100
      
      patchState(store, {
        recentActivities: limited,
        error: null,
      });
    },

    /**
     * Set time range
     */
    setTimeRange(range: 'today' | 'week' | 'month' | 'all'): void {
      patchState(store, { selectedTimeRange: range });
    },

    /**
     * Load activities
     */
    loadActivities(activities: RecentActivity[]): void {
      patchState(store, { recentActivities: activities, error: null });
    },

    /**
     * Refresh all data
     */
    refresh(stats: OverviewStats, activities: RecentActivity[]): void {
      patchState(store, {
        stats,
        recentActivities: activities,
        error: null,
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
