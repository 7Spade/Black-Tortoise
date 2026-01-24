/**
 * Documents Store
 *
 * Layer: Application - Store
 * Purpose: Manages document/file state using NgRx Signals
 * Architecture: Zone-less, Pure Reactive, Angular 20+
 *
 * Responsibilities:
 * - Document metadata management
 * - Upload progress tracking
 * - File organization
 *
 * Event Flow:
 * - Publishes: DocumentUploaded
 */

import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap } from 'rxjs';

import { EventBus } from '@domain/event-bus/event-bus.interface';
import { EventStore } from '@domain/event-store/event-store.interface';
import { createDocumentUploadedEvent } from '@domain/events/domain-events';

export interface Document {
  readonly documentId: string;
  readonly name: string;
  readonly type: string;
  readonly size: number;
  readonly url: string;
  readonly uploadedById: string;
  readonly uploadedAt: Date;
  readonly tags?: string[];
  readonly relatedTaskId?: string;
}

export interface UploadProgress {
  readonly fileId: string;
  readonly fileName: string;
  readonly progress: number;
  readonly status: 'uploading' | 'completed' | 'failed';
  readonly error?: string;
}

export interface DocumentsState {
  readonly documents: ReadonlyArray<Document>;
  readonly uploads: ReadonlyArray<UploadProgress>;
  readonly selectedDocument: Document | null;
  readonly searchQuery: string;
  readonly filterTags: string[];
  readonly isLoading: boolean;
  readonly error: string | null;
}

const initialState: DocumentsState = {
  documents: [],
  uploads: [],
  selectedDocument: null,
  searchQuery: '',
  filterTags: [],
  isLoading: false,
  error: null,
};

export const DocumentsStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((state) => ({
    filteredDocuments: computed(() => {
      let docs = state.documents();
      
      const query = state.searchQuery().toLowerCase();
      if (query) {
        docs = docs.filter(doc => 
          doc.name.toLowerCase().includes(query) ||
          doc.tags?.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      const tags = state.filterTags();
      if (tags.length > 0) {
        docs = docs.filter(doc =>
          doc.tags?.some(tag => tags.includes(tag))
        );
      }
      
      return docs;
    }),
    
    documentsByTask: computed(() => (taskId: string) =>
      state.documents().filter(doc => doc.relatedTaskId === taskId)
    ),
    
    allTags: computed(() => {
      const tagsSet = new Set<string>();
      state.documents().forEach(doc => {
        doc.tags?.forEach(tag => tagsSet.add(tag));
      });
      return Array.from(tagsSet).sort();
    }),
    
    activeUploads: computed(() =>
      state.uploads().filter(upload => upload.status === 'uploading')
    ),
    
    totalSize: computed(() =>
      state.documents().reduce((sum, doc) => sum + doc.size, 0)
    ),
  })),

  withMethods((store) => ({
    /**
     * Add document
     */
    addDocument: rxMethod<{
      name: string;
      type: string;
      size: number;
      url: string;
      uploadedById: string;
      tags?: string[];
      relatedTaskId?: string;
      workspaceId: string;
      eventBus: EventBus;
      eventStore: EventStore;
    }>(
      pipe(
        tap(({ name, type, size, url, uploadedById, tags, relatedTaskId, workspaceId, eventBus, eventStore }) => {
          const documentId = crypto.randomUUID();
          
          const newDocument: Document = {
            documentId,
            name,
            type,
            size,
            url,
            uploadedById,
            uploadedAt: new Date(),
            tags,
            relatedTaskId,
          };
          
          // Create and publish event
          const event = createDocumentUploadedEvent(
            documentId,
            workspaceId,
            name,
            type,
            size,
            url,
            uploadedById
          );
          
          // Append then publish
          eventStore.append(event).then(() => {
            eventBus.publish(event);
          });
          
          // Update state
          patchState(store, {
            documents: [...store.documents(), newDocument],
            error: null,
          });
        })
      )
    ),

    /**
     * Update upload progress
     */
    updateUploadProgress(fileId: string, progress: number): void {
      const uploads = store.uploads();
      const upload = uploads.find(u => u.fileId === fileId);
      
      if (upload) {
        const updatedUpload: UploadProgress = { ...upload, progress };
        patchState(store, {
          uploads: uploads.map(u => u.fileId === fileId ? updatedUpload : u),
        });
      }
    },

    /**
     * Start upload
     */
    startUpload(fileId: string, fileName: string): void {
      const newUpload: UploadProgress = {
        fileId,
        fileName,
        progress: 0,
        status: 'uploading',
      };
      
      patchState(store, {
        uploads: [...store.uploads(), newUpload],
      });
    },

    /**
     * Complete upload
     */
    completeUpload(fileId: string): void {
      const uploads = store.uploads();
      const upload = uploads.find(u => u.fileId === fileId);
      
      if (upload) {
        const completedUpload: UploadProgress = { ...upload, progress: 100, status: 'completed' };
        patchState(store, {
          uploads: uploads.map(u => u.fileId === fileId ? completedUpload : u),
        });
      }
    },

    /**
     * Fail upload
     */
    failUpload(fileId: string, error: string): void {
      const uploads = store.uploads();
      const upload = uploads.find(u => u.fileId === fileId);
      
      if (upload) {
        const failedUpload: UploadProgress = { ...upload, status: 'failed', error };
        patchState(store, {
          uploads: uploads.map(u => u.fileId === fileId ? failedUpload : u),
        });
      }
    },

    /**
     * Clear completed uploads
     */
    clearCompletedUploads(): void {
      patchState(store, {
        uploads: store.uploads().filter(u => u.status === 'uploading'),
      });
    },

    /**
     * Set search query
     */
    setSearchQuery(query: string): void {
      patchState(store, { searchQuery: query });
    },

    /**
     * Set filter tags
     */
    setFilterTags(tags: string[]): void {
      patchState(store, { filterTags: tags });
    },

    /**
     * Select document
     */
    selectDocument(documentId: string): void {
      const doc = store.documents().find(d => d.documentId === documentId);
      patchState(store, { selectedDocument: doc || null });
    },

    /**
     * Clear selection
     */
    clearSelection(): void {
      patchState(store, { selectedDocument: null });
    },

    /**
     * Reset store (on workspace switch)
     */
    reset(): void {
      patchState(store, initialState);
    },
  }))
);
