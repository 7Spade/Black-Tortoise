
import { DailyEntryEntity } from '../aggregates';

export interface DailyRepository {
  findById(id: string): Promise<DailyEntryEntity | null>;
  findByUserAndDate(userId: string, date: string): Promise<DailyEntryEntity | null>;
  save(entry: DailyEntryEntity): Promise<void>;
}
