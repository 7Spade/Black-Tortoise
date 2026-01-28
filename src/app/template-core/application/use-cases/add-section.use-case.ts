import { Inject, Injectable } from '@angular/core';
import { ITemplateRepository } from '@template-core/domain/repositories/template.repository';
import { AddTemplateSectionCommand } from '@template-core/application/commands/template.commands';
import { TEMPLATE_REPOSITORY_TOKEN } from '@template-core/application/tokens/template-repository.token';

@Injectable({ providedIn: 'root' })
export class AddSectionToTemplateUseCase {
  constructor(
    @Inject(TEMPLATE_REPOSITORY_TOKEN) private repository: ITemplateRepository
  ) {}

  async execute(command: AddTemplateSectionCommand): Promise<void> {
    // 1. Load Aggregate
    const template = await this.repository.findById(command.templateId);
    if (!template) {
      throw new Error(`Template with id ${command.templateId} not found`);
    }

    // 2. Causality Context Setup
    // In a real app, correlationId might come from the input command (if chaining) or context
    const correlationId = crypto.randomUUID(); 
    const causationId = 'CMD-' + crypto.randomUUID().slice(0, 8);

    // 3. Domain Logic Execution
    // Pass metadata to the aggregate so the event carries the trace
    template.addSection(command.title, command.content, {
        userId: command.userId,
        correlationId: correlationId,
        causationId: causationId
    });

    // 4. Persistence
    await this.repository.save(template);
  }
}
