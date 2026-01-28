import { DomainEvent } from '../domain-event.interface';

export const PERMISSIONS_SOURCE = 'Permissions';

export class PermissionChanged implements DomainEvent<{ roleId: string; permissionIds: string[] }> {
    readonly type = 'Permissions.PermissionChanged';
    readonly source = PERMISSIONS_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { roleId: string; permissionIds: string[] },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.roleId;
    }
}

export class RoleCreated implements DomainEvent<{ roleId: string; name: string; description?: string }> {
    readonly type = 'Permissions.RoleCreated';
    readonly source = PERMISSIONS_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { roleId: string; name: string; description?: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.roleId;
    }
}

export class RoleUpdated implements DomainEvent<{ roleId: string; changes: Record<string, unknown> }> {
    readonly type = 'Permissions.RoleUpdated';
    readonly source = PERMISSIONS_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { roleId: string; changes: Record<string, unknown> },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.roleId;
    }
}

export class RoleDeleted implements DomainEvent<{ roleId: string }> {
    readonly type = 'Permissions.RoleDeleted';
    readonly source = PERMISSIONS_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { roleId: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.roleId;
    }
}
