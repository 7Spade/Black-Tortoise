
import { CalendarEventAggregate } from '../aggregates/calendar-event.aggregate';
import { CalendarEventId } from '../value-objects/calendar-event-id.vo';
import { DateRange } from '../value-objects/date-range.vo';
import { InjectionToken } from '@angular/core';

export interface CalendarEventRepository {
    findById(id: CalendarEventId): Promise<CalendarEventAggregate | null>;
    save(event: CalendarEventAggregate): Promise<void>;
    delete(id: CalendarEventId): Promise<void>;
    findByDateRange(workspaceId: string, range: DateRange): Promise<CalendarEventAggregate[]>;
}

export const CALENDAR_EVENT_REPOSITORY = new InjectionToken<CalendarEventRepository>('CALENDAR_EVENT_REPOSITORY');
