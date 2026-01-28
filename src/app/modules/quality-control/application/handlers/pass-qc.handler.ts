/**
 * Pass QC Use Case
 * 
 * Layer: Application - Use Case
 * Purpose: Execute quality control approval workflow
 * 
 * Responsibilities:
 * - Create QCPassedEvent
 * - Publish via PublishEventHandler (append ??publish)
 * - Returns success/failure
 */

import { inject, Injectable } from '@angular/core';
import { PublishEventHandler } from '@application/handlers/publish-event.handler';
import { createQCPassedEvent } from '@events';

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
  private readonly publishEvent = inject(PublishEventHandler);

  async execute(request: PassQCRequest): Promise<PassQCResponse> {
    try {
      const event = createQCPassedEvent(
        {
          taskId: request.taskId,
          qcId: crypto.randomUUID(), // Assuming a new QC record ID is needed
          notes: request.reviewNotes,
        },
        request.correlationId || crypto.randomUUID(),
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


