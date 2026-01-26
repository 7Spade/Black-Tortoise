import { inject } from '@angular/core';
import { IssuePriority } from '@domain/modules/issues/aggregates/issue.aggregate';
import { IssueCreatedEvent } from '@domain/modules/issues/events/issue-created.event';
import { IssueResolvedEvent } from '@domain/modules/issues/events/issue-resolved.event';
import { EventBus } from '@domain/shared/events/event-bus/event-bus.interface';
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




