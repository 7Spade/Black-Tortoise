/**
 * Acceptance Event Handlers
 * 
 * Layer: Application - Event Handlers
 * Purpose: Register event handlers for Acceptance domain events
 * 
 * Responsibilities:
 * - Subscribe to AcceptanceApproved and AcceptanceRejected events
 * - Delegate to AcceptanceStore for state mutations
 * - Event-driven state management (react pattern)
 * 
 * Event Flow:
 * 1. Use Case publishes event via PublishEventUseCase (append → publish)
 * 2. EventBus notifies all subscribers
 * 3. This handler receives event
 * 4. Handler calls store method to mutate state
 * 
 * Initialization:
 * - Called by workspace runtime or app initializer
 * - Registers handlers for the workspace-scoped EventBus
 */

import { inject } from '@angular/core';
import { EVENT_BUS } from '@application/events';
import { EventBus } from '@domain/event-bus/event-bus.interface';
import { AcceptanceApprovedEvent, AcceptanceRejectedEvent, QCPassedEvent } from '@domain/events/domain-events';
import { AcceptanceStore } from '../stores/acceptance.store';

export function registerAcceptanceEventHandlers(eventBus: EventBus): void {
  const acceptanceStore = inject(AcceptanceStore);
  
  eventBus.subscribe<QCPassedEvent['payload']>(
    'QCPassed',
    (event) => {
      console.log('[AcceptanceEventHandlers] QCPassed:', event);
      acceptanceStore.addTaskForAcceptance({
        taskId: event.aggregateId,
        taskTitle: event.payload.taskTitle,
        taskDescription: '',
        qcPassedAt: new Date(event.timestamp),
        qcReviewedBy: event.payload.reviewerId,
      });
    }
  );
  
  eventBus.subscribe<AcceptanceApprovedEvent['payload']>(
    'AcceptanceApproved',
    (event) => {
      console.log('[AcceptanceEventHandlers] AcceptanceApproved:', event);
      acceptanceStore.handleAcceptanceApproved(event as AcceptanceApprovedEvent);
    }
  );
  
  eventBus.subscribe<AcceptanceRejectedEvent['payload']>(
    'AcceptanceRejected',
    (event) => {
      console.log('[AcceptanceEventHandlers] AcceptanceRejected:', event);
      acceptanceStore.handleAcceptanceRejected(event as AcceptanceRejectedEvent);
    }
  );
  
  console.log('[AcceptanceEventHandlers] Registered event handlers for workspace');
}
