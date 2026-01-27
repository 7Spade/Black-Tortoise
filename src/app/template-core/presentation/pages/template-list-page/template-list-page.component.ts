import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TemplateStore } from '../../../application/stores/template.store';

@Component({
  selector: 'app-template-list-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatProgressSpinnerModule],
  template: `
    <div class="container">
      <h1>Templates (DDD Strict Mode)</h1>
      
      <div class="actions">
        <button mat-raised-button color="primary" (click)="createTemplate()">
          Create New Template
        </button>
      </div>

      @if (store.isLoading()) {
        <mat-spinner></mat-spinner>
      }

      @if (store.error()) {
        <div class="error">{{ store.error() }}</div>
      }

      <div class="grid">
        @for (template of store.templateDtos(); track template.id) {
          <mat-card>
            <mat-card-header>
              <mat-card-title>
                {{ template.displayName }}
                @if (template.isNew) { <span class="badge">NEW</span> }
              </mat-card-title>
              <mat-card-subtitle>Modified: {{ template.lastModified }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>{{ template.previewContent }}</p>
            </mat-card-content>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 2rem; }
    .actions { margin-bottom: 2rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }
    .error { color: red; margin: 1rem 0; }
    .badge { background: #4caf50; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem; margin-left: 8px; }
  `]
})
export class TemplateListPageComponent implements OnInit {
  readonly store = inject(TemplateStore);

  ngOnInit() {
    this.store.loadAll();
  }

  createTemplate() {
    const name = prompt('Template Name:');
    const content = prompt('Template Content:');
    if (name && content) {
      this.store.addTemplate({ name, content, userId: 'demo-user' });
    }
  }
}
