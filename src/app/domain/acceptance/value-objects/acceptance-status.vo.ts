/**
 * Acceptance Status Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export enum AcceptanceStatusEnum {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

export class AcceptanceStatus {
    constructor(public readonly value: AcceptanceStatusEnum) { }

    public static pending(): AcceptanceStatus {
        return new AcceptanceStatus(AcceptanceStatusEnum.PENDING);
    }

    public static create(value: AcceptanceStatusEnum): AcceptanceStatus {
        return new AcceptanceStatus(value);
    }

    public isTerminal(): boolean {
        return this.value === AcceptanceStatusEnum.APPROVED || this.value === AcceptanceStatusEnum.REJECTED;
    }

    public equals(other: AcceptanceStatus): boolean {
        return this.value === other.value;
    }
}
