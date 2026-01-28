/**
 * Locale Value Object
 * 
 * Represents a user's locale setting (e.g., 'en-US', 'zh-TW').
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export class Locale {
    constructor(public readonly value: string) {
        if (!this.isValid(value)) {
            throw new Error('Invalid locale format');
        }
    }

    public static default(): Locale {
        return new Locale('en-US');
    }

    public static create(value: string): Locale {
        return new Locale(value);
    }

    private isValid(value: string): boolean {
        // Simple regex for 'xx-XX' or 'xx' format
        return /^[a-z]{2}(-[A-Z]{2})?$/.test(value);
    }

    public equals(other: Locale): boolean {
        return this.value === other.value;
    }
}
