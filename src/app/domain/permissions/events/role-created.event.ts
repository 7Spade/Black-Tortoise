
export class RoleCreated {
    readonly type = 'RoleCreated';
    constructor(
        public readonly roleId: string,
        public readonly name: string,
        public readonly permissions: string[],
        public readonly correlationId?: string
    ) { }
}
