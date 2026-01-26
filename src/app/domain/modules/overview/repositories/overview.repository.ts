
import { OverviewDashboard } from '../aggregates/overview-dashboard.aggregate';

export interface OverviewRepository {
  getDashboard(workspaceId: string): Promise<OverviewDashboard>;
  // This might be a read-only repository in many cases, or updated by projections
}
