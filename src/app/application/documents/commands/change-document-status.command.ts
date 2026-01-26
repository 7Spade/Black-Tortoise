/**
 * Change Document Status Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

import { DocumentStatus } from '@domain/modules/documents/aggregates/document.aggregate';
import { DocumentId } from '@domain/modules/documents/value-objects/document-id.vo';

export interface ChangeDocumentStatusCommand {
  documentId: DocumentId;
  newStatus: DocumentStatus;
}
