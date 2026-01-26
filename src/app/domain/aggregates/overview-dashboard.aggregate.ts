
export interface OverviewDashboard {
  readonly workspaceId: string;
  readonly activeTaskCount: number;
  readonly completedTaskCount: number;
  readonly pendingIssuesCount: number;
  readonly upcomingDeadlines: ReadonlyArray<{ taskId: string; dueDate: number }>;
  readonly lastCalculatedAt: number;
}

export const INITIAL_DASHBOARD: OverviewDashboard = {
  workspaceId: '',
  activeTaskCount: 0,
  completedTaskCount: 0,
  pendingIssuesCount: 0,
  upcomingDeadlines: [],
  lastCalculatedAt: 0
};
