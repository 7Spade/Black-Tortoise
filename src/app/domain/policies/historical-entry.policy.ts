/**
 * Historical Entry Policy
 * 
 * Layer: Domain
 * DDD Pattern: Policy
 * Purpose: Enforce 30-day modification window
 * 
 * Business Rule: Can only modify entries within the past 30 days
 */

export class HistoricalEntryPolicy {
  private static readonly MAX_DAYS_BACK = 30;

  /**
   * Check if entry date is within allowed modification window
   */
  public static isSatisfiedBy(entryDate: string): boolean {
    const entry = new Date(entryDate);
    const now = new Date();
    const diffTime = now.getTime() - entry.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= 0 && diffDays <= this.MAX_DAYS_BACK;
  }

  /**
   * Throw error if date outside allowed window
   */
  public static assertIsValid(entryDate: string): void {
    if (!this.isSatisfiedBy(entryDate)) {
      throw new Error(
        `Entry date ${entryDate} is outside the 30-day modification window`
      );
    }
  }
}
