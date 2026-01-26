import { InjectionToken } from '@angular/core';
import { AuditLogRepository } from '@domain/repositories';

export const AUDIT_LOG_REPOSITORY = new InjectionToken<AuditLogRepository>('AUDIT_LOG_REPOSITORY');
