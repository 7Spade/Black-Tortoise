/**
 * FileMetadata Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export interface FileMetadataProps {
    size: number;
    contentType: string;
    originalName: string;
    uploadedAt: Date;
    uploadedBy: string;
}

export class FileMetadata {
    constructor(
        public readonly size: number,
        public readonly contentType: string,
        public readonly originalName: string,
        public readonly uploadedAt: Date,
        public readonly uploadedBy: string
    ) {
        if (size < 0) {
            throw new Error('File size cannot be negative');
        }
        if (!contentType) {
            throw new Error('Content type is required');
        }
    }

    public static create(props: FileMetadataProps): FileMetadata {
        return new FileMetadata(
            props.size,
            props.contentType,
            props.originalName,
            props.uploadedAt,
            props.uploadedBy
        );
    }

    public equals(other: FileMetadata): boolean {
        return (
            this.size === other.size &&
            this.contentType === other.contentType &&
            this.originalName === other.originalName &&
            this.uploadedAt.getTime() === other.uploadedAt.getTime() &&
            this.uploadedBy === other.uploadedBy
        );
    }
}
