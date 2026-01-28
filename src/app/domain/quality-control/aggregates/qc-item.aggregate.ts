import { AggregateRoot } from '@domain/base/aggregate-root';
import { QcItemId } from '../value-objects/qc-item-id.vo';
import { QcStatus } from '../value-objects/qc-status.vo';
import { QcResult } from '../value-objects/qc-result.vo';
import { QcChecklistItem } from '../entities/qc-checklist-item.entity';
import { TaskId } from '@domain/value-objects/task-id.vo';
import { UserId } from '@domain/value-objects/user-id.vo';

/**
 * QC Item Aggregate
 * 
 * Represents a quality control verification process for a task.
 */
export interface QcItemProps {
    taskId: TaskId;
    status: QcStatus;
    result: QcResult | null;
    assigneeId: UserId | null;
}

export class QcItemAggregate extends AggregateRoot<QcItemId> {
    private _checklist: QcChecklistItem[] = [];

    public readonly taskId: TaskId;
    public status: QcStatus;
    public result: QcResult | null;
    public readonly assigneeId: UserId | null;

    private constructor(
        id: QcItemId,
        props: QcItemProps
    ) {
        super(id);
        this.taskId = props.taskId;
        this.status = props.status;
        this.result = props.result;
        this.assigneeId = props.assigneeId;
    }

    public static create(id: QcItemId, taskId: TaskId): QcItemAggregate {
        return new QcItemAggregate(
            id,
            {
                taskId,
                status: QcStatus.pending(),
                result: null,
                assigneeId: null
            }
        );
    }

    public addChecklistItem(item: QcChecklistItem): void {
        this._checklist.push(item);
    }

    public get checklist(): ReadonlyArray<QcChecklistItem> {
        return [...this._checklist];
    }
}
