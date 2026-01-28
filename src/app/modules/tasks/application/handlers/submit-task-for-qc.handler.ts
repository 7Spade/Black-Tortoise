import { Injectable, inject } from '@angular/core';
import { PublishEventHandler } from '@application/handlers/publish-event.handler';
import { TASK_REPOSITORY } from '@tasks/application/interfaces/task-repository.token';
import { TaskStatus } from '@tasks/domain/value-objects/task-status.vo';
import { createTaskSubmittedForQCEvent } from '@tasks/domain/events/task-submitted-for-qc.event';
import { TaskId } from '@tasks/domain/value-objects/task-id.vo';

export interface SubmitTaskForQCRequest {
    readonly taskId: string;
    readonly workspaceId: string;
    readonly taskTitle: string;
    readonly submittedBy: string;
    readonly correlationId?: string;
    readonly causationId?: string | null;
}

export interface SubmitTaskForQCResponse {
    readonly success: boolean;
    readonly error?: string;
}

@Injectable({ providedIn: 'root' })
export class SubmitTaskForQCHandler {
    private readonly repo = inject(TASK_REPOSITORY);
    private readonly publishEvent = inject(PublishEventHandler);

    async execute(
        request: SubmitTaskForQCRequest,
    ): Promise<SubmitTaskForQCResponse> {
        try {
            // 1. Load
            const taskId = new TaskId(request.taskId);
            const task = await this.repo.findById(taskId);
            if (!task) {
                throw new Error(`Task not found: ${request.taskId}`);
            }

            // 2. Logic: Update Status to IN_QC
            // Direct assignment as TaskAggregate allows manual status update
            task.status = TaskStatus.IN_QC;

            // 3. Save
            await this.repo.save(task);

            // 4. Publish
            const event = createTaskSubmittedForQCEvent({
                taskId: task.id.value,
                workspaceId: task.workspaceId.getValue(),
                taskTitle: task.title,
                submittedById: request.submittedBy,
                ...(request.correlationId ? { correlationId: request.correlationId } : {}),
                ...(request.causationId ? { causationId: request.causationId } : {})
            });

            await this.publishEvent.execute({ event });

            return { success: true };
        } catch (error) {
            console.error('SubmitTaskForQCHandler error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
}
