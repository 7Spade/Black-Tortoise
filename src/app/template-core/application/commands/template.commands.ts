// Command Object Definition
export class CreateTemplateCommand {
  constructor(
    public readonly name: string,
    public readonly content: string,
    public readonly userId: string
  ) {}
}

export class UpdateTemplateContentCommand {
  constructor(
    public readonly templateId: string,
    public readonly newContent: string,
    public readonly userId: string
  ) {}
}

export class AddTemplateSectionCommand {
  constructor(
    public readonly templateId: string,
    public readonly title: string,
    public readonly content: string,
    public readonly userId: string
  ) {}
}
