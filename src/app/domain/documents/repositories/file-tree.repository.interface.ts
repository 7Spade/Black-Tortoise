
import { Folder } from '../entities/folder.entity';
import { Document } from '../entities/document.entity';
import { InjectionToken } from '@angular/core';

export interface FileTreeRepository {
    getRootFolders(): Promise<Folder[]>;
    getRootDocuments(): Promise<Document[]>;
    // Other methods needed for the tree...
    // Actually the Aggregate manages the tree, so maybe we just save the Aggregate?
    // But FileTreeAggregate seems to be per-workspace.
    // Let's stick to the docs "FileTreeRepository".

    get(workspaceId: string): Promise<any>; // Should return Aggregate
}

export const FILE_TREE_REPOSITORY = new InjectionToken<FileTreeRepository>('FILE_TREE_REPOSITORY');
