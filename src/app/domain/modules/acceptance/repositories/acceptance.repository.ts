
import { AcceptanceCheckEntity } from '../aggregates/acceptance-check.aggregate';

export interface AcceptanceRepository {
  findByTaskId(taskId: string): Promise<AcceptanceCheckEntity | null>;
  save(entity: AcceptanceCheckEntity): Promise<void>;
}
