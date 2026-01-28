/**
 * Acceptance Result Value Object
 * 
 * Outcome of the acceptance process.
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export class AcceptanceResult {
    constructor(
        public readonly approved: boolean,
        public readonly comments: string = '',
        public readonly acceptedBy: string // user id
    ) { }

    public static approve(acceptedBy: string, comments: string = ''): AcceptanceResult {
        return new AcceptanceResult(true, comments, acceptedBy);
    }

    public static reject(rejectedBy: string, comments: string): AcceptanceResult {
        return new AcceptanceResult(false, comments, rejectedBy);
    }

    public equals(other: AcceptanceResult): boolean {
        return this.approved === other.approved &&
            this.comments === other.comments &&
            this.acceptedBy === other.acceptedBy;
    }
}
