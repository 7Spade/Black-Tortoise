/**
 * Task Assignee Changed Event
 *
 * Layer: Domain
 * DDD Pattern: Domain Event
 *
 * Published when task assignees are changed.
 */

export interface TaskAssigneeChangedEvent {
  readonly eventType: 'TaskAssigneeChanged';
  readonly eventId: string;
  readonly taskId: string;
  readonly oldAssigneeIds: ReadonlyArray<string>;
  readonly newAssigneeIds: ReadonlyArray<string>;
  readonly oldResponsibleId: string | null;
  readonly newResponsibleId: string | null;
  readonly timestamp: number;
  readonly correlationId: string;
  readonly causedBy?: string;
}

export function createTaskAssigneeChangedEvent(
  taskId: string,
  oldAssigneeIds: ReadonlyArray<string>,
  newAssigneeIds: ReadonlyArray<string>,
  oldResponsibleId: string | null,
  newResponsibleId: string | null,
  correlationId: string,
  causedBy?: string,
): TaskAssigneeChangedEvent {
  return {
    eventType: 'TaskAssigneeChanged',
    eventId: crypto.randomUUID(),
    taskId,
    oldAssigneeIds,
    newAssigneeIds,
    oldResponsibleId,
    newResponsibleId,
    timestamp: Date.now(),
    correlationId,
    causedBy,
  };
}
