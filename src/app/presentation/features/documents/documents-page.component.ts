/**
 * Documents Page Component
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { DocumentsStore } from '@application/documents/stores/documents.store';

@Component({
  selector: 'app-documents-page',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="documents-page">
      <h1>Documents</h1>
      <mat-card>
        <mat-card-content>
          <p>Total Documents: {{ store.documents().length }}</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`.documents-page { padding: 24px; }`],
})
export class DocumentsPageComponent {
  readonly store = inject(DocumentsStore);
}
