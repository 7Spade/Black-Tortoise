/**
 * ChangeDocumentStatusHandler
 * 
 * Layer: Application
 * Pattern: Use Case
 */

import { Injectable, inject } from '@angular/core';
import { ChangeDocumentStatusCommand } from '../commands/change-document-status.command';
// import { DocumentRepository } from '@documents/domain';

@Injectable({ providedIn: 'root' })
export class ChangeDocumentStatusHandler {
  // private repo = inject(DocumentRepository);

  async execute(command: ChangeDocumentStatusCommand): Promise<void> {
    // TODO: Implement Use Case logic
    // 1. Load Aggregate
    // 2. Invoke method
    // 3. Save
    // 4. Update Store (via return or event)
    console.log('Execute ChangeDocumentStatusHandler', command);
  }
}
