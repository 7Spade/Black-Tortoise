import { AggregateRoot } from '@domain/base/aggregate-root';
import { CalendarEventId } from '@calendar/domain/value-objects/calendar-event-id.vo';
import { DateRange } from '@calendar/domain/value-objects/date-range.vo';
import { WorkspaceId } from '@domain/value-objects/workspace-id.vo';
import { UserId } from '@domain/value-objects/user-id.vo';

/**
 * Calendar Event Aggregate
 * 
 * Represents an event on the calendar.
 */
export interface CalendarEventProps {
    title: string;
    period: DateRange;
    workspaceId: WorkspaceId;
    creatorId: UserId;
    description?: string;
    isAllDay: boolean;
}

export class CalendarEventAggregate extends AggregateRoot<CalendarEventId> {
    public title: string;
    public period: DateRange;
    public readonly workspaceId: WorkspaceId;
    public readonly creatorId: UserId;
    public description?: string;
    public isAllDay: boolean;

    private constructor(
        id: CalendarEventId,
        props: CalendarEventProps
    ) {
        super(id);
        this.title = props.title;
        this.period = props.period;
        this.workspaceId = props.workspaceId;
        this.creatorId = props.creatorId;
        this.description = props.description;
        this.isAllDay = props.isAllDay;
    }

    public static create(
        id: CalendarEventId,
        props: Omit<CalendarEventProps, 'description' | 'isAllDay'> & { description?: string, isAllDay?: boolean }
    ): CalendarEventAggregate {
        return new CalendarEventAggregate(
            id,
            {
                ...props,
                isAllDay: props.isAllDay ?? false
            }
        );
    }

    public reschedule(newPeriod: EventPeriod): void {
        this.period = newPeriod;
    }
}
