import { Entity } from '@domain/base/entity';
import { FolderId } from '@documents/domain/value-objects/folder-id.vo';

/**
 * Folder Entity
 * 
 * Represents a directory.
 */
export class Folder extends Entity<FolderId> {
    private constructor(
        id: FolderId,
        public readonly name: string,
        public readonly parentFolderId: FolderId | null
    ) {
        super(id);
    }

    public static create(id: FolderId, name: string, parentFolderId: FolderId | null): Folder {
        return new Folder(id, name, parentFolderId);
    }
}
