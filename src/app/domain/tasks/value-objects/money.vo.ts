/**
 * Money Value Object
 * 
 * Layer: Domain
 * DDD Pattern: Value Object
 */
export class Money {
    constructor(
        public readonly amount: number,
        public readonly currency: string = 'USD'
    ) {
        if (amount < 0) {
            throw new Error('Amount cannot be negative');
        }
    }

    public static create(amount: number, currency: string = 'USD'): Money {
        return new Money(amount, currency);
    }

    public static zero(currency: string = 'USD'): Money {
        return new Money(0, currency);
    }

    public add(other: Money): Money {
        if (this.currency !== other.currency) {
            throw new Error('Cannot add money with different currencies');
        }
        return new Money(this.amount + other.amount, this.currency);
    }

    public equals(other: Money): boolean {
        return this.amount === other.amount && this.currency === other.currency;
    }
}
