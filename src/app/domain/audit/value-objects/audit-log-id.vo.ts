import { v4 as uuidv4 } from 'uuid';

/**
 * Audit Log ID Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export class AuditLogId {
    constructor(public readonly value: string) {
        if (!value) {
            throw new Error('AuditLogId cannot be empty');
        }
    }

    public static generate(): AuditLogId {
        return new AuditLogId(uuidv4());
    }

    public static create(value: string): AuditLogId {
        return new AuditLogId(value);
    }

    public equals(other: AuditLogId): boolean {
        return this.value === other.value;
    }
}
