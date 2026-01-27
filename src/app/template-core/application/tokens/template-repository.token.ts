import { InjectionToken } from '@angular/core';
import { ITemplateRepository } from '../../domain/repositories/template.repository';

export const TEMPLATE_REPOSITORY_TOKEN = new InjectionToken<ITemplateRepository>('TEMPLATE_REPOSITORY_TOKEN');
