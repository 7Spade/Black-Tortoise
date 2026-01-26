/**
 * Pass QC Use Case
 * 
 * Layer: Application - Use Case
 * Purpose: Execute quality control approval workflow
 * 
 * Responsibilities:
 * - Create QCPassedEvent
 * - Publish via PublishEventUseCase (append ??publish)
 * - Returns success/failure
 */

import { inject, Injectable } from '@angular/core';
import { PublishEventUseCase } from '@application/events/use-cases/publish-event.use-case';
import { createQCPassedEvent } from '@domain/modules/quality-control/events/qc-passed.event';

export interface PassQCRequest {
  readonly taskId: string;
  readonly workspaceId: string;
  readonly taskTitle: string;
  readonly reviewedBy: string;
  readonly reviewNotes?: string;
  readonly correlationId?: string;
  readonly causationId?: string | null;
}

export interface PassQCResponse {
  readonly success: boolean;
  readonly error?: string;
}

@Injectable({ providedIn: 'root' })
export class PassQCUseCase {
  private readonly publishEvent = inject(PublishEventUseCase);

  async execute(request: PassQCRequest): Promise<PassQCResponse> {
    try {
      const event = createQCPassedEvent(
        request.taskId,
        request.workspaceId,
        request.taskTitle,
        request.reviewedBy,
        request.reviewNotes,
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


