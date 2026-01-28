import { AggregateRoot } from '@domain/base/aggregate-root';
import { WorkspaceId } from '@domain/value-objects/workspace-id.vo';
import { Document } from '../entities/document.entity';
import { Folder } from '../entities/folder.entity';

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

    // Logic to manage tree structure would go here
}
