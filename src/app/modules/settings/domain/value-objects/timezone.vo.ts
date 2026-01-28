/**
 * Timezone Value Object
 * 
 * Represents a timezone setting (e.g., 'UTC', 'Asia/Taipei').
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export class Timezone {
    constructor(public readonly value: string) {
        // Validation could verify against IANA timezone list
        if (!value) {
            throw new Error('Timezone cannot be empty');
        }
    }

    public static utc(): Timezone {
        return new Timezone('UTC');
    }

    public static create(value: string): Timezone {
        return new Timezone(value);
    }

    public equals(other: Timezone): boolean {
        return this.value === other.value;
    }
}
