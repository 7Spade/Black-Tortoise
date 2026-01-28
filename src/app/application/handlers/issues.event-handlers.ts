/**
 * Issues Event Handlers
 * 
 * Layer: Application - Event Handlers
 * Purpose: Register event handlers for Issues domain events
 */

import { inject } from '@angular/core';
import { createIssue, IssuePriority, IssueStatus, IssueType } from '@domain/aggregates';
import { IssueCreatedEvent, IssueResolvedEvent } from '@domain/events';
import { AcceptanceRejectedEvent } from '@domain/events/acceptance-rejected.event';
import { TaskCompletedEvent } from '@domain/events/task-completed.event';
import { EventBus } from '@domain/types';
import { WorkspaceId } from '@domain/value-objects';
import { IssuesStore } from '../stores/issues.store';
import { CreateIssueHandler } from './create-issue.handler';
import { IssueContextProviderImpl } from '../providers/issue-context-provider.impl';

export function registerIssuesEventHandlers(eventBus: EventBus): void {
  const issuesStore = inject(IssuesStore);
  const createIssueHandler = inject(CreateIssueHandler);
  const issueContextProvider = inject(IssueContextProviderImpl);
  
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
  
  // Subscribe to AcceptanceRejected to auto-create issues
  eventBus.subscribe<AcceptanceRejectedEvent['payload']>(
    'AcceptanceRejected',
    async (event) => {
      console.log('[IssuesEventHandlers] AcceptanceRejected - auto-creating issue:', event);
      
      const issueId = crypto.randomUUID();
      await createIssueHandler.execute({
        issueId,
        taskId: event.payload.taskId,
        workspaceId: event.payload.workspaceId,
        title: `Acceptance Failed: ${event.payload.taskTitle}`,
        description: event.payload.rejectionReason,
        createdBy: event.payload.rejectedById,
        correlationId: event.correlationId,
        causationId: event.eventId,
      });
    }
  );
  
  // Subscribe to TaskCompleted to prevent completion with open issues
  eventBus.subscribe<TaskCompletedEvent['payload']>(
    'TaskCompleted',
    (event) => {
      console.log('[IssuesEventHandlers] TaskCompleted - validating issues:', event);
      
      const hasBlockingIssues = issueContextProvider.hasBlockingIssues(event.payload.taskId);
      if (hasBlockingIssues) {
        const openCount = issueContextProvider.getOpenIssuesCount(event.payload.taskId);
        console.warn(
          `[IssuesEventHandlers] Task ${event.payload.taskId} has ${openCount} open/in-progress issues. ` +
          `Task should not be completed until all issues are resolved.`
        );
        // Note: In a production system, this would publish a TaskCompletionBlocked event
        // or throw an error to prevent the completion
      }
    }
  );
  
  console.log('[IssuesEventHandlers] Registered event handlers for workspace');
}
