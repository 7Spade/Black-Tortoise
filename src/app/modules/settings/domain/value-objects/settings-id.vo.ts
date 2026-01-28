import { v4 as uuidv4 } from 'uuid';

/**
 * Settings ID Value Object
 * 
 * Uniquely identifies a settings configuration (usually per workspace or user).
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export class SettingsId {
    constructor(public readonly value: string) {
        if (!value) {
            throw new Error('SettingsId cannot be empty');
        }
    }

    public static generate(): SettingsId {
        return new SettingsId(uuidv4());
    }

    public static create(value: string): SettingsId {
        return new SettingsId(value);
    }

    public equals(other: SettingsId): boolean {
        return this.value === other.value;
    }
}
