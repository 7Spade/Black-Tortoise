/**
 * ChangeDocumentStatusUseCase
 * 
 * Layer: Application
 * Pattern: Use Case
 */

import { Injectable, inject } from '@angular/core';
import { ChangeDocumentStatusCommand } from '../commands/change-document-status.command';
// import { DocumentsRepository } from '@domain/modules/documents/repositories';

@Injectable({ providedIn: 'root' })
export class ChangeDocumentStatusUseCase {
  // private repo = inject(DocumentsRepository);

  async execute(command: ChangeDocumentStatusCommand): Promise<void> {
    // TODO: Implement Use Case logic
    // 1. Load Aggregate
    // 2. Invoke method
    // 3. Save
    // 4. Update Store (via return or event)
    console.log('Execute ChangeDocumentStatusUseCase', command);
  }
}
