/**
 * FolderRenamedEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when a folder is renamed.
 */

import { DomainEvent } from '@domain/events';

export interface FolderRenamedPayload {
  readonly workspaceId: string;
  readonly folderId: string;
  readonly oldName: string;
  readonly newName: string;
  readonly renamedBy: string;
}

export interface FolderRenamedEvent extends DomainEvent<FolderRenamedPayload> {
  readonly type: 'FolderRenamed';
}

/**
 * Create a FolderRenamedEvent
 */
export function createFolderRenamedEvent(
  folderId: string,
  oldName: string,
  newName: string,
  workspaceId: string,
  renamedBy: string,
  correlationId?: string,
  causationId?: string | null
): FolderRenamedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;

  const payload: FolderRenamedPayload = {
    workspaceId,
    folderId,
    oldName,
    newName,
    renamedBy,
  };

  return {
    eventId,
    type: 'FolderRenamed',
    aggregateId: folderId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload,
  };
}
