/**
 * Issues Event Handlers
 * 
 * Layer: Application - Event Handlers
 * Purpose: Register event handlers for Issues domain events
 */

import { inject } from '@angular/core';
import { createIssue, IssuePriority, IssueStatus, IssueType } from '@issues/domain';
import { IssueCreated, IssueResolved } from '@events/issues/issues.events';
import { EventBus } from '@domain/types';
import { WorkspaceId } from '@domain/value-objects';
import { IssuesStore } from '@issues/application/stores/issues.store';

export function registerIssuesEventHandlers(eventBus: EventBus): void {
  const issuesStore = inject(IssuesStore);

  eventBus.subscribe<IssueCreated>(
    'IssueCreated',
    (event) => {
      console.log('[IssuesEventHandlers] IssueCreated:', event);

      const issue = createIssue(
        event.aggregateId,
        WorkspaceId.create(event.payload.workspaceId),
        event.payload.title,
        event.payload.description,
        IssueType.bug(), // Using static factory
        IssuePriority.high(),
        event.payload.createdById,
        undefined,
        event.payload.taskId
      );

      issuesStore.createIssue(issue);
    }
  );

  eventBus.subscribe<IssueResolved>(
    'IssueResolved',
    (event) => {
      console.log('[IssuesEventHandlers] IssueResolved:', event);

      // issuesStore.updateIssue currently uses IssueAggregate method or something?
      // Actually issuesStore.updateIssue in issues.store.ts expects (id, props)
      // We need to pass the VO for status
      issuesStore.updateIssue(event.aggregateId, {
        status: IssueStatus.resolved(),
        resolvedAt: event.timestamp
      });
    }
  );

  console.log('[IssuesEventHandlers] Registered event handlers for workspace');
}
