import { AggregateRoot } from '@domain/base/aggregate-root';
import { MemberId } from '../value-objects/member-id.vo';
import { MemberRole } from '../value-objects/member-role.vo';
import { MemberStatus } from '../value-objects/member-status.vo';
import { UserId } from '@domain/value-objects/user-id.vo';
import { WorkspaceId } from '@domain/value-objects/workspace-id.vo';

/**
 * Member Aggregate
 * 
 * Represents a user's membership within a workspace.
 */
export interface MemberProps {
    userId: UserId;
    workspaceId: WorkspaceId;
    role: MemberRole;
    status: MemberStatus;
    joinedAt: Date;
}

export class MemberAggregate extends AggregateRoot<MemberId> {
    public readonly userId: UserId;
    public readonly workspaceId: WorkspaceId;
    public role: MemberRole;
    public status: MemberStatus;
    public readonly joinedAt: Date;

    private constructor(
        id: MemberId,
        props: MemberProps
    ) {
        super(id);
        this.userId = props.userId;
        this.workspaceId = props.workspaceId;
        this.role = props.role;
        this.status = props.status;
        this.joinedAt = props.joinedAt;
    }

    public static create(
        id: MemberId,
        userId: UserId,
        workspaceId: WorkspaceId,
        role: MemberRole
    ): MemberAggregate {
        return new MemberAggregate(
            id,
            {
                userId,
                workspaceId,
                role,
                status: MemberStatus.active(),
                joinedAt: new Date()
            }
        );
    }

    public updateRole(newRole: MemberRole): void {
        this.role = newRole;
    }

    public deactivate(): void {
        this.status = MemberStatus.inactive();
    }
}
