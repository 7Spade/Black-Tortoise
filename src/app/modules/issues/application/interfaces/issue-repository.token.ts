import { InjectionToken } from '@angular/core';
import { IssueRepository } from '@issues/domain';

export const ISSUE_REPOSITORY = new InjectionToken<IssueRepository>('ISSUE_REPOSITORY');
