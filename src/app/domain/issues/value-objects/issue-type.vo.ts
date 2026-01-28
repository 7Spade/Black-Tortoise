/**
 * Issue Type Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export enum IssueTypeEnum {
    BUG = 'BUG',
    FEATURE_REQUEST = 'FEATURE_REQUEST',
    IMPROVEMENT = 'IMPROVEMENT',
    TASK = 'TASK'
}

export class IssueType {
    constructor(public readonly value: IssueTypeEnum) { }

    public static bug(): IssueType {
        return new IssueType(IssueTypeEnum.BUG);
    }

    public static feature(): IssueType {
        return new IssueType(IssueTypeEnum.FEATURE_REQUEST);
    }

    public static create(value: IssueTypeEnum): IssueType {
        return new IssueType(value);
    }

    public equals(other: IssueType): boolean {
        return this.value === other.value;
    }
}
