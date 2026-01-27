<!-- markdownlint-disable-file -->

# Task Details: Documents Module Implementation

## Research Reference

**Source Research**: #file:../research/20260127-documents-module-research.md

## Phase 1: Domain Layer Refactoring

### Task 1.1: Refactor DocumentEntity to class-based aggregate

Refactor existing functional-style document aggregate to class-based with static create() and reconstruct() methods following DDD patterns.

- **Files**:
  - src/app/domain/aggregates/document.aggregate.ts - Refactor to class-based pattern
- **Success**:
  - DocumentEntity uses private constructor
  - Static create() method emits domain events
  - Static reconstruct() method rebuilds from snapshot without events
  - All existing document operations preserved
- **Research References**:
  - #file:../research/20260127-documents-module-research.md (Lines 119-147) - Complete class-based aggregate example
  - #file:../../.github/instructions/ddd-architecture.instructions.md - Aggregate patterns
- **Dependencies**:
  - None (foundation for other tasks)

### Task 1.2: Create DocumentFactory with policy enforcement

Create factory pattern to enforce business rules and policies during document creation.

- **Files**:
  - src/app/domain/factories/document.factory.ts - New factory class
  - src/app/domain/policies/document-naming.policy.ts - Extract naming validation to policy
- **Success**:
  - Factory enforces DocumentNamingPolicy before creation
  - Factory delegates to DocumentEntity.create()
  - Policy provides isSatisfiedBy() and assertIsValid() methods
  - Clear error messages for policy violations
- **Research References**:
  - #file:../research/20260127-documents-module-research.md (Lines 149-163) - Factory pattern example
  - docs/modulars/02-documents-文件模組.md (Lines 285-310) - Factory and Policy patterns
- **Dependencies**:
  - Task 1.1 completion (requires class-based aggregate)

### Task 1.3: Create FolderEntity aggregate (or extend DocumentEntity)

Create aggregate for folder management with hierarchy constraints and folder-specific operations.

- **Files**:
  - src/app/domain/aggregates/folder.aggregate.ts - New folder aggregate
  - src/app/domain/value-objects/folder-id.vo.ts - Folder identifier value object
  - src/app/domain/policies/folder-depth.policy.ts - Max depth validation (10 levels)
- **Success**:
  - FolderEntity has create() and reconstruct() methods
  - Supports parent-child relationships
  - Enforces max depth limit (10 levels)
  - Can contain files and other folders
  - Provides methods: addChild(), removeChild(), canAcceptChild()
- **Research References**:
  - #file:../research/20260127-documents-module-research.md (Lines 190-220) - FileTreeNode structure
  - docs/modulars/02-documents-文件模組.md (Lines 25-38) - File tree requirements
- **Dependencies**:
  - Task 1.1 completion
  - DocumentEntity class-based pattern

### Task 1.4: Create FileTreeNode value object

Create immutable value object representing tree nodes with type safety and metadata support.

- **Files**:
  - src/app/domain/value-objects/file-tree-node.vo.ts - Tree node value object
  - src/app/domain/types/node-metadata.type.ts - Metadata type definition
- **Success**:
  - Immutable FileTreeNode with id, name, type, parentId, children, metadata
  - Type discriminates between 'file' and 'folder'
  - Metadata includes size, mimeType, uploadedAt, uploadedBy
  - Provides helper methods: isRoot(), hasChildren(), getDepth()
  - Type-safe children array
- **Research References**:
  - #file:../research/20260127-documents-module-research.md (Lines 190-202) - FileTreeNode interface
  - docs/modulars/02-documents-文件模組.md (Lines 28-29) - Node structure requirements
- **Dependencies**:
  - Task 1.1 completion
  - Value object patterns

### Task 1.5: Add domain events for folder operations

Create domain events for folder lifecycle and tree operations with proper event metadata.

