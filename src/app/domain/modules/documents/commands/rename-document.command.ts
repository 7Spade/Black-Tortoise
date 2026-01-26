/**
 * Rename Document Command
 * 
 * Layer: Domain
 * DDD Pattern: Command
 */

import { DocumentId } from '../value-objects/document-id.vo';

export interface RenameDocumentCommand {
  documentId: DocumentId;
  newName: string;
}
