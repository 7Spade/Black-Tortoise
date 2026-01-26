/**
 * Reject Task Use Case
 * 
 * Layer: Application - Use Case
 * Purpose: Execute task rejection workflow
 * 
 * Responsibilities:
 * - Create AcceptanceRejectedEvent
 * - Publish via PublishEventHandler (append ??publish)
 * - Returns success/failure
 * 
 * DDD Pattern: Application Service
 * Event Flow: create ??append(EventStore) ??publish(EventBus) ??react
 */

import { inject, Injectable } from '@angular/core';
import { PublishEventHandler } from '@application/handlers/publish-event.handler';
import { createAcceptanceRejectedEvent } from '@domain/modules/acceptance/events/acceptance-rejected.event';

export interface RejectTaskRequest {
  readonly taskId: string;
  readonly workspaceId: string;
  readonly taskTitle: string;
  readonly rejectedById: string;
  readonly rejectionReason: string;
  readonly correlationId?: string;
  readonly causationId?: string | null;
}

export interface RejectTaskResponse {
  readonly success: boolean;
  readonly error?: string;
}

@Injectable({ providedIn: 'root' })
export class RejectTaskHandler {
  private readonly publishEvent = inject(PublishEventHandler);

  /**
   * Execute use case: Reject task
   */
  async execute(request: RejectTaskRequest): Promise<RejectTaskResponse> {
    try {
      // Create domain event
      const event = createAcceptanceRejectedEvent(
        request.taskId,
        request.workspaceId,
        request.taskTitle,
        request.rejectedById,
        request.rejectionReason,
        request.correlationId,
        request.causationId
      );

      // Publish via PublishEventHandler (append BEFORE publish)
      const result = await this.publishEvent.execute({ event });

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}


