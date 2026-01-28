/**
 * Auth Repository Implementation
 * 
 * Layer: Infrastructure
 * Purpose: Implements AuthRepository using specific Auth provider (Firebase)
 * 
 * Dependencies:
 * - @angular/fire/auth: For Firebase Authentication
 * - @domain/repositories: For the interface
 */

import { Injectable, inject } from '@angular/core';
import { Auth, User as FirebaseUser, authState, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from '@angular/fire/auth';
import { AuthStream } from '@application/interfaces/auth-stream.token';
import { User, Email, UserId } from '@account/index';
import { AuthRepository } from '@domain/repositories';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthRepositoryImpl implements AuthRepository, AuthStream {
  private auth = inject(Auth);

  /**
   * Stream of auth state changes mapped to Domain Entity User
   * Implements AuthStream (Application Layer)
   */
  readonly authState$: Observable<User | null> = authState(this.auth).pipe(
    map(firebaseUser => this.mapToUserEntity(firebaseUser))
  );

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async register(email: string, password: string, displayName: string): Promise<void> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    if (credential.user) {
      await updateProfile(credential.user, { displayName });
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }

  async getCurrentUser(): Promise<User | null> {
    const user = this.auth.currentUser;
    return this.mapToUserEntity(user);
  }

  // --- Mapper ---

  private mapToUserEntity(firebaseUser: FirebaseUser | null): User | null {
    if (!firebaseUser) {
      return null;
    }
    
    // Construct VOs
    const id = UserId.create(firebaseUser.uid);
    const email = Email.create(firebaseUser.email || `missing-${firebaseUser.uid}@example.com`);
    
    return User.create(
        id,
        email,
        firebaseUser.displayName || 'Unknown User',
        firebaseUser.photoURL || null
    );
  }
}
