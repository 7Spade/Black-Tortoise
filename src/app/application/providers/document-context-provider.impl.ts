/**
 * Document Context Provider Implementation
 * 
 * Layer: Application
 * Purpose: Concrete implementation of DocumentContextProvider
 * 
 * This implementation wraps DocumentsStore and provides a stable
 * interface for other modules to query document data.
 */

import { Injectable, inject } from '@angular/core';
import { DocumentsStore } from '@application/stores/documents.store';
import { DocumentContextProvider } from './document-context.provider';

/**
 * Default Implementation of DocumentContextProvider
 * 
 * Delegates to DocumentsStore for data access.
 */
@Injectable()
export class DocumentContextProviderImpl extends DocumentContextProvider {
  private readonly store = inject(DocumentsStore);

  /**
   * Get total document count from store
   */
  getDocumentCount(): number {
    return this.store.documents().length;
  }

  /**
   * Check if document exists by ID
   */
  hasDocument(documentId: string): boolean {
    return this.store.documents().some(d => d.id === documentId);
  }

  /**
   * Get document path (folder hierarchy)
   * Returns array of folder names from root to document
   */
  getDocumentPath(documentId: string): string[] {
    const document = this.store.documents().find(d => d.id === documentId);
    if (!document || !document.parentId) return [];

    const path: string[] = [];
    let currentParentId: string | null = document.parentId;

    // Traverse up the tree
    while (currentParentId !== null) {
      const parent = this.store.fileTree().find(n => n.id === currentParentId);
      if (!parent) break;
      path.unshift(parent.name);
      currentParentId = parent.parentId;
    }

    return path;
  }
}
