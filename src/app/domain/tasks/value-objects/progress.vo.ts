/**
 * Progress Value Object
 * 
 * Represents the completion percentage of a task.
 * Value must be between 0 and 100.
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export class Progress {
    constructor(public readonly value: number) {
        if (value < 0 || value > 100) {
            throw new Error('Progress must be between 0 and 100');
        }
    }

    public static zero(): Progress {
        return new Progress(0);
    }

    public static complete(): Progress {
        return new Progress(100);
    }

    public static create(value: number): Progress {
        return new Progress(value);
    }

    public isComplete(): boolean {
        return this.value === 100;
    }

    public equals(other: Progress): boolean {
        return this.value === other.value;
    }
}
