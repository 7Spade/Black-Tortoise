
import { AcceptanceCheckEntity } from '../aggregates';

export interface AcceptanceRepository {
  findByTaskId(taskId: string): Promise<AcceptanceCheckEntity | null>;
  findByWorkspaceId(workspaceId: string): Promise<AcceptanceCheckEntity[]>;
  save(entity: AcceptanceCheckEntity): Promise<void>;
}
