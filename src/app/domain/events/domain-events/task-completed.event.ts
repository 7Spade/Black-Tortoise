/**
 * TaskCompletedEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when a task is marked as completed.
 * Contains all information needed to track task completion in the event store.
 */

export interface TaskCompletedEvent {
  readonly eventId: string;
  readonly eventType: 'TaskCompleted';
  readonly aggregateId: string; // taskId
  readonly workspaceId: string;
  readonly timestamp: Date;
  readonly causalityId: string;
  
  // Payload
  readonly payload: {
    readonly taskId: string;
    readonly taskName: string;
    readonly completedBy: string;
    readonly completionNotes?: string;
  };
  
  // Metadata for event sourcing
  readonly metadata: {
    readonly version: number;
    readonly userId?: string;
    readonly correlationId?: string;
  };
}

/**
 * Create a TaskCompletedEvent
 */
export function createTaskCompletedEvent(
  taskId: string,
  taskName: string,
  completedBy: string,
  workspaceId: string,
  completionNotes?: string,
  userId?: string,
  causalityId?: string,
  correlationId?: string
): TaskCompletedEvent {
  return {
    eventId: crypto.randomUUID(),
    eventType: 'TaskCompleted',
    aggregateId: taskId,
    workspaceId,
    timestamp: new Date(),
    causalityId: causalityId ?? crypto.randomUUID(),
    payload: {
      taskId,
      taskName,
      completedBy,
      completionNotes,
    },
    metadata: {
      version: 1,
      userId,
      correlationId,
    },
  };
}
