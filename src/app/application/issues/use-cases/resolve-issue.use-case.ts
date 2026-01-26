/**
 * Resolve Issue Use Case
 * 
 * Layer: Application - Use Case
 * Purpose: Execute issue resolution workflow
 * 
 * Responsibilities:
 * - Create IssueResolvedEvent
 * - Publish via PublishEventUseCase (append → publish)
 * - Returns success/failure
 */

import { inject, Injectable } from '@angular/core';
import { PublishEventUseCase } from '@application/events/use-cases/publish-event.use-case';
import { createIssueResolvedEvent } from '@domain/modules/issues/events/issue-resolved.event';

export interface ResolveIssueRequest {
  readonly issueId: string;
  readonly taskId: string;
  readonly workspaceId: string;
  readonly resolvedBy: string;
  readonly resolution: string;
  readonly correlationId?: string;
  readonly causationId?: string | null;
}

export interface ResolveIssueResponse {
  readonly success: boolean;
  readonly error?: string;
}

@Injectable({ providedIn: 'root' })
export class ResolveIssueUseCase {
  private readonly publishEvent = inject(PublishEventUseCase);

  async execute(request: ResolveIssueRequest): Promise<ResolveIssueResponse> {
    try {
      const event = createIssueResolvedEvent(
        request.issueId,
        request.taskId,
        request.workspaceId,
        request.resolvedBy,
        request.resolution,
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
