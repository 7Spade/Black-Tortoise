/**
 * Approve Task Use Case
 * 
 * Layer: Application - Use Case
 * Purpose: Execute task approval workflow
 * 
 * Responsibilities:
 * - Create AcceptanceApprovedEvent
 * - Publish via PublishEventHandler (append ??publish)
 * - Returns success/failure
 * 
 * DDD Pattern: Application Service
 * Event Flow: create ??append(EventStore) ??publish(EventBus) ??react
 */

import { inject, Injectable } from '@angular/core';
import { PublishEventHandler } from '@application/handlers/publish-event.handler';
import { createAcceptanceApprovedEvent } from '@domain/modules/acceptance/events/acceptance-approved.event';

export interface ApproveTaskRequest {
  readonly taskId: string;
  readonly workspaceId: string;
  readonly taskTitle: string;
  readonly approverId: string;
  readonly approvalNotes?: string;
  readonly correlationId?: string;
  readonly causationId?: string | null;
}

export interface ApproveTaskResponse {
  readonly success: boolean;
  readonly error?: string;
}

@Injectable({ providedIn: 'root' })
export class ApproveTaskHandler {
  private readonly publishEvent = inject(PublishEventHandler);

  /**
   * Execute use case: Approve task
   */
  async execute(request: ApproveTaskRequest): Promise<ApproveTaskResponse> {
    try {
      // Create domain event
      const event = createAcceptanceApprovedEvent(
        request.taskId,
        request.workspaceId,
        request.taskTitle,
        request.approverId,
        request.approvalNotes,
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


