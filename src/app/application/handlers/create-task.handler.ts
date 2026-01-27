/**
 * Create Task Use Case
 *
 * Layer: Application - Use Case
 * Purpose: Execute task creation workflow
 *
 * Responsibilities:
 * - Create Domain Entity (Factory)
 * - Persist to Repository (Command Side)
 * - Create TaskCreatedEvent
 * - Publish via PublishEventHandler (append ??publish)
 * - Returns success/failure
 *
 * DDD Pattern: Application Service
 */

import { inject, Injectable } from '@angular/core';
import { PublishEventHandler } from '@application/handlers/publish-event.handler';
import { TASK_REPOSITORY } from '@application/interfaces';
import { createTask, TaskPriority } from '@domain/aggregates';
import { createTaskCreatedEvent } from '@domain/events';

export interface CreateTaskRequest {
  readonly taskId: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly description: string;
  readonly priority: TaskPriority;
  readonly createdById: string;
  readonly correlationId?: string;
  readonly causationId?: string | null;
}

export interface CreateTaskResponse {
  readonly success: boolean;
  readonly error?: string;
}

@Injectable({ providedIn: 'root' })
export class CreateTaskHandler {
  private readonly publishEvent = inject(PublishEventHandler);
  private readonly repository = inject(TASK_REPOSITORY);

  async execute(request: CreateTaskRequest): Promise<CreateTaskResponse> {
    try {
      // 1. Create Domain Entity
      const task = createTask({
        id: request.taskId,
        workspaceId: request.workspaceId,
        title: request.title,
        description: request.description,
        createdById: request.createdById,
        priority: request.priority,
      });

      // 2. Persist to Repository (Command Side)
      await this.repository.save(task);

      // 3. Create Event
      const event = createTaskCreatedEvent(
        task.id,
        task.workspaceId,
        task.title,
        task.description,
        task.priority,
        task.createdById,
        request.correlationId,
        request.causationId,
      );

      // 4. Publish Event
      await this.publishEvent.execute({ event });

      return { success: true };
    } catch (error: any) {
      console.error('[CreateTaskHandler] Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
