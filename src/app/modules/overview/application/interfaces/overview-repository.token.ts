import { InjectionToken } from '@angular/core';
import { OverviewRepository } from '@overview/domain';

export const OVERVIEW_REPOSITORY = new InjectionToken<OverviewRepository>('OVERVIEW_REPOSITORY');
