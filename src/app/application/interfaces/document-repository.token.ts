import { InjectionToken } from '@angular/core';
import { DocumentRepository } from '@domain/repositories';

export const DOCUMENT_REPOSITORY = new InjectionToken<DocumentRepository>('DOCUMENT_REPOSITORY');
