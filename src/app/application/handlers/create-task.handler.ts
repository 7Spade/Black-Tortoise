/**
 * Create Task Use Case
 * 
 * Layer: Application - Use Case
 * Purpose: Execute task creation workflow
 * 
 * Responsibilities:
 * - Create TaskCreatedEvent
 * - Publish via PublishEventHandler (append ??publish)
 * - Returns success/failure
 * 
 * DDD Pattern: Application Service
 * Event Flow: create ??append(EventStore) ??publish(EventBus) ??react
 */

import { inject, Injectable } from '@angular/core';
import { PublishEventHandler } from '@application/handlers/publish-event.handler';
import { TaskPriority } from '@domain/aggregates';
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

  async execute(request: CreateTaskRequest): Promise<CreateTaskResponse> {
    try {
      const event = createTaskCreatedEvent(
        request.taskId,
        request.workspaceId,
        request.title,
        request.description,
        request.priority,
        request.createdById,
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



