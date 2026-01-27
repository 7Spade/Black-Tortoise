/**
 * Money Value Object
 *
 * Layer: Domain
 * DDD Pattern: Value Object
 *
 * Represents a monetary amount with currency.
 * Immutable and side-effect free.
 */

export interface Money {
  readonly amount: number;
  readonly currency: string;
}

/**
 * Create Money value object
 */
export function createMoney(amount: number, currency: string = 'TWD'): Money {
  if (amount < 0) {
    throw new Error('Money amount cannot be negative');
  }

  return {
    amount,
    currency,
  };
}

/**
 * Add two Money values (must be same currency)
 */
export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error('Cannot add money with different currencies');
  }
  return createMoney(a.amount + b.amount, a.currency);
}

/**
 * Subtract Money values (must be same currency)
 */
export function subtractMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error('Cannot subtract money with different currencies');
  }
  const result = a.amount - b.amount;
  if (result < 0) {
    throw new Error('Money subtraction would result in negative amount');
  }
  return createMoney(result, a.currency);
}

/**
 * Multiply Money by scalar
 */
export function multiplyMoney(money: Money, multiplier: number): Money {
  if (multiplier < 0) {
    throw new Error('Money multiplier cannot be negative');
  }
  return createMoney(money.amount * multiplier, money.currency);
}

/**
 * Check if two Money values are equal
 */
export function moneyEquals(a: Money, b: Money): boolean {
  return a.amount === b.amount && a.currency === b.currency;
}

/**
 * Format Money for display
 */
export function formatMoney(money: Money): string {
  return `${money.currency} ${money.amount.toFixed(2)}`;
}
