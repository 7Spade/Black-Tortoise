/**
 * QCRecordFactory
 *
 * Layer: Domain - Factories
 * Purpose: Create QC records with template application and policy enforcement
 *
 * Responsibilities:
 * - Apply QC template based on task type
 * - Enforce QC criteria policies
 * - Delegate to aggregate for creation with events
 */

import { EventMetadata } from '../events/event-metadata';
import { QCCheckEntity } from '../aggregates/quality-control.aggregate';
import { ChecklistItem } from '../value-objects/checklist-item.vo';
import { TaskSnapshot } from '../value-objects/task-snapshot.vo';
import { QCTemplate } from '../value-objects/qc-template.vo';

export class QCRecordFactory {
  /**
   * Create QC record with template application
   */
  static create(
    qcId: string,
    taskId: string,
    workspaceId: string,
    taskType: string,
    taskSnapshot: TaskSnapshot,
    template: QCTemplate,
    eventMetadata?: EventMetadata
  ): QCCheckEntity {
    // Validate task type matches template
    if (template.taskType !== taskType && template.taskType !== 'default') {
      throw new Error(`Template task type mismatch: expected ${taskType}, got ${template.taskType}`);
    }

    // Convert template items to pending checklist items
    const checklistItems: ReadonlyArray<ChecklistItem> = template.checklistItems.map(item =>
      ChecklistItem.createPending(item.name, item.description, item.isRequired)
    );

    // Create entity via aggregate (emits domain events)
    return QCCheckEntity.create(qcId, taskId, workspaceId, checklistItems, taskSnapshot, eventMetadata);
  }

  /**
   * Create with default template
   */
  static createWithDefaultTemplate(
    qcId: string,
    taskId: string,
    workspaceId: string,
    taskSnapshot: TaskSnapshot,
    eventMetadata?: EventMetadata
  ): QCCheckEntity {
    const defaultTemplate = QCTemplate.createDefault();
    return this.create(qcId, taskId, workspaceId, 'default', taskSnapshot, defaultTemplate, eventMetadata);
  }
}
