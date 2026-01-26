
import { AcceptanceCheckEntity } from '../aggregates';

export interface AcceptanceRepository {
  findByTaskId(taskId: string): Promise<AcceptanceCheckEntity | null>;
  save(entity: AcceptanceCheckEntity): Promise<void>;
}
