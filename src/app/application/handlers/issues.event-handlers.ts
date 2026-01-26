import { inject } from '@angular/core';
import { IssuePriority } from '@domain/aggregates';
import { IssueCreatedEvent } from '@domain/events';
import { IssueResolvedEvent } from '@domain/events';
import { EventBus } from '@domain/types';
import { IssuesStore } from '../stores/issues.store';

export function registerIssuesEventHandlers(eventBus: EventBus): void {
  const issuesStore = inject(IssuesStore);
  
  eventBus.subscribe<IssueCreatedEvent['payload']>(
    'IssueCreated',
    (event) => {
      console.log('[IssuesEventHandlers] IssueCreated:', event);
      issuesStore.createIssue({
        taskId: event.payload.taskId,
        title: event.payload.title,
        description: event.payload.description,
        priority: IssuePriority.HIGH,
        createdBy: event.payload.createdById,
      });
    }
  );
  
  eventBus.subscribe<IssueResolvedEvent['payload']>(
    'IssueResolved',
    (event) => {
      console.log('[IssuesEventHandlers] IssueResolved:', event);
      issuesStore.resolveIssue(
        event.aggregateId,
        event.payload.resolvedById,
        event.payload.resolution
      );
    }
  );
  
  console.log('[IssuesEventHandlers] Registered event handlers for workspace');
}




