/**
 * DocumentMovedEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when a document or folder is moved to a different parent.
 */

import { DomainEvent } from '@domain/events';

export interface DocumentMovedPayload {
  readonly workspaceId: string;
  readonly nodeId: string;
  readonly nodeName: string;
  readonly nodeType: 'file' | 'folder';
  readonly oldParentId: string | null;
  readonly newParentId: string | null;
  readonly movedBy: string;
}

export interface DocumentMovedEvent extends DomainEvent<DocumentMovedPayload> {
  readonly type: 'DocumentMoved';
}

/**
 * Create a DocumentMovedEvent
 */
export function createDocumentMovedEvent(
  nodeId: string,
  nodeName: string,
  nodeType: 'file' | 'folder',
  oldParentId: string | null,
  newParentId: string | null,
  workspaceId: string,
  movedBy: string,
  correlationId?: string,
  causationId?: string | null
): DocumentMovedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;

  const payload: DocumentMovedPayload = {
    workspaceId,
    nodeId,
    nodeName,
    nodeType,
    oldParentId,
    newParentId,
    movedBy,
  };

  return {
    eventId,
    type: 'DocumentMoved',
    aggregateId: nodeId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload,
  };
}
