/**
 * Overview Store
 *
 * Layer: Application - Store
 * Purpose: Manages workspace overview/dashboard state using NgRx Signals
 * Architecture: Zone-less, Pure Reactive, Angular 20+, Event-driven
 *
 * Responsibilities:
 * - Aggregate statistics from all modules via Event Bus subscriptions
 * - Provide dashboard metrics
 * - Track workspace health
 *
 * Event Integration:
 * - Reacts to: TaskCreated, TaskCompleted, IssueCreated, IssueResolved,
 *   DocumentUploaded, MemberAdded, DailyEntryCreated, WorkspaceSwitched
 * - Publishes: None (read-only aggregation)
 *
 * Clean Architecture Compliance:
 * - Uses Event Bus for module communication (no direct store injection)
 * - All state updates via patchState
 * - Pure signal-based reactivity
 */

import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { EVENT_BUS } from '@application/interfaces';

export interface WorkspaceMetrics {
  readonly totalTasks: number;
  readonly completedTasks: number;
  readonly activeTasks: number;
  readonly blockedTasks: number;
  readonly openIssues: number;
  readonly pendingQC: number;
  readonly pendingAcceptance: number;
  readonly totalMembers: number;
  readonly totalDocuments: number;
  readonly lastActivityAt: Date | null;
}

export interface OverviewState {
  readonly metrics: WorkspaceMetrics;
  readonly recentActivities: ReadonlyArray<{
    readonly id: string;
    readonly type: string;
    readonly description: string;
    readonly timestamp: Date;
    readonly actorId: string;
  }>;
  readonly isLoading: boolean;
  readonly error: string | null;
}

const initialState: OverviewState = {
  metrics: {
    totalTasks: 0,
    completedTasks: 0,
    activeTasks: 0,
    blockedTasks: 0,
    openIssues: 0,
    pendingQC: 0,
    pendingAcceptance: 0,
    totalMembers: 0,
    totalDocuments: 0,
    lastActivityAt: null,
  },
  recentActivities: [],
  isLoading: false,
  error: null,
};

/**
 * Overview Store
 *
 * Application-level store for workspace overview using NgRx Signals.
 */
