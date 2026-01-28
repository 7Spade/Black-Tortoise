import { Inject, Injectable } from '@angular/core';
import { Template } from '@template-core/domain/aggregates/template.aggregate';
import { ITemplateRepository } from '@template-core/domain/repositories/template.repository';
import { GetTemplateByIdQuery } from '@template-core/application/queries/get-template.query';
import { TEMPLATE_REPOSITORY_TOKEN } from '@template-core/application/tokens/template-repository.token';

@Injectable({ providedIn: 'root' })
export class GetTemplateUseCase {
  constructor(
    @Inject(TEMPLATE_REPOSITORY_TOKEN) private repository: ITemplateRepository
  ) {}

  async execute(query: GetTemplateByIdQuery): Promise<Template | null> {
    return this.repository.findById(query.id);
  }
}
