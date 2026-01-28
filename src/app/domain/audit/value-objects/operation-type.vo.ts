/**
 * Operation Type Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export enum OperationTypeEnum {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    READ = 'READ', // Optional, usually we audit writes
    EXECUTE = 'EXECUTE', // e.g. run a job
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT'
}

export class OperationType {
    constructor(public readonly value: OperationTypeEnum) { }

    public static create(value: OperationTypeEnum): OperationType {
        return new OperationType(value);
    }

    public equals(other: OperationType): boolean {
        return this.value === other.value;
    }
}
