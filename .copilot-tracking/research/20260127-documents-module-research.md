<!-- markdownlint-disable-file -->

# Task Research Notes: Documents Module (02-documents) Architecture

## Research Executed

### File Analysis

- **docs/modulars/02-documents-文件模組.md**
  - Complete specification for Documents Module (Version 2.0, updated 2026-01-27)
  - Defines file tree structure, upload, search/filter, preview/download capabilities
  - Specifies Angular 20+ modern practices (signals, control flow, zone-less)
  - DDD patterns: Aggregate Root, Factory, Policy, Repository Port
  
- **docs/modulars/workspace-modular-architecture_constitution_enhanced.md**
  - Constitutional document for workspace modular architecture
  - Defines pure reactive communication via Event Bus
  - Enforces strict DDD layering: Domain → Application → Infrastructure → Presentation
  - Module isolation rules and cross-module integration patterns

- **src/app/domain/aggregates/document.aggregate.ts**
  - Existing functional-style Document aggregate (not class-based as spec requires)
  - Current types: DocumentType, DocumentStatus
  - Functions: createDocument, renameDocument, publishDocument, archiveDocument, restoreDocument

- **src/app/application/stores/documents.store.ts**
  - Existing signalStore implementation using NgRx Signals
  - Features: upload progress tracking, document listing, selection
  - Missing: file tree structure, folder management, advanced search/filter
  
- **src/app/presentation/pages/modules/documents/documents.component.ts**
  - Basic presentation component with file upload
  - Uses Angular 20 control flow (@if, @for)
  - Missing: tree view, drag-drop, virtual scroll, preview dialogs

- **src/app/domain/events/document-uploaded.event.ts**
  - Existing DocumentUploadedEvent with proper correlation/causation ID
  - Contains comprehensive payload with workspace context

- **src/app/domain/policies/document-validation.policy.ts**
  - Functional-style validation policies
  - validateDocumentMetadata, isValidDocumentTransition

### Code Search Results

- **#search "DocumentRepository"**
  - src/app/domain/repositories/document.repository.ts - Domain interface
  - src/app/application/interfaces/document-repository.token.ts - Application token
  - src/app/infrastructure/repositories/document.repository.impl.ts - Firestore implementation

- **#search "WorkspaceEventBus"**
  - src/app/domain/types/workspace-event-bus.interface.ts - Event bus interface
  - src/app/application/facades/workspace-event-bus.adapter.ts - Adapter implementation

- **#search "ContextProvider"**
  - src/app/application/providers/overview-context.provider.ts
  - src/app/application/providers/permission-context.provider.ts
  - Pattern established for cross-module context sharing

### Project Conventions

- **Standards referenced**: 
  - strict-ddd-architecture.instructions.md - Four-layer DDD architecture
  - angular-control-flow-syntax.instructions.md - @if/@for/@switch mandatory
  - angular-ngrx-signals.instructions.md - signalStore patterns
  - ddd-architecture.instructions.md - Aggregate, Factory, Policy patterns

- **Instructions followed**:
  - No barrel exports across layers
  - Unidirectional dependency: Domain ← Application ← Infrastructure ← Presentation
  - Event-driven cross-module communication
  - Zone-less change detection with OnPush strategy

## Key Discoveries

### Project Structure

```
src/app/
├── domain/
│   ├── aggregates/document.aggregate.ts (EXISTS - needs class-based refactor)
│   ├── value-objects/document-id.vo.ts (EXISTS)
│   ├── policies/document-validation.policy.ts (EXISTS)
│   ├── events/document-uploaded.event.ts (EXISTS)
│   ├── repositories/document.repository.ts (EXISTS - domain interface)
│   └── factories/ (MISSING - needs DocumentFactory)
├── application/
│   ├── stores/documents.store.ts (EXISTS - needs file tree support)
│   ├── handlers/ (PARTIAL - create/rename/change-status exist)
│   ├── commands/ (PARTIAL - create/rename/change-status exist)
│   ├── interfaces/document-repository.token.ts (EXISTS)
│   ├── providers/ (MISSING - needs DocumentContextProvider)
│   └── ports/ (MISSING - needs repository port interface)
├── infrastructure/
│   ├── repositories/document.repository.impl.ts (EXISTS)
│   └── mappers/ (MISSING - needs Firestore mappers)
└── presentation/
    └── pages/modules/documents/documents.component.ts (EXISTS - basic only)
```

### Implementation Patterns

**Current State:**
- Functional-style aggregates (not class-based as spec requires)
- Basic signalStore without file tree structure
- Simple upload UI without tree, drag-drop, or virtual scroll
- Events defined but not fully integrated

**Required Patterns:**
- Class-based Aggregate with static create() and reconstruct() methods
- Factory pattern for creation with policy enforcement
- signalStore with nested tree state (folders + files)
- Angular Material mat-tree or CDK tree
- Virtual scrolling for large file lists
- Deferred loading for preview dialogs

