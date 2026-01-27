/**
 * TaskSnapshot Value Object
 *
 * Layer: Domain - Value Objects
 * Purpose: Captures task state at QC submission time for audit trail
 *
 * Immutability: All properties readonly
 * Audit Trail: Preserves task data even if task is later modified
 */

export interface TaskSnapshotProps {
  readonly title: string;
  readonly description: string;
  readonly quantity: number;
  readonly attachments: ReadonlyArray<string>;
  readonly completedAt: number;
  readonly submittedBy: string;
}

export class TaskSnapshot {
  readonly title: string;
  readonly description: string;
  readonly quantity: number;
  readonly attachments: ReadonlyArray<string>;
  readonly completedAt: number;
  readonly submittedBy: string;

  private constructor(props: TaskSnapshotProps) {
    if (!props.title || props.title.trim().length === 0) {
      throw new Error('TaskSnapshot title cannot be empty');
    }

    if (props.quantity < 0) {
      throw new Error('TaskSnapshot quantity cannot be negative');
    }

    if (props.completedAt <= 0) {
      throw new Error('TaskSnapshot completedAt must be a valid timestamp');
    }

    this.title = props.title.trim();
    this.description = props.description?.trim() || '';
    this.quantity = props.quantity;
    this.attachments = [...props.attachments];
    this.completedAt = props.completedAt;
    this.submittedBy = props.submittedBy;
  }

  static create(props: TaskSnapshotProps): TaskSnapshot {
    return new TaskSnapshot(props);
  }

  equals(other: TaskSnapshot): boolean {
    return (
      this.title === other.title &&
      this.description === other.description &&
      this.quantity === other.quantity &&
      this.completedAt === other.completedAt &&
      this.submittedBy === other.submittedBy &&
      JSON.stringify(this.attachments) === JSON.stringify(other.attachments)
    );
  }
}
