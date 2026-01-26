/**
 * Create Document Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

import { DocumentType } from '@domain/modules/documents/aggregates/document.aggregate';
import { DocumentId } from '@domain/modules/documents/value-objects/document-id.vo';
import { WorkspaceId } from '@domain/modules/documents/value-objects/workspace-id.vo';

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
