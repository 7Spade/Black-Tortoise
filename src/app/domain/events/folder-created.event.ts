/**
 * FolderCreatedEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when a folder is created in the workspace.
 */

import { DomainEvent } from '@domain/events';

export interface FolderCreatedPayload {
  readonly workspaceId: string;
  readonly folderId: string;
  readonly folderName: string;
  readonly parentId: string | null;
  readonly createdBy: string;
  readonly depth: number;
}

export interface FolderCreatedEvent extends DomainEvent<FolderCreatedPayload> {
  readonly type: 'FolderCreated';
}

/**
 * Create a FolderCreatedEvent
 */
export function createFolderCreatedEvent(
  folderId: string,
  folderName: string,
  parentId: string | null,
  workspaceId: string,
  createdBy: string,
  depth: number,
  correlationId?: string,
  causationId?: string | null
): FolderCreatedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;

  const payload: FolderCreatedPayload = {
    workspaceId,
    folderId,
    folderName,
    parentId,
    createdBy,
    depth,
  };

  return {
    eventId,
    type: 'FolderCreated',
    aggregateId: folderId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload,
  };
}