- **Files**:
  - src/app/domain/events/folder-created.event.ts - New folder creation event
  - src/app/domain/events/folder-deleted.event.ts - Folder deletion event
  - src/app/domain/events/document-moved.event.ts - File/folder movement event
  - src/app/domain/events/folder-renamed.event.ts - Folder rename event
- **Success**:
  - All events extend base DomainEvent
  - Include correlationId and causationId
  - Payloads are pure DTOs (no functions or services)
  - Include workspace context (workspaceId)
  - Include parent-child relationship data for tree operations
- **Research References**:
  - #file:../research/20260127-documents-module-research.md (Lines 175-183) - Published events list
  - #file:../../.github/instructions/event-sourcing-and-causality.instructions.md - Event metadata
  - docs/modulars/02-documents-文件模組.md (Lines 122-137) - Event requirements
- **Dependencies**:
  - Task 1.3 completion (FolderEntity)
  - Existing DocumentUploadedEvent pattern

## Phase 2: Application Layer Enhancement

### Task 2.1: Define IDocumentRepository port interface

Create port interface in application layer defining repository contract with tree operations.

- **Files**:
  - src/app/application/ports/document-repository.port.ts - Repository port interface
  - src/app/application/tokens/document-repository.token.ts - Update token for new interface
- **Success**:
  - Interface includes: findById, save, delete, findByWorkspace
  - Tree operations: saveTree, loadTree, moveNode
  - Batch operations: saveBatch, deleteBatch
  - Search/filter: findByQuery, findByFilter
  - Properly typed return values with Promises
- **Research References**:
  - #file:../research/20260127-documents-module-research.md (Lines 314-327) - Repository pattern
  - #file:../../.github/instructions/strict-ddd-architecture.instructions.md - Dependency inversion
  - docs/modulars/02-documents-文件模組.md (Lines 314-327) - Repository port pattern
- **Dependencies**:
  - Task 1.4 completion (FileTreeNode)
  - Domain entities from Phase 1

### Task 2.2: Enhance DocumentsStore with file tree state

Extend existing signalStore to include file tree structure, expanded nodes, selection, and filters.

- **Files**:
  - src/app/application/stores/documents.store.ts - Extend existing store
  - src/app/application/types/documents-state.type.ts - Define comprehensive state interface
  - src/app/application/types/upload-progress.type.ts - Upload progress type
- **Success**:
  - State includes: fileTree, documents, uploadProgress, selectedNodeId, expandedNodeIds
  - Filter state: searchQuery, filters (type, dateRange, uploader, sizeRange)
  - Sort state: sortBy, sortOrder
  - Store uses signalStore with withState, withMethods, withHooks
  - Signals are properly typed
  - Initial state properly defined
- **Research References**:
  - #file:../research/20260127-documents-module-research.md (Lines 189-220) - State schema
  - #file:../research/20260127-documents-module-research.md (Lines 226-261) - signalStore example
  - docs/modulars/02-documents-文件模組.md (Lines 216-238) - Store integration example
- **Dependencies**:
  - Task 2.1 completion (repository port)
  - Task 1.4 completion (FileTreeNode)

### Task 2.3: Implement tree manipulation methods

Add methods to DocumentsStore for tree operations: create folder, move nodes, delete nodes with validation.

- **Files**:
  - src/app/application/stores/documents.store.ts - Add methods using withMethods
- **Success**:
  - createFolder(name, parentId) - validates name, adds to tree, publishes event
  - moveNode(nodeId, newParentId) - validates depth, updates tree, publishes event
  - deleteNode(nodeId) - removes node and children recursively, publishes events
  - renameNode(nodeId, newName) - validates name, updates tree, publishes event
  - expandNode(nodeId) / collapseNode(nodeId) - manages expanded state
  - selectNode(nodeId) - manages selection state
  - All methods use patchState for immutable updates
