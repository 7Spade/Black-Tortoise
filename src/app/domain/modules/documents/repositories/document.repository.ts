/**
 * Document Repository Interface
 * 
 * Layer: Domain
 * DDD Pattern: Repository Interface
 * 
 * Defines the contract for document persistence operations.
 * The actual implementation will be in the Infrastructure layer.
 * This interface is pure TypeScript with no framework dependencies.
 */

import { WorkspaceId } from '@domain/core/workspace/value-objects';
import { DocumentAggregate } from '../aggregates';
import { DocumentId } from '../value-objects';

export interface DocumentRepository {
  /**
   * Find a document by its ID
   * @returns The document if found, undefined otherwise
   */
  findById(id: DocumentId): Promise<DocumentAggregate | undefined>;

  /**
   * Find all documents in a workspace
   */
  findByWorkspaceId(workspaceId: WorkspaceId): Promise<DocumentAggregate[]>;

  /**
   * Find documents by type
   */
  findByType(workspaceId: WorkspaceId, type: string): Promise<DocumentAggregate[]>;

  /**
   * Find documents by owner
   */
  findByOwnerId(ownerId: string): Promise<DocumentAggregate[]>;

  /**
   * Find documents by folder path
   */
  findByFolderPath(workspaceId: WorkspaceId, folderPath: string): Promise<DocumentAggregate[]>;

  /**
   * Find documents modified after a specific date
   */
  findModifiedAfter(workspaceId: WorkspaceId, date: Date): Promise<DocumentAggregate[]>;

  /**
   * Search documents by name
   */
  searchByName(workspaceId: WorkspaceId, searchTerm: string): Promise<DocumentAggregate[]>;

  /**
   * Find documents by tags
   */
  findByTags(workspaceId: WorkspaceId, tags: string[]): Promise<DocumentAggregate[]>;

  /**
   * Save a document (create or update)
   */
  save(document: DocumentAggregate): Promise<void>;

  /**
   * Delete a document by ID
   */
  delete(id: DocumentId): Promise<void>;

  /**
   * Check if a document exists
   */
  exists(id: DocumentId): Promise<boolean>;

  /**
   * Count total documents in a workspace
   */
  countByWorkspace(workspaceId: WorkspaceId): Promise<number>;

  /**
   * Count documents by type
   */
  countByType(workspaceId: WorkspaceId, type: string): Promise<number>;

  /**
   * Get total storage size for a workspace
   */
  getTotalStorageSize(workspaceId: WorkspaceId): Promise<number>;
}
