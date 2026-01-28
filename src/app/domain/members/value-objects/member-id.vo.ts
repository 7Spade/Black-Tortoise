
export class MemberId {
    constructor(public readonly value: string) {
        if (!value) throw new Error('MemberId cannot be empty');
    }

    equals(other: MemberId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