- **Research References**:
  - #file:../research/20260127-documents-module-research.md (Lines 234-249) - Tree manipulation methods
  - docs/modulars/02-documents-文件模組.md (Lines 40-48) - Folder creation requirements
- **Dependencies**:
  - Task 2.2 completion (store with tree state)
  - Task 1.3 completion (FolderEntity and policies)

### Task 2.4: Create DocumentContextProvider

Create context provider for cross-module queries following established pattern.

- **Files**:
  - src/app/application/providers/document-context.provider.ts - Abstract provider class
  - src/app/application/providers/document-context.provider.impl.ts - Implementation
- **Success**:
  - Abstract class defines: getDocumentCount, hasDocument, getDocumentPath
  - Implementation injects DocumentsStore
  - Provider registered in app.config.ts
  - Methods are synchronous and return computed values
  - Follows pattern from OverviewContextProvider and PermissionContextProvider
- **Research References**:
  - #file:../research/20260127-documents-module-research.md (Lines 56-59) - Context provider pattern
  - #file:../research/20260127-documents-module-research.md (Lines 165-171) - Provider interface
  - docs/modulars/02-documents-文件模組.md (Lines 188-197) - Context provider definition
- **Dependencies**:
  - Task 2.2 completion (enhanced store)
  - Existing context provider patterns

### Task 2.5: Add use case handlers

Create command handlers for document/folder operations following CQRS pattern.

- **Files**:
  - src/app/application/handlers/create-folder.handler.ts - New handler
  - src/app/application/handlers/upload-file.handler.ts - New handler
  - src/app/application/handlers/move-node.handler.ts - New handler
  - src/app/application/handlers/delete-node.handler.ts - New handler
  - src/app/application/commands/create-folder.command.ts - New command
  - src/app/application/commands/upload-file.command.ts - New command
  - src/app/application/commands/move-node.command.ts - New command
  - src/app/application/commands/delete-node.command.ts - New command
- **Success**:
  - Each handler validates command, executes business logic, publishes events
  - Handlers inject repository via token
  - Commands are simple DTOs with validation
  - Follows existing CreateDocumentHandler pattern
  - Proper error handling with domain exceptions
- **Research References**:
  - src/app/application/handlers/create-document.handler.ts - Existing pattern
  - #file:../../.github/instructions/ddd-architecture.instructions.md - CQRS pattern
- **Dependencies**:
  - Task 2.1 completion (repository port)
  - Task 1.2 completion (factories)
  - Domain events from Task 1.5

### Task 2.6: Implement search/filter computed signals

Add computed signals to DocumentsStore for filtering, searching, and sorting documents.

- **Files**:
  - src/app/application/stores/documents.store.ts - Add computed signals
  - src/app/application/utils/document-filter.util.ts - Filter utility functions
  - src/app/application/utils/document-sort.util.ts - Sort utility functions
- **Success**:
  - filteredDocuments computed signal filters by searchQuery and filters
  - sortedDocuments computed signal sorts by sortBy and sortOrder
  - visibleDocuments combines filtering and sorting
  - documentCount computed signal for stats
  - All computeds are pure functions
  - Efficient memoization via computed()
- **Research References**:
  - #file:../research/20260127-documents-module-research.md (Lines 68-79) - Search/filter requirements
  - docs/modulars/02-documents-文件模組.md (Lines 68-79) - Search requirements
  - #file:../../.github/instructions/angular-ngrx-signals.instructions.md - Computed signals
- **Dependencies**:
  - Task 2.2 completion (store with filter state)

## Phase 3: Infrastructure Implementation

### Task 3.1: Create Firestore mappers

Create mappers for bidirectional conversion between domain entities and Firestore documents.

- **Files**:
  - src/app/infrastructure/mappers/document-firestore.mapper.ts - Document mapper
  - src/app/infrastructure/mappers/folder-firestore.mapper.ts - Folder mapper
  - src/app/infrastructure/mappers/file-tree-node-firestore.mapper.ts - Tree node mapper
  - src/app/infrastructure/types/firestore-document.type.ts - Firestore document type
  - src/app/infrastructure/types/firestore-folder.type.ts - Firestore folder type
