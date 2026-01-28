
import { TaskAggregate } from '@tasks/domain/aggregates/task.aggregate';
import { TaskId } from '@tasks/domain/value-objects/task-id.vo';
import { InjectionToken } from '@angular/core';

export interface TaskRepository {
    findById(id: TaskId): Promise<TaskAggregate | null>;
    save(task: TaskAggregate): Promise<void>;
    delete(id: TaskId): Promise<void>;
    findByWorkspace(workspaceId: string): Promise<TaskAggregate[]>;
    // Add specific queries likely needed
}

export const TASK_REPOSITORY = new InjectionToken<TaskRepository>('TASK_REPOSITORY');
