import { DomainEvent } from '../domain-event.interface';

export const DAILY_SOURCE = 'Daily';

export class DailyEntryCreated implements DomainEvent<{ entryId: string; taskId: string; content: string; date: string }> {
    readonly type = 'Daily.DailyEntryCreated';
    readonly source = DAILY_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { entryId: string; taskId: string; content: string; date: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.entryId;
    }
}
// Helpers for backward compatibility
export function createDailyEntryCreatedEvent(payload: { entryId: string; userId: string; content: string }, correlationId: string, causationId?: string | null): DailyEntryCreated {
    return new DailyEntryCreated(payload, correlationId, causationId ?? undefined);
}
export class DailyEntryUpdated implements DomainEvent<{ entryId: string; content: string }> {
    readonly type = 'Daily.DailyEntryUpdated';
    readonly source = DAILY_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { entryId: string; content: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.entryId;
    }
}
