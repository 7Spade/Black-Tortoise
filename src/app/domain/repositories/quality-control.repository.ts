/**
 * QualityControl Repository Interface
 *
 * Layer: Domain - Repositories
 * Purpose: Define contract for QC persistence
 */

import { QCCheckEntity } from '../aggregates';

export interface QualityControlRepository {
  findById(id: string): Promise<QCCheckEntity | null>;
  findByTaskId(taskId: string): Promise<QCCheckEntity | null>;
  findHistoryByTaskId(taskId: string): Promise<ReadonlyArray<QCCheckEntity>>;
  save(entity: QCCheckEntity): Promise<void>;
}
