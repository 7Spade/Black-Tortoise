/**
 * Submit Daily Entry Command
 * 
 * Layer: Domain
 * DDD Pattern: Command
 */

export interface SubmitDailyEntryCommand {
  id: string;
  userId: string;
  workspaceId: string;
  date: string;
  tasksWorkedOn: string[];
  notes: string;
  hoursSpent: number;
}
