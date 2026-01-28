/**
 * RoleId Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export class RoleId {
    private readonly value: string;

    private constructor(value: string) {
        if (!value || value.trim().length === 0) {
            throw new Error('RoleId cannot be empty');
        }
        this.value = value;
    }

    public static create(id: string): RoleId {
        return new RoleId(id);
    }

    public static generate(): RoleId {
        return new RoleId(crypto.randomUUID());
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: RoleId): boolean {
        return this.value === other.value;
    }
}
