/**
 * Document Validation Policy
 * 
 * Layer: Domain
 * DDD Pattern: Policy
 */

import { DocumentStatus } from '../value-objects/document-status.vo';

/**
 * Validate document creation metadata
 */
export function validateDocumentMetadata(
  name: string,
  size: number,
  storageUrl: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!name || name.trim().length === 0) {
    errors.push('Document name cannot be empty');
  }

  if (size <= 0) {
    errors.push('Document size must be greater than 0');
  }

  if (!storageUrl || storageUrl.trim().length === 0) {
    errors.push('Document storage URL cannot be empty');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Check if document state transition is valid
 */
export function isValidDocumentTransition(
  currentStatus: DocumentStatus,
  newStatus: DocumentStatus
): { valid: boolean; reason?: string } {
  if (currentStatus === newStatus) {
    return { valid: false, reason: 'Document is already in this status' };
  }

  // Published cannot go back to Draft? (Business rule assumption: No, usually logical)
  // Archive from Draft or Published
  if (newStatus === 'archived') {
    return { valid: true };
  }

  // Publish only from Draft?
  if (newStatus === 'published') {
    if (currentStatus === 'archived') {
      return { valid: false, reason: 'Cannot publish an archived document directly. Restore it first.' };
    }
    return { valid: true };
  }

  // Restore only from Archived to Draft
  if (newStatus === 'draft') {
    if (currentStatus === 'archived') {
      return { valid: true };
    }
    // Published -> Draft (Unpublish?) - Logic in aggregate didn't explicitly forbid, but strict workflow usually does.
    // Aggregate code allows everything not explicitly forbidden.
    return { valid: true };
  }

  return { valid: true };
}
