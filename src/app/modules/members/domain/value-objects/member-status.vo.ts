/**
 * Member Status Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export enum MemberStatusEnum {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    INVITED = 'INVITED',
    SUSPENDED = 'SUSPENDED',
    REMOVED = 'REMOVED'
}

export class MemberStatus {
    constructor(public readonly value: MemberStatusEnum) { }

    public static active(): MemberStatus {
        return new MemberStatus(MemberStatusEnum.ACTIVE);
    }

    public static inactive(): MemberStatus {
        return new MemberStatus(MemberStatusEnum.INACTIVE);
    }

    public static invited(): MemberStatus {
        return new MemberStatus(MemberStatusEnum.INVITED);
    }

    public static suspended(): MemberStatus {
        return new MemberStatus(MemberStatusEnum.SUSPENDED);
    }

    public static removed(): MemberStatus {
        return new MemberStatus(MemberStatusEnum.REMOVED);
    }

    public static create(value: MemberStatusEnum): MemberStatus {
        return new MemberStatus(value);
    }

    public isActive(): boolean {
        return this.value === MemberStatusEnum.ACTIVE;
    }

    public equals(other: MemberStatus): boolean {
        return this.value === other.value;
    }
}
