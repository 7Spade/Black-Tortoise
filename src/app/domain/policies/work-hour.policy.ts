/**
 * Work Hour Policy
 * 
 * Layer: Domain
 * DDD Pattern: Policy
 * Purpose: Enforce max 1.0 man-day per person per day
 * 
 * Business Rule: A person can only log up to 1.0 man-day total per day
 */

export interface DailyEntryForValidation {
  readonly date: string;
  readonly userId: string;
  readonly headcount: number;
}

export class WorkHourPolicy {
  /**
   * Check if adding new headcount would exceed daily limit
   */
  public static isSatisfiedBy(
    newHeadcount: number,
    userId: string,
    date: string,
    existingEntries: ReadonlyArray<DailyEntryForValidation>
  ): boolean {
    const existingTotal = existingEntries
      .filter(e => e.date === date && e.userId === userId)
      .reduce((sum, e) => sum + e.headcount, 0);
    
    return (existingTotal + newHeadcount) <= 1.0;
  }

  /**
   * Throw error if policy not satisfied
   */
  public static assertIsValid(
    newHeadcount: number,
    userId: string,
    date: string,
    existingEntries: ReadonlyArray<DailyEntryForValidation>
  ): void {
    if (!this.isSatisfiedBy(newHeadcount, userId, date, existingEntries)) {
      const existingTotal = existingEntries
        .filter(e => e.date === date && e.userId === userId)
        .reduce((sum, e) => sum + e.headcount, 0);
      
      throw new Error(
        `Work hour limit exceeded. Existing: ${existingTotal}, Requested: ${newHeadcount}, Max: 1.0`
      );
    }
  }
}
