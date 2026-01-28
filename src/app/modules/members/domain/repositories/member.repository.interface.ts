
import { MemberAggregate } from '@members/domain/aggregates/member.aggregate';
import { MemberId } from '@members/domain/value-objects/member-id.vo';
import { InjectionToken } from '@angular/core';

export interface MemberRepository {
    findById(id: MemberId): Promise<MemberAggregate | null>;
    save(member: MemberAggregate): Promise<void>;
    delete(id: MemberId): Promise<void>;
    findByWorkspace(workspaceId: string): Promise<MemberAggregate[]>;
    findByUserAndWorkspace(userId: string, workspaceId: string): Promise<MemberAggregate | null>;
}

export const MEMBER_REPOSITORY = new InjectionToken<MemberRepository>('MEMBER_REPOSITORY');
