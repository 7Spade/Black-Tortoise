/**
 * Document Context Provider
 * 
 * Layer: Application
 * Purpose: Abstract interface for accessing document data
 * 
 * This provider allows other modules to query document information
 * without directly coupling to DocumentsStore.
 * 
 * Pattern: Abstract Provider Pattern (DDD)
 * DI: Provided via InjectionToken for loose coupling
 */

import { InjectionToken } from '@angular/core';

/**
 * Abstract Provider for Document Context
 * 
 * Other modules inject this abstraction to query document data.
 */
export abstract class DocumentContextProvider {
  /**
   * Get total document count for current workspace
   */
  abstract getDocumentCount(): number;

  /**
   * Check if a document exists by ID
   */
  abstract hasDocument(documentId: string): boolean;

  /**
   * Get document path (folder hierarchy)
   */
  abstract getDocumentPath(documentId: string): string[];
}

/**
 * Injection Token for DocumentContextProvider
 * 
 * Usage:
 * ```typescript
 * private readonly documentContext = inject(DOCUMENT_CONTEXT);
 * const count = this.documentContext.getDocumentCount();
 * ```
 */
export const DOCUMENT_CONTEXT = new InjectionToken<DocumentContextProvider>(
  'DocumentContextProvider',
  {
    providedIn: 'root',
    factory: () => {
      throw new Error(
        'DocumentContextProvider must be provided in app configuration'
      );
    }
  }
);
