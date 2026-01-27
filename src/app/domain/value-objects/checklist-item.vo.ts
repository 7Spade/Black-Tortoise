/**
 * ChecklistItem Value Object
 *
 * Layer: Domain - Value Objects
 * Purpose: Represents individual checklist item in QC review
 *
 * Immutability: All properties readonly
 * Validation: Constructor ensures valid state
 */

export interface ChecklistItemProps {
  readonly name: string;
  readonly description: string;
  readonly isRequired: boolean;
  readonly isPassed: boolean | null;
  readonly failureReason: string | null;
}

export class ChecklistItem {
  readonly name: string;
  readonly description: string;
  readonly isRequired: boolean;
  readonly isPassed: boolean | null;
  readonly failureReason: string | null;

  private constructor(props: ChecklistItemProps) {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('ChecklistItem name cannot be empty');
    }

    if (!props.isRequired && props.isPassed === null) {
      // Optional items can be null (not yet reviewed)
    } else if (props.isPassed === false && (!props.failureReason || props.failureReason.trim().length === 0)) {
      throw new Error('failureReason is required when isPassed is false');
    }

    this.name = props.name.trim();
    this.description = props.description?.trim() || '';
    this.isRequired = props.isRequired;
    this.isPassed = props.isPassed;
    this.failureReason = props.failureReason?.trim() || null;
  }

  static create(props: ChecklistItemProps): ChecklistItem {
    return new ChecklistItem(props);
  }

  static createPending(name: string, description: string, isRequired: boolean): ChecklistItem {
    return new ChecklistItem({
      name,
      description,
      isRequired,
      isPassed: null,
      failureReason: null,
    });
  }

  markPassed(): ChecklistItem {
    return new ChecklistItem({
      ...this,
      isPassed: true,
      failureReason: null,
    });
  }

  markFailed(failureReason: string): ChecklistItem {
    return new ChecklistItem({
      ...this,
      isPassed: false,
      failureReason,
    });
  }

  equals(other: ChecklistItem): boolean {
    return (
      this.name === other.name &&
      this.description === other.description &&
      this.isRequired === other.isRequired &&
      this.isPassed === other.isPassed &&
      this.failureReason === other.failureReason
    );
  }
}
