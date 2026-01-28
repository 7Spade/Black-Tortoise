
export enum MemberRoleType {
    OWNER = 'owner',
    ADMIN = 'admin',
    MEMBER = 'member',
    GUEST = 'guest'
}

export class MemberRole {
    constructor(public readonly value: MemberRoleType) { }

    static OWNER = new MemberRole(MemberRoleType.OWNER);
    static ADMIN = new MemberRole(MemberRoleType.ADMIN);
    static MEMBER = new MemberRole(MemberRoleType.MEMBER);
    static GUEST = new MemberRole(MemberRoleType.GUEST);

    equals(other: MemberRole): boolean {
        return this.value === other.value;
    }
}
