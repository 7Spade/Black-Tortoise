/**
 * Audit Metadata Value Object
 * 
 * Stores additional context about the audit log.
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export class AuditMetadata {
    constructor(
        public readonly ipAddress: string | null,
        public readonly userAgent: string | null,
        public readonly timestamp: number,
        public readonly correlationId: string | null
    ) { }

    public static create(
        ipAddress: string | null,
        userAgent: string | null,
        correlationId: string | null = null
    ): AuditMetadata {
        return new AuditMetadata(ipAddress, userAgent, Date.now(), correlationId);
    }

    public equals(other: AuditMetadata): boolean {
        return this.ipAddress === other.ipAddress &&
            this.userAgent === other.userAgent &&
            this.timestamp === other.timestamp &&
            this.correlationId === other.correlationId;
    }
}
