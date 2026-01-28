import { DomainEvent } from '../domain-event.interface';

export const CALENDAR_SOURCE = 'Calendar';

export class CalendarEventCreated implements DomainEvent<{ eventId: string; title: string; start: Date; end: Date; ownerId: string }> {
  readonly type = 'Calendar.CalendarEventCreated';
  readonly source = CALENDAR_SOURCE;
  readonly id = crypto.randomUUID();
  readonly timestamp = Date.now();

  constructor(
    public readonly payload: { eventId: string; title: string; start: Date; end: Date; ownerId: string },
    public readonly correlationId: string,
    public readonly causationId: string | undefined
  ) {}
}

export class CalendarEventUpdated implements DomainEvent<{ eventId: string; changes: Record<string, any> }> {
  readonly type = 'Calendar.CalendarEventUpdated';
  readonly source = CALENDAR_SOURCE;
  readonly id = crypto.randomUUID();
  readonly timestamp = Date.now();

  constructor(
    public readonly payload: { eventId: string; changes: Record<string, any> },
    public readonly correlationId: string,
    public readonly causationId: string | undefined
  ) {}
}

export class CalendarEventDeleted implements DomainEvent<{ eventId: string }> {
  readonly type = 'Calendar.CalendarEventDeleted';
  readonly source = CALENDAR_SOURCE;
  readonly id = crypto.randomUUID();
  readonly timestamp = Date.now();

  constructor(
    public readonly payload: { eventId: string },
    public readonly correlationId: string,
    public readonly causationId: string | undefined
  ) {}
}
