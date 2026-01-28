/**
 * Event Type Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export enum EventTypeEnum {
    TASK_DUE = 'TASK_DUE',
    DAILY_ENTRY = 'DAILY_ENTRY',
    MEETING = 'MEETING',
    HOLIDAY = 'HOLIDAY',
    REMINDER = 'REMINDER'
}

export class EventType {
    constructor(public readonly value: EventTypeEnum) { }

    public static taskDue(): EventType {
        return new EventType(EventTypeEnum.TASK_DUE);
    }

    public static create(value: EventTypeEnum): EventType {
        return new EventType(value);
    }

    public equals(other: EventType): boolean {
        return this.value === other.value;
    }
}
