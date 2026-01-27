/**
 * Issues Signal Store
 *
 * Layer: Application - Store
 * Purpose: Manages issue tracking state using NgRx Signals (Repository Backed)
 * Architecture: Zone-less, Signal-based, Pure Reactive
 *
 * Responsibilities:
 * - Track all issues
 * - Manage issue lifecycle (open/resolved/closed)
 * - Link issues to tasks (blocking relationships)
 *
 * Clean Architecture Compliance:
 * - Single source of truth for issues state
 * - Backend sync via IssueRepository
 */

import { computed, inject } from '@angular/core';
import { ISSUE_REPOSITORY } from '@application/interfaces';
import { IssueAggregate, IssueStatus } from '@domain/aggregates';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { from, pipe, switchMap } from 'rxjs';

export interface IssuesState {
  readonly issues: ReadonlyArray<IssueAggregate>;
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
      state.issues().filter(i => i.status === IssueStatus.OPEN || i.status === IssueStatus.IN_PROGRESS)
    ),

    /**
     * Resolved issues
     */
    resolvedIssues: computed(() =>
      state.issues().filter(i => i.status === IssueStatus.RESOLVED || i.status === IssueStatus.CLOSED)
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
    hasOpenIssues: computed(() => state.issues().some(i => i.status === IssueStatus.OPEN || i.status === IssueStatus.IN_PROGRESS)),
  })),

  withMethods((store, repo = inject(ISSUE_REPOSITORY)) => ({
    
    /**
     * Load issues for a workspace
     */
    loadByWorkspace: rxMethod<string>(
      pipe(
        switchMap((workspaceId) => {
          patchState(store, { isProcessing: true, error: null });
          return from(repo.findByWorkspaceId(workspaceId)).pipe(
            tapResponse({
              next: (issues) => patchState(store, { issues, isProcessing: false, error: null }),
              error: (err: any) => patchState(store, { error: err.message, isProcessing: false })
            })
          );
        })
      )
    ),

    /**
     * Create Issue
     */
    async createIssue(issue: IssueAggregate): Promise<void> {
      patchState(store, { isProcessing: true, error: null });
      try {
        await repo.save(issue);
        patchState(store, {
          issues: [...store.issues(), issue],
          isProcessing: false,
          error: null
        });
      } catch (err: any) {
        patchState(store, { error: err.message, isProcessing: false });
      }
    },

    /**
     * Update Issue
     */
    async updateIssue(issueId: string, updates: Partial<IssueAggregate>): Promise<void> {
        const issue = store.issues().find(i => i.id === issueId);
        if (!issue) {
            patchState(store, { error: `Issue ${issueId} not found` });
            return;
        }

        const updatedIssue = { ...issue, ...updates }; // Aggregate structure copy
        patchState(store, { isProcessing: true, error: null });

        try {
            await repo.save(updatedIssue as IssueAggregate); // Cast might be needed if Partial doesn't align perfectly but save expects full
            patchState(store, {
                issues: store.issues().map(i => i.id === issueId ? (updatedIssue as IssueAggregate) : i),
                isProcessing: false,
                error: null
            });
        } catch (err: any) {
            patchState(store, { error: err.message, isProcessing: false });
        }
    },

    /**
     * Select Issue
     */
    selectIssue(issueId: string | null): void {
      patchState(store, { selectedIssueId: issueId });
    },

    /**
     * Reset State (Clear on Workspace Switch)
     */
    reset(): void {
      patchState(store, initialState);
    },
  }))
);
