import { v4 as uuidv4 } from 'uuid';

/**
 * Invitation Token Value Object
 * 
 * Token used for inviting members.
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export class InvitationToken {
    constructor(public readonly value: string) {
        if (!value) {
            throw new Error('InvitationToken cannot be empty');
        }
    }

    public static generate(): InvitationToken {
        return new InvitationToken(uuidv4());
    }

    public static create(value: string): InvitationToken {
        return new InvitationToken(value);
    }

    public equals(other: InvitationToken): boolean {
        return this.value === other.value;
    }
}
