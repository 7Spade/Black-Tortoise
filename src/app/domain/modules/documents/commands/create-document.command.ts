/**
 * Create Document Command
 * 
 * Layer: Domain
 * DDD Pattern: Command
 */

import { DocumentType } from '../aggregates/document.aggregate';
import { DocumentId } from '../value-objects/document-id.vo';
import { WorkspaceId } from '../value-objects/workspace-id.vo';

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
