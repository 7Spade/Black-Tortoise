/**
 * Issue Repository Interface
 * 
 * Layer: Domain
 * DDD Pattern: Repository Interface
 */

import { IssueAggregate } from '../aggregates';

export interface IssueRepository {
  findById(id: string): Promise<IssueAggregate | null>;
  findByWorkspaceId(workspaceId: string): Promise<IssueAggregate[]>;
  save(issue: IssueAggregate): Promise<void>;
  delete(id: string): Promise<void>;
}
