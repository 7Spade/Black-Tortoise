/**
 * Create Daily Entry Use Case
 * 
 * Layer: Application - Use Case
 * Purpose: Execute daily log entry creation workflow with comprehensive validation
 * 
 * Responsibilities:
 * - Validate business rules (policies)
 * - Create DailyEntryCreatedEvent
 * - Publish via PublishEventHandler (append → publish)
 * - Returns success/failure
 * 
 * Business Rules Enforced:
 * - Max 1.0 man-day per person per day (WorkHourPolicy)
 * - No logging on completed tasks (TaskCompletionPolicy)
 * - 30-day modification window (HistoricalEntryPolicy)
 */

import { inject, Injectable } from '@angular/core';
import { PublishEventHandler } from '@application/handlers/publish-event.handler';
import { TaskContextProvider } from '@application/providers/task-context.provider';
import { DailyStore } from '@application/stores/daily.store';
import { createDailyEntryCreatedEvent } from '@domain/events';
import { WorkHourPolicy } from '@domain/policies/work-hour.policy';
import { TaskCompletionPolicy } from '@domain/policies/task-completion.policy';
import { HistoricalEntryPolicy } from '@domain/policies/historical-entry.policy';

export interface CreateDailyEntryRequest {
  readonly entryId: string;
  readonly workspaceId: string;
  readonly date: string;
  readonly userId: string;
  readonly taskIds: string[];
  readonly headcount: number;
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
  private readonly taskContext = inject(TaskContextProvider);
  private readonly dailyStore = inject(DailyStore);

  async execute(request: CreateDailyEntryRequest): Promise<CreateDailyEntryResponse> {
    try {
      // Validate: Historical Entry Policy (30-day window)
      HistoricalEntryPolicy.assertIsValid(request.date);

      // Validate: Work Hour Policy (max 1.0 man-day per day)
      const existingEntries = this.dailyStore.entries().map(e => ({
        date: e.date,
        userId: e.userId,
        headcount: e.headcount,
      }));
      WorkHourPolicy.assertIsValid(
        request.headcount,
        request.userId,
        request.date,
        existingEntries
      );

      // Validate: Task Completion Policy (no completed tasks)
      for (const taskId of request.taskIds) {
        const taskStatus = this.taskContext.getTaskStatus(taskId);
        if (taskStatus) {
          TaskCompletionPolicy.assertIsValid(taskId, taskStatus);
        }
      }

      // Create and publish event
      const event = createDailyEntryCreatedEvent(
        request.entryId,
        request.workspaceId,
        request.date,
        request.userId,
        request.taskIds,
        request.headcount,
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


