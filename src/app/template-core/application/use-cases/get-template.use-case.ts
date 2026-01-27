import { Inject, Injectable } from '@angular/core';
import { Template } from '../../domain/aggregates/template.aggregate';
import { ITemplateRepository } from '../../domain/repositories/template.repository';
import { TEMPLATE_REPOSITORY_TOKEN } from '../interfaces/template.repository';
import { GetTemplateByIdQuery } from '../queries/get-template.query';

@Injectable({ providedIn: 'root' })
export class GetTemplateUseCase {
  constructor(
    @Inject(TEMPLATE_REPOSITORY_TOKEN) private repository: ITemplateRepository
  ) {}

  async execute(query: GetTemplateByIdQuery): Promise<Template | null> {
    return this.repository.findById(query.id);
  }
}
