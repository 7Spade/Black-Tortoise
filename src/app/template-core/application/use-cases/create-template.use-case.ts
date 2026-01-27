import { Inject, Injectable } from '@angular/core';
import { TemplateFactory } from '../../domain/factories/template.factory';
import { ITemplateRepository } from '../../domain/repositories/template.repository';
import { CreateTemplateCommand } from '../commands/template.commands';
import { TEMPLATE_REPOSITORY_TOKEN } from '../tokens/template-repository.token';

@Injectable({ providedIn: 'root' })
export class CreateTemplateUseCase {
  constructor(
    @Inject(TEMPLATE_REPOSITORY_TOKEN) private repository: ITemplateRepository
  ) {}

  async execute(command: CreateTemplateCommand): Promise<string> {
    // 1. Causality Context Setup
    // In a real app, this might come from a Context Service or Request Scope
    const correlationId = crypto.randomUUID(); 
    const causationId = 'CMD-' + crypto.randomUUID().slice(0, 8); // Simulating Command ID as cause

    // 2. Domain Logic Execution (via Factory)
    const template = TemplateFactory.createValidTemplate(
      command.name,
      command.content,
      {
        userId: command.userId,
        correlationId: correlationId,
        causationId: causationId
      }
    );

    // 3. Persistence
    await this.repository.save(template);

    // 4. Return ID
    return template.id.value;
  }
}
