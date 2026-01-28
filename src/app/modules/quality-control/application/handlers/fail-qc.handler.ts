import { Injectable, inject } from '@angular/core';
import { PublishEventHandler } from '@application/handlers/publish-event.handler';
import { TASK_REPOSITORY } from '@tasks/domain';
import { TaskStatus, TaskId } from '@tasks/domain';
import { createQCFailedEvent } from '@events';

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
      const task = await this.repo.findById(new TaskId(request.taskId));
      if (!task) {
        throw new Error(`Task not found: ${request.taskId}`);
      }

      // 2. Logic (Update Status)
      const updatedTask = task.cloneWith({
        status: TaskStatus.qcFailed()
      });

      // 3. Save
      await this.repo.save(updatedTask);

      // 4. Publish Event
      const event = createQCFailedEvent(
        {
          taskId: updatedTask.id.value,
          qcId: crypto.randomUUID(),
          reasons: [request.failureReason],
        },
        request.correlationId || crypto.randomUUID(),
        request.causationId
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
