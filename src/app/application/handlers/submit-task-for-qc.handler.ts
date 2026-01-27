import { Injectable, inject } from '@angular/core';
import { PublishEventHandler } from '@application/handlers/publish-event.handler';
import { TASK_REPOSITORY } from '@application/interfaces';
import { TaskStatus, updateTaskStatus } from '@domain/aggregates';
import { createTaskSubmittedForQCEvent } from '@domain/events';
import { TaskId } from '@domain/value-objects';

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
  private readonly repo = inject(TASK_REPOSITORY);
  private readonly publishEvent = inject(PublishEventHandler);

  async execute(
    request: SubmitTaskForQCRequest,
  ): Promise<SubmitTaskForQCResponse> {
    try {
      // 1. Load
      const task = await this.repo.findById(TaskId.create(request.taskId));
      if (!task) {
        throw new Error(`Task not found: ${request.taskId}`);
      }

      // 2. Logic
      const updatedTask = updateTaskStatus(task, TaskStatus.IN_QC);

      // 3. Save
      await this.repo.save(updatedTask);

      // 4. Publish
      const event = createTaskSubmittedForQCEvent(
        updatedTask.id,
        updatedTask.workspaceId,
        updatedTask.title,
        request.submittedBy,
        request.correlationId,
        request.causationId,
      );

      await this.publishEvent.execute({ event });
      return { success: true };
    } catch (error) {
      console.error('[SubmitTaskForQCHandler] Failed', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
