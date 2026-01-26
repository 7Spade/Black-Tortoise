import { InjectionToken } from '@angular/core';
import { TaskRepository } from '@domain/repositories';

export const TASK_REPOSITORY = new InjectionToken<TaskRepository>('TASK_REPOSITORY');
