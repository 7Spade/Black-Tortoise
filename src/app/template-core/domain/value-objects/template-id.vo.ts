export class TemplateId {
  private constructor(public readonly value: string) {}

  public static create(): TemplateId {
    return new TemplateId(crypto.randomUUID());
  }

  public static from(id: string): TemplateId {
    return new TemplateId(id);
  }
}