### Complete Examples

```typescript
// Domain Layer: 02-documents/domain/aggregates/document.aggregate.ts
export class DocumentEntity {
  private constructor(
    public readonly id: DocumentId,
    public readonly workspaceId: WorkspaceId,
    public readonly name: string,
    public readonly type: DocumentType,
    // ... other properties
  ) {}
  
  public static create(
    id: DocumentId,
    workspaceId: WorkspaceId,
    name: string,
    type: DocumentType,
    metadata?: EventMetadata
  ): DocumentEntity {
    // Validate and emit domain event
    const entity = new DocumentEntity(id, workspaceId, name, type);
    // Store event in entity's event collection for event sourcing
    return entity;
  }
  
  public static reconstruct(props: DocumentProps): DocumentEntity {
    // Rebuild from snapshot without emitting events
    return new DocumentEntity(...props);
  }
}

// Domain Layer: 02-documents/domain/factories/document.factory.ts
export class DocumentFactory {
  public static create(
    name: string,
    type: DocumentType,
    metadata?: EventMetadata
  ): DocumentEntity {
    // Enforce naming policy
    DocumentNamingPolicy.assertIsValid(name);
    
    // Delegate to aggregate
    const id = DocumentId.create();
    return DocumentEntity.create(id, workspaceId, name, type, metadata);
  }
}

// Application Layer: DocumentContextProvider
export abstract class DocumentContextProvider {
  abstract getDocumentCount(workspaceId: string): number;
  abstract hasDocument(documentId: string): boolean;
  abstract getDocumentPath(documentId: string): string | null;
}
```

### API and Schema Documentation

**Event Bus Events:**

Published Events:
- DocumentUploaded
- DocumentDeleted
- FolderCreated
- FolderDeleted
- DocumentUpdated

Subscribed Events:
- WorkspaceSwitched (clear all state)

**State Schema:**

```typescript
interface FileTreeNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parentId: string | null;
  children: FileTreeNode[];
  metadata: {
    size?: number;
    mimeType?: string;
    uploadedAt?: Date;
    uploadedBy?: string;
  };
}

interface DocumentsState {
  fileTree: FileTreeNode[];
  documents: Document[];
  uploadProgress: UploadProgress[];
  selectedNodeId: string | null;
  expandedNodeIds: Set<string>;
  searchQuery: string;
  filters: {
    type?: DocumentType[];
    dateRange?: { start: Date; end: Date };
    uploader?: string[];
    sizeRange?: { min: number; max: number };
  };
  sortBy: 'name' | 'size' | 'date' | 'uploader';
  sortOrder: 'asc' | 'desc';
}
```

### Configuration Examples

```typescript
// Application Layer: signalStore with file tree
export const DocumentsStore = signalStore(
  { providedIn: 'root' },
  withState<DocumentsState>(initialState),
  withMethods((store) => {
    const eventBus = inject(WorkspaceEventBus);
    const workspaceContext = inject(WorkspaceContextProvider);
    
    return {
      createFolder(name: string, parentId: string | null): void {
        // Validate, create node, update tree, publish event
      },
      
      uploadFile(file: File, parentId: string | null): void {
        // Start upload, track progress, add to tree
      },
      
      moveNode(nodeId: string, newParentId: string): void {
        // Validate depth, update tree, publish event
      },
      
      deleteNode(nodeId: string): void {
        // Remove node and children, publish event
      }
    };
  }),
  withHooks({
    onInit(store) {
      const eventBus = inject(WorkspaceEventBus);
      
      eventBus.on('WorkspaceSwitched', () => {
        patchState(store, initialState);
      });
    }
  })
);
```

### Technical Requirements

