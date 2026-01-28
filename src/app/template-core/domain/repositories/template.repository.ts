import { Template } from '@template-core/domain/aggregates/template.aggregate';

export interface ITemplateRepository {
  findById(id: string): Promise<Template | null>;
  findAll(): Promise<Template[]>;
  save(template: Template): Promise<void>;
  delete(id: string): Promise<void>;
}
