import { InjectionToken } from '@angular/core';
import { DailyRepository } from '@daily/domain';

export const DAILY_REPOSITORY = new InjectionToken<DailyRepository>('DAILY_REPOSITORY');
