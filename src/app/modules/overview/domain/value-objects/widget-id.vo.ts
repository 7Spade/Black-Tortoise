/**
 * WidgetId Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export class WidgetId {
    private readonly value: string;

    private constructor(value: string) {
        if (!value || value.trim().length === 0) {
            throw new Error('WidgetId cannot be empty');
        }
        this.value = value;
    }

    public static create(id: string): WidgetId {
        return new WidgetId(id);
    }

    public static generate(): WidgetId {
        return new WidgetId(crypto.randomUUID());
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: WidgetId): boolean {
        return this.value === other.value;
    }
}
