/**
 * ManDay Value Object
 * 
 * Represents a unit of work effort (Man-Day).
 * Precision is usually up to 1 decimal place (e.g., 0.5 days).
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export class ManDay {
    constructor(public readonly value: number) {
        if (value < 0) {
            throw new Error('ManDay cannot be negative');
        }
    }

    public static create(value: number): ManDay {
        return new ManDay(value);
    }

    public static zero(): ManDay {
        return new ManDay(0);
    }

    public add(other: ManDay): ManDay {
        return new ManDay(this.value + other.value);
    }

    public subtract(other: ManDay): ManDay {
        // Decision: Should we allow negative result? 
        // Usually working hours sum shouldn't be negative, but let's just create it and validate < 0 in constructor if needed.
        // However, the constructor throws if < 0. So this will fail if result is negative.
        return new ManDay(this.value - other.value);
    }

    public equals(other: ManDay): boolean {
        return this.value === other.value;
    }
}
