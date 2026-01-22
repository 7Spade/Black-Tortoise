/**
 * DocumentUploadedEvent
 * 
 * Layer: Domain
 * DDD Pattern: Domain Event
 * 
 * Emitted when a document is uploaded to the system.
 * Contains all information needed to track document uploads in the event store.
 */

export interface DocumentUploadedEvent {
  readonly eventId: string;
  readonly eventType: 'DocumentUploaded';
  readonly aggregateId: string; // documentId
  readonly workspaceId: string;
  readonly timestamp: Date;
  readonly causalityId: string;
  
  // Payload
  readonly payload: {
    readonly documentId: string;
    readonly documentName: string;
    readonly documentType: string;
    readonly fileSize: number;
    readonly uploadedBy: string;
    readonly storagePath: string;
  };
  
  // Metadata for event sourcing
  readonly metadata: {
    readonly version: number;
    readonly userId?: string;
    readonly correlationId?: string;
  };
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
  causalityId?: string,
  correlationId?: string
): DocumentUploadedEvent {
  return {
    eventId: crypto.randomUUID(),
    eventType: 'DocumentUploaded',
    aggregateId: documentId,
    workspaceId,
    timestamp: new Date(),
    causalityId: causalityId ?? crypto.randomUUID(),
    payload: {
      documentId,
      documentName,
      documentType,
      fileSize,
      uploadedBy,
      storagePath,
    },
    metadata: {
      version: 1,
      userId,
      correlationId,
    },
  };
}
