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

// Helpers for backward compatibility
export function createTaskCreatedEvent(payload: { taskId: string; title: string; assigneeId?: string; dueDate?: Date }, correlationId: string, causationId?: string | null): TaskCreated {
    return new TaskCreated(payload, correlationId, causationId ?? undefined);
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

export function createTaskUpdatedEvent(payload: { taskId: string; changes: Record<string, any> }, correlationId: string, causationId?: string | null): TaskUpdated {
    return new TaskUpdated(payload, correlationId, causationId ?? undefined);
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

export function createTaskCompletedEvent(payload: { taskId: string; completedBy: string }, correlationId: string, causationId?: string | null): TaskCompleted {
    return new TaskCompleted(payload, correlationId, causationId ?? undefined);
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

export function createTaskReopenedEvent(payload: { taskId: string; reason?: string }, correlationId: string, causationId?: string | null): TaskReopened {
    return new TaskReopened(payload, correlationId, causationId ?? undefined);
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

export function createTaskDeletedEvent(payload: { taskId: string }, correlationId: string, causationId?: string | null): TaskDeleted {
    return new TaskDeleted(payload, correlationId, causationId ?? undefined);
}
