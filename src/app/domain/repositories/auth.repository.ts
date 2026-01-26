/**
 * Auth Repository Interface
 * 
 * Layer: Domain
 * DDD Pattern: Repository Interface
 * 
 * Defines the contract for authentication operations.
 * Pure Domain Layer - No framework dependencies.
 */

import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';

export interface AuthRepository {
  /**
   * Stream of the current user state
   * Emits null if no user is logged in
   */
  authState$: Observable<User | null>;

  /**
   * Login with email and password
   */
  login(email: string, password: string): Promise<void>;

  /**
   * Register a new user
   */
  register(email: string, password: string, displayName: string): Promise<void>;

  /**
   * Sign out the current user
   */
  logout(): Promise<void>;

  /**
   * Send password reset email
   */
  resetPassword(email: string): Promise<void>;
  
  /**
   * Get the current user snapshot
   */
  getCurrentUser(): Promise<User | null>;
}
