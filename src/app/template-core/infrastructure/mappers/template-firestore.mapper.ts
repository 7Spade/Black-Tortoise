import { Timestamp } from '@angular/fire/firestore';
import { Template } from '@template-core/domain/aggregates/template.aggregate';
import { TemplateId } from '@template-core/domain/value-objects/template-id.vo';

export class TemplateFirestoreMapper {
  static toDomain(data: any): Template {
    return Template.reconstruct({
      id: TemplateId.from(data.id),
      name: data.name,
      content: data.content,
      sections: (data.sections || []).map((s: any) => ({
          id: s.id,
          title: s.title,
          content: s.content,
          orderIndex: s.orderIndex
      })),
      createdAt: (data.createdAt as Timestamp).toDate(),
      updatedAt: (data.updatedAt as Timestamp).toDate()
    });
  }

  static toPersistence(template: Template): any {
    const primitives = template.toPrimitives();
    return {
      id: primitives.id.value,
      name: primitives.name,
      content: primitives.content,
      sections: primitives.sections,
      createdAt: primitives.createdAt,
      updatedAt: primitives.updatedAt
    };
  }
}
