
import { QCCheckEntity } from '../aggregates';

export interface QualityControlRepository {
  findByTaskId(taskId: string): Promise<QCCheckEntity | null>;
  save(entity: QCCheckEntity): Promise<void>;
}
