/**
 * Domain Event Base Interface (Account Context)
 * Kept minimal to avoid cross-layer dependencies.
 */

export interface DomainEvent<TPayload> {
    readonly eventId: string;
    readonly type: string;
    readonly aggregateId: string;
    readonly correlationId: string;
    readonly causationId: string | null;
    readonly timestamp: number;
    readonly payload: TPayload;
}
