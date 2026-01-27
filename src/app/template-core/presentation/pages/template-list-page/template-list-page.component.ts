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
    <div class="row">
      <!-- Left: Template List -->
      <div class="col-8">
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
              <mat-card class="card-hover">
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
                <mat-card-actions>
                  <button mat-button (click)="viewHistory(template.id)">View History</button>
                  <button mat-button (click)="addSection(template.id)">Add Section</button>
                </mat-card-actions>
              </mat-card>
            }
          </div>
        </div>
      </div>

      <!-- Right: Event History (Causality Visualization) -->
      @if (store.selectedTemplateId()) {
        <div class="col-4 history-panel">
          <div class="history-header">
            <h2>📜 Causality Audit Log</h2>
            <button mat-icon-button (click)="store.clearHistory()">✕</button>
          </div>
          
          <div class="timeline">
            @for (event of store.history(); track event.eventId) {
              <div class="event-item">
                <div class="event-marker"></div>
                <div class="event-content">
                  <div class="event-time">{{ event.occurredOn }}</div>
                  <div class="event-title">{{ event.description }}</div>
                  
                  <div class="metadata-box">
                    <div class="meta-row">
                      <span class="label">Correlation (Trace):</span>
                      <span class="value monospaced">{{ event.metadata.correlationId | slice:0:8 }}...</span>
                    </div>
                    @if (event.metadata.causationId) {
                      <div class="meta-row">
                        <span class="label">Causation (Cause):</span>
                        <span class="value monospaced">{{ event.metadata.causationId | slice:0:8 }}...</span>
                      </div>
                    }
                    <div class="meta-row">
                      <span class="label">User:</span>
                      <span class="value">{{ event.metadata.userId || 'System' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .row { display: flex; height: 100vh; overflow: hidden; }
    .col-8 { flex: 2; overflow-y: auto; }
    .col-4 { flex: 1; border-left: 1px solid #ccc; background: #f9f9f9; overflow-y: auto; box-shadow: -2px 0 5px rgba(0,0,0,0.05); }
    
    .container { padding: 2rem; }
    .actions { margin-bottom: 2rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }
    .error { color: red; margin: 1rem 0; }
    .badge { background: #4caf50; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem; margin-left: 8px; }
    .card-hover:hover { transform: translateY(-2px); transition: transform 0.2s; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }

    /* History Panel Styles */
    .history-panel { padding: 1.5rem; }
    .history-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 2px solid #3f51b5; padding-bottom: 0.5rem; }
    .history-header h2 { margin: 0; font-size: 1.2rem; color: #3f51b5; }
    
    .timeline { position: relative; padding-left: 1rem; }
    .timeline::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: #ddd; }
    
    .event-item { position: relative; padding-left: 1.5rem; margin-bottom: 2rem; }
    .event-marker { position: absolute; left: -5px; top: 0; width: 12px; height: 12px; border-radius: 50%; background: #3f51b5; border: 2px solid white; box-shadow: 0 0 0 1px #3f51b5; }
    
    .event-time { font-size: 0.75rem; color: #666; margin-bottom: 0.25rem; }
    .event-title { font-weight: bold; margin-bottom: 0.5rem; color: #333; }
    
    .metadata-box { background: #fff; border: 1px solid #eee; border-radius: 4px; padding: 0.5rem; font-size: 0.75rem; }
    .meta-row { display: flex; justify-content: space-between; margin-bottom: 2px; }
    .label { color: #888; }
    .value { font-weight: 500; }
    .monospaced { font-family: monospace; color: #d63384; }
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

  addSection(id: string) {
    const title = prompt('Section Title:');
    const content = prompt('Section Content:');
    if (title && content) {
      this.store.addSection({ templateId: id, title, content, userId: 'demo-user' });
    }
  }

  viewHistory(id: string) {
    this.store.loadHistory(id);
  }
}
