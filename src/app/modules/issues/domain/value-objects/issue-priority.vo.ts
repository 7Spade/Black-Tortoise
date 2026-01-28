/**
 * Issue Priority Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export enum IssuePriorityEnum {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL'
}

export class IssuePriority {
    constructor(public readonly value: IssuePriorityEnum) { }

    public static low(): IssuePriority {
        return new IssuePriority(IssuePriorityEnum.LOW);
    }

    public static medium(): IssuePriority {
        return new IssuePriority(IssuePriorityEnum.MEDIUM);
    }

    public static high(): IssuePriority {
        return new IssuePriority(IssuePriorityEnum.HIGH);
    }

    public static critical(): IssuePriority {
        return new IssuePriority(IssuePriorityEnum.CRITICAL);
    }

    public static create(value: IssuePriorityEnum): IssuePriority {
        return new IssuePriority(value);
    }

    public equals(other: IssuePriority): boolean {
        return this.value === other.value;
    }
}
