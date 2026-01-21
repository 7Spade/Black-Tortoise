import { DomainError } from './domain.error';

/**
 * ValidationError represents domain validation failures.
 */
export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
