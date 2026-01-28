
export class IssueId {
    constructor(public readonly value: string) {
        if (!value) throw new Error('IssueId cannot be empty');
    }

    equals(other: IssueId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
