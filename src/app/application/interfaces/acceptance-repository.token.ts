import { InjectionToken } from '@angular/core';
import { AcceptanceRepository } from '@domain/repositories';

export const ACCEPTANCE_REPOSITORY = new InjectionToken<AcceptanceRepository>('ACCEPTANCE_REPOSITORY');
