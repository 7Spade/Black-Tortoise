import { InjectionToken } from '@angular/core';
import { QualityControlRepository } from '@domain/repositories';

export const QUALITY_CONTROL_REPOSITORY = new InjectionToken<QualityControlRepository>('QUALITY_CONTROL_REPOSITORY');
