/**
 * Event Type Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export enum CalendarEventTypeEnum {
    TASK_DUE = 'TASK_DUE',
    DAILY_ENTRY = 'DAILY_ENTRY',
    MEETING = 'MEETING',
    HOLIDAY = 'HOLIDAY',
    REMINDER = 'REMINDER'
}

export class CalendarEventType {
    constructor(public readonly value: CalendarEventTypeEnum) { }

    public static taskDue(): CalendarEventType {
        return new CalendarEventType(CalendarEventTypeEnum.TASK_DUE);
    }

    public static create(value: CalendarEventTypeEnum): CalendarEventType {
        return new CalendarEventType(value);
    }

    public equals(other: CalendarEventType): boolean {
        return this.value === other.value;
    }
}
