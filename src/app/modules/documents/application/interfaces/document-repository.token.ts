import { InjectionToken } from '@angular/core';
import { DocumentRepository } from '@documents/domain';

export const DOCUMENT_REPOSITORY = new InjectionToken<DocumentRepository>('DOCUMENT_REPOSITORY');
