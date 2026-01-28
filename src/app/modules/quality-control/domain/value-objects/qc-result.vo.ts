/**
 * QC Result Value Object
 * 
 * Detailed result of a QC check, including comments or specific metrics if needed.
 * For now, simple wrapper around pass/fail reason.
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export class QcResult {
    constructor(
        public readonly passed: boolean,
        public readonly comments: string = '',
        public readonly defectsFound: number = 0
    ) { }

    public static pass(comments: string = ''): QcResult {
        return new QcResult(true, comments, 0);
    }

    public static fail(comments: string, defectsFound: number = 1): QcResult {
        return new QcResult(false, comments, defectsFound);
    }

    public equals(other: QcResult): boolean {
        return this.passed === other.passed &&
            this.comments === other.comments &&
            this.defectsFound === other.defectsFound;
    }
}
