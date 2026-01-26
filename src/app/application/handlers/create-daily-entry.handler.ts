/**
 * Create Daily Entry Use Case
 * 
 * Layer: Application - Use Case
 * Purpose: Execute daily log entry creation workflow
 * 
 * Responsibilities:
 * - Create DailyEntryCreatedEvent
 * - Publish via PublishEventHandler (append ??publish)
 * - Returns success/failure
 */

import { inject, Injectable } from '@angular/core';
import { PublishEventHandler } from '@application/handlers/publish-event.handler';
import { createDailyEntryCreatedEvent } from '@domain/events';

export interface CreateDailyEntryRequest {
  readonly entryId: string;
  readonly workspaceId: string;
  readonly date: string;
  readonly userId: string;
  readonly taskIds: string[];
  readonly hoursLogged: number;
  readonly notes?: string;
  readonly correlationId?: string;
  readonly causationId?: string | null;
}

export interface CreateDailyEntryResponse {
  readonly success: boolean;
  readonly error?: string;
}

@Injectable({ providedIn: 'root' })
export class CreateDailyEntryHandler {
  private readonly publishEvent = inject(PublishEventHandler);

  async execute(request: CreateDailyEntryRequest): Promise<CreateDailyEntryResponse> {
    try {
      const event = createDailyEntryCreatedEvent(
        request.entryId,
        request.workspaceId,
        request.date,
        request.userId,
        request.taskIds,
        request.hoursLogged,
        request.notes,
        request.correlationId
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


