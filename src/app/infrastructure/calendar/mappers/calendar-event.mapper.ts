import { ActionDate } from '@domain/value-objects/action-date.vo';
import { CalendarEventDto } from '../models/calendar-event.dto';
import { CalendarEventAggregate } from '@domain/calendar/aggregates/calendar-event.aggregate';
import { Timestamp } from '@angular/fire/firestore';

/**
 * Calendar Event Mapper
 * 
 * Transforms between Domain Aggregate and Infrastructure DTO.
 */
export class CalendarEventMapper {
    static toDomain(dto: CalendarEventDto): CalendarEventAggregate {
        // Converting Firestore Timestamp to logic handled in Domain or via simple Date check
        // Assuming ActionDate can be constructed from Date
        
        return CalendarEventAggregate.reconstitute(
            dto.id,
            dto.workspaceId,
            dto.title,
            {
                start: dto.startDate.toDate(),
                end: dto.endDate.toDate()
            },
            dto.description,
            dto.isAllDay,
            dto.createdAt.toDate(),
            dto.updatedAt.toDate()
        );
    }

    static toDto(domain: CalendarEventAggregate): CalendarEventDto {
        return {
            id: domain.id,
            workspaceId: domain.workspaceId,
            title: domain.title,
            description: domain.description,
            startDate: Timestamp.fromDate(domain.period.start),
            endDate: Timestamp.fromDate(domain.period.end),
            isAllDay: domain.isAllDay,
            createdAt: Timestamp.fromDate(domain.createdAt),
            updatedAt: Timestamp.fromDate(domain.updatedAt)
        };
    }
}
