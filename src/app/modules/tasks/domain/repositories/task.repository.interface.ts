
import { TaskAggregate } from '@tasks/domain/aggregates/task.aggregate';
import { TaskId } from '@tasks/domain/value-objects/task-id.vo';

export interface TaskRepository {
    findById(id: TaskId): Promise<TaskAggregate | null>;
    save(task: TaskAggregate): Promise<void>;
    delete(id: TaskId): Promise<void>;
    findByWorkspace(workspaceId: string): Promise<TaskAggregate[]>;
    // Add specific queries likely needed
}
