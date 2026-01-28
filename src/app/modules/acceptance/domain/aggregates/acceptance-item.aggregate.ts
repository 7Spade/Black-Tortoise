import { AggregateRoot } from '@domain/base/aggregate-root';
import { AcceptanceItemId } from '@acceptance/domain/value-objects/acceptance-item-id.vo';
import { AcceptanceStatus } from '@acceptance/domain/value-objects/acceptance-status.vo';
import { AcceptanceResult } from '@acceptance/domain/value-objects/acceptance-result.vo';
import { AcceptanceCriteriaItem } from '@acceptance/domain/entities/acceptance-criteria-item.entity';
import { TaskId } from '@domain/value-objects/task-id.vo';

/**
 * Acceptance Item Aggregate
 * 
 * Represents the acceptance process for a task.
 */
export class AcceptanceItemAggregate extends AggregateRoot<AcceptanceItemId> {
    private _criteria: AcceptanceCriteriaItem[] = [];

    private constructor(
        id: AcceptanceItemId,
        public readonly taskId: TaskId,
        public status: AcceptanceStatus,
        public result: AcceptanceResult | null
    ) {
        super(id);
    }

    public static create(id: AcceptanceItemId, taskId: TaskId): AcceptanceItemAggregate {
        return new AcceptanceItemAggregate(
            id,
            taskId,
            AcceptanceStatus.pending(),
            null
        );
    }

    public addCriteria(item: AcceptanceCriteriaItem): void {
        this._criteria.push(item);
    }

    public get criteria(): ReadonlyArray<AcceptanceCriteriaItem> {
        return [...this._criteria];
    }
}
