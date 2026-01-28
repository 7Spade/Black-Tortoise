/**
 * FolderId Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export class FolderId {
    private readonly value: string;

    private constructor(value: string) {
        if (!value || value.trim().length === 0) {
            throw new Error('FolderId cannot be empty');
        }
        this.value = value;
    }

    public static create(id: string): FolderId {
        return new FolderId(id);
    }

    public static generate(): FolderId {
        return new FolderId(crypto.randomUUID());
    }

    public static root(): FolderId {
        return new FolderId('ROOT');
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: FolderId): boolean {
        return this.value === other.value;
    }
}
