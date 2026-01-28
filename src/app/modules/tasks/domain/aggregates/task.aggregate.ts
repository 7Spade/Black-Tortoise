import { AggregateRoot } from '@domain/base/aggregate-root';
import { TaskId } from '@tasks/domain/value-objects/task-id.vo';
import { WorkspaceId } from '@domain/value-objects/workspace-id.vo';
import { UserId } from '@domain/value-objects/user-id.vo';
import { TaskStatus } from '@tasks/domain/value-objects/task-status.vo';
import { TaskPriority } from '@tasks/domain/value-objects/task-priority.vo';
import { Money } from '@tasks/domain/value-objects/money.vo';
import { Progress } from '@tasks/domain/value-objects/progress.vo';
import { Subtask } from '@tasks/domain/entities/subtask.entity';
import { TaskDependency } from '@tasks/domain/entities/task-dependency.entity';

export interface TaskProps {
    workspaceId: WorkspaceId;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    assigneeId: UserId | null;
    estimatedCost: Money | null;
    progress: Progress;
}

/**
 * Task Aggregate Root
 */
export class TaskAggregate extends AggregateRoot<TaskId> {
    private _subtasks: Subtask[] = [];
    private _dependencies: TaskDependency[] = [];

    public readonly workspaceId: WorkspaceId;
    public title: string;
    public description: string;
    public status: TaskStatus;
    public priority: TaskPriority;
    public assigneeId: UserId | null;
    public estimatedCost: Money | null;
    public progress: Progress;
    public blockedByIssueIds: string[] = [];

    private constructor(
        id: TaskId,
        props: TaskProps
    ) {
        super(id);
        this.workspaceId = props.workspaceId;
        this.title = props.title;
        this.description = props.description;
        this.status = props.status;
        this.priority = props.priority;
        this.assigneeId = props.assigneeId;
        this.estimatedCost = props.estimatedCost;
        this.progress = props.progress;
    }

    public static create(
        id: TaskId,
        workspaceId: WorkspaceId,
        title: string
    ): TaskAggregate {
        const props: TaskProps = {
            workspaceId,
            title,
            description: '',
            status: TaskStatus.todo(),
            priority: TaskPriority.medium(),
            assigneeId: null,
            estimatedCost: null,
            progress: Progress.zero()
        };
        return new TaskAggregate(id, props);
    }

    public static restore(
        id: TaskId,
        props: TaskProps
    ): TaskAggregate {
        return new TaskAggregate(id, props);
    }

    public addSubtask(subtask: Subtask): void {
        this._subtasks.push(subtask);
    }

    public get subtasks(): ReadonlyArray<Subtask> {
        return [...this._subtasks];
    }
}

// Factory function
export function createTask(
    id: TaskId,
    workspaceId: WorkspaceId,
    title: string
): TaskAggregate {
    return TaskAggregate.create(id, workspaceId, title);
}
