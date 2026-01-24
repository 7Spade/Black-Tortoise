/**
 * Issues Store
 *
 * Layer: Application - Store
 * Purpose: Manages issue/defect tracking state using NgRx Signals
 * Architecture: Zone-less, Pure Reactive, Angular 20+
 *
 * Responsibilities:
 * - Issue lifecycle management
 * - Task blocking relationships
 * - Event-driven integration with Tasks and QC modules
 *
 * Event Flow:
 * - Listens: QCFailed, AcceptanceFailed
 * - Publishes: IssueCreated, IssueResolved
 */

import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap } from 'rxjs';

import { EventBus } from '@domain/event-bus/event-bus.interface';
import { EventStore } from '@domain/event-store/event-store.interface';
import { createIssueCreatedEvent, createIssueResolvedEvent } from '@domain/events/domain-events';

export interface Issue {
  readonly issueId: string;
  readonly title: string;
  readonly description: string;
  readonly relatedTaskId: string;
  readonly relatedTaskTitle: string;
  readonly severity: 'critical' | 'high' | 'medium' | 'low';
  readonly status: 'open' | 'in-progress' | 'resolved' | 'closed';
  readonly createdById: string;
  readonly createdAt: Date;
  readonly resolvedById?: string;
  readonly resolvedAt?: Date;
  readonly resolution?: string;
}

export interface IssuesState {
  readonly issues: ReadonlyArray<Issue>;
  readonly selectedIssue: Issue | null;
  readonly isLoading: boolean;
  readonly error: string | null;
}

const initialState: IssuesState = {
  issues: [],
  selectedIssue: null,
  isLoading: false,
  error: null,
};

export const IssuesStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((state) => ({
    openIssues: computed(() =>
      state.issues().filter(issue => issue.status === 'open')
    ),
    
    inProgressIssues: computed(() =>
      state.issues().filter(issue => issue.status === 'in-progress')
    ),
    
    resolvedIssues: computed(() =>
      state.issues().filter(issue => issue.status === 'resolved' || issue.status === 'closed')
    ),
    
    criticalIssues: computed(() =>
      state.issues().filter(issue => issue.severity === 'critical' && issue.status !== 'resolved')
    ),
    
    issuesForTask: computed(() => (taskId: string) =>
      state.issues().filter(issue => issue.relatedTaskId === taskId)
    ),
    
    blockingIssuesCount: computed(() =>
      state.issues().filter(issue => 
        (issue.severity === 'critical' || issue.severity === 'high') && 
        issue.status !== 'resolved'
      ).length
    ),
  })),

  withMethods((store) => ({
    /**
     * Create new issue
     * Can be auto-triggered by QCFailed or AcceptanceFailed events
     */
    createIssue: rxMethod<{
      title: string;
      description: string;
      relatedTaskId: string;
      relatedTaskTitle: string;
      severity: 'critical' | 'high' | 'medium' | 'low';
      createdById: string;
      workspaceId: string;
      eventBus: EventBus;
      eventStore: EventStore;
      correlationId?: string;
      causationId?: string;
    }>(
      pipe(
        tap(({ title, description, relatedTaskId, relatedTaskTitle, severity, createdById, workspaceId, eventBus, eventStore, correlationId, causationId }) => {
          const issueId = crypto.randomUUID();
          
          const newIssue: Issue = {
            issueId,
            title,
            description,
            relatedTaskId,
            relatedTaskTitle,
            severity,
            status: 'open',
            createdById,
            createdAt: new Date(),
          };
          
          // Create and publish event
          const event = createIssueCreatedEvent(
            issueId,
            workspaceId,
            title,
            description,
            relatedTaskId,
            severity,
            createdById,
            correlationId,
            causationId
          );
          
          // Append then publish
          eventStore.append(event).then(() => {
            eventBus.publish(event);
          });
          
          // Update state
          patchState(store, {
            issues: [...store.issues(), newIssue],
            error: null,
          });
        })
      )
    ),

    /**
     * Update issue status
     */
    updateIssueStatus(issueId: string, status: 'open' | 'in-progress' | 'resolved' | 'closed'): void {
      const issues = store.issues();
      const issue = issues.find(i => i.issueId === issueId);
      
      if (!issue) {
        patchState(store, { error: `Issue ${issueId} not found` });
        return;
      }
      
      const updatedIssue: Issue = { ...issue, status };
      
      patchState(store, {
        issues: issues.map(i => i.issueId === issueId ? updatedIssue : i),
        error: null,
      });
    },

    /**
     * Resolve issue
     */
    resolveIssue: rxMethod<{
      issueId: string;
      resolvedById: string;
      resolution: string;
      workspaceId: string;
      eventBus: EventBus;
      eventStore: EventStore;
    }>(
      pipe(
        tap(({ issueId, resolvedById, resolution, workspaceId, eventBus, eventStore }) => {
          const issues = store.issues();
          const issue = issues.find(i => i.issueId === issueId);
          
          if (!issue) {
            patchState(store, { error: `Issue ${issueId} not found` });
            return;
          }
          
          const resolvedIssue: Issue = {
            ...issue,
            status: 'resolved',
            resolvedById,
            resolvedAt: new Date(),
            resolution,
          };
          
          // Create and publish event
          const event = createIssueResolvedEvent(
            issueId,
            workspaceId,
            issue.relatedTaskId,
            resolvedById
          );
          
          // Append then publish
          eventStore.append(event).then(() => {
            eventBus.publish(event);
          });
          
          // Update state
          patchState(store, {
            issues: issues.map(i => i.issueId === issueId ? resolvedIssue : i),
            error: null,
          });
        })
      )
    ),

    /**
     * Select issue for detail view
     */
    selectIssue(issueId: string): void {
      const issue = store.issues().find(i => i.issueId === issueId);
      patchState(store, { selectedIssue: issue || null });
    },

    /**
     * Clear selection
     */
    clearSelection(): void {
      patchState(store, { selectedIssue: null });
    },

    /**
     * Reset store (on workspace switch)
     */
    reset(): void {
      patchState(store, initialState);
    },
  }))
);
