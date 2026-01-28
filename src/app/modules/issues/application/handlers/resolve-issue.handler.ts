import { Injectable, inject } from '@angular/core';
import { PublishEventHandler } from '@application/handlers/publish-event.handler';
import { ISSUE_REPOSITORY } from '@application/interfaces';
import { resolveIssue } from '@domain/aggregates/issue.aggregate';
import { createIssueResolvedEvent } from '@events';

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
export class ResolveIssueHandler {
  private readonly repo = inject(ISSUE_REPOSITORY);
  private readonly publishEvent = inject(PublishEventHandler);

  async execute(request: ResolveIssueRequest): Promise<ResolveIssueResponse> {
    try {
      // 1. Load
      const issue = await this.repo.findById(request.issueId);
      if (!issue) {
        throw new Error(`Issue not found: ${request.issueId}`);
      }

      // 2. Logic
      const resolvedIssue = resolveIssue(issue);

      // 3. Save
      await this.repo.save(resolvedIssue);

      // 4. Publish
      const event = createIssueResolvedEvent(
        resolvedIssue.id,
        resolvedIssue.taskId || '',
        typeof resolvedIssue.workspaceId === 'string'
          ? resolvedIssue.workspaceId
          : resolvedIssue.workspaceId.getValue(), // Handle VO or string
        request.resolvedBy,
        request.resolution,
        request.correlationId,
        request.causationId,
      );

      await this.publishEvent.execute({ event });
      return { success: true };
    } catch (error) {
      console.error('[ResolveIssueHandler] Failed', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
