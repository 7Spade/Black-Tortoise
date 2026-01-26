/**
 * Rename Document Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

import { DocumentId } from '@domain/modules/documents/value-objects/document-id.vo';

export interface RenameDocumentCommand {
  documentId: DocumentId;
  newName: string;
}
