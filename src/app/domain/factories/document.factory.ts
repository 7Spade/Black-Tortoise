/**
 * Document Factory
 * 
 * Layer: Domain
 * DDD Pattern: Factory
 * 
 * Encapsulates document creation logic with policy enforcement.
 * Ensures all business rules are satisfied before creation.
 */

import { WorkspaceId, DocumentId } from '@domain/value-objects';
import { DocumentType, createDocument, DocumentAggregate } from '../aggregates/document.aggregate';
import { DocumentNamingPolicy } from '../policies/document-naming.policy';

export class DocumentFactory {
  /**
   * Create a new document with policy enforcement
   */
  static create(
    id: DocumentId,
    workspaceId: WorkspaceId,
    name: string,
    type: DocumentType,
    mimeType: string,
    size: number,
    storageUrl: string,
    uploadedBy: string
  ): DocumentAggregate {
    // Enforce naming policy
    DocumentNamingPolicy.assertIsValid(name);

    // Enforce file size (100MB max)
    if (size > 100 * 1024 * 1024) {
      throw new Error('Document size cannot exceed 100MB');
    }

    // Delegate to aggregate creation function
    return createDocument(
      id,
      workspaceId,
      name,
      type,
      mimeType,
      size,
      storageUrl,
      uploadedBy
    );
  }

  /**
   * Reconstruct document from storage without validation
   */
  static reconstruct(
    id: DocumentId,
    workspaceId: WorkspaceId,
    name: string,
    type: DocumentType,
    status: 'draft' | 'published' | 'archived',
    mimeType: string,
    size: number,
    storageUrl: string,
    uploadedBy: string,
    createdAt: Date,
    updatedAt: Date,
    version: number
  ): DocumentAggregate {
    return {
      id,
      workspaceId,
      name,
      type,
      status,
      mimeType,
      size,
      storageUrl,
      uploadedBy,
      createdAt,
      updatedAt,
      version,
    };
  }
}