**Angular 20+ Requirements:**
- ✅ Use @if/@for/@switch (NO *ngIf/*ngFor)
- ✅ signalStore for all state
- ✅ computed signals for derived state
- ✅ @defer for preview dialogs and heavy components
- ✅ ChangeDetectionStrategy.OnPush
- ✅ Zone-less change detection
- ✅ Track expressions in @for loops

**Material Components:**
- mat-tree or custom tree with CDK
- mat-dialog for folder creation, file preview
- mat-progress-bar for upload progress
- cdk-virtual-scroll-viewport for large file lists
- CDK Drag & Drop for file/folder movement
- mat-menu for context menus

**DDD Requirements:**
- Class-based DocumentEntity aggregate
- DocumentFactory with policy enforcement
- Repository pattern with InjectionToken
- Mapper pattern (Domain ↔ DTO ↔ Firestore)
- Event sourcing metadata (correlationId, causationId)

**Performance:**
- LCP < 2.5s
- INP < 200ms
- CLS < 0.1
- Virtual scrolling for 100+ items
- Lazy load preview components

**Accessibility:**
- Keyboard navigation (arrow keys for tree)
- ARIA labels for tree nodes
- LiveAnnouncer for upload status
- Semantic HTML
- Focus management

## Recommended Approach

### Implementation Strategy

**Phase 1: Domain Layer Refactoring**
1. Refactor DocumentEntity to class-based aggregate with create()/reconstruct()
2. Create DocumentFactory with policy enforcement
3. Define FolderEntity aggregate (or extend DocumentEntity)
4. Create FileTreeNode value object
5. Add domain events: FolderCreated, FolderDeleted, DocumentMoved

**Phase 2: Application Layer Enhancement**
1. Define IDocumentRepository port interface in application/ports
2. Enhance DocumentsStore with file tree state
3. Implement tree manipulation methods (createFolder, moveNode, deleteNode)
4. Create DocumentContextProvider for cross-module queries
5. Add use case handlers: CreateFolderHandler, UploadFileHandler, MoveNodeHandler
6. Implement search/filter computed signals

**Phase 3: Infrastructure Implementation**
1. Create Firestore mappers (DocumentFirestoreMapper, FolderFirestoreMapper)
2. Implement tree persistence in repository
3. Configure Firebase Storage for file uploads
4. Add upload progress tracking with observables → signals conversion

**Phase 4: Presentation Layer**
1. Build file tree component with mat-tree
2. Add drag-drop support with CDK Drag & Drop
3. Implement context menu with mat-menu
4. Create file upload component with progress indicators
5. Build file preview dialog (defer loaded)
6. Add virtual scroll for file list view
7. Implement search/filter UI
8. Add keyboard navigation support

**Phase 5: Event Integration**
1. Wire WorkspaceSwitched event to reset state
2. Publish DocumentUploaded, FolderCreated, etc.
3. Test event correlation chains
4. Implement optimistic UI updates

## Implementation Guidance

- **Objectives**: 
  - Implement full file tree management with folders
  - Support drag-drop file organization
  - Enable batch file uploads with progress tracking
  - Provide search/filter across documents
  - Support file preview and download
  - Ensure accessibility (keyboard navigation, screen readers)
  
- **Key Tasks**:
  1. Refactor domain layer to class-based aggregates
  2. Extend signalStore with tree state structure
  3. Build tree UI with Angular Material
  4. Implement drag-drop with CDK
  5. Add virtual scrolling for performance
  6. Create deferred preview dialogs
  7. Wire event bus integration
  8. Add DocumentContextProvider
  9. Implement comprehensive tests
  
- **Dependencies**:
  - Angular Material (mat-tree, mat-dialog, mat-progress-bar)
  - Angular CDK (Drag & Drop, Virtual Scroll)
  - WorkspaceEventBus (already exists)
  - WorkspaceContextProvider (already exists)
  - Firebase Storage (for file uploads)
  - NgRx Signals (already in use)
  
- **Success Criteria**:
  - File tree with 10-level depth support
  - Drag-drop file/folder movement
  - Batch upload with individual progress bars
  - Search by name, filter by type/date/size
  - Preview images/PDFs in dialog
  - Download single files or folders as ZIP
  - All events properly published with correlation IDs
  - Keyboard accessible (arrow keys, tab navigation)
  - Screen reader compatible
  - Performance: Virtual scroll for 100+ items, LCP < 2.5s
  - Tests: Unit (domain logic), Integration (event contracts), E2E (user flows)

## Gap Analysis

### Existing vs. Required

**✅ Already Implemented:**
- Basic Document aggregate (functional style)
- DocumentsStore with signalStore
- Upload progress tracking
- Basic upload UI component
- DocumentUploadedEvent
- Repository pattern (domain interface + Firestore impl)
- Validation policies

**⚠️ Partially Implemented:**
- Document aggregate (exists but functional, needs class-based refactor)
- DocumentsStore (exists but missing tree structure)
- Presentation component (basic upload only, needs tree UI)
- Events (defined but not fully wired)

**❌ Missing:**
- Folder management (no FolderEntity or folder operations)
- File tree structure in store state
- Tree UI component (mat-tree or custom)
- Drag-drop support
- Virtual scrolling
- File preview dialogs
- Advanced search/filter
- Context menus
- DocumentFactory pattern
- DocumentContextProvider for cross-module queries
- Comprehensive event integration
- Keyboard navigation
- Batch operations

### Priority Recommendations

**High Priority (Core Functionality):**
1. File tree state structure in store
2. Folder creation/deletion
3. Tree UI component with mat-tree
4. Basic drag-drop file movement
5. Event integration (WorkspaceSwitched, FolderCreated, etc.)

**Medium Priority (Enhanced UX):**
1. File preview dialogs
2. Advanced search/filter
3. Virtual scrolling for performance
4. Context menus
5. Keyboard navigation
6. Batch operations

**Low Priority (Nice-to-Have):**
1. Upload pause/resume
2. Folder upload with structure preservation
3. ZIP download for folders
4. File versioning
5. Tags/metadata editing
