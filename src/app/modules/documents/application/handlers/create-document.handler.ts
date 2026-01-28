/**
 * CreateDocumentHandler
 * 
 * Layer: Application
 * Pattern: Use Case
 */

import { Injectable, inject } from '@angular/core';
import { CreateDocumentCommand } from '@documents/application/commands/create-document.command';
// import { DocumentRepository } from '@documents/domain';

@Injectable({ providedIn: 'root' })
export class CreateDocumentHandler {
  // private repo = inject(DocumentRepository);

  async execute(command: CreateDocumentCommand): Promise<void> {
    // TODO: Implement Use Case logic
    // 1. Load Aggregate
    // 2. Invoke method
    // 3. Save
    // 4. Update Store (via return or event)
    console.log('Execute CreateDocumentHandler', command);
  }
}
