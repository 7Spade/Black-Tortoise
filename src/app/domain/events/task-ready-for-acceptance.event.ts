/**
 * Task Ready For Acceptance Event
 *
 * Layer: Domain
 * DDD Pattern: Domain Event
 *
 * Published when task passes QC and is ready for acceptance.
 */

export interface TaskReadyForAcceptanceEvent {
  readonly eventType: 'TaskReadyForAcceptance';
  readonly eventId: string;
  readonly taskId: string;
  readonly workspaceId: string;
  readonly timestamp: number;
  readonly correlationId: string;
  readonly causedBy?: string;
}

export function createTaskReadyForAcceptanceEvent(
  taskId: string,
  workspaceId: string,
  correlationId: string,
  causedBy?: string,
): TaskReadyForAcceptanceEvent {
  return {
    eventType: 'TaskReadyForAcceptance',
    eventId: crypto.randomUUID(),
    taskId,
    workspaceId,
    timestamp: Date.now(),
    correlationId,
    causedBy,
  };
}
