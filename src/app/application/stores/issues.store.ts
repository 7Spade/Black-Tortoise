/**
 * Issues Store
 *
 * Layer: Application - Store
 * Purpose: Manages issue tracking state using NgRx Signals
 * Architecture: Zone-less, Pure Reactive, Angular 20+, NO RxJS
 *
 * Responsibilities:
 * - Track all issues
 * - Manage issue lifecycle (open/resolved/closed)
 * - Link issues to tasks (blocking relationships)
 *
 * Event Integration:
 * - Reacts to: QCFailed, AcceptanceRejected (auto-create issues)
 * - Publishes: IssueCreated, IssueResolved
 *
 * Clean Architecture Compliance:
 * - Single source of truth for issues state
 * - All state updates via patchState
 * - No RxJS subscriptions
 * - Pure signal-based reactivity
 */

import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { IssueStatus, IssuePriority } from '@domain/aggregates';

export interface Issue {
  readonly id: string;
  readonly taskId: string;
  readonly title: string;
  readonly description: string;
  readonly status: IssueStatus;
  readonly priority: IssuePriority;
  readonly createdAt: number;
  readonly createdBy: string;
  readonly resolvedAt?: number;
  readonly resolvedBy?: string;
  readonly resolution?: string;
}

export interface IssuesState {
  readonly issues: ReadonlyArray<Issue>;
  readonly selectedIssueId: string | null;
  readonly isProcessing: boolean;
  readonly error: string | null;
}

const initialState: IssuesState = {
  issues: [],
  selectedIssueId: null,
  isProcessing: false,
  error: null,
};

/**
 * Issues Store
 *
 * Application-level store for issue management using NgRx Signals.
 */
export const IssuesStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((state) => ({
    /**
     * Open issues
     */
    openIssues: computed(() =>
      state.issues().filter(i => i.status === 'open' || i.status === 'in-progress')
    ),

    /**
     * Resolved issues
     */
    resolvedIssues: computed(() =>
      state.issues().filter(i => i.status === 'resolved' || i.status === 'closed')
    ),

    /**
     * Issues by task
     */
    getIssuesByTask: computed(() => (taskId: string) =>
      state.issues().filter(i => i.taskId === taskId)
    ),

    /**
     * Selected issue
     */
    selectedIssue: computed(() => {
      const id = state.selectedIssueId();
      return id ? state.issues().find(i => i.id === id) || null : null;
    }),

    /**
     * Has open issues
     */
    hasOpenIssues: computed(() => state.issues().some(i => i.status === 'open' || i.status === 'in-progress')),
  })),

  withMethods((store) => ({
    /**
     * Create new issue
     */
    createIssue(issue: Omit<Issue, 'id' | 'status' | 'createdAt'>): void {
      const newIssue: Issue = {
        ...issue,
        id: crypto.randomUUID(),
        status: IssueStatus.OPEN,
        createdAt: Date.now(),
      };

      patchState(store, {
        issues: [...store.issues(), newIssue],
      });
    },

    /**
     * Resolve issue
     */
    resolveIssue(issueId: string, resolvedBy: string, resolution: string): void {
      patchState(store, {
        issues: store.issues().map(i =>
          i.id === issueId
            ? { ...i, status: IssueStatus.RESOLVED, resolvedAt: Date.now(), resolvedBy, resolution }
            : i
        ),
        isProcessing: false,
      });
    },

    /**
     * Update issue status
     */
    updateIssueStatus(issueId: string, status: Issue['status']): void {
      patchState(store, {
        issues: store.issues().map(i =>
          i.id === issueId ? { ...i, status } : i
        ),
      });
    },

    /**
     * Select issue
     */
    selectIssue(issueId: string | null): void {
      patchState(store, { selectedIssueId: issueId });
    },

    /**
     * Clear all issues (workspace switch)
     */
    clearIssues(): void {
      patchState(store, {
        issues: [],
        selectedIssueId: null,
        isProcessing: false,
        error: null,
      });
    },

    /**
     * Set error
     */
    setError(error: string | null): void {
      patchState(store, { error, isProcessing: false });
    },
  }))
);



