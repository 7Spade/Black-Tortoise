/**
 * Documents Store
 *
 * Layer: Application - Store
 * Purpose: Manages document/file state with tree structure using NgRx Signals
 * Architecture: Zone-less, Pure Reactive, Angular 20+, NO RxJS
 *
 * Responsibilities:
 * - Track uploaded documents
 * - Manage file tree structure
 * - Handle folder hierarchy
 * - Manage upload progress
 * - Handle search and filtering
 *
 * Event Integration:
 * - Reacts to: WorkspaceSwitched
 * - Publishes: DocumentUploaded, FolderCreated, FolderDeleted, DocumentMoved, FolderRenamed
 *
 * Clean Architecture Compliance:
 * - Single source of truth for documents state
 * - All state updates via patchState
 * - No RxJS subscriptions
 * - Pure signal-based reactivity
 */

import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { FileTreeNode } from '@domain/value-objects/file-tree-node.vo';

export interface Document {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly size: number;
  readonly url: string;
  readonly uploadedAt: Date;
  readonly uploadedBy: string;
  readonly relatedTaskId?: string;
  readonly parentId?: string | null;
}

export interface UploadProgress {
  readonly fileId: string;
  readonly fileName: string;
  readonly progress: number; // 0-100
  readonly status: 'uploading' | 'completed' | 'failed';
  readonly error?: string;
}

export interface DocumentFilter {
  readonly type?: string;
  readonly dateFrom?: Date;
  readonly dateTo?: Date;
  readonly uploader?: string;
  readonly minSize?: number;
  readonly maxSize?: number;
}

export interface DocumentsState {
  readonly documents: ReadonlyArray<Document>;
  readonly fileTree: ReadonlyArray<FileTreeNode>;
  readonly uploadProgress: ReadonlyArray<UploadProgress>;
  readonly selectedNodeId: string | null;
  readonly expandedNodeIds: ReadonlyArray<string>;
  readonly searchQuery: string;
  readonly filters: DocumentFilter;
  readonly sortBy: 'name' | 'date' | 'size' | 'type';
  readonly sortOrder: 'asc' | 'desc';
  readonly isUploading: boolean;
  readonly error: string | null;
}

const initialState: DocumentsState = {
  documents: [],
  fileTree: [],
  uploadProgress: [],
  selectedNodeId: null,
  expandedNodeIds: [],
  searchQuery: '',
  filters: {},
  sortBy: 'name',
  sortOrder: 'asc',
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
     * Selected node
     */
    selectedNode: computed(() => {
      const id = state.selectedNodeId();
      return id ? state.fileTree().find(n => n.id === id) || null : null;
    }),

    /**
     * Root folders (top-level nodes)
     */
    rootNodes: computed(() =>
      state.fileTree().filter(n => n.isRoot())
    ),

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

    /**
     * Filtered and sorted documents
     */
    visibleDocuments: computed(() => {
      let docs = state.documents();
      const query = state.searchQuery().toLowerCase();
      const filters = state.filters();

      // Apply search query
      if (query) {
        docs = docs.filter(d => d.name.toLowerCase().includes(query));
      }

      // Apply filters
      if (filters.type) {
        docs = docs.filter(d => d.type === filters.type);
      }
      if (filters.dateFrom) {
        docs = docs.filter(d => d.uploadedAt >= filters.dateFrom!);
      }
      if (filters.dateTo) {
        docs = docs.filter(d => d.uploadedAt <= filters.dateTo!);
      }
      if (filters.uploader) {
        docs = docs.filter(d => d.uploadedBy === filters.uploader);
      }
      if (filters.minSize !== undefined) {
        docs = docs.filter(d => d.size >= filters.minSize!);
      }
      if (filters.maxSize !== undefined) {
        docs = docs.filter(d => d.size <= filters.maxSize!);
      }

      // Apply sorting
      const sortBy = state.sortBy();
      const sortOrder = state.sortOrder();
      const sorted = [...docs].sort((a, b) => {
        let comparison = 0;
        switch (sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'date':
            comparison = a.uploadedAt.getTime() - b.uploadedAt.getTime();
            break;
          case 'size':
            comparison = a.size - b.size;
            break;
          case 'type':
            comparison = a.type.localeCompare(b.type);
            break;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });

      return sorted;
    }),

    /**
     * Document count
     */
    documentCount: computed(() => state.visibleDocuments().length),

    /**
     * Expanded state helper
     */
    isNodeExpanded: computed(() => (nodeId: string) =>
      state.expandedNodeIds().includes(nodeId)
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
     * Create folder
     */
    createFolder(name: string, parentId: string | null = null): void {
      const folderId = crypto.randomUUID();
      const folder = FileTreeNode.create(folderId, name, 'folder', parentId);

      patchState(store, {
        fileTree: [...store.fileTree(), folder],
      });
    },

    /**
     * Move node
     */
    moveNode(nodeId: string, newParentId: string | null): void {
      patchState(store, {
        fileTree: store.fileTree().map(node =>
          node.id === nodeId ? node.withParent(newParentId) : node
        ),
      });
    },

    /**
     * Delete node
     */
    deleteNode(nodeId: string): void {
      // Remove node and all children
      const nodesToRemove = new Set<string>([nodeId]);
      const findChildren = (id: string) => {
        store.fileTree().forEach(node => {
          if (node.parentId === id) {
            nodesToRemove.add(node.id);
            findChildren(node.id);
          }
        });
      };
      findChildren(nodeId);

      patchState(store, {
        fileTree: store.fileTree().filter(n => !nodesToRemove.has(n.id)),
        documents: store.documents().filter(d => !nodesToRemove.has(d.parentId || '')),
      });
    },

    /**
     * Rename node
     */
    renameNode(nodeId: string, newName: string): void {
      patchState(store, {
        fileTree: store.fileTree().map(node =>
          node.id === nodeId ? node.withName(newName) : node
        ),
      });
    },

    /**
     * Expand node
     */
    expandNode(nodeId: string): void {
      if (!store.expandedNodeIds().includes(nodeId)) {
        patchState(store, {
          expandedNodeIds: [...store.expandedNodeIds(), nodeId],
        });
      }
    },

    /**
     * Collapse node
     */
    collapseNode(nodeId: string): void {
      patchState(store, {
        expandedNodeIds: store.expandedNodeIds().filter(id => id !== nodeId),
      });
    },

    /**
     * Select node
     */
    selectNode(nodeId: string | null): void {
      patchState(store, { selectedNodeId: nodeId });
    },

    /**
     * Set search query
     */
    setSearchQuery(query: string): void {
      patchState(store, { searchQuery: query });
    },

    /**
     * Set filters
     */
    setFilters(filters: DocumentFilter): void {
      patchState(store, { filters });
    },

    /**
     * Set sorting
     */
    setSorting(sortBy: 'name' | 'date' | 'size' | 'type', sortOrder: 'asc' | 'desc'): void {
      patchState(store, { sortBy, sortOrder });
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
     * Reset (Clear on Workspace Switch)
     */
    reset(): void {
      patchState(store, initialState);
    },

    /**
     * Clear all documents (workspace switch)
     * @deprecated Use reset() instead
     */
    clearDocuments(): void {
      this.reset();
    },

    /**
     * Set error
     */
    setError(error: string | null): void {
      patchState(store, { error, isUploading: false });
    },
  }))
);
