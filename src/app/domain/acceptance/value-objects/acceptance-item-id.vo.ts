import { v4 as uuidv4 } from 'uuid';

/**
 * Acceptance Item ID Value Object
 * 
 * Identity for an Acceptance Item.
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export class AcceptanceItemId {
    constructor(public readonly value: string) {
        if (!value) {
            throw new Error('AcceptanceItemId cannot be empty');
        }
    }

    public static generate(): AcceptanceItemId {
        return new AcceptanceItemId(uuidv4());
    }

    public static create(value: string): AcceptanceItemId {
        return new AcceptanceItemId(value);
    }

    public equals(other: AcceptanceItemId): boolean {
        return this.value === other.value;
    }
}
