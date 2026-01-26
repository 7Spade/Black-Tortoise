/**
 * Acceptance Validation Policy
 * 
 * Layer: Domain
 * DDD Pattern: Policy
 */

import { AcceptanceStatus } from '../aggregates';

/**
 * Validate acceptance criteria
 */
export function validateAcceptanceCriteria(
  criteria: string[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!criteria || criteria.length === 0) {
    errors.push('At least one acceptance criterion is required');
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Validate acceptance status transition
 */
export function validateAcceptanceTransition(
  current: AcceptanceStatus,
  target: AcceptanceStatus
): { valid: boolean; reason?: string } {
    if (current === target) return { valid: false, reason: 'No change' };
    
    // Pending -> Approved/Rejected
    if (current === AcceptanceStatus.PENDING) return { valid: true };

    // Rejected -> Pending (Re-review)
    if (current === AcceptanceStatus.REJECTED && target === AcceptanceStatus.PENDING) return { valid: true };

    return { valid: false, reason: `Cannot transition from ${current} to ${target}` };
}
