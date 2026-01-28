import { Injectable } from '@angular/core';
import { Template } from '@template-core/domain/aggregates/template.aggregate';
import { GetTemplateByIdQuery } from '../queries/get-template.query';
import { GetTemplateUseCase } from '../use-cases/get-template.use-case';

@Injectable({ providedIn: 'root' })
export class GetTemplateHandler {
  constructor(private useCase: GetTemplateUseCase) {}

  async handle(query: GetTemplateByIdQuery): Promise<Template | null> {
    return this.useCase.execute(query);
  }
}
