/**
 * Quality Control Event Handlers
 * 
 * Layer: Application - Event Handlers
 * Purpose: Register event handlers for QC domain events
 * 
 * Responsibilities:
 * - Subscribe to TaskSubmittedForQC, QCPassed, QCFailed events
 * - Delegate to QualityControlStore for state mutations
 * - Event-driven state management (react pattern)
 */

import { inject } from '@angular/core';
import { EventBus } from '@domain/event-bus/event-bus.interface';
import { TaskSubmittedForQCEvent, QCPassedEvent, QCFailedEvent } from '@domain/events/domain-events';
import { QualityControlStore } from '../stores/quality-control.store';

export function registerQualityControlEventHandlers(eventBus: EventBus): void {
  const qcStore = inject(QualityControlStore);
  
  eventBus.subscribe<TaskSubmittedForQCEvent>(
    'TaskSubmittedForQC',
    (event) => {
      console.log('[QCEventHandlers] TaskSubmittedForQC:', event);
      qcStore.addTaskForReview({
        taskId: event.aggregateId,
        taskTitle: event.payload.taskTitle,
        taskDescription: event.payload.taskDescription || 'No description',
        submittedAt: new Date(event.timestamp),
        submittedBy: event.payload.submittedBy,
      });
    }
  );
  
  eventBus.subscribe<QCPassedEvent>(
    'QCPassed',
    (event) => {
      console.log('[QCEventHandlers] QCPassed:', event);
      qcStore.passTask(
        event.aggregateId,
        event.payload.reviewedBy,
        event.payload.reviewNotes
      );
    }
  );
  
  eventBus.subscribe<QCFailedEvent>(
    'QCFailed',
    (event) => {
      console.log('[QCEventHandlers] QCFailed:', event);
      qcStore.failTask(
        event.aggregateId,
        event.payload.reviewedBy,
        event.payload.failureReason
      );
    }
  );
  
  console.log('[QCEventHandlers] Registered event handlers for workspace');
}
