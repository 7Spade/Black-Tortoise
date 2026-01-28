import { AggregateRoot } from '@domain/base/aggregate-root';
import { IssueId } from '../value-objects/issue-id.vo';
import { IssueStatus } from '../value-objects/issue-status.vo';
import { IssueType } from '../value-objects/issue-type.vo';
import { IssuePriority } from '../value-objects/issue-priority.vo';
import { TaskId } from '@domain/value-objects/task-id.vo';
import { UserId } from '@domain/value-objects/user-id.vo';

/**
 * Issue Aggregate
 * 
 * Represents a defect or issue found during QC or operations.
 */
export interface IssueProps {
    title: string;
    description: string;
    status: IssueStatus;
    type: IssueType;
    priority: IssuePriority;
    relatedTaskId: TaskId | null;
    reporterId: UserId;
    assigneeId: UserId | null;
}

export class IssueAggregate extends AggregateRoot<IssueId> {
    public title: string;
    public description: string;
    public status: IssueStatus;
    public type: IssueType;
    public priority: IssuePriority;
    public readonly relatedTaskId: TaskId | null;
    public readonly reporterId: UserId;
    public assigneeId: UserId | null;

    private constructor(
        id: IssueId,
        props: IssueProps
    ) {
        super(id);
        this.title = props.title;
        this.description = props.description;
        this.status = props.status;
        this.type = props.type;
        this.priority = props.priority;
        this.relatedTaskId = props.relatedTaskId;
        this.reporterId = props.reporterId;
        this.assigneeId = props.assigneeId;
    }

    public static create(
        id: IssueId,
        props: Omit<IssueProps, 'status' | 'assigneeId'>
    ): IssueAggregate {
        return new IssueAggregate(
            id,
            {
                ...props,
                status: IssueStatus.open(),
                assigneeId: null
            }
        );
    }
}
