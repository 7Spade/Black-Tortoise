import { InjectionToken } from '@angular/core';
import { AcceptanceRepository } from '@acceptance/domain';

export const ACCEPTANCE_REPOSITORY = new InjectionToken<AcceptanceRepository>('ACCEPTANCE_REPOSITORY');
