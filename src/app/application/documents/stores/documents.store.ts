/**
 * Documents Store
 *
 * Layer: Application - Store
 * Purpose: Manages document/file state using NgRx Signals
 * Architecture: Zone-less, Pure Reactive, Angular 20+, NO RxJS
 *
 * Responsibilities:
 * - Track uploaded documents
 * - Manage upload progress
 * - Handle document metadata
 *
 * Event Integration:
 * - Reacts to: TaskCreated (can attach documents)
 * - Publishes: DocumentUploaded
 *
 * Clean Architecture Compliance:
 * - Single source of truth for documents state
 * - All state updates via patchState
 * - No RxJS subscriptions
 * - Pure signal-based reactivity
 */

import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

export interface Document {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly size: number;
  readonly url: string;
  readonly uploadedAt: Date;
  readonly uploadedBy: string;
  readonly relatedTaskId?: string;
}

export interface UploadProgress {
  readonly fileId: string;
  readonly fileName: string;
  readonly progress: number; // 0-100
  readonly status: 'uploading' | 'completed' | 'failed';
  readonly error?: string;
}

export interface DocumentsState {
  readonly documents: ReadonlyArray<Document>;
  readonly uploadProgress: ReadonlyArray<UploadProgress>;
  readonly selectedDocumentId: string | null;
  readonly isUploading: boolean;
  readonly error: string | null;
}

const initialState: DocumentsState = {
  documents: [],
  uploadProgress: [],
  selectedDocumentId: null,
  isUploading: false,
  error: null,
};

/**
 * Documents Store
 *
 * Application-level store for document management using NgRx Signals.
 */
export const DocumentsStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((state) => ({
    /**
     * Documents by task
     */
    getDocumentsByTask: computed(() => (taskId: string) =>
      state.documents().filter(d => d.relatedTaskId === taskId)
    ),

    /**
     * Selected document
     */
    selectedDocument: computed(() => {
      const id = state.selectedDocumentId();
      return id ? state.documents().find(d => d.id === id) || null : null;
    }),

    /**
     * Active uploads
     */
    activeUploads: computed(() =>
      state.uploadProgress().filter(p => p.status === 'uploading')
    ),

    /**
     * Total storage size
     */
    totalStorageSize: computed(() =>
      state.documents().reduce((sum, d) => sum + d.size, 0)
    ),

    /**
     * Has documents
     */
    hasDocuments: computed(() => state.documents().length > 0),

    /**
     * Is uploading
     */
    hasActiveUploads: computed(() =>
      state.uploadProgress().some(p => p.status === 'uploading')
    ),
  })),

  withMethods((store) => ({
    /**
     * Add document
     */
    addDocument(document: Omit<Document, 'id' | 'uploadedAt'>): void {
      const newDoc: Document = {
        ...document,
        id: crypto.randomUUID(),
        uploadedAt: new Date(),
      };

      patchState(store, {
        documents: [...store.documents(), newDoc],
      });
    },

    /**
     * Start upload
     */
    startUpload(fileId: string, fileName: string): void {
      const progress: UploadProgress = {
        fileId,
        fileName,
        progress: 0,
        status: 'uploading',
      };

      patchState(store, {
        uploadProgress: [...store.uploadProgress(), progress],
        isUploading: true,
      });
    },

    /**
     * Update upload progress
     */
    updateUploadProgress(fileId: string, progress: number): void {
      patchState(store, {
        uploadProgress: store.uploadProgress().map(p =>
          p.fileId === fileId ? { ...p, progress } : p
        ),
      });
    },

    /**
     * Complete upload
     */
    completeUpload(fileId: string): void {
      patchState(store, {
        uploadProgress: store.uploadProgress().map(p =>
          p.fileId === fileId ? { ...p, status: 'completed' as const, progress: 100 } : p
        ),
        isUploading: store.uploadProgress().some(p => p.status === 'uploading' && p.fileId !== fileId),
      });
    },

    /**
     * Fail upload
     */
    failUpload(fileId: string, error: string): void {
      patchState(store, {
        uploadProgress: store.uploadProgress().map(p =>
          p.fileId === fileId ? { ...p, status: 'failed' as const, error } : p
        ),
        isUploading: store.uploadProgress().some(p => p.status === 'uploading' && p.fileId !== fileId),
      });
    },

    /**
     * Clear upload progress
     */
    clearUploadProgress(): void {
      patchState(store, {
        uploadProgress: [],
        isUploading: false,
      });
    },

    /**
     * Delete document
     */
    deleteDocument(documentId: string): void {
      patchState(store, {
        documents: store.documents().filter(d => d.id !== documentId),
      });
    },

    /**
     * Select document
     */
    selectDocument(documentId: string | null): void {
      patchState(store, { selectedDocumentId: documentId });
    },

    /**
     * Clear all documents (workspace switch)
     */
    clearDocuments(): void {
      patchState(store, {
        documents: [],
        uploadProgress: [],
        selectedDocumentId: null,
        isUploading: false,
        error: null,
      });
    },

    /**
     * Set error
     */
    setError(error: string | null): void {
      patchState(store, { error, isUploading: false });
    },
  }))
);
