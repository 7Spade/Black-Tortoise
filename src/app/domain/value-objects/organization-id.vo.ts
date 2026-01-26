/**
 * OrganizationId Value Object
 * 
 * Layer: Domain
 * Purpose: Strongly typed ID for organizations to prevent string primitive obsession.
 */

export class OrganizationId {
    constructor(private readonly value: string) {
        if (!value) {
            throw new Error('OrganizationId cannot be empty');
        }
    }

    static create(id: string): OrganizationId {
        return new OrganizationId(id);
    }

    static generate(): OrganizationId {
        return new OrganizationId(crypto.randomUUID());
    }

    toString(): string {
        return this.value;
    }

    equals(other: OrganizationId): boolean {
        return this.value === other.value;
    }
}
