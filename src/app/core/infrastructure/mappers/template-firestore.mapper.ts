import { Timestamp } from '@angular/fire/firestore';
import { Template } from '../../domain/aggregates/template.aggregate';
import { TemplateId } from '../../domain/value-objects/template-id.vo';

export class TemplateFirestoreMapper {
  static toDomain(data: any): Template {
    return Template.reconstruct({
      id: TemplateId.from(data.id),
      name: data.name,
      content: data.content,
      createdAt: (data.createdAt as Timestamp).toDate(),
      updatedAt: (data.updatedAt as Timestamp).toDate()
    });
  }

  static toPersistence(template: Template): any {
    return {
      id: template.id.value,
      name: template.name,
      content: template.content,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt
    };
  }
}
