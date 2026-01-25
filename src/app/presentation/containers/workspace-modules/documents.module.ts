/**
 * Documents Module - File Management
 * Layer: Presentation
 * Events: Publishes DocumentUploaded
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { IAppModule, ModuleType } from '@application/interfaces/module.interface';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import { DocumentsStore } from '@application/documents/stores/documents.store';
import { ModuleEventHelper } from '@presentation/containers/workspace-modules/basic/module-event-helper';

@Component({
  selector: 'app-documents-module',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="documents-module">
      <div class="module-header">
        <h2>📄 Documents</h2>
        <p>Workspace: {{ eventBus?.workspaceId }} | Total: {{ documentsStore.totalStorageSize() | number }} bytes</p>
      </div>
      
      <div class="upload-section">
        <h3>Upload Document</h3>
        <input type="file" #fileInput (change)="onFileSelected($event)" class="file-input" />
        <button (click)="fileInput.click()" class="btn-primary">Choose File</button>
      </div>

      @if (documentsStore.hasActiveUploads()) {
        <div class="upload-progress">
          <h3>Uploading...</h3>
          @for (upload of documentsStore.activeUploads(); track upload.fileId) {
            <div class="progress-item">
              <span>{{ upload.fileName }}</span>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="upload.progress"></div>
              </div>
              <span>{{ upload.progress }}%</span>
            </div>
          }
        </div>
      }

      <div class="documents-list">
        <h3>Documents ({{ documentsStore.documents().length }})</h3>
        @if (documentsStore.documents().length === 0) {
          <div class="empty-state">No documents uploaded</div>
        }
        @for (doc of documentsStore.documents(); track doc.id) {
          <div class="document-card">
            <div class="doc-icon">📄</div>
            <div class="doc-info">
              <h4>{{ doc.name }}</h4>
              <p>{{ doc.size | number }} bytes | {{ doc.uploadedAt.toLocaleString() }}</p>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .documents-module { padding: 1.5rem; max-width: 1000px; }
    .module-header h2 { margin: 0 0 0.5rem 0; color: #1976d2; }
    .upload-section, .upload-progress, .documents-list { background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 1.5rem; margin-top: 1rem; }
    .file-input { display: none; }
    .btn-primary { padding: 0.5rem 1rem; border: none; border-radius: 4px; background: #1976d2; color: white; cursor: pointer; }
    .progress-item { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem; }
    .progress-bar { flex: 1; height: 8px; background: #e0e0e0; border-radius: 4px; overflow: hidden; }
    .progress-fill { height: 100%; background: #1976d2; transition: width 0.3s; }
    .document-card { display: flex; gap: 1rem; align-items: center; border: 1px solid #e0e0e0; border-radius: 4px; padding: 1rem; margin-bottom: 0.5rem; }
    .doc-icon { font-size: 2rem; }
    .doc-info h4 { margin: 0; }
    .doc-info p { margin: 0.25rem 0 0 0; font-size: 0.75rem; color: #666; }
    .empty-state { text-align: center; color: #999; padding: 2rem; }
  `]
})
export class DocumentsModule implements IAppModule, OnInit, OnDestroy {
  readonly id = 'documents';
  readonly name = 'Documents';
  readonly type: ModuleType = 'documents';
  
  @Input() eventBus?: IModuleEventBus;
  readonly documentsStore = inject(DocumentsStore);
  
  private readonly currentUserId = 'user-demo';
  private subscriptions = ModuleEventHelper.createSubscriptionManager();
  
  ngOnInit(): void {
    if (this.eventBus) {
      this.initialize(this.eventBus);
    }
  }
  
  initialize(eventBus: IModuleEventBus): void {
    this.eventBus = eventBus;
    
    this.subscriptions.add(
      ModuleEventHelper.onWorkspaceSwitched(eventBus, () => {
        this.documentsStore.clearDocuments();
      })
    );
    
  }
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    
    const file = input.files[0];
    if (!file) return; // Guard against undefined
    
    const fileId = crypto.randomUUID();
    
    // Start upload
    this.documentsStore.startUpload(fileId, file.name);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      this.documentsStore.updateUploadProgress(fileId, progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        this.documentsStore.completeUpload(fileId);
        
        // Add document (file is guaranteed to exist here due to guard)
        this.documentsStore.addDocument({
          name: file.name,
          type: file.type,
          size: file.size,
          url: URL.createObjectURL(file),
          uploadedBy: this.currentUserId,
        });
      }
    }, 200);
  }
  
  activate(): void {}
  deactivate(): void {}
  destroy(): void {
    this.subscriptions.unsubscribeAll();
  }
  ngOnDestroy(): void {
    this.destroy();
  }
}