- **Success**:
  - toFirestore() converts domain entity to Firestore document
  - fromFirestore() converts Firestore document to domain entity
  - Handles nested objects and arrays properly
  - Timestamp conversions (Date <-> Firestore Timestamp)
  - Type-safe with no any or unknown
  - Handles null/undefined edge cases
- **Research References**:
  - #file:../research/20260127-documents-module-research.md (Lines 330-332) - Mapper pattern
  - src/app/infrastructure/repositories/document.repository.impl.ts - Existing patterns
  - #file:../../.github/instructions/strict-ddd-architecture.instructions.md - Mapper layer
- **Dependencies**:
  - Domain entities from Phase 1
  - Task 1.4 completion (FileTreeNode)

### Task 3.2: Implement tree persistence in repository

Extend DocumentRepository implementation with tree-specific operations for hierarchical storage.

- **Files**:
  - src/app/infrastructure/repositories/document.repository.impl.ts - Extend existing
  - src/app/infrastructure/utils/tree-flattening.util.ts - Tree serialization utilities
- **Success**:
  - saveTree() flattens and saves entire tree structure
  - loadTree() loads and reconstructs tree hierarchy
  - moveNode() updates parentId with transaction
  - deleteNode() recursively deletes children with batch operations
  - Uses Firestore transactions for consistency
  - Optimistic locking to prevent conflicts
  - Efficient queries with proper indexing
- **Research References**:
  - #file:../research/20260127-documents-module-research.md (Lines 44-50) - Repository implementation
  - docs/modulars/02-documents-文件模組.md (Lines 25-38) - Tree structure requirements
- **Dependencies**:
  - Task 3.1 completion (mappers)
  - Task 2.1 completion (repository port)

### Task 3.3: Configure Firebase Storage for uploads

Set up Firebase Storage integration for file uploads with security rules and organization.

- **Files**:
  - src/app/infrastructure/services/firebase-storage.service.ts - New storage service
  - src/app/infrastructure/config/storage-config.ts - Storage configuration
  - firestore.rules - Update with storage security rules (if combined)
- **Success**:
  - Service provides uploadFile, downloadFile, deleteFile methods
  - Files organized by workspaceId/documentId path
  - Metadata stored with files (mimeType, size, uploadedBy)
  - Security rules enforce workspace access control
  - Handles large files (up to 100MB default)
  - Generates secure download URLs with expiration
- **Research References**:
  - #file:../research/20260127-documents-module-research.md (Lines 369-370) - Firebase Storage dependency
  - docs/modulars/02-documents-文件模組.md (Lines 50-66) - Upload requirements
- **Dependencies**:
  - Firebase Storage configured in project
  - WorkspaceContextProvider for workspace ID

### Task 3.4: Add upload progress tracking

Implement upload progress tracking with observables converted to signals for reactive UI updates.

- **Files**:
  - src/app/infrastructure/services/firebase-storage.service.ts - Add progress tracking
  - src/app/application/stores/documents.store.ts - Add progress signals
  - src/app/application/utils/observable-to-signal.util.ts - Conversion utility
- **Success**:
  - uploadFile returns observable with progress events
  - Progress converted to signal in store
  - UploadProgress type includes: fileId, fileName, progress (0-100), status
  - Supports pause/cancel operations (optional)
  - Multiple concurrent uploads tracked separately
  - Progress removed after completion/error
  - Error handling with retry capability
- **Research References**:
  - #file:../research/20260127-documents-module-research.md (Lines 25-29) - Upload progress in store
  - docs/modulars/02-documents-文件模組.md (Lines 55-58) - Progress tracking requirements
