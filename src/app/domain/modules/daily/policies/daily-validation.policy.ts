/**
 * Daily Entry Validation Policy
 * 
 * Layer: Domain
 * DDD Pattern: Policy
 */

/**
 * Validate daily entry submission
 */
export function validateDailyEntry(
  date: string,
  hoursSpent: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(date)) {
    errors.push('Date must be in YYYY-MM-DD format');
  }

  if (hoursSpent < 0 || hoursSpent > 24) {
    errors.push('Hours spent must be between 0 and 24');
  }

  return { valid: errors.length === 0, errors };
}
