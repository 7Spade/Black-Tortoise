/**
 * Change Document Status Command
 * 
 * Layer: Domain
 * DDD Pattern: Command
 */

import { DocumentStatus } from '../aggregates/document.aggregate';
import { DocumentId } from '../value-objects/document-id.vo';

export interface ChangeDocumentStatusCommand {
  documentId: DocumentId;
  newStatus: DocumentStatus;
}
