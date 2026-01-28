/**
 * Issue Status Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export enum IssueStatusEnum {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED',
    REOPENED = 'REOPENED'
}

export class IssueStatus {
    constructor(public readonly value: IssueStatusEnum) { }

    public static open(): IssueStatus {
        return new IssueStatus(IssueStatusEnum.OPEN);
    }

    public static create(value: IssueStatusEnum): IssueStatus {
        return new IssueStatus(value);
    }

    public isClosed(): boolean {
        return this.value === IssueStatusEnum.CLOSED;
    }

    public equals(other: IssueStatus): boolean {
        return this.value === other.value;
    }
}
