
export class PermissionChanged {
    readonly type = 'PermissionChanged';
    constructor(
        public readonly roleId: string,
        public readonly addedPermissions: string[],
        public readonly removedPermissions: string[],
        public readonly correlationId?: string
    ) { }
}
