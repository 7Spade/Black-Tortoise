/**
 * PermissionId Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export class PermissionId {
    private readonly value: string;

    private constructor(value: string) {
        if (!value || value.trim().length === 0) {
            throw new Error('PermissionId cannot be empty');
        }
        this.value = value;
    }

    public static create(id: string): PermissionId {
        return new PermissionId(id);
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: PermissionId): boolean {
        return this.value === other.value;
    }
}
