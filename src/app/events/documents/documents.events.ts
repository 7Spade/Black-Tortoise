import { DomainEvent } from '../domain-event.interface';

export const DOCUMENTS_SOURCE = 'Documents';

export class DocumentCreated implements DomainEvent<{ documentId: string; title: string; authorId: string }> {
    readonly type = 'Documents.DocumentCreated';
    readonly source = DOCUMENTS_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { documentId: string; title: string; authorId: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.documentId;
    }
}
// Helpers for backward compatibility
export function createDocumentCreatedEvent(payload: { documentId: string; title: string; authorId: string }, correlationId: string, causationId?: string | null): DocumentCreated {
    return new DocumentCreated(payload, correlationId, causationId ?? undefined);
}
export class DocumentUpdated implements DomainEvent<{ documentId: string; changes: Record<string, any> }> {
    readonly type = 'Documents.DocumentUpdated';
    readonly source = DOCUMENTS_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { documentId: string; changes: Record<string, any> },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.documentId;
    }
}

export class DocumentArchived implements DomainEvent<{ documentId: string }> {
    readonly type = 'Documents.DocumentArchived';
    readonly source = DOCUMENTS_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { documentId: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.documentId;
    }
}

export class DocumentDeleted implements DomainEvent<{ documentId: string }> {
    readonly type = 'Documents.DocumentDeleted';
    readonly source = DOCUMENTS_SOURCE;
    readonly eventId = crypto.randomUUID();
    readonly aggregateId: string;
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { documentId: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) {
        this.aggregateId = payload.documentId;
    }
}
