
export class DailyEntryId {
    constructor(public readonly value: string) {
        if (!value) throw new Error('DailyEntryId cannot be empty');
    }

    equals(other: DailyEntryId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
