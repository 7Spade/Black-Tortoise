/**
 * Reopen Issue Handler
 *
 * Layer: Application
 * DDD Pattern: Command Handler
 *
 * Handles the command to reopen an issue.
 */

import { inject, Injectable } from '@angular/core';
import { reopenIssue } from '@domain/aggregates';
import { createIssueReopenedEvent } from '@domain/events/issue-reopened.event';
import { ISSUE_REPOSITORY } from '../interfaces/issue-repository.token';
import { EventBus } from '@domain/types';
import { ReopenIssueCommand } from '../commands/reopen-issue.command';

@Injectable({ providedIn: 'root' })
export class ReopenIssueHandler {
  private readonly repository = inject(ISSUE_REPOSITORY);
  private readonly eventBus = inject(EventBus);

  async execute(command: ReopenIssueCommand): Promise<void> {
    const issue = await this.repository.findById(command.issueId);
    if (!issue) {
      throw new Error(`Issue ${command.issueId} not found`);
    }

    const reopenedIssue = reopenIssue(issue);
    await this.repository.save(reopenedIssue);

    const event = createIssueReopenedEvent(
      command.issueId,
      command.workspaceId,
      command.reopenedBy,
      reopenedIssue.taskId,
      command.reopenReason,
      command.correlationId,
      command.causationId
    );

    this.eventBus.publish(event);
  }
}
