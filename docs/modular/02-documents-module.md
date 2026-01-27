# Documents Module Design

## 1. Responsibilities
- Workspace file asset management.
- File tree structure and folder organization.
- File CRUD (Upload, Move, Rename, Delete).

## 2. Architecture
- **Store**: `DocumentsStore` (SignalStore).
- **Service**: `DocumentsService`.
- **Infrastructure**: `DocumentsFirestoreRepository`, `StorageService` (Adapter).

## 3. Data Structures
### Entities
- `FileNode`: id, name, type (file/folder), parentId, children[], metadata (size, type, url).
- `UploadTask`: id, file, progress (Signal), status.

## 4. Key Logic & Signals
- **State**: `fileTree` (Tree Structure), `uploadQueue` (List).
- **Computed**: `filteredFiles` (Search/Filter), `uploadSummary`.
- **methods**: `createFolder`, `uploadFiles`, `moveNode`, `deleteNode`.

## 5. UI Specifications
- **File Tree**: `mat-tree` with Drag & Drop (CDK).
- **Grid/List View**: Virtual Scroll for large directories.
- **Upload**: Drop zone, Progress bars.
- **Preview**: Dialogs for images/PDFs.

## 6. Events
- **Publish**: `FolderCreated`, `DocumentUploaded`, `DocumentDeleted`.
- **Subscribe**: None specific (Autonomous).

## 7. File Tree
```
src/app/
  application/
    stores/
      documents.store.ts
    services/
      documents.service.ts
  domain/
    documents/
      entities/
        file-node.entity.ts
      repositories/
        documents.repository.ts
  infrastructure/
    documents/
      documents.firestore.repository.ts
      storage.adapter.ts
  presentation/
    documents/
      components/
        file-tree/
        upload-dialog/
        file-preview/
      documents.component.ts
      documents.routes.ts
```
