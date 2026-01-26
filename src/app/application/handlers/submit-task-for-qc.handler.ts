/**
 * Submit Task for QC Use Case
 * 
 * Layer: Application - Use Case
 * Purpose: Execute task submission for quality control
 * 
 * Responsibilities:
 * - Create TaskSubmittedForQCEvent
 * - Publish via PublishEventHandler (append ??publish)
 * - Returns success/failure
 */

import { inject, Injectable } from '@angular/core';
import { PublishEventHandler } from '@application/handlers/publish-event.handler';
import { createTaskSubmittedForQCEvent } from '@domain/modules/tasks/events/task-submitted-for-qc.event';

export interface SubmitTaskForQCRequest {
  readonly taskId: string;
  readonly workspaceId: string;
  readonly taskTitle: string;
  readonly submittedBy: string;
  readonly correlationId?: string;
  readonly causationId?: string | null;
}

export interface SubmitTaskForQCResponse {
  readonly success: boolean;
  readonly error?: string;
}

@Injectable({ providedIn: 'root' })
export class SubmitTaskForQCHandler {
  private readonly publishEvent = inject(PublishEventHandler);

  async execute(request: SubmitTaskForQCRequest): Promise<SubmitTaskForQCResponse> {
    try {
      const event = createTaskSubmittedForQCEvent(
        request.taskId,
        request.workspaceId,
        request.taskTitle,
        request.submittedBy,
        request.correlationId,
        request.causationId
      );

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


