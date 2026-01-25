/**
 * Issues Event Handlers
 * 
 * Layer: Application - Event Handlers
 * Purpose: Register event handlers for Issue domain events
 * 
 * Responsibilities:
 * - Subscribe to IssueCreated, IssueResolved events
 * - Delegate to IssuesStore for state mutations
 * - Event-driven state management (react pattern)
 */

import { inject } from '@angular/core';
import { EventBus } from '@domain/event-bus/event-bus.interface';
import { IssueCreatedEvent, IssueResolvedEvent } from '@domain/events/domain-events';
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
        priority: 'high',
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
