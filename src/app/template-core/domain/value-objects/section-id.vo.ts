export class SectionId {
  private constructor(public readonly value: string) {
    if (!value) {
      throw new Error('SectionId cannot be empty');
    }
  }

  public static create(): SectionId {
    return new SectionId(crypto.randomUUID());
  }

  public static from(id: string): SectionId {
    return new SectionId(id);
  }

  public equals(other: SectionId): boolean {
    return other.value === this.value;
  }
}
