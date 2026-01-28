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
    SUSPENDED = 'SUSPENDED'
}

export class MemberStatus {
    constructor(public readonly value: MemberStatusEnum) { }

    public static active(): MemberStatus {
        return new MemberStatus(MemberStatusEnum.ACTIVE);
    }

    public static invited(): MemberStatus {
        return new MemberStatus(MemberStatusEnum.INVITED);
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
