/**
 * Date Range Value Object
 * 
 * Represents a start date and an end date.
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export class DateRange {
    constructor(
        public readonly start: Date,
        public readonly end: Date
    ) {
        if (start.getTime() > end.getTime()) {
            throw new Error('Start date cannot be after end date');
        }
    }

    public static create(start: Date, end: Date): DateRange {
        return new DateRange(start, end);
    }

    public contains(date: Date): boolean {
        const time = date.getTime();
        return time >= this.start.getTime() && time <= this.end.getTime();
    }

    public equals(other: DateRange): boolean {
        return this.start.getTime() === other.start.getTime() &&
            this.end.getTime() === other.end.getTime();
    }
}
