/**
 * QC Aggregate Root
 *
 * Layer: Domain - Aggregates
 * Purpose: QC review entity with checklist-based validation
 * Pattern: DDD Aggregate with create/reconstruct pattern
 *
 * Responsibilities:
 * - Enforce QC business invariants
 * - Emit domain events on state changes
 * - Manage checklist items lifecycle
 */

import { EventMetadata } from '../events/event-metadata';
import { ChecklistItem } from '../value-objects/checklist-item.vo';
import { TaskSnapshot } from '../value-objects/task-snapshot.vo';
import { QCStartedEvent } from '../events/qc-started.event';
import { QCPassedEvent } from '../events/qc-passed.event';
import { QCFailedEvent } from '../events/qc-failed.event';

export enum QCStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  PASSED = 'passed',
  FAILED = 'failed',
}

export interface QCCheckEntityProps {
  readonly id: string;
  readonly taskId: string;
  readonly workspaceId: string;
  readonly status: QCStatus;
  readonly checklistItems: ReadonlyArray<ChecklistItem>;
  readonly taskSnapshot: TaskSnapshot;
  readonly reviewer: string | null;
  readonly reviewerAssignedAt: number | null;
  readonly comments: string;
  readonly checkedBy: string | null;
  readonly checkedAt: number | null;
  readonly createdAt: number;
}

export class QCCheckEntity {
  readonly id: string;
  readonly taskId: string;
  readonly workspaceId: string;
  readonly status: QCStatus;
  readonly checklistItems: ReadonlyArray<ChecklistItem>;
  readonly taskSnapshot: TaskSnapshot;
  readonly reviewer: string | null;
  readonly reviewerAssignedAt: number | null;
  readonly comments: string;
  readonly checkedBy: string | null;
  readonly checkedAt: number | null;
  readonly createdAt: number;

  private domainEvents: Array<QCStartedEvent | QCPassedEvent | QCFailedEvent> = [];

  private constructor(props: QCCheckEntityProps) {
    this.id = props.id;
    this.taskId = props.taskId;
    this.workspaceId = props.workspaceId;
    this.status = props.status;
    this.checklistItems = props.checklistItems;
    this.taskSnapshot = props.taskSnapshot;
    this.reviewer = props.reviewer;
    this.reviewerAssignedAt = props.reviewerAssignedAt;
    this.comments = props.comments;
    this.checkedBy = props.checkedBy;
    this.checkedAt = props.checkedAt;
    this.createdAt = props.createdAt;
  }

  /**
   * Create new QC record (emits domain event)
   */
  static create(
    id: string,
    taskId: string,
    workspaceId: string,
    checklistItems: ReadonlyArray<ChecklistItem>,
    taskSnapshot: TaskSnapshot,
    eventMetadata?: EventMetadata
  ): QCCheckEntity {
    const now = Date.now();
    const entity = new QCCheckEntity({
      id,
      taskId,
      workspaceId,
      status: QCStatus.PENDING,
      checklistItems,
      taskSnapshot,
      reviewer: null,
      reviewerAssignedAt: null,
      comments: '',
      checkedBy: null,
      checkedAt: null,
      createdAt: now,
    });

    // Emit QCStarted event
    const event: QCStartedEvent = {
      eventId: crypto.randomUUID(),
      eventType: 'QCStarted',
      aggregateId: taskId,
      aggregateType: 'Task',
      timestamp: now,
      correlationId: eventMetadata?.correlationId || crypto.randomUUID(),
      causationId: eventMetadata?.causationId || null,
      payload: {
        qcId: id,
        taskId,
        workspaceId,
        checklistItemCount: checklistItems.length,
        startedAt: now,
      },
    };

    entity.domainEvents.push(event);
    return entity;
  }

  /**
   * Reconstruct from persistence (no events)
   */
  static reconstruct(props: QCCheckEntityProps): QCCheckEntity {
    return new QCCheckEntity(props);
  }

  /**
   * Assign reviewer to QC task
   */
  assignReviewer(reviewerId: string): QCCheckEntity {
    if (this.status !== QCStatus.PENDING) {
      throw new Error('Can only assign reviewer to pending QC tasks');
    }

    return new QCCheckEntity({
      ...this,
      status: QCStatus.IN_PROGRESS,
      reviewer: reviewerId,
      reviewerAssignedAt: Date.now(),
    });
  }

  /**
   * Update checklist item status
   */
  updateChecklistItem(itemIndex: number, isPassed: boolean, failureReason?: string): QCCheckEntity {
    if (itemIndex < 0 || itemIndex >= this.checklistItems.length) {
      throw new Error(`Invalid checklist item index: ${itemIndex}`);
    }

    const item = this.checklistItems[itemIndex];
    const updatedItem = isPassed ? item.markPassed() : item.markFailed(failureReason || '');

    const updatedItems = this.checklistItems.map((existing, idx) =>
      idx === itemIndex ? updatedItem : existing
    );

    return new QCCheckEntity({
      ...this,
      checklistItems: updatedItems,
    });
  }

  /**
   * Mark QC as passed (emits domain event)
   */
  markPassed(reviewerId: string, comments: string, eventMetadata?: EventMetadata): QCCheckEntity {
    const now = Date.now();
    const entity = new QCCheckEntity({
      ...this,
      status: QCStatus.PASSED,
      checkedBy: reviewerId,
      checkedAt: now,
      comments,
    });

    const event: QCPassedEvent = {
      eventId: crypto.randomUUID(),
      eventType: 'QCPassed',
      aggregateId: this.taskId,
      aggregateType: 'Task',
      timestamp: now,
      correlationId: eventMetadata?.correlationId || crypto.randomUUID(),
      causationId: eventMetadata?.causationId || null,
      payload: {
        qcId: this.id,
        taskId: this.taskId,
        workspaceId: this.workspaceId,
        reviewerId,
        reviewNotes: comments,
        passedAt: now,
      },
    };

    entity.domainEvents.push(event);
    return entity;
  }

  /**
   * Mark QC as failed (emits domain event)
   */
  markFailed(reviewerId: string, failureReason: string, eventMetadata?: EventMetadata): QCCheckEntity {
    const now = Date.now();
    const entity = new QCCheckEntity({
      ...this,
      status: QCStatus.FAILED,
      checkedBy: reviewerId,
      checkedAt: now,
      comments: failureReason,
    });

    const event: QCFailedEvent = {
      eventId: crypto.randomUUID(),
      eventType: 'QCFailed',
      aggregateId: this.taskId,
      aggregateType: 'Task',
      timestamp: now,
      correlationId: eventMetadata?.correlationId || crypto.randomUUID(),
      causationId: eventMetadata?.causationId || null,
      payload: {
        qcId: this.id,
        taskId: this.taskId,
        workspaceId: this.workspaceId,
        reviewedById: reviewerId,
        failureReason,
        taskTitle: this.taskSnapshot.title,
        failedAt: now,
      },
    };

    entity.domainEvents.push(event);
    return entity;
  }

  /**
   * Get domain events (for event sourcing)
   */
  getDomainEvents(): ReadonlyArray<QCStartedEvent | QCPassedEvent | QCFailedEvent> {
    return [...this.domainEvents];
  }

  /**
   * Clear domain events (after publishing)
   */
  clearDomainEvents(): void {
    this.domainEvents = [];
  }
}
