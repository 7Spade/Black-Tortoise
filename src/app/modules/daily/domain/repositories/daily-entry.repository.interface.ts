
import { DailyEntryAggregate } from '@daily/domain/aggregates/daily-entry.aggregate';
import { DailyEntryId } from '@daily/domain/value-objects/daily-entry-id.vo';
import { InjectionToken } from '@angular/core';

export interface DailyEntryRepository {
    findById(id: DailyEntryId): Promise<DailyEntryAggregate | null>;
    save(dailyEntry: DailyEntryAggregate): Promise<void>;
    delete(id: DailyEntryId): Promise<void>;
    findByUserAndDate(userId: string, date: string): Promise<DailyEntryAggregate[]>;
    findByWorkspace(workspaceId: string): Promise<DailyEntryAggregate[]>;
}

export const DAILY_ENTRY_REPOSITORY = new InjectionToken<DailyEntryRepository>('DAILY_ENTRY_REPOSITORY');
