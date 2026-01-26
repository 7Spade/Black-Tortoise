import { Email } from '../value-objects/email.vo';
import { UserId } from '../value-objects/user-id.vo';

/**
 * User Entity
 * 
 * Layer: Domain
 * Purpose: Represents a registered user in the system.
 */
export class User {
    constructor(
        public readonly id: UserId,
        public readonly email: Email,
        // Using string for simple names, could be generic Name VO if strictness increases
        public readonly displayName: string
    ) {}

    // Factory method strict enforcement
    static create(id: UserId, email: Email, displayName: string): User {
        return new User(id, email, displayName);
    }
}
