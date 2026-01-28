/**
 * WorkDate Value Object
 * 
 * Represents a specific date of work, ensuring no time component or timezone issues affecting the "Day".
 * Format: YYYY-MM-DD
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export class WorkDate {
    private readonly _dateString: string;

    constructor(dateOrString: Date | string) {
        if (dateOrString instanceof Date) {
            this._dateString = this.formatDate(dateOrString);
        } else {
            if (!this.isValidDateString(dateOrString)) {
                throw new Error('Invalid date format. Expected YYYY-MM-DD');
            }
            this._dateString = dateOrString;
        }
    }

    public get value(): string {
        return this._dateString;
    }

    public static create(dateOrString: Date | string): WorkDate {
        return new WorkDate(dateOrString);
    }

    public static today(): WorkDate {
        return new WorkDate(new Date());
    }

    public equals(other: WorkDate): boolean {
        return this._dateString === other.value;
    }

    public toDate(): Date {
        return new Date(this._dateString);
    }

    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    private isValidDateString(dateString: string): boolean {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateString)) return false;

        const date = new Date(dateString);
        return !isNaN(date.getTime());
    }
}
