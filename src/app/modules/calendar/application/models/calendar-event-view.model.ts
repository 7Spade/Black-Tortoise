/**
 * Calendar Event View Model
 * 
 * Flattened/Simplified model for UI consumption.
 */
export interface CalendarEventViewModel {
    id: string;
    title: string;
    description: string;
    start: Date;
    end: Date;
    isAllDay: boolean;
}
