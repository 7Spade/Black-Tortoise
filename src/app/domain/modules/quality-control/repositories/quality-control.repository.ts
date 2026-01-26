
import { QCCheckEntity } from '../aggregates/quality-control.aggregate';

export interface QualityControlRepository {
  findByTaskId(taskId: string): Promise<QCCheckEntity | null>;
  save(entity: QCCheckEntity): Promise<void>;
}
