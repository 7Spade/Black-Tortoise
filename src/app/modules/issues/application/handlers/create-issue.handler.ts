/**
 * Create Issue Use Case
 * 
 * Layer: Application - Use Case
 * Purpose: Execute issue creation workflow
 * 
 * Responsibilities:
 * - Create IssueCreatedEvent
 * - Publish via PublishEventHandler (append ??publish)
 * - Returns success/failure
 */

import { inject, Injectable } from '@angular/core';
import { PublishEventHandler } from '@application/handlers/publish-event.handler';
import { createIssueCreatedEvent } from '@events';

export interface CreateIssueRequest {
  readonly issueId: string;
  readonly taskId: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly description: string;
  readonly createdBy: string;
  readonly correlationId?: string;
  readonly causationId?: string | null;
}

export interface CreateIssueResponse {
  readonly success: boolean;
  readonly error?: string;
}

@Injectable({ providedIn: 'root' })
export class CreateIssueHandler {
  private readonly publishEvent = inject(PublishEventHandler);

  async execute(request: CreateIssueRequest): Promise<CreateIssueResponse> {
    try {
      const event = createIssueCreatedEvent({
        issueId: request.issueId,
        taskId: request.taskId,
        workspaceId: request.workspaceId,
        title: request.title,
        description: request.description,
        createdById: request.createdBy,
        correlationId: request.correlationId,
        causationId: request.causationId
      });

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


