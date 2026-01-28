/**
 * QC Validation Policy
 * 
 * Layer: Domain
 * DDD Pattern: Policy
 */

import { QCStatus } from '../aggregates';

/**
 * Validate QC status transition
 */
export function validateQCTransition(
  current: QCStatus,
  target: QCStatus
): { valid: boolean; reason?: string } {
  if (current === target) {
    return { valid: false, reason: 'Already in this status' };
  }

  // Pending -> Passed/Failed
  if (current === QCStatus.PENDING) {
    if (target === QCStatus.PASSED || target === QCStatus.FAILED) {
      return { valid: true };
    }
  }

  // Failed -> Pending (Retest)
  if (current === QCStatus.FAILED && target === QCStatus.PENDING) {
    return { valid: true };
  }

  return { valid: false, reason: `Invalid transition from ${current} to ${target}` };
}
