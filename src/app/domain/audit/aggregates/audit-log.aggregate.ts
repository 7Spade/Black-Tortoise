import { AggregateRoot } from '@domain/base/aggregate-root';
import { AuditLogId } from '../value-objects/audit-log-id.vo';
import { ActionType } from '../value-objects/action-type.vo';
import { UserId } from '@domain/value-objects/user-id.vo';
import { WorkspaceId } from '@domain/value-objects/workspace-id.vo';

/**
 * Audit Log Aggregate
 * 
 * Immutable record of a system action.
 */
export interface AuditLogProps {
    action: ActionType;
    actorId: UserId;
    workspaceId: WorkspaceId;
    targetEntity: string;
    targetId: string;
    payload: any;
    timestamp: Date;
}

export class AuditLogAggregate extends AggregateRoot<AuditLogId> {
    public readonly action: ActionType;
    public readonly actorId: UserId;
    public readonly workspaceId: WorkspaceId;
    public readonly targetEntity: string;
    public readonly targetId: string;
    public readonly payload: any;
    public readonly timestamp: Date;

    private constructor(
        id: AuditLogId,
        props: AuditLogProps
    ) {
        super(id);
        this.action = props.action;
        this.actorId = props.actorId;
        this.workspaceId = props.workspaceId;
        this.targetEntity = props.targetEntity;
        this.targetId = props.targetId;
        this.payload = props.payload;
        this.timestamp = props.timestamp;
    }

    public static create(
        id: AuditLogId,
        props: Omit<AuditLogProps, 'timestamp'>
    ): AuditLogAggregate {
        return new AuditLogAggregate(
            id,
            {
                ...props,
                timestamp: new Date()
            }
        );
    }
}
