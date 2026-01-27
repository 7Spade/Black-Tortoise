/**
 * QCStarted Domain Event
 *
 * Layer: Domain - Events
 * Purpose: Signals that QC review has been initiated for a task
 *
 * Event Flow:
 * - Emitted when QCCheckEntity.create() is called
 * - Contains correlationId for causality tracking
 * - Consumed by QC analytics and notification systems
 */

import { DomainEvent } from './domain-event';

export interface QCStartedPayload {
  readonly qcId: string;
  readonly taskId: string;
  readonly workspaceId: string;
  readonly checklistItemCount: number;
  readonly startedAt: number;
}

export interface QCStartedEvent extends DomainEvent {
  readonly eventType: 'QCStarted';
  readonly aggregateType: 'Task';
  readonly payload: QCStartedPayload;
}
