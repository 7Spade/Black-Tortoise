export abstract class TemplateEntity<T> {
  protected readonly _id: T;
  
  constructor(id: T) {
    this._id = id;
  }
  
  get id(): T {
    return this._id;
  }
  
  equals(object?: TemplateEntity<T>): boolean {
    if (object == null || object == undefined) {
      return false;
    }
  
    if (this === object) {
      return true;
    }
  
    if (!isEntity(object)) {
      return false;
    }
  
    return this._id === object._id;
  }
}

function isEntity(v: any): v is TemplateEntity<any> {
  return v instanceof TemplateEntity;
}
