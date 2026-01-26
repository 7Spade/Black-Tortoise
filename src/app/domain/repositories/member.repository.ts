/**
 * Member Repository Interface
 * 
 * Layer: Domain
 * DDD Pattern: Repository Interface
 */

import { MemberAggregate } from '../aggregates';

export interface MemberRepository {
  findById(id: string): Promise<MemberAggregate | null>;
  findByUserId(userId: string): Promise<MemberAggregate[]>;
  findByWorkspaceId(workspaceId: string): Promise<MemberAggregate[]>;
  save(member: MemberAggregate): Promise<void>;
  delete(id: string): Promise<void>;
}
