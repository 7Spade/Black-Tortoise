import type { Observable } from 'rxjs';
import type { AuthUser, AuthCredentials, AuthProfileUpdate } from '../entities/auth-user.entity';

/**
 * AuthRepository defines the contract for authentication operations.
 */
export interface AuthRepository {
  authState(): Observable<AuthUser | null>;
  signIn(credentials: AuthCredentials): Observable<AuthUser>;
  signUp(credentials: AuthCredentials): Observable<AuthUser>;
  signOut(): Observable<void>;
  sendPasswordReset(email: string): Observable<void>;
  updateProfile(update: AuthProfileUpdate): Observable<AuthUser>;
}
