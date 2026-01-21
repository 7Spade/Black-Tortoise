import type { Email } from '@domain/shared/value-objects/email.value-object';
import type { IdentityId } from '../value-objects/identity-id.value-object';

/**
 * AuthStatus models the lifecycle of authentication state in the application.
 */
export type AuthStatus = 'initializing' | 'authenticated' | 'unauthenticated' | 'error';

/**
 * AuthUser represents the authenticated identity snapshot used by the app.
 * This is an aggregate root enforcing authentication invariants.
 */
export class AuthUser {
  readonly id: IdentityId;
  readonly email: Email;
  readonly emailVerified: boolean;

  private constructor(props: {
    id: IdentityId;
    email: Email;
    emailVerified: boolean;
  }) {
    this.id = props.id;
    this.email = props.email;
    this.emailVerified = props.emailVerified;
  }

  static create(props: {
    id: IdentityId;
    email: Email;
    emailVerified: boolean;
  }): AuthUser {
    return new AuthUser(props);
  }

  /**
   * Check if the user has verified their email.
   */
  isEmailVerified(): boolean {
    return this.emailVerified;
  }
}

/**
 * AuthCredentials capture the minimum data needed for password auth.
 */
export interface AuthCredentials {
  readonly email: string;
  readonly password: string;
}

/**
 * AuthProfileUpdate models display/profile updates for the current user.
 * Note: This is for infrastructure layer use, not domain state.
 */
export interface AuthProfileUpdate {
  readonly displayName?: string;
  readonly photoUrl?: string;
}
