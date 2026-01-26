/**
 * CausationId Value Object
 * 
 * Layer: Domain
 * Purpose: Used for tracking the direct cause of an event (Causality Tracking).
 * Represents the ID of the command/event that *directly caused* this event.
 */

export class CausationId {
    constructor(private readonly value: string) {
        if (!value) {
            throw new Error('CausationId cannot be empty');
        }
    }

    static create(id: string): CausationId {
        return new CausationId(id);
    }

    static generate(): CausationId {
        return new CausationId(crypto.randomUUID());
    }

    toString(): string {
        return this.value;
    }

    equals(other: CausationId): boolean {
        return this.value === other.value;
    }
}
