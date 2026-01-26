import { InjectionToken } from '@angular/core';
import { IssueRepository } from '@domain/repositories';

export const ISSUE_REPOSITORY = new InjectionToken<IssueRepository>('ISSUE_REPOSITORY');
