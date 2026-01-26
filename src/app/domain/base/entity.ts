/**
 * Entity Base Class
 * 
 * Layer: Domain
 * Purpose: Base class for all domain entities.
 * Implements equality logic based on identity (ID), not structural equality.
 */

export abstract class Entity<TId> {
    constructor(public readonly id: TId) {
        if (!id) {
            throw new Error('Entity must have an ID');
        }
    }

    equals(other: Entity<TId>): boolean {
        if (other === null || other === undefined) {
            return false;
        }
        if (this === other) {
            return true;
        }
        if (!(other instanceof Entity)) {
            return false;
        }
        
        // Use .equals() if the ID is a Value Object with an equals method
        if (this.id && typeof (this.id as any).equals === 'function') {
            return (this.id as any).equals(other.id);
        }

        return this.id === other.id;
    }
}
