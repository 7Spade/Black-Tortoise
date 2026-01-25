/**
 * Create Issue Use Case
 * 
 * Layer: Application - Use Case
 * Purpose: Execute issue creation workflow
 * 
 * Responsibilities:
 * - Create IssueCreatedEvent
 * - Publish via PublishEventUseCase (append → publish)
 * - Returns success/failure
 */

import { inject, Injectable } from '@angular/core';
import { createIssueCreatedEvent } from '@domain/events/domain-events';
import { PublishEventUseCase } from '@application/events/use-cases/publish-event.use-case';

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
export class CreateIssueUseCase {
  private readonly publishEvent = inject(PublishEventUseCase);

  async execute(request: CreateIssueRequest): Promise<CreateIssueResponse> {
    try {
      const event = createIssueCreatedEvent(
        request.issueId,
        request.taskId,
        request.workspaceId,
        request.title,
        request.description,
        request.createdBy,
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
