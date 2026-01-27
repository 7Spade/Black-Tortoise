
export interface DailyEntryEntity {
  readonly id: string;
  readonly userId: string;
  readonly workspaceId: string;
  readonly date: string; // YYYY-MM-DD
  readonly tasksWorkedOn: ReadonlyArray<string>; // Task IDs
  readonly notes: string;
  readonly headcount: number;
  readonly submittedAt: number;
}
