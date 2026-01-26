/**
 * Issues Event Handlers
 * 
 * Layer: Application - Event Handlers
 * Purpose: Register event handlers for Issues domain events
 */

import { inject } from '@angular/core';
import { createIssue, IssuePriority, IssueStatus, IssueType } from '@domain/aggregates';
import { IssueCreatedEvent, IssueResolvedEvent } from '@domain/events';
import { EventBus } from '@domain/types';
import { WorkspaceId } from '@domain/value-objects';
import { IssuesStore } from '../stores/issues.store';

export function registerIssuesEventHandlers(eventBus: EventBus): void {
  const issuesStore = inject(IssuesStore);
  
  eventBus.subscribe<IssueCreatedEvent['payload']>(
    'IssueCreated',
    (event) => {
      console.log('[IssuesEventHandlers] IssueCreated:', event);
      
      const issue = createIssue(
        event.aggregateId,
        WorkspaceId.create(event.payload.workspaceId),
        event.payload.title,
        event.payload.description,
        IssueType.BUG, // Defaulting to BUG as type isn't in event payload yet
        IssuePriority.HIGH,
        event.payload.createdById,
        undefined,
        event.payload.taskId
      );

      issuesStore.createIssue(issue);
    }
  );
  
  eventBus.subscribe<IssueResolvedEvent['payload']>(
    'IssueResolved',
    (event) => {
      console.log('[IssuesEventHandlers] IssueResolved:', event);
      
      issuesStore.updateIssue(event.aggregateId, {
        status: IssueStatus.RESOLVED,
        resolvedAt: event.timestamp
      });
    }
  );
  
  console.log('[IssuesEventHandlers] Registered event handlers for workspace');
}
