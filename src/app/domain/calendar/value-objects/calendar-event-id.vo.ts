import { v4 as uuidv4 } from 'uuid';

/**
 * Calendar Event ID Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export class CalendarEventId {
    constructor(public readonly value: string) {
        if (!value) {
            throw new Error('CalendarEventId cannot be empty');
        }
    }

    public static generate(): CalendarEventId {
        return new CalendarEventId(uuidv4());
    }

    public static create(value: string): CalendarEventId {
        return new CalendarEventId(value);
    }

    public equals(other: CalendarEventId): boolean {
        return this.value === other.value;
    }
}
