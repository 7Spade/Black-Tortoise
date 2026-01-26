/**
 * Fail QC Use Case
 * 
 * Layer: Application - Use Case
 * Purpose: Execute quality control failure workflow
 * 
 * Responsibilities:
 * - Create QCFailedEvent
 * - Publish via PublishEventUseCase (append ??publish)
 * - Returns success/failure
 */

import { inject, Injectable } from '@angular/core';
import { PublishEventUseCase } from '@application/events/use-cases/publish-event.use-case';
import { createQCFailedEvent } from '@domain/modules/quality-control/events/qc-failed.event';

export interface FailQCRequest {
  readonly taskId: string;
  readonly workspaceId: string;
  readonly taskTitle: string;
  readonly failureReason: string;
  readonly reviewedBy: string;
  readonly correlationId?: string;
  readonly causationId?: string | null;
}

export interface FailQCResponse {
  readonly success: boolean;
  readonly error?: string;
}

@Injectable({ providedIn: 'root' })
export class FailQCUseCase {
  private readonly publishEvent = inject(PublishEventUseCase);

  async execute(request: FailQCRequest): Promise<FailQCResponse> {
    try {
      const event = createQCFailedEvent(
        request.taskId,
        request.workspaceId,
        request.taskTitle,
        request.failureReason,
        request.reviewedBy,
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


