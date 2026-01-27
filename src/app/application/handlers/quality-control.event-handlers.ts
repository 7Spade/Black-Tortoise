/**
 * Quality Control Event Handlers
 * 
 * Layer: Application - Event Handlers
 * Purpose: Register event handlers for QC domain events
 * 
 * Responsibilities:
 * - Subscribe to TaskSubmittedForQC, IssueResolved, QCStarted, QCPassed, QCFailed events
 * - Delegate to QualityControlStore for state mutations
 * - Handle QCFailed → IssueCreated causality chain
 * - Handle IssueResolved → QC restart workflow
 * - Event-driven state management (react pattern)
 * 
 * Constitution Compliance:
 * - All events published via PublishEventHandler (append-before-publish)
 * - Causality propagation: correlationId inherited, causationId = parent.eventId
 * - No direct eventBus.publish or eventStore.append calls
 */

import { inject } from '@angular/core';
import { CreateIssueHandler } from '@application/handlers/create-issue.handler';
import { QCFailedEvent } from '@domain/events';
import { QCPassedEvent } from '@domain/events';
import { QCStartedEvent } from '@domain/events';
import { TaskSubmittedForQCEvent } from '@domain/events';
import { IssueResolvedEvent } from '@domain/events';
import { EventBus } from '@domain/types';
import { QualityControlStore } from '../stores/quality-control.store';

export function registerQualityControlEventHandlers(eventBus: EventBus): void {
  const qcStore = inject(QualityControlStore);
  const createIssueHandler = inject(CreateIssueHandler);
  
  // Subscribe to TaskSubmittedForQC (TaskReadyForQC equivalent)
  eventBus.subscribe<TaskSubmittedForQCEvent['payload']>(
    'TaskSubmittedForQC',
    (event) => {
      console.log('[QCEventHandlers] TaskSubmittedForQC:', event);
      qcStore.addTaskForReview({
        taskId: event.aggregateId,
        taskTitle: event.payload.taskTitle,
        taskDescription: '',
        taskType: 'default', // TODO: Get from task metadata
        submittedAt: new Date(event.timestamp),
        submittedBy: event.payload.submittedById,
        checklistItems: [], // Will be populated when QC starts
      });
    }
  );

  // Subscribe to IssueResolved (restart QC after issue fixed)
  eventBus.subscribe<IssueResolvedEvent['payload']>(
    'IssueResolved',
    (event) => {
      console.log('[QCEventHandlers] IssueResolved:', event);
      
      // Check if this issue was created from QC failure
      // If so, restart QC for the task
      const taskId = event.payload.taskId;
      if (taskId) {
        qcStore.restartQCAfterIssueResolved(taskId);
      }
    }
  );

  // Subscribe to QCStarted (track QC initiation)
  eventBus.subscribe<QCStartedEvent['payload']>(
    'QCStarted',
    (event) => {
      console.log('[QCEventHandlers] QCStarted:', event);
      // QC started event handled for analytics/notifications
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
      await createIssueHandler.execute({
        issueId,
        taskId: event.aggregateId,
        workspaceId: event.payload.workspaceId,
        title: `[QC Failed] ${event.payload.taskTitle}`,
        description: event.payload.failureReason,
        createdBy: event.payload.reviewedById,
        correlationId: event.correlationId, // Inherited from parent
        causationId: event.eventId, // Parent event that caused this
      });
    }
  );
  
  console.log('[QCEventHandlers] Registered event handlers for workspace');
}


