import { DomainEvent } from '../domain-event.interface';

export const WORKSPACE_SOURCE = 'Workspace';

export class WorkspaceCreated implements DomainEvent<{
    workspaceId: string;
    name: string;
    ownerId: string;
    ownerType: 'user' | 'organization';
    moduleIds: string[];
}> {
    readonly type = 'Workspace.WorkspaceCreated';
    readonly source = WORKSPACE_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: {
            workspaceId: string;
            name: string;
            ownerId: string;
            ownerType: 'user' | 'organization';
            moduleIds: string[];
        },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.workspaceId;
    }
}

export class WorkspaceRenamed implements DomainEvent<{ workspaceId: string; oldName: string; newName: string }> {
    readonly type = 'Workspace.WorkspaceRenamed';
    readonly source = WORKSPACE_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { workspaceId: string; oldName: string; newName: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.workspaceId;
    }
}

export class ModuleActivated implements DomainEvent<{ workspaceId: string; moduleId: string }> {
    readonly type = 'Workspace.ModuleActivated';
    readonly source = WORKSPACE_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { workspaceId: string; moduleId: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.workspaceId;
    }
}

export class ModuleDeactivated implements DomainEvent<{ workspaceId: string; moduleId: string }> {
    readonly type = 'Workspace.ModuleDeactivated';
    readonly source = WORKSPACE_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { workspaceId: string; moduleId: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.workspaceId;
    }
}
