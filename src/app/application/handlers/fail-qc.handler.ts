import { Injectable, inject } from '@angular/core';
import { PublishEventHandler } from '@application/handlers/publish-event.handler';
import { TASK_REPOSITORY } from '@application/interfaces';
import { TaskStatus, updateTaskStatus } from '@domain/aggregates';
import { createQCFailedEvent } from '@eventing/domain/events';
import { TaskId } from '@domain/value-objects';

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
export class FailQCHandler {
  private readonly repo = inject(TASK_REPOSITORY);
  private readonly publishEvent = inject(PublishEventHandler);

  async execute(request: FailQCRequest): Promise<FailQCResponse> {
    try {
      // 1. Load
      const task = await this.repo.findById(TaskId.create(request.taskId));
      if (!task) {
        throw new Error(`Task not found: ${request.taskId}`);
      }

      // 2. Logic (Update Status)
      const updatedTask = updateTaskStatus(task, TaskStatus.QC_FAILED);

      // 3. Save
      await this.repo.save(updatedTask);

      // 4. Publish Event
      const event = createQCFailedEvent(
        updatedTask.id,
        updatedTask.workspaceId,
        updatedTask.title,
        request.failureReason,
        request.reviewedBy,
        request.correlationId,
        request.causationId,
      );

      await this.publishEvent.execute({ event });
      return { success: true };
    } catch (error) {
      console.error('[FailQCHandler] Failed', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
