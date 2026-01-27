/**
 * Task Progress Updated Event
 *
 * Layer: Domain
 * DDD Pattern: Domain Event
 *
 * Published when task progress is updated.
 */

export interface TaskProgressUpdatedEvent {
  readonly eventType: 'TaskProgressUpdated';
  readonly eventId: string;
  readonly taskId: string;
  readonly progress: number;
  readonly timestamp: number;
  readonly correlationId: string;
  readonly causedBy?: string;
}

export function createTaskProgressUpdatedEvent(
  taskId: string,
  progress: number,
  correlationId: string,
  causedBy?: string,
): TaskProgressUpdatedEvent {
  return {
    eventType: 'TaskProgressUpdated',
    eventId: crypto.randomUUID(),
    taskId,
    progress,
    timestamp: Date.now(),
    correlationId,
    causedBy,
  };
}