- **Dependencies**:
  - Task 3.3 completion (storage service)
  - Task 2.2 completion (store with upload progress state)

## Phase 4: Presentation Layer

### Task 4.1: Build file tree component with mat-tree

Create tree component using Angular Material mat-tree with expand/collapse and icon support.

- **Files**:
  - src/app/presentation/components/file-tree/file-tree.component.ts - New component
  - src/app/presentation/components/file-tree/file-tree.component.html - Template
  - src/app/presentation/components/file-tree/file-tree.component.scss - Styles
  - src/app/presentation/components/file-tree-node/file-tree-node.component.ts - Node component
- **Success**:
  - Uses mat-tree with MatTreeNestedDataSource
  - Nodes display icon (by type/extension), name, metadata
  - Expand/collapse works with animation
  - Selection highlights current node
  - Breadcrumb navigation shows current path
  - Double-click opens file preview
  - Uses @if/@for control flow (no *ngIf/*ngFor)
  - Track expressions in @for loops
  - ChangeDetectionStrategy.OnPush
  - Signals for all reactive state
- **Research References**:
  - #file:../research/20260127-documents-module-research.md (Lines 275-280) - Material components
  - docs/modulars/02-documents-文件模組.md (Lines 25-38) - Tree requirements
  - #file:../../.github/instructions/angular-material-best-practices.instructions.md - Material patterns
- **Dependencies**:
  - Task 2.3 completion (tree manipulation methods)
  - Angular Material mat-tree module

### Task 4.2: Add drag-drop support with CDK

Implement drag-drop functionality for file/folder reorganization using Angular CDK.

- **Files**:
  - src/app/presentation/components/file-tree/file-tree.component.ts - Add drag-drop
  - src/app/presentation/components/file-tree/file-tree.component.html - Add CDK directives
  - src/app/presentation/directives/drop-validation.directive.ts - Custom validation
- **Success**:
  - cdkDrag on tree nodes enables dragging
  - cdkDropList on folders enables dropping
  - Visual feedback during drag (ghost element, drop zone highlight)
  - Validates drop target (no circular references, depth limit)
  - Calls store.moveNode() on successful drop
  - Prevents invalid drops (file into file, exceeding depth)
  - Works with both mouse and touch
  - Accessible with keyboard alternative
- **Research References**:
  - #file:../research/20260127-documents-module-research.md (Lines 279) - CDK Drag & Drop requirement
  - docs/modulars/02-documents-文件模組.md (Lines 33-35) - Drag-drop requirements
  - Angular CDK documentation for drag-drop
- **Dependencies**:
  - Task 4.1 completion (tree component)
  - Task 2.3 completion (moveNode method)
  - Angular CDK drag-drop module

### Task 4.3: Implement context menu

Create right-click context menu for file/folder operations using mat-menu.

- **Files**:
  - src/app/presentation/components/file-tree-context-menu/file-tree-context-menu.component.ts - Menu component
  - src/app/presentation/components/file-tree-context-menu/file-tree-context-menu.component.html - Template
  - src/app/presentation/services/context-menu.service.ts - Position and state management
- **Success**:
  - Right-click opens context menu at cursor position
  - Menu options: New Folder, Rename, Delete, Move, Copy Link, Download
  - Options disabled based on context (can't delete root)
  - Triggers appropriate store methods
  - Closes on outside click or Escape key
  - Works with keyboard (shift+F10 or context menu key)
  - ARIA roles for accessibility
- **Research References**:
  - #file:../research/20260127-documents-module-research.md (Lines 280) - mat-menu requirement
  - docs/modulars/02-documents-文件模組.md (Lines 35) - Context menu requirements
- **Dependencies**:
  - Task 4.1 completion (tree component)
  - Angular Material mat-menu module

### Task 4.4: Create file upload component with progress

Build upload component with drag-drop zone, file selection, and progress indicators.

- **Files**:
  - src/app/presentation/components/file-upload/file-upload.component.ts - Upload component
  - src/app/presentation/components/file-upload/file-upload.component.html - Template
  - src/app/presentation/components/file-upload/file-upload.component.scss - Styles
  - src/app/presentation/components/upload-progress-item/upload-progress-item.component.ts - Progress item
- **Success**:
  - Drag-drop zone highlights on dragover
  - Click to open file picker (multiple selection)
  - Validates file size (100MB limit)
  - Validates file type (configurable whitelist)
  - Checks for duplicate names
  - Shows individual progress bars for each file
  - mat-progress-bar displays upload progress
  - Cancel button stops upload
  - Error handling with user-friendly messages
  - Uses signals for progress tracking
- **Research References**:
  - #file:../research/20260127-documents-module-research.md (Lines 50-66) - Upload requirements
  - docs/modulars/02-documents-文件模組.md (Lines 50-66) - Upload specifications
- **Dependencies**:
  - Task 3.4 completion (upload progress tracking)
  - Angular Material mat-progress-bar

### Task 4.5: Build file preview dialog

Create preview dialog component with deferred loading for different file types.

- **Files**:
  - src/app/presentation/components/file-preview-dialog/file-preview-dialog.component.ts - Dialog component
  - src/app/presentation/components/file-preview-dialog/file-preview-dialog.component.html - Template
  - src/app/presentation/components/image-preview/image-preview.component.ts - Image viewer (deferred)
  - src/app/presentation/components/pdf-preview/pdf-preview.component.ts - PDF viewer (deferred)
  - src/app/presentation/components/text-preview/text-preview.component.ts - Text viewer (deferred)
- **Success**:
  - mat-dialog opens with file content
  - Images display directly in dialog
  - PDFs render with PDF viewer library
  - Text files display with syntax highlighting
  - Uses @defer (on interaction) for viewer components
  - Download button for all file types
  - Close button and ESC key to dismiss
  - Loading state while fetching content
  - Error state for failed loads
  - Keyboard navigation (prev/next file)
- **Research References**:
  - #file:../research/20260127-documents-module-research.md (Lines 82-89) - Preview requirements
  - docs/modulars/02-documents-文件模組.md (Lines 82-89) - Preview specifications
  - #file:../../.github/instructions/angular-material-best-practices.instructions.md - Dialog patterns
- **Dependencies**:
  - Task 4.1 completion (tree component triggers preview)
  - Angular Material mat-dialog
  - PDF viewer library (if needed)

### Task 4.6: Add virtual scroll for file list

Implement virtual scrolling for large file lists using CDK virtual scroll viewport.

- **Files**:
  - src/app/presentation/components/file-list/file-list.component.ts - List component
  - src/app/presentation/components/file-list/file-list.component.html - Template with virtual scroll
  - src/app/presentation/components/file-list-item/file-list-item.component.ts - List item component
- **Success**:
  - cdk-virtual-scroll-viewport wraps list
  - Only renders visible items (itemSize configured)
  - Smooth scrolling with 100+ items
  - List items show: icon, name, size, date, uploader
  - Click to select, double-click to preview
  - Checkbox for multi-select
  - Keyboard navigation (up/down arrows)
  - Performance: renders only ~20 items regardless of total count
- **Research References**:
  - #file:../research/20260127-documents-module-research.md (Lines 71-72) - Virtual scroll requirement
  - docs/modulars/02-documents-文件模組.md (Lines 71-72) - Virtual scroll specifications
  - Angular CDK virtual scrolling documentation
- **Dependencies**:
  - Task 2.6 completion (filtered/sorted documents)
  - Angular CDK virtual scroll module

### Task 4.7: Implement search/filter UI

Create search and advanced filter controls for document discovery.

- **Files**:
  - src/app/presentation/components/document-search/document-search.component.ts - Search component
  - src/app/presentation/components/document-filter/document-filter.component.ts - Filter panel
  - src/app/presentation/components/document-search/document-search.component.html - Template
  - src/app/presentation/components/document-filter/document-filter.component.html - Template
- **Success**:
  - Search input with real-time filtering (debounced 300ms)
  - Filter panel with: file type, date range, uploader, size range
  - Filter chips display active filters
  - Clear all filters button
  - Filter state synced with store
  - Sort dropdown (name, size, date, uploader)
  - Sort order toggle (asc/desc)
  - Updates visibleDocuments computed signal
  - Accessible with keyboard and screen reader
- **Research References**:
  - #file:../research/20260127-documents-module-research.md (Lines 68-79) - Search/filter requirements
  - docs/modulars/02-documents-文件模組.md (Lines 68-79) - Search/filter specifications
- **Dependencies**:
  - Task 2.6 completion (filter computed signals)
  - Angular Material form controls

### Task 4.8: Add keyboard navigation support

Implement comprehensive keyboard navigation for accessibility.

- **Files**:
  - src/app/presentation/components/file-tree/file-tree.component.ts - Add keyboard handlers
  - src/app/presentation/directives/tree-keyboard-nav.directive.ts - Navigation directive
  - src/app/presentation/services/focus-manager.service.ts - Focus management
- **Success**:
  - Arrow keys navigate tree (up/down/left/right)
  - Enter opens file or expands folder
  - Space selects/deselects node
  - Delete key triggers delete action
  - F2 triggers rename
  - Ctrl+C/Ctrl+V for copy/paste
  - Tab moves between major sections
  - Escape closes dialogs/menus
  - Focus visible outline on all interactive elements
  - Screen reader announces tree structure and changes
  - LiveAnnouncer for upload status
- **Research References**:
  - #file:../research/20260127-documents-module-research.md (Lines 299-302) - A11y requirements
  - docs/modulars/02-documents-文件模組.md (Lines 174-177) - Accessibility specifications
  - #file:../../.github/instructions/a11y.instructions.md - Accessibility guidelines
- **Dependencies**:
  - Task 4.1 completion (tree component)
  - Angular CDK a11y module

## Phase 5: Event Integration & Testing

### Task 5.1: Wire WorkspaceSwitched event handler

Subscribe to WorkspaceSwitched event and reset all document state.

- **Files**:
  - src/app/application/stores/documents.store.ts - Add event subscription in withHooks
- **Success**:
  - onInit hook subscribes to WorkspaceSwitched event
  - Handler resets state to initialState
  - All file tree cleared
  - All selections cleared
  - All filters reset
  - Upload progress cleared
  - Event subscription cleaned up on destroy
- **Research References**:
  - #file:../research/20260127-documents-module-research.md (Lines 251-260) - Event subscription example
  - docs/modulars/02-documents-文件模組.md (Lines 228-236) - Event integration
- **Dependencies**:
  - Task 2.2 completion (store)
  - WorkspaceEventBus available

### Task 5.2: Publish document/folder events

Publish domain events when document/folder operations occur with proper correlation.

- **Files**:
  - src/app/application/stores/documents.store.ts - Add event publishing
  - src/app/application/handlers/*.handler.ts - Publish events in handlers
- **Success**:
  - DocumentUploaded published after successful upload
  - FolderCreated published after folder creation
  - FolderDeleted published after folder deletion
  - DocumentDeleted published after document deletion
  - DocumentMoved published after node movement
  - All events include correlationId and causationId
  - Events follow Append -> Publish -> React pattern
  - Event payloads are pure DTOs (no functions/services)
- **Research References**:
  - #file:../research/20260127-documents-module-research.md (Lines 175-183) - Published events
  - docs/modulars/02-documents-文件模組.md (Lines 122-137) - Event requirements
  - #file:../../.github/instructions/event-sourcing-and-causality.instructions.md - Event patterns
- **Dependencies**:
  - Task 1.5 completion (domain events)
  - Task 2.5 completion (handlers)
  - WorkspaceEventBus

### Task 5.3: Implement unit tests

Write unit tests for domain logic, computed signals, and pure functions.

- **Files**:
  - src/app/domain/aggregates/document.aggregate.spec.ts - Aggregate tests
  - src/app/domain/factories/document.factory.spec.ts - Factory tests
  - src/app/domain/policies/*.policy.spec.ts - Policy tests
  - src/app/application/utils/document-filter.util.spec.ts - Filter utility tests
  - src/app/application/utils/document-sort.util.spec.ts - Sort utility tests
- **Success**:
  - Test DocumentEntity.create() emits events
  - Test DocumentEntity.reconstruct() doesn't emit events
  - Test factory enforces policies
  - Test policies validate business rules
  - Test computed signal logic (filter, sort)
  - Test pure functions with various inputs
  - No effect testing (effects have side effects)
  - 100% coverage of domain logic
  - Fast tests (no async, no dependencies)
- **Research References**:
  - #file:../research/20260127-documents-module-research.md (Lines 150-154) - Unit test requirements
  - docs/modulars/02-documents-文件模組.md (Lines 150-154) - Test strategy
- **Dependencies**:
  - Domain entities from Phase 1
  - Application utilities from Phase 2

### Task 5.4: Implement integration tests

Write integration tests for event contracts and cross-layer interactions.

- **Files**:
  - src/app/application/handlers/create-folder.handler.spec.ts - Handler tests
  - src/app/application/handlers/upload-file.handler.spec.ts - Handler tests
  - src/app/application/stores/documents.store.spec.ts - Store integration tests
  - src/app/infrastructure/repositories/document.repository.impl.spec.ts - Repository tests
- **Success**:
  - Test Given initial state → When command → Then event published
  - Test event payloads match contract
  - Test handler-repository integration
  - Test store event subscriptions
  - Mock repository with test doubles
  - Verify correlationId propagation
  - No private method testing
  - Focus on observable behavior
- **Research References**:
  - #file:../research/20260127-documents-module-research.md (Lines 156-159) - Integration test requirements
  - docs/modulars/02-documents-文件模組.md (Lines 156-159) - Integration test strategy
- **Dependencies**:
  - Task 2.5 completion (handlers)
  - Task 3.2 completion (repository)

### Task 5.5: Implement E2E tests

Write end-to-end tests for critical user workflows.

- **Files**:
  - e2e/documents/file-tree.spec.ts - Tree navigation tests
  - e2e/documents/file-upload.spec.ts - Upload workflow tests
  - e2e/documents/drag-drop.spec.ts - Drag-drop tests
  - e2e/documents/search-filter.spec.ts - Search/filter tests
  - e2e/documents/file-preview.spec.ts - Preview dialog tests
- **Success**:
  - Test complete upload workflow (select, validate, upload, verify in tree)
  - Test folder creation and navigation
  - Test drag-drop file movement
  - Test search finds correct files
  - Test filter reduces visible files
  - Test preview opens and displays content
  - Test keyboard navigation works
  - Test optimistic UI updates and rollback on errors
  - Tests run reliably (no flakiness)
  - Page object pattern for maintainability
- **Research References**:
  - #file:../research/20260127-documents-module-research.md (Lines 161-163) - E2E test requirements
  - docs/modulars/02-documents-文件模組.md (Lines 161-163) - E2E test strategy
- **Dependencies**:
  - All presentation components from Phase 4
  - Playwright or Cypress configured

## Dependencies

- Angular 20+ with Signals and Control Flow
- Angular Material and CDK
- NgRx Signals
- Firebase Storage
- WorkspaceEventBus
- WorkspaceContextProvider

## Success Criteria

- All tasks completed with working code
- Tests pass with good coverage
- Accessibility validated
- Performance meets targets
- Events properly integrated
- Documentation updated
