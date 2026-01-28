
import { TaskAggregate } from '@tasks/domain/aggregates/task.aggregate';
import { TaskId } from '@tasks/domain/value-objects/task-id.vo';
import { WorkspaceId, UserId } from '@domain/value-objects';

export interface TaskRepository {
    findById(id: TaskId): Promise<TaskAggregate | null>;
    save(task: TaskAggregate): Promise<void>;
    delete(id: TaskId): Promise<void>;
    findByWorkspace(workspaceId: WorkspaceId): Promise<TaskAggregate[]>;
    findByAssignee(assigneeId: UserId): Promise<TaskAggregate[]>;
}
