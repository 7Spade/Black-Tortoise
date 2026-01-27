/**
 * Documents Module - File Management with Tree Structure
 * Layer: Presentation
 * Events: Publishes DocumentUploaded, FolderCreated, DocumentMoved
 * Architecture: OnPush, Signals only, Angular 20 control flow
 */

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IModuleEventBus } from '@application/interfaces/module-event-bus.interface';
import {
  IAppModule,
  ModuleType,
} from '@application/interfaces/module.interface';
import { DocumentsStore } from '@application/stores/documents.store';
import { ModuleEventHelper } from '@presentation/components/module-event-helper';
import { FileTreeComponent } from '../../../documents/components/file-tree/file-tree.component';

@Component({
  selector: 'app-documents-module',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatInputModule,
    MatFormFieldModule,
    FileTreeComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="documents-module">
      <div class="module-header">
        <h2>📄 Documents</h2>
        <p>
          Workspace: {{ eventBus?.workspaceId }} | Total:
          {{ documentsStore.totalStorageSize() | number }} bytes
        </p>
      </div>

      <!-- Toolbar -->
      <div class="toolbar">
        <mat-form-field appearance="outline">
          <mat-label>Search</mat-label>
          <input matInput 
                 [value]="documentsStore.searchQuery()"
                 (input)="onSearchChange($event)" />
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>

        <button mat-raised-button color="primary" (click)="onCreateFolder()">
          <mat-icon>create_new_folder</mat-icon>
          New Folder
        </button>

        <button mat-raised-button color="accent" (click)="fileInput.click()">
          <mat-icon>upload_file</mat-icon>
          Upload File
        </button>
        <input
          type="file"
          #fileInput
          (change)="onFileSelected($event)"
          style="display: none"
          multiple
        />
      </div>

      <!-- Upload Progress -->
      @if (documentsStore.hasActiveUploads()) {
        <div class="upload-progress">
          <h3>Uploading...</h3>
          @for (upload of documentsStore.activeUploads(); track upload.fileId) {
            <div class="progress-item">
              <span>{{ upload.fileName }}</span>
              <mat-progress-bar 
                mode="determinate" 
                [value]="upload.progress">
              </mat-progress-bar>
              <span>{{ upload.progress }}%</span>
            </div>
          }
        </div>
      }

      <!-- File Tree -->
      <div class="file-tree-container">
        @if (documentsStore.rootNodes().length > 0) {
          <app-file-tree 
            [nodes]="documentsStore.rootNodes()"
            (nodeSelected)="onNodeSelected($event)">
          </app-file-tree>
        } @else {
          <div class="empty-state">
            <mat-icon>folder_open</mat-icon>
            <p>No files or folders</p>
            <p>Upload a file or create a folder to get started</p>
          </div>
        }
      </div>

      <!-- Documents List -->
      <div class="documents-list">
        <h3>Documents ({{ documentsStore.documentCount() }})</h3>
        @if (documentsStore.visibleDocuments().length === 0) {
          <div class="empty-state">No documents match your search</div>
        }
        @for (doc of documentsStore.visibleDocuments(); track doc.id) {
          <div class="document-card" 
               [class.selected]="documentsStore.selectedNode()?.id === doc.id">
            <mat-icon>description</mat-icon>
            <div class="doc-info">
              <h4>{{ doc.name }}</h4>
              <p>
                {{ doc.size | number }} bytes |
                {{ doc.uploadedAt.toLocaleString() }}
              </p>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./documents.component.scss'],
})
export class DocumentsComponent implements IAppModule, OnInit, OnDestroy {
  readonly id = 'documents';
  readonly name = 'Documents';
  readonly type: ModuleType = 'documents';

  @Input() eventBus: IModuleEventBus | undefined;
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
        this.documentsStore.reset();
      }),
    );
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.documentsStore.setSearchQuery(input.value);
  }

  onCreateFolder(): void {
    const name = prompt('Enter folder name:');
    if (name) {
      this.documentsStore.createFolder(name, null);
    }
  }

  onNodeSelected(nodeId: string): void {
    this.documentsStore.selectNode(nodeId);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    Array.from(input.files).forEach(file => {
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

          // Add document
          this.documentsStore.addDocument({
            name: file.name,
            type: file.type,
            size: file.size,
            url: URL.createObjectURL(file),
            uploadedBy: this.currentUserId,
            parentId: this.documentsStore.selectedNode()?.id || null,
          });
        }
      }, 200);
    });

    // Reset input
    input.value = '';
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
