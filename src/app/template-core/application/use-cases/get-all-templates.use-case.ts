import { Inject, Injectable } from '@angular/core';
import { Template } from '@template-core/domain/aggregates/template.aggregate';
import { ITemplateRepository } from '@template-core/domain/repositories/template.repository';
import { TEMPLATE_REPOSITORY_TOKEN } from '@template-core/application/tokens/template-repository.token';

@Injectable({ providedIn: 'root' })
export class GetAllTemplatesUseCase {
  constructor(
    @Inject(TEMPLATE_REPOSITORY_TOKEN) private repository: ITemplateRepository
  ) {}

  async execute(): Promise<Template[]> {
    return this.repository.findAll();
  }
}
