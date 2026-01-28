
import { IssueAggregate } from '../aggregates/issue.aggregate';
import { IssueId } from '../value-objects/issue-id.vo';
import { InjectionToken } from '@angular/core';

export interface IssueRepository {
    findById(id: IssueId): Promise<IssueAggregate | null>;
    save(issue: IssueAggregate): Promise<void>;
    findByTaskId(taskId: string): Promise<IssueAggregate[]>;
    findByAssignee(userId: string): Promise<IssueAggregate[]>;
}

export const ISSUE_REPOSITORY = new InjectionToken<IssueRepository>('ISSUE_REPOSITORY');
