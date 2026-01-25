/**
 * Quality Control Event Handlers
 * 
 * Layer: Application - Event Handlers
 * Purpose: Register event handlers for QC domain events
 * 
 * Responsibilities:
 * - Subscribe to TaskSubmittedForQC, QCPassed, QCFailed events
 * - Delegate to QualityControlStore for state mutations
 * - Handle QCFailed → IssueCreated causality chain
 * - Event-driven state management (react pattern)
 * 
 * Constitution Compliance:
 * - All events published via PublishEventUseCase (append-before-publish)
 * - Causality propagation: correlationId inherited, causationId = parent.eventId
 * - No direct eventBus.publish or eventStore.append calls
 */

import { inject } from '@angular/core';
import { EventBus } from '@domain/event-bus/event-bus.interface';
import { TaskSubmittedForQCEvent, QCPassedEvent, QCFailedEvent } from '@domain/events/domain-events';
import { QualityControlStore } from '../stores/quality-control.store';
import { CreateIssueUseCase } from '@application/issues/use-cases/create-issue.use-case';

export function registerQualityControlEventHandlers(eventBus: EventBus): void {
  const qcStore = inject(QualityControlStore);
  const createIssueUseCase = inject(CreateIssueUseCase);
  
  eventBus.subscribe<TaskSubmittedForQCEvent['payload']>(
    'TaskSubmittedForQC',
    (event) => {
      console.log('[QCEventHandlers] TaskSubmittedForQC:', event);
      qcStore.addTaskForReview({
        taskId: event.aggregateId,
        taskTitle: event.payload.taskTitle,
        taskDescription: '',
        submittedAt: new Date(event.timestamp),
        submittedBy: event.payload.submittedById,
      });
    }
  );
  
  eventBus.subscribe<QCPassedEvent['payload']>(
    'QCPassed',
    (event) => {
      console.log('[QCEventHandlers] QCPassed:', event);
      qcStore.passTask(
        event.aggregateId,
        event.payload.reviewerId,
        event.payload.reviewNotes
      );
    }
  );
  
  eventBus.subscribe<QCFailedEvent['payload']>(
    'QCFailed',
    async (event) => {
      console.log('[QCEventHandlers] QCFailed:', event);
      
      // Update QC store state
      qcStore.failTask(
        event.aggregateId,
        event.payload.reviewedById,
        event.payload.failureReason
      );
      
      // Create derived Issue event with proper causality
      // Constitution Rule: correlationId inherited, causationId = parent.eventId
      const issueId = crypto.randomUUID();
      await createIssueUseCase.execute({
        issueId,
        taskId: event.aggregateId,
        workspaceId: event.payload.workspaceId,
        title: `QC Failed: ${event.payload.taskTitle}`,
        description: event.payload.failureReason,
        createdBy: event.payload.reviewedById,
        correlationId: event.correlationId, // Inherited from parent
        causationId: event.eventId, // Parent event that caused this
      });
    }
  );
  
  console.log('[QCEventHandlers] Registered event handlers for workspace');
}
