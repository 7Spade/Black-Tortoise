
export class RoleUpdated {
    readonly type = 'RoleUpdated';
    constructor(
        public readonly roleId: string,
        public readonly name: string,
        public readonly permissions: string[],
        public readonly correlationId?: string
    ) { }
}
