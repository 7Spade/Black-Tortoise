/**
 * DocumentUploadedEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when a document is uploaded to the system.
 * Contains all information needed to track document uploads in the event store.
 */

import { DomainEvent } from '@eventing/domain/events';

export interface DocumentUploadedPayload {
  readonly workspaceId: string;
  readonly documentId: string;
  readonly documentName: string;
  readonly documentType: string;
  readonly fileSize: number;
  readonly uploadedBy: string;
  readonly storagePath: string;
  readonly userId?: string;
}

export interface DocumentUploadedEvent extends DomainEvent<DocumentUploadedPayload> {
  readonly type: 'DocumentUploaded';
}

/**
 * Create a DocumentUploadedEvent
 */
export function createDocumentUploadedEvent(
  documentId: string,
  documentName: string,
  documentType: string,
  fileSize: number,
  uploadedBy: string,
  storagePath: string,
  workspaceId: string,
  userId?: string,
  correlationId?: string,
  causationId?: string | null
): DocumentUploadedEvent {
  const eventId = crypto.randomUUID();
  const newCorrelationId = correlationId ?? eventId;
  
  const payload: DocumentUploadedPayload = {
    workspaceId,
    documentId,
    documentName,
    documentType,
    fileSize,
    uploadedBy,
    storagePath,
    ...(userId !== undefined ? { userId } : {}),
  };
  
  return {
    eventId,
    type: 'DocumentUploaded',
    aggregateId: documentId,
    correlationId: newCorrelationId,
    causationId: causationId ?? null,
    timestamp: Date.now(),
    payload,
  };
}

