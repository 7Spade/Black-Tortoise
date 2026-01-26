/**
 * Create Task Command
 * Layer: Application
 */
export interface CreateTaskCommand {
  workspaceId: string;
  title: string;
  description?: string;
  assigneeId?: string;
  priority?: any; // TaskPriority
  status?: any; // TaskStatus
  dueDate?: Date;
}
