import { Entity } from '../base/entity';
import { TemplateId } from '../value-objects/template-id.vo';

export interface TemplateProps {
  id: TemplateId;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Template extends Entity<TemplateId> {
  private _name: string;
  private _content: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: TemplateProps) {
    super(props.id);
    this._name = props.name;
    this._content = props.content;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static create(name: string, content: string): Template {
    return new Template({
      id: TemplateId.create(),
      name,
      content,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  public static reconstruct(props: TemplateProps): Template {
    return new Template(props);
  }

  // Getters
  get name(): string { return this._name; }
  get content(): string { return this._content; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  // Business Logic Methods
  public updateContent(newContent: string): void {
    if (!newContent) {
      throw new Error('Content cannot be empty');
    }
    this._content = newContent;
    this._updatedAt = new Date();
  }

  public toPrimitives(): any {
      return {
          id: this.id.value,
          name: this.name,
          content: this.content,
          createdAt: this.createdAt,
          updatedAt: this.updatedAt
      }
  }
}
