import { Timestamp } from '@angular/fire/firestore';

/**
 * Calendar Event DTO
 * 
 * Infrastructure representation of a calendar event for Firestore.
 */
export interface CalendarEventDto {
    id: string;
    workspaceId: string;
    title: string;
    description?: string;
    startDate: Timestamp;
    endDate: Timestamp;
    isAllDay: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
