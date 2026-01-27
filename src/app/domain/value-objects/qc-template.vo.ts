/**
 * QCTemplate Value Object
 *
 * Layer: Domain - Value Objects
 * Purpose: Defines checklist template for different task types
 *
 * Immutability: All properties readonly
 * Template Pattern: Maps task type to default checklist items
 */

export interface ChecklistItemTemplate {
  readonly name: string;
  readonly description: string;
  readonly isRequired: boolean;
}

export interface QCTemplateProps {
  readonly taskType: string;
  readonly templateName: string;
  readonly checklistItems: ReadonlyArray<ChecklistItemTemplate>;
}

export class QCTemplate {
  readonly taskType: string;
  readonly templateName: string;
  readonly checklistItems: ReadonlyArray<ChecklistItemTemplate>;

  private constructor(props: QCTemplateProps) {
    if (!props.taskType || props.taskType.trim().length === 0) {
      throw new Error('QCTemplate taskType cannot be empty');
    }

    if (!props.templateName || props.templateName.trim().length === 0) {
      throw new Error('QCTemplate templateName cannot be empty');
    }

    if (!props.checklistItems || props.checklistItems.length === 0) {
      throw new Error('QCTemplate must have at least one checklist item');
    }

    this.taskType = props.taskType.trim();
    this.templateName = props.templateName.trim();
    this.checklistItems = [...props.checklistItems];
  }

  static create(props: QCTemplateProps): QCTemplate {
    return new QCTemplate(props);
  }

  static createDefault(): QCTemplate {
    return new QCTemplate({
      taskType: 'default',
      templateName: 'Default QC Template',
      checklistItems: [
        {
          name: 'Requirements Met',
          description: 'Verify all requirements from task description are fulfilled',
          isRequired: true,
        },
        {
          name: 'Quality Standards',
          description: 'Check if work meets quality standards',
          isRequired: true,
        },
        {
          name: 'Documentation',
          description: 'Verify necessary documentation is included',
          isRequired: false,
        },
      ],
    });
  }

  equals(other: QCTemplate): boolean {
    return (
      this.taskType === other.taskType &&
      this.templateName === other.templateName &&
      JSON.stringify(this.checklistItems) === JSON.stringify(other.checklistItems)
    );
  }

  getRequiredItemCount(): number {
    return this.checklistItems.filter(item => item.isRequired).length;
  }

  getTotalItemCount(): number {
    return this.checklistItems.length;
  }
}
