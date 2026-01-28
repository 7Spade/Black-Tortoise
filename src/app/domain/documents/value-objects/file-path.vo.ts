/**
 * FilePath Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export class FilePath {
    private readonly value: string;

    private constructor(value: string) {
        if (!value || value.trim().length === 0) {
            throw new Error('FilePath cannot be empty');
        }
        // Simple validation, can be improved
        if (value.includes('..') || value.includes('\\')) {
            throw new Error('Invalid file path format');
        }
        this.value = value;
    }

    public static create(path: string): FilePath {
        return new FilePath(path);
    }

    public getValue(): string {
        return this.value;
    }

    public getExtension(): string {
        const parts = this.value.split('.');
        return parts.length > 1 ? parts.pop()! : '';
    }

    public equals(other: FilePath): boolean {
        return this.value === other.value;
    }
}
