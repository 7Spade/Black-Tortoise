import { AggregateRoot } from '@domain/base/aggregate-root';
import { DailyEntryId } from '@daily/domain/value-objects/daily-entry-id.vo';
import { WorkspaceId } from '@domain/value-objects/workspace-id.vo';
import { UserId } from '@domain/value-objects/user-id.vo';
import { WorkDate } from '@daily/domain/value-objects/work-date.vo';
import { ManDay } from '@daily/domain/value-objects/man-day.vo';

/**
 * Daily Entry Aggregate
 * 
 * Represents a single daily work log entry.
 */
export interface DailyEntryProps {
    workspaceId: WorkspaceId;
    userId: UserId;
    date: WorkDate;
    content: string;
    manDay: ManDay;
}

export class DailyEntryAggregate extends AggregateRoot<DailyEntryId> {
    public readonly workspaceId: WorkspaceId;
    public readonly userId: UserId;
    public readonly date: WorkDate;
    public content: string;
    public manDay: ManDay;

    private constructor(
        id: DailyEntryId,
        props: DailyEntryProps
    ) {
        super(id);
        this.workspaceId = props.workspaceId;
        this.userId = props.userId;
        this.date = props.date;
        this.content = props.content;
        this.manDay = props.manDay;
    }

    public static create(
        id: DailyEntryId,
        props: DailyEntryProps
    ): DailyEntryAggregate {
        return new DailyEntryAggregate(id, props);
    }
}
