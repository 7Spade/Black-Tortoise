
export class DocumentId {
    constructor(public readonly value: string) {
        if (!value) throw new Error('DocumentId cannot be empty');
    }

    equals(other: DocumentId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
