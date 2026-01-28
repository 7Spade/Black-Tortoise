
import { MemberAggregate } from '@members/domain/aggregates/member.aggregate';
import { MemberId } from '@members/domain/value-objects/member-id.vo';
import { WorkspaceId, UserId } from '@domain/value-objects';
import { InjectionToken } from '@angular/core';

export interface MemberRepository {
    findById(id: MemberId): Promise<MemberAggregate | null>;
    save(member: MemberAggregate): Promise<void>;
    delete(id: MemberId): Promise<void>;
    findByWorkspace(workspaceId: WorkspaceId): Promise<MemberAggregate[]>;
    findByUserId(userId: UserId): Promise<MemberAggregate[]>;
    findByUserAndWorkspace(userId: UserId, workspaceId: WorkspaceId): Promise<MemberAggregate | null>;
}

export const MEMBER_REPOSITORY = new InjectionToken<MemberRepository>('MEMBER_REPOSITORY');
