import { InjectionToken } from '@angular/core';
import { OverviewRepository } from '@domain/repositories';

export const OVERVIEW_REPOSITORY = new InjectionToken<OverviewRepository>('OVERVIEW_REPOSITORY');
