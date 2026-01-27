/**
 * ManDay Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 * Purpose: Encapsulate headcount validation (0.1 to 1.0 range)
 * 
 * Business Rules:
 * - Must be between 0.1 and 1.0
 * - Represents traditional industry man-day tracking
 * - Supports full day (1.0), half day (0.5), quarter day (0.25)
 */
export class ManDay {
  private readonly _value: number;

  private constructor(value: number) {
    if (value < 0.1 || value > 1.0) {
      throw new Error('ManDay must be between 0.1 and 1.0');
    }
    this._value = value;
  }

  public static create(value: number): ManDay {
    return new ManDay(value);
  }

  public get value(): number {
    return this._value;
  }

  public equals(other: ManDay): boolean {
    if (!other) return false;
    return this._value === other._value;
  }

  public toString(): string {
    return this._value.toString();
  }
}
