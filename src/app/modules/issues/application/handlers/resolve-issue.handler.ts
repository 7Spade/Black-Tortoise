import { Injectable, inject } from '@angular/core';
import { PublishEventHandler } from '@application/handlers/publish-event.handler';
import { ISSUE_REPOSITORY } from '@application/interfaces';
import { IssueId } from '@issues/domain/value-objects/issue-id.vo';
import { IssueResolved } from '@events';

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
      const issueId = new IssueId(request.issueId);
      const issue = await this.repo.findById(issueId);
      if (!issue) {
        throw new Error(`Issue not found: ${request.issueId}`);
      }

      // 2. Logic (TODO: Move to Aggregate method)
      // issue.resolve(request.resolvedBy); 

      // 3. Save
      await this.repo.save(issue);

      // 4. Publish
      const event = new IssueResolved(
        {
          issueId: request.issueId,
          resolverId: request.resolvedBy,
          resolution: request.resolution
        },
        request.correlationId || crypto.randomUUID(),
        request.causationId || undefined
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
