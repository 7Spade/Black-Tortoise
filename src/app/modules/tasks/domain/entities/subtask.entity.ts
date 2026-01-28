import { Entity } from '@domain/base/entity';
import { TaskStatus } from '@tasks/domain/value-objects/task-status.vo';

/**
 * Subtask Entity
 * 
 * Simple sub-unit of work within a task.
 * Note: Uses string ID for local simplicity within aggregate, or can map to TaskId if needed.
 * For now, treating as local entity with string ID.
 */
export class Subtask extends Entity<any> { // Generic ID for now
    private constructor(
        id: any,
        public title: string,
        public status: TaskStatus
    ) {
        super(id);
    }

    public static create(id: string, title: string): Subtask {
        return new Subtask({ value: id }, title, TaskStatus.todo());
    }
}
