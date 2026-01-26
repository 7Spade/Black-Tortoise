/**
 * Document Aggregate Root
 * 
 * Layer: Domain
 * DDD Pattern: Aggregate Root
 * 
 * The Document aggregate manages document metadata, versioning, and access control.
 * It enforces business rules around document lifecycle and permissions.
 */

import { DocumentId } from '../value-objects/document-id.vo';
import { WorkspaceId } from '../value-objects/workspace-id.vo';

export type DocumentType = 'text' | 'spreadsheet' | 'presentation' | 'pdf' | 'image' | 'other';
export type DocumentStatus = 'draft' | 'published' | 'archived';

export interface DocumentAggregate {
  readonly id: DocumentId;
  readonly workspaceId: WorkspaceId;
  readonly name: string;
  readonly type: DocumentType;
  readonly status: DocumentStatus;
  readonly mimeType: string;
  readonly size: number;
  readonly storageUrl: string;
  readonly uploadedBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly version: number;
}

/**
 * Create a new Document aggregate
 */
export function createDocument(
  id: DocumentId,
  workspaceId: WorkspaceId,
  name: string,
  type: DocumentType,
  mimeType: string,
  size: number,
  storageUrl: string,
  uploadedBy: string
): DocumentAggregate {
  if (!name || name.trim().length === 0) {
    throw new Error('Document name cannot be empty');
  }

  if (size <= 0) {
    throw new Error('Document size must be greater than 0');
  }

  if (!storageUrl || storageUrl.trim().length === 0) {
    throw new Error('Document storage URL cannot be empty');
  }

  if (!uploadedBy || uploadedBy.trim().length === 0) {
    throw new Error('Document uploader ID cannot be empty');
  }

  return {
    id,
    workspaceId,
    name: name.trim(),
    type,
    status: 'draft',
    mimeType,
    size,
    storageUrl,
    uploadedBy,
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1,
  };
}

/**
 * Rename document
 */
export function renameDocument(
  document: DocumentAggregate,
  newName: string
): DocumentAggregate {
  if (!newName || newName.trim().length === 0) {
    throw new Error('Document name cannot be empty');
  }

  return {
    ...document,
    name: newName.trim(),
    updatedAt: new Date(),
    version: document.version + 1,
  };
}

/**
 * Publish document
 */
export function publishDocument(
  document: DocumentAggregate
): DocumentAggregate {
  if (document.status === 'published') {
    throw new Error('Document is already published');
  }

  if (document.status === 'archived') {
    throw new Error('Cannot publish an archived document');
  }

  return {
    ...document,
    status: 'published',
    updatedAt: new Date(),
    version: document.version + 1,
  };
}

/**
 * Archive document
 */
export function archiveDocument(
  document: DocumentAggregate
): DocumentAggregate {
  if (document.status === 'archived') {
    throw new Error('Document is already archived');
  }

  return {
    ...document,
    status: 'archived',
    updatedAt: new Date(),
    version: document.version + 1,
  };
}

/**
 * Restore document from archive
 */
export function restoreDocument(
  document: DocumentAggregate
): DocumentAggregate {
  if (document.status !== 'archived') {
    throw new Error('Only archived documents can be restored');
  }

  return {
    ...document,
    status: 'draft',
    updatedAt: new Date(),
    version: document.version + 1,
  };
}
