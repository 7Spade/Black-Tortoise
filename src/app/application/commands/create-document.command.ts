/**
 * Create Document Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

import { WorkspaceId } from '@domain/value-objects';
import { DocumentType } from '@domain/aggregates';
import { DocumentId } from '@domain/value-objects';

export interface CreateDocumentCommand {
  id: DocumentId;
  workspaceId: WorkspaceId;
  name: string;
  type: DocumentType;
  mimeType: string;
  size: number;
  storageUrl: string;
  uploadedByUserId: string;
}
