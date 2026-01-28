import { InjectionToken } from '@angular/core';
import { QualityControlRepository } from '@quality-control/domain';

export const QUALITY_CONTROL_REPOSITORY = new InjectionToken<QualityControlRepository>('QUALITY_CONTROL_REPOSITORY');
