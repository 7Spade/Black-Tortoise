/**
 * RenameDocumentUseCase
 * 
 * Layer: Application
 * Pattern: Use Case
 */

import { Injectable, inject } from '@angular/core';
import { RenameDocumentCommand } from '../commands/rename-document.command';
// import { DocumentsRepository } from '@domain/modules/documents/repositories';

@Injectable({ providedIn: 'root' })
export class RenameDocumentUseCase {
  // private repo = inject(DocumentsRepository);

  async execute(command: RenameDocumentCommand): Promise<void> {
    // TODO: Implement Use Case logic
    // 1. Load Aggregate
    // 2. Invoke method
    // 3. Save
    // 4. Update Store (via return or event)
    console.log('Execute RenameDocumentUseCase', command);
  }
}
