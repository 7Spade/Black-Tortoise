export class TemplateDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TemplateDomainException';
  }
}

export class TemplateValidationException extends TemplateDomainException {
  constructor(message: string) {
    super(`Validation Error: ${message}`);
    this.name = 'TemplateValidationException';
  }
}

export class TemplateNotFoundException extends TemplateDomainException {
  constructor(id: string) {
    super(`Template with ID ${id} not found.`);
    this.name = 'TemplateNotFoundException';
  }
}
