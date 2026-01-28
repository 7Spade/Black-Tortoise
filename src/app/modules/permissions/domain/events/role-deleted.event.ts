
export class RoleDeleted {
    readonly type = 'RoleDeleted';
    constructor(
        public readonly roleId: string,
        public readonly correlationId?: string
    ) { }
}
