
export class TaskId {
    constructor(public readonly value: string) {
        if (!value) throw new Error('TaskId cannot be empty');
    }

    equals(other: TaskId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
