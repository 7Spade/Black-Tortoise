import { Entity } from '@domain/base/entity';
import { DocumentId } from '@documents/domain/value-objects/document-id.vo';
import { FileMetadata } from '@documents/domain/value-objects/file-metadata.vo';
import { FolderId } from '@documents/domain/value-objects/folder-id.vo';

/**
 * Document Entity
 * 
 * Represents a file asset.
 */
export class Document extends Entity<DocumentId> {
    private constructor(
        id: DocumentId,
        public readonly metadata: FileMetadata,
        public readonly parentFolderId: FolderId | null // null means root
    ) {
        super(id);
    }

    public static create(id: DocumentId, metadata: FileMetadata, parentFolderId: FolderId | null): Document {
        return new Document(id, metadata, parentFolderId);
    }
}
