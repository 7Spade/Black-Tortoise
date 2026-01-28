/**
 * QC Status Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export enum QcStatusEnum {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    PASSED = 'PASSED',
    FAILED = 'FAILED'
}

export class QcStatus {
    constructor(public readonly value: QcStatusEnum) { }

    public static pending(): QcStatus {
        return new QcStatus(QcStatusEnum.PENDING);
    }

    public static create(value: QcStatusEnum): QcStatus {
        return new QcStatus(value);
    }

    public isTerminal(): boolean {
        return this.value === QcStatusEnum.PASSED || this.value === QcStatusEnum.FAILED;
    }

    public equals(other: QcStatus): boolean {
        return this.value === other.value;
    }
}
