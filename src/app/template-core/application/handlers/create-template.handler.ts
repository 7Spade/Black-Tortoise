import { Injectable } from '@angular/core';
import { CreateTemplateCommand } from '@template-core/application/commands/template.commands';
import { CreateTemplateUseCase } from '@template-core/application/use-cases/create-template.use-case';

@Injectable({ providedIn: 'root' })
export class CreateTemplateHandler {
  constructor(private useCase: CreateTemplateUseCase) {}

  async handle(command: CreateTemplateCommand): Promise<string> {
    console.log(`[Handler] Handling CreateTemplateCommand for user ${command.userId}`);
    return this.useCase.execute(command);
  }
}
