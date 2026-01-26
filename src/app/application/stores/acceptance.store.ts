/**
 * Acceptance Signal Store
 *
 * Layer: Application - Store
 * Purpose: Manages acceptance workflow state using NgRx Signals (Repository Backed)
 * Architecture: Zone-less, Signal-based, Pure Reactive
 *
 * Responsibilities:
 * - Track acceptance checks for tasks
 * - React to approval/rejection events (via UI calls triggers repo updates)
 *
 * Clean Architecture Compliance:
 * - Single source of truth for acceptance checks
 * - Backend sync via AcceptanceRepository
 */

import { computed, inject } from '@angular/core';
import { ACCEPTANCE_REPOSITORY } from '@application/interfaces';
import { AcceptanceCheckEntity, AcceptanceStatus } from '@domain/aggregates';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { from, pipe, switchMap } from 'rxjs';

export interface AcceptanceState {
  readonly checks: ReadonlyArray<AcceptanceCheckEntity>;
  readonly selectedCheckId: string | null;
  readonly isProcessing: boolean;
  readonly error: string | null;
}

const initialState: AcceptanceState = {
  checks: [],
  selectedCheckId: null,
  isProcessing: false,
  error: null,
};

/**
 * Acceptance Store
 *
 * Application-level store for acceptance management using NgRx Signals.
 */
export const AcceptanceStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((state) => ({
    /**
     * Pending acceptance checks
     */
    pendingChecks: computed(() =>
      state.checks().filter(c => c.status === AcceptanceStatus.PENDING)
    ),

    /**
     * Approved checks
     */
    approvedChecks: computed(() =>
      state.checks().filter(c => c.status === AcceptanceStatus.APPROVED)
    ),

    /**
     * Rejected checks
     */
    rejectedChecks: computed(() =>
      state.checks().filter(c => c.status === AcceptanceStatus.REJECTED)
    ),

    /**
     * Selected check
     */
    selectedCheck: computed(() => {
      const id = state.selectedCheckId();
      return id ? state.checks().find(c => c.id === id) || null : null;
    }),

    /**
     * Has pending checks
     */
    hasPendingChecks: computed(() => state.checks().some(c => c.status === AcceptanceStatus.PENDING)),
  })),

  withMethods((store, repo = inject(ACCEPTANCE_REPOSITORY)) => ({
    
    /**
     * Load acceptance checks for a workspace
     */
    loadByWorkspace: rxMethod<string>(
      pipe(
        switchMap((workspaceId) => {
          patchState(store, { isProcessing: true, error: null });
          return from(repo.findByWorkspaceId(workspaceId)).pipe(
            tapResponse({
              next: (checks) => patchState(store, { checks, isProcessing: false, error: null }),
              error: (err: any) => patchState(store, { error: err.message, isProcessing: false })
            })
          );
        })
      )
    ),

    /**
     * Add Check
     */
    async addCheck(check: AcceptanceCheckEntity): Promise<void> {
      patchState(store, { isProcessing: true, error: null });
      try {
        await repo.save(check);
        patchState(store, {
          checks: [...store.checks(), check],
          isProcessing: false,
          error: null
        });
      } catch (err: any) {
        patchState(store, { error: err.message, isProcessing: false });
      }
    },

    /**
     * Update check (approve/reject)
     */
    async updateCheck(check: AcceptanceCheckEntity): Promise<void> {
      patchState(store, { isProcessing: true, error: null });
      try {
        await repo.save(check);
        patchState(store, {
          checks: store.checks().map(c => c.id === check.id ? check : c),
          isProcessing: false,
          error: null
        });
      } catch (err: any) {
        patchState(store, { error: err.message, isProcessing: false });
      }
    },

    /**
     * Reset State (Clear on Workspace Switch)
     */
    resetState(): void {
      patchState(store, initialState);
    },

    /**
     * Select Check
     */
    selectCheck(checkId: string | null): void {
      patchState(store, { selectedCheckId: checkId });
    }
  }))
);
