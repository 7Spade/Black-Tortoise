import { SectionId } from '@template-core/domain/value-objects/section-id.vo';

// Child Entity
// Has identity (SectionId) but its lifecycle is managed by the Aggregate Root (Template)
export class TemplateSection {
  constructor(
    public readonly id: SectionId,
    public title: string,
    public content: string,
    public orderIndex: number
  ) {
    if (!title) throw new Error('Section title is required');
    if (orderIndex < 0) throw new Error('Order index cannot be negative');
  }

  updateContent(newContent: string): void {
    this.content = newContent;
  }

  updateTitle(newTitle: string): void {
    if (!newTitle) throw new Error('Section title cannot be empty');
    this.title = newTitle;
  }
}
