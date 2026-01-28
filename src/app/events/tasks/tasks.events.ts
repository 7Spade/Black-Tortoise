import { DomainEvent } from '../domain-event.interface';

export const TASKS_SOURCE = 'Tasks';

export class TaskCreated implements DomainEvent<{ taskId: string; title: string; assigneeId?: string; dueDate?: Date }> {
    readonly type = 'Tasks.TaskCreated';
    readonly source = TASKS_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { taskId: string; title: string; assigneeId?: string; dueDate?: Date },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.taskId;
    }
}

export class TaskUpdated implements DomainEvent<{ taskId: string; changes: Record<string, any> }> {
    readonly type = 'Tasks.TaskUpdated';
    readonly source = TASKS_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { taskId: string; changes: Record<string, any> },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.taskId;
    }
}

export class TaskCompleted implements DomainEvent<{ taskId: string; completedBy: string }> {
    readonly type = 'Tasks.TaskCompleted';
    readonly source = TASKS_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { taskId: string; completedBy: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.taskId;
    }
}

export class TaskReopened implements DomainEvent<{ taskId: string; reason?: string }> {
    readonly type = 'Tasks.TaskReopened';
    readonly source = TASKS_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { taskId: string; reason?: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.taskId;
    }
}

export class TaskDeleted implements DomainEvent<{ taskId: string }> {
    readonly type = 'Tasks.TaskDeleted';
    readonly source = TASKS_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { taskId: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.taskId;
    }
}
