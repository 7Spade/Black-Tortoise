import { Injectable, inject } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskCommand } from '@tasks/application/commands/create-task.command';
import { TASK_REPOSITORY } from '@tasks/application/interfaces/task-repository.token';
import { createTask, TaskAggregate } from '@tasks/domain/aggregates/task.aggregate';
import { TaskId } from '@tasks/domain/value-objects/task-id.vo';
import { WorkspaceId } from '@domain/value-objects/workspace-id.vo';
import { TaskPriority } from '@tasks/domain/value-objects/task-priority.vo';
import { TaskStatus } from '@tasks/domain/value-objects/task-status.vo';
import { UserId } from '@domain/value-objects/user-id.vo';

@Injectable({
  providedIn: 'root'
})
export class CreateTaskHandler {
  private readonly repository = inject(TASK_REPOSITORY);

  async execute(command: CreateTaskCommand): Promise<TaskAggregate> {
    const id = new TaskId(uuidv4());
    const workspaceId = WorkspaceId.create(command.workspaceId);

    // Create new task with required fields
    const task = createTask(
      id,
      workspaceId,
      command.title
    );

    // Apply optional fields
    if (command.description) {
      task.description = command.description;
    }

    if (command.priority) {
      task.priority = TaskPriority.create(command.priority);
    }

    if (command.status) {
      task.status = TaskStatus.create(command.status);
    }

    if (command.dueDate) {
      task.dueDate = command.dueDate;
    }

    if (command.assigneeId) {
      task.assigneeId = UserId.create(command.assigneeId);
    }

    await this.repository.save(task);

    return task;
  }
}
