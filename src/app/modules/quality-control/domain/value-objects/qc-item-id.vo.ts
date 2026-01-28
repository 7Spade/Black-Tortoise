import { v4 as uuidv4 } from 'uuid';

/**
 * QC Item ID Value Object
 * 
 * Identity for a Quality Control Item.
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export class QcItemId {
    constructor(public readonly value: string) {
        if (!value) {
            throw new Error('QcItemId cannot be empty');
        }
    }

    public static generate(): QcItemId {
        return new QcItemId(uuidv4());
    }

    public static create(value: string): QcItemId {
        return new QcItemId(value);
    }

    public equals(other: QcItemId): boolean {
        return this.value === other.value;
    }
}
