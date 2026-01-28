import { DomainEvent } from '../domain-event.interface';

export const DOCUMENTS_SOURCE = 'Documents';

export class DocumentCreated implements DomainEvent<{ documentId: string; title: string; ownerId: string }> {
    readonly type = 'Documents.DocumentCreated';
    readonly source = DOCUMENTS_SOURCE;
    readonly id = crypto.randomUUID();
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { documentId: string; title: string; ownerId: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) { }
}

export class DocumentUpdated implements DomainEvent<{ documentId: string; changes: Record<string, any> }> {
    readonly type = 'Documents.DocumentUpdated';
    readonly source = DOCUMENTS_SOURCE;
    readonly id = crypto.randomUUID();
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { documentId: string; changes: Record<string, any> },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) { }
}

export class DocumentArchived implements DomainEvent<{ documentId: string }> {
    readonly type = 'Documents.DocumentArchived';
    readonly source = DOCUMENTS_SOURCE;
    readonly id = crypto.randomUUID();
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { documentId: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) { }
}

export class DocumentDeleted implements DomainEvent<{ documentId: string }> {
    readonly type = 'Documents.DocumentDeleted';
    readonly source = DOCUMENTS_SOURCE;
    readonly id = crypto.randomUUID();
    readonly timestamp = Date.now();

    constructor(
        public readonly payload: { documentId: string },
        public readonly correlationId: string,
        public readonly causationId: string | undefined
    ) { }
}
