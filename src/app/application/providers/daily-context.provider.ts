/**
 * Daily Context Provider
 * 
 * Layer: Application
 * DDD Pattern: Anti-Corruption Layer / Context Provider
 * Purpose: Provide read-only access to daily entry state for other modules
 * 
 * Prevents tight coupling between modules by exposing only
 * necessary data through a well-defined interface.
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { DailyStore } from '@application/stores/daily.store';

/**
 * Abstract class defining the contract for daily context access
 */
export abstract class DailyContextProvider {
  /**
   * Get total work hours (headcount) for a user on a specific date
   */
  abstract getTotalWorkHours(userId: string, date: Date): number;

  /**
   * Check if user has any daily entries on a specific date
   */
  abstract hasDailyEntry(userId: string, date: Date): boolean;
}

/**
 * Injection Token for DailyContextProvider
 * 
 * Usage:
 * ```typescript
 * private readonly dailyContext = inject(DAILY_CONTEXT);
 * const hours = this.dailyContext.getTotalWorkHours(userId, new Date());
 * ```
 */
export const DAILY_CONTEXT = new InjectionToken<DailyContextProvider>(
  'DailyContextProvider',
  {
    providedIn: 'root',
    factory: () => {
      throw new Error(
        'DailyContextProvider must be provided in app configuration'
      );
    }
  }
);

/**
 * Implementation of DailyContextProvider
 */
@Injectable()
export class DailyContextProviderImpl extends DailyContextProvider {
  private readonly dailyStore = inject(DailyStore);

  getTotalWorkHours(userId: string, date: Date): number {
    const dateStr = this.toISODate(date);
    return this.dailyStore
      .entries()
      .filter(e => e.userId === userId && e.date === dateStr)
      .reduce((sum, e) => sum + e.headcount, 0);
  }

  hasDailyEntry(userId: string, date: Date): boolean {
    const dateStr = this.toISODate(date);
    return this.dailyStore
      .entries()
      .some(e => e.userId === userId && e.date === dateStr);
  }

  private toISODate(date: Date): string {
    return date.toISOString().split('T')[0] ?? '';
  }
}
