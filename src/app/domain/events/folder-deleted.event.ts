/**
 * FolderDeletedEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when a folder is deleted from the workspace.
 */

import { DomainEvent } from '@domain/events';

export interface FolderDeletedPayload {
  readonly workspaceId: string;
  readonly folderId: string;
  readonly folderName: string;
  readonly parentId: string | null;
  readonly deletedBy: string;
  readonly childrenCount: number;
}

export interface FolderDeletedEvent extends DomainEvent<FolderDeletedPayload> {
  readonly type: 'FolderDeleted';
}

/**
 * Create a FolderDeletedEvent
 */
export function createFolderDeletedEvent(
  folderId: string,
  folderName: string,
  parentId: string | null,
  workspaceId: string,
  deletedBy: string,
  childrenCount: number,
  correlationId?: string,
  causationId?: string | null
): FolderDeletedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;

  const payload: FolderDeletedPayload = {
    workspaceId,
    folderId,
    folderName,
    parentId,
    deletedBy,
    childrenCount,
  };

  return {
    eventId,
    type: 'FolderDeleted',
    aggregateId: folderId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload,
  };
}
