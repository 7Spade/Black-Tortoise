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
  headcount: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(date)) {
    errors.push('Date must be in YYYY-MM-DD format');
  }

  if (headcount <= 0) {
    errors.push('Headcount must be greater than 0');
  }

  return { valid: errors.length === 0, errors };
}
