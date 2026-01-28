import { CalendarEventAggregate } from '../calendar/aggregates/calendar-event.aggregate';

/**
 * Calendar Repository Interface
 * 
 * Defined in Domain (per existing project pattern), implemented in Infrastructure.
 */
export abstract class CalendarRepository {
    abstract findByWorkspaceId(workspaceId: string): Promise<CalendarEventAggregate[]>;
    abstract findById(id: string): Promise<CalendarEventAggregate | null>;
    abstract save(event: CalendarEventAggregate): Promise<void>;
    abstract delete(id: string): Promise<void>;
}
