/**
 * Acceptance Event Handlers
 * 
 * Layer: Application - Event Handlers
 * Purpose: Register event handlers for Acceptance domain events
 */

import { inject } from '@angular/core';
import { AcceptanceCheckEntity, AcceptanceStatus } from '@acceptance/domain';
import { AcceptanceApprovedEvent, AcceptanceRejectedEvent, QCPassedEvent } from '@domain/events';
import { EventBus } from '@domain/types';
import { AcceptanceStore } from '@acceptance/application/stores/acceptance.store';

export function registerAcceptanceEventHandlers(eventBus: EventBus): void {
  const acceptanceStore = inject(AcceptanceStore);
  
  eventBus.subscribe<QCPassedEvent['payload']>(
    'QCPassed',
    (event) => {
      console.log('[AcceptanceEventHandlers] QCPassed:', event);
      
      const check: AcceptanceCheckEntity = {
        id: crypto.randomUUID(),
        taskId: event.aggregateId,
        workspaceId: event.payload.workspaceId,
        status: AcceptanceStatus.PENDING,
        criteria: [`Pass QC: ${event.payload.taskTitle}`],
        notes: '',
        reviewedBy: null,
        reviewedAt: null
      };
      
      acceptanceStore.addCheck(check);
    }
  );
  
  eventBus.subscribe<AcceptanceApprovedEvent['payload']>(
    'AcceptanceApproved',
    (event) => {
      console.log('[AcceptanceEventHandlers] AcceptanceApproved:', event);
      const check = acceptanceStore.checks().find(c => c.taskId === event.aggregateId);
      if (check) {
          acceptanceStore.updateCheck({
              ...check,
              status: AcceptanceStatus.APPROVED,
              reviewedBy: event.payload.approverId,
              notes: event.payload.approvalNotes || '',
              reviewedAt: event.timestamp
          });
      }
    }
  );

  eventBus.subscribe<AcceptanceRejectedEvent['payload']>(
    'AcceptanceRejected',
    (event) => {
      console.log('[AcceptanceEventHandlers] AcceptanceRejected:', event);
      const check = acceptanceStore.checks().find(c => c.taskId === event.aggregateId);
      if (check) {
          acceptanceStore.updateCheck({
              ...check,
              status: AcceptanceStatus.REJECTED,
              reviewedBy: event.payload.rejectedById,
              notes: event.payload.rejectionReason,
              reviewedAt: event.timestamp
          });
      }
    }
  );
  
  console.log('[AcceptanceEventHandlers] Registered event handlers for workspace');
}
