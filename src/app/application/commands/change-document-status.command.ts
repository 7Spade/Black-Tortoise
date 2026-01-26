/**
 * Change Document Status Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

import { DocumentStatus } from '@domain/aggregates';
import { DocumentId } from '@domain/value-objects';

export interface ChangeDocumentStatusCommand {
  documentId: DocumentId;
  newStatus: DocumentStatus;
}
