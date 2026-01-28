import { InjectionToken } from '@angular/core';
import { TaskRepository } from '@tasks/domain';

export const TASK_REPOSITORY = new InjectionToken<TaskRepository>('TASK_REPOSITORY');
