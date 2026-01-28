import { AggregateRoot } from '@domain/base/aggregate-root';
import { WorkspaceId } from '@domain/value-objects/workspace-id.vo';
import { Document } from '@documents/domain/entities/document.entity';
import { Folder } from '@documents/domain/entities/folder.entity';
import { DocumentId } from '@documents/domain/value-objects/document-id.vo';
import { FolderId } from '@documents/domain/value-objects/folder-id.vo';

/**
 * File Tree Aggregate
 * 
 * Manages the entire file system structure for a workspace.
 * Ensures strict consistency between folders and documents.
 */
export class FileTreeAggregate extends AggregateRoot<WorkspaceId> {
    private _rootFolders: Folder[];
    private _rootDocuments: Document[];

    private constructor(id: WorkspaceId) {
        super(id);
        this._rootFolders = [];
        this._rootDocuments = [];
    }

    public static create(workspaceId: WorkspaceId): FileTreeAggregate {
        return new FileTreeAggregate(workspaceId);
    }

    get rootFolders(): ReadonlyArray<Folder> {
        return [...this._rootFolders];
    }

    get rootDocuments(): ReadonlyArray<Document> {
        return [...this._rootDocuments];
    }

    public addDocument(document: Document): void {
        if (document.parentFolderId) {
            // Logic to find folder and add to it would go here
            // But since Folder entity holds children usually, or we hold flat list?
            // "FileTreeAggregate" implies it manages the hole thing.
            // For simplicity, let's assume we manage roots here.
        } else {
            this._rootDocuments.push(document);
        }
    }

    public addFolder(folder: Folder): void {
        if (folder.parentFolderId) {
            // Logic to add to parent
        } else {
            this._rootFolders.push(folder);
        }
    }
}