export const OverviewStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((state) => ({
    /**
     * Task completion percentage
     */
    taskCompletionRate: computed(() => {
      const total = state.metrics().totalTasks;
      if (total === 0) return 0;
      return Math.round((state.metrics().completedTasks / total) * 100);
    }),

    /**
     * Health score (0-100)
     */
    healthScore: computed(() => {
      const metrics = state.metrics();
      const total = metrics.totalTasks;
      if (total === 0) return 100;

      const blocked = metrics.blockedTasks / total;
      const issues = metrics.openIssues / total;
      
      const score = 100 - (blocked * 50) - (issues * 30);
      return Math.max(0, Math.round(score));
    }),

    /**
     * Has activity
     */
    hasActivity: computed(() => state.recentActivities().length > 0),

    /**
     * Latest activity
     */
    latestActivity: computed(() => {
      const activities = state.recentActivities();
      return activities.length > 0 ? activities[activities.length - 1] : null;
    }),
  })),

  withMethods((store) => ({
    /**
     * Update metrics
     */
    updateMetrics(updates: Partial<WorkspaceMetrics>): void {
      patchState(store, {
        metrics: { ...store.metrics(), ...updates },
      });
    },

    /**
     * Increment metric
     */
    incrementMetric(metric: keyof WorkspaceMetrics, amount: number = 1): void {
      const current = store.metrics();
      const key = metric as keyof typeof current;
      const value = current[key];
      
      if (typeof value === 'number') {
        patchState(store, {
          metrics: { ...current, [metric]: value + amount },
        });
      }
    },

    /**
     * Decrement metric
     */
    decrementMetric(metric: keyof WorkspaceMetrics, amount: number = 1): void {
      const current = store.metrics();
      const key = metric as keyof typeof current;
      const value = current[key];
      
      if (typeof value === 'number') {
        patchState(store, {
          metrics: { ...current, [metric]: Math.max(0, value - amount) },
        });
      }
    },

    /**
     * Add activity
     */
    addActivity(activity: Omit<OverviewState['recentActivities'][number], 'id'>): void {
      const newActivity = {
        ...activity,
        id: crypto.randomUUID(),
      };

      const activities = [...store.recentActivities(), newActivity].slice(-50); // Keep last 50

      patchState(store, {
        recentActivities: activities,
        metrics: { ...store.metrics(), lastActivityAt: new Date() },
      });
    },

    /**
     * Reset (Clear on Workspace Switch)
     */
    reset(): void {
      patchState(store, initialState);
    },

    /**
     * Clear all data (workspace switch)
     * @deprecated Use reset() instead
     */
    clearOverview(): void {
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
  })),

  /**
   * Event Bus Integration
   * 
   * Subscribe to workspace events to update metrics and activity feed.
   * Follows the pattern: Event Bus → Store → Component (signal propagation)
   */
  withHooks({
    onInit(store) {
      const eventBus = inject(EVENT_BUS);
      const methods = store as unknown as ReturnType<typeof withMethods>;

      // Subscribe to TaskCreated
      eventBus.subscribe('TaskCreated', (event: any) => {
        methods.incrementMetric('totalTasks');
        methods.addActivity({
          type: 'TaskCreated',
          description: `Task created: ${event.payload?.title || 'New Task'}`,
          timestamp: new Date(event.timestamp || Date.now()),
          actorId: event.metadata?.userId || 'system',
        });
      });

      // Subscribe to TaskCompleted
      eventBus.subscribe('TaskCompleted', (event: any) => {
        methods.incrementMetric('completedTasks');
        methods.addActivity({
          type: 'TaskCompleted',
          description: `Task completed: ${event.payload?.title || 'Task'}`,
          timestamp: new Date(event.timestamp || Date.now()),
          actorId: event.metadata?.userId || 'system',
        });
      });

      // Subscribe to IssueCreated
      eventBus.subscribe('IssueCreated', (event: any) => {
        methods.incrementMetric('openIssues');
        methods.addActivity({
          type: 'IssueCreated',
          description: `Issue created: ${event.payload?.title || 'New Issue'}`,
          timestamp: new Date(event.timestamp || Date.now()),
          actorId: event.metadata?.userId || 'system',
        });
      });

      // Subscribe to IssueResolved
      eventBus.subscribe('IssueResolved', (event: any) => {
        methods.decrementMetric('openIssues');
        methods.addActivity({
          type: 'IssueResolved',
          description: `Issue resolved: ${event.payload?.title || 'Issue'}`,
          timestamp: new Date(event.timestamp || Date.now()),
          actorId: event.metadata?.userId || 'system',
        });
      });

      // Subscribe to DocumentUploaded
      eventBus.subscribe('DocumentUploaded', (event: any) => {
        methods.incrementMetric('totalDocuments');
        methods.addActivity({
          type: 'DocumentUploaded',
          description: `Document uploaded: ${event.payload?.name || 'Document'}`,
          timestamp: new Date(event.timestamp || Date.now()),
          actorId: event.metadata?.userId || 'system',
        });
      });

      // Subscribe to MemberAdded
      eventBus.subscribe('MemberAdded', (event: any) => {
        methods.incrementMetric('totalMembers');
        methods.addActivity({
          type: 'MemberAdded',
          description: `Member added: ${event.payload?.email || 'New Member'}`,
          timestamp: new Date(event.timestamp || Date.now()),
          actorId: event.metadata?.userId || 'system',
        });
      });

      // Subscribe to DailyEntryCreated
      eventBus.subscribe('DailyEntryCreated', (event: any) => {
        methods.addActivity({
          type: 'DailyEntryCreated',
          description: `Daily entry created`,
          timestamp: new Date(event.timestamp || Date.now()),
          actorId: event.metadata?.userId || 'system',
        });
      });

      // Subscribe to WorkspaceSwitched - reset all state
      eventBus.subscribe('WorkspaceSwitched', () => {
        methods.reset();
      });

      // Subscribe to QC events for activity feed
      eventBus.subscribe('QCPassed', (event: any) => {
        methods.addActivity({
          type: 'QCPassed',
          description: `QC passed: ${event.payload?.taskTitle || 'Task'}`,
          timestamp: new Date(event.timestamp || Date.now()),
          actorId: event.metadata?.userId || 'system',
        });
      });

      eventBus.subscribe('QCFailed', (event: any) => {
        methods.addActivity({
          type: 'QCFailed',
          description: `QC failed: ${event.payload?.taskTitle || 'Task'}`,
          timestamp: new Date(event.timestamp || Date.now()),
          actorId: event.metadata?.userId || 'system',
        });
      });

      // Subscribe to Acceptance events for activity feed
      eventBus.subscribe('AcceptanceApproved', (event: any) => {
        methods.addActivity({
          type: 'AcceptanceApproved',
          description: `Acceptance approved: ${event.payload?.taskTitle || 'Task'}`,
          timestamp: new Date(event.timestamp || Date.now()),
          actorId: event.metadata?.userId || 'system',
        });
      });
    },
  })
);
