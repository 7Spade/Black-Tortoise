import { Template } from '@template-core/domain/aggregates/template.aggregate';
import { TemplateDto } from '../dtos/template.dto';

export class TemplateToDtoMapper {
  public static toDto(template: Template): TemplateDto {
    const primitives = template.toPrimitives();
    const now = new Date();
    const isNew = (now.getTime() - primitives.createdAt.getTime()) < 24 * 60 * 60 * 1000; // < 24 hours

    return {
      id: primitives.id.value,
      displayName: primitives.name,
      previewContent: primitives.content.substring(0, 100) + (primitives.content.length > 100 ? '...' : ''),
      sections: primitives.sections.map(s => ({
          id: s.id,
          title: s.title,
          content: s.content,
          orderIndex: s.orderIndex
      })),
      lastModified: primitives.updatedAt.toLocaleDateString(),
      isNew
    };
  }

  public static toDtoList(templates: Template[]): TemplateDto[] {
    return templates.map(t => this.toDto(t));
  }
}
