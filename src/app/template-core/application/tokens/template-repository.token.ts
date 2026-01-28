import { InjectionToken } from '@angular/core';
import { ITemplateRepository } from '@template-core/domain/repositories/template.repository';

export const TEMPLATE_REPOSITORY_TOKEN = new InjectionToken<ITemplateRepository>('TEMPLATE_REPOSITORY_TOKEN');
