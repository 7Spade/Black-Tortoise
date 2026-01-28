/**
 * ResourceAction Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export class ResourceAction {
    private readonly value: string;

    private constructor(value: string) {
        if (!value || value.trim().length === 0) {
            throw new Error('ResourceAction cannot be empty');
        }
        this.value = value;
    }

    public static create(action: string): ResourceAction {
        return new ResourceAction(action);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: ResourceAction): boolean {
        return this.value === other.value;
    }
}
