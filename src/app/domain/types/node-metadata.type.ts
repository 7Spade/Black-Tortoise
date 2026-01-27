/**
 * Node Metadata Type
 * 
 * Layer: Domain
 * Purpose: Metadata for file tree nodes
 * 
 * Pure TypeScript type - no framework dependencies.
 */

export interface NodeMetadata {
  readonly size?: number;
  readonly mimeType?: string;
  readonly uploadedAt?: Date;
  readonly uploadedBy?: string;
  readonly modifiedAt?: Date;
  readonly modifiedBy?: string;
  readonly storageUrl?: string;
  readonly thumbnailUrl?: string;
}

export type NodeType = 'file' | 'folder';
