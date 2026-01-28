import { AggregateRoot } from '@domain/base/aggregate-root';
import { TaskId } from '@domain/tasks/value-objects/task-id.vo';
import { WorkspaceId } from '@domain/value-objects/workspace-id.vo';
import { UserId } from '@domain/value-objects/user-id.vo';
import { TaskStatus } from '@domain/tasks/value-objects/task-status.vo';
import { TaskPriority } from '@domain/tasks/value-objects/task-priority.vo';
import { Money } from '@domain/tasks/value-objects/money.vo';
import { Progress } from '@domain/tasks/value-objects/progress.vo';
import { Subtask } from '@domain/tasks/entities/subtask.entity';
import { TaskDependency } from '@domain/tasks/entities/task-dependency.entity';

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
        return new TaskAggregate(
            id,
            workspaceId,
            title,
            '',
            TaskStatus.todo(),
            TaskPriority.medium(),
            null,
            null,
            Progress.zero()
        );
    }

    public addSubtask(subtask: Subtask): void {
        this._subtasks.push(subtask);
    }

    public get subtasks(): ReadonlyArray<Subtask> {
        return [...this._subtasks];
    }
}
