/**
 * Rename Document Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

import { DocumentId } from '@domain/value-objects';

export interface RenameDocumentCommand {
  documentId: DocumentId;
  newName: string;
}
