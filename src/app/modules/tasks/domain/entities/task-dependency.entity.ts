import { Entity } from '@domain/base/entity';
import { TaskId } from '@tasks/domain/value-objects/task-id.vo';

/**
 * Task Dependency Entity
 * 
 * Represents a relationship between tasks (e.g. BlockedBy).
 */
export class TaskDependency extends Entity<any> {
    private constructor(
        public readonly sourceTaskId: TaskId,
        public readonly targetTaskId: TaskId,
        public readonly type: 'BLOCKS' | 'BLOCKED_BY'
    ) {
        super({ value: `${sourceTaskId.value}-${type}-${targetTaskId.value}` });
    }

    public static create(source: TaskId, target: TaskId, type: 'BLOCKS' | 'BLOCKED_BY'): TaskDependency {
        return new TaskDependency(source, target, type);
    }
}
