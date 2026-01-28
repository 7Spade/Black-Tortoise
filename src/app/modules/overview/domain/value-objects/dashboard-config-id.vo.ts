
export class DashboardConfigId {
    constructor(public readonly value: string) {
        if (!value) throw new Error('DashboardConfigId cannot be empty');
    }

    equals(other: DashboardConfigId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
