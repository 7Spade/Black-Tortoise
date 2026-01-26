import { InjectionToken } from '@angular/core';
import { DailyRepository } from '@domain/repositories';

export const DAILY_REPOSITORY = new InjectionToken<DailyRepository>('DAILY_REPOSITORY');
