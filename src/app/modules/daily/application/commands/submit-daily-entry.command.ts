/**
 * Submit Daily Entry Command
 * 
 * Layer: Application
 * DDD Pattern: Command
 */

export interface SubmitDailyEntryCommand {
  id: string;
  userId: string;
  workspaceId: string;
  date: string;
  tasksWorkedOn: string[];
  notes: string;
  headcount: number;
}
