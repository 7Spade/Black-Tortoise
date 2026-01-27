/**
 * QC Criteria Policy
 *
 * Layer: Domain - Policies
 * Purpose: Enforce QC checklist validation rules
 *
 * DDD Pattern: Policy (encapsulates business rules)
 */

import { ChecklistItem } from '../value-objects/checklist-item.vo';

export class QCCriteriaPolicy {
  /**
   * Check if all required checklist items have passed
   */
  static allRequiredItemsPassed(checklistItems: ReadonlyArray<ChecklistItem>): boolean {
    const requiredItems = checklistItems.filter(item => item.isRequired);

    if (requiredItems.length === 0) {
      return false; // No required items means invalid checklist
    }

    return requiredItems.every(item => item.isPassed === true);
  }

  /**
   * Check if any required item has failed
   */
  static anyRequiredItemFailed(checklistItems: ReadonlyArray<ChecklistItem>): boolean {
    return checklistItems.filter(item => item.isRequired).some(item => item.isPassed === false);
  }

  /**
   * Assert checklist is valid for QC pass
   */
  static assertCanPass(checklistItems: ReadonlyArray<ChecklistItem>): void {
    if (!this.allRequiredItemsPassed(checklistItems)) {
      const failedItems = checklistItems
        .filter(item => item.isRequired && item.isPassed !== true)
        .map(item => item.name);

      throw new Error(
        `Cannot pass QC: required items not passed: ${failedItems.join(', ')}`
      );
    }
  }

  /**
   * Assert checklist has at least one required item
   */
  static assertHasRequiredItems(checklistItems: ReadonlyArray<ChecklistItem>): void {
    if (checklistItems.filter(item => item.isRequired).length === 0) {
      throw new Error('QC checklist must have at least one required item');
    }
  }

  /**
   * Get completion percentage
   */
  static getCompletionPercentage(checklistItems: ReadonlyArray<ChecklistItem>): number {
    if (checklistItems.length === 0) {
      return 0;
    }

    const reviewedCount = checklistItems.filter(item => item.isPassed !== null).length;
    return Math.round((reviewedCount / checklistItems.length) * 100);
  }

  /**
   * Check if checklist is satisfied (all items reviewed)
   */
  static isSatisfiedBy(checklistItems: ReadonlyArray<ChecklistItem>): boolean {
    return checklistItems.every(item => item.isPassed !== null);
  }
}
