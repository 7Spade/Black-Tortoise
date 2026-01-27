/**
 * QC Context Provider
 *
 * Layer: Application - Providers
 * DDD Pattern: Anti-Corruption Layer / Context Provider
 *
 * Purpose: Provides read-only access to QC state for other modules
 * Prevents tight coupling between modules
 *
 * Cross-Module Integration:
 * - Tasks module can query QC status
 * - Acceptance module can check if QC passed
 * - Issues module can check if linked to QC failure
 */

export abstract class QCContextProvider {
  /**
   * Get QC status for a task
   */
  abstract getQCStatus(taskId: string): string | null;

  /**
   * Check if task can start QC
   */
  abstract canStartQC(taskId: string): boolean;

  /**
   * Check if task has passed QC
   */
  abstract hasPassedQC(taskId: string): boolean;

  /**
   * Get QC reviewer for a task
   */
  abstract getQCReviewer(taskId: string): string | null;

  /**
   * Get QC checklist completion percentage
   */
  abstract getChecklistCompletion(taskId: string): number;
}
