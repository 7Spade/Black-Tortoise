import { Inject, Injectable } from '@angular/core';
import { Template } from '../../domain/aggregates/template.aggregate';
import { ITemplateRepository } from '../../domain/repositories/template.repository';
import { TEMPLATE_REPOSITORY_TOKEN } from '../tokens/template-repository.token';

@Injectable({ providedIn: 'root' })
export class GetAllTemplatesUseCase {
  constructor(
    @Inject(TEMPLATE_REPOSITORY_TOKEN) private repository: ITemplateRepository
  ) {}

  async execute(): Promise<Template[]> {
    return this.repository.findAll();
  }
}
