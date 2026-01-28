import { Entity } from '@domain/base/entity';
import { Email } from '@domain/value-objects/email.vo';
import { UserId } from '@domain/value-objects/user-id.vo';

/**
 * User Entity
 * 
 * Layer: Domain
 * Purpose: Represents a registered user in the system.
 * Note: CRUD entity, not Event Sourced.
 */
export class User extends Entity<UserId> {
    constructor(
        id: UserId,
        public readonly email: Email,
        public readonly displayName: string,
        public readonly photoUrl: string | null = null
    ) {
        super(id);
    }

    // Factory method strict enforcement
    static create(id: UserId, email: Email, displayName: string, photoUrl: string | null = null): User {
        return new User(id, email, displayName, photoUrl);
    }
}
