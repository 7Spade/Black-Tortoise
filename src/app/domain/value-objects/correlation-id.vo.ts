/**
 * CorrelationId Value Object
 * 
 * Layer: Domain
 * Purpose: Used for tracking a chain of events/commands (Causality Tracking).
 * Represents the ID of the command/event that *started* the flow.
 */

export class CorrelationId {
    constructor(private readonly value: string) {
        if (!value) {
            throw new Error('CorrelationId cannot be empty');
        }
    }

    static create(id: string): CorrelationId {
        return new CorrelationId(id);
    }

    static generate(): CorrelationId {
        return new CorrelationId(crypto.randomUUID());
    }

    toString(): string {
        return this.value;
    }

    equals(other: CorrelationId): boolean {
        return this.value === other.value;
    }
}
