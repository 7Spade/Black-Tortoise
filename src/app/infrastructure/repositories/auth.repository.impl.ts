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
import { UserEntity, createUser } from '@domain/aggregates';
import { AuthRepository } from '@domain/repositories';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthRepositoryImpl implements AuthRepository {
  private auth = inject(Auth);

  /**
   * Stream of auth state changes mapped to Domain UserEntity
   */
  readonly authState$: Observable<UserEntity | null> = authState(this.auth).pipe(
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

  async getCurrentUser(): Promise<UserEntity | null> {
    const user = this.auth.currentUser;
    return this.mapToUserEntity(user);
  }

  // --- Mapper ---

  private mapToUserEntity(firebaseUser: FirebaseUser | null): UserEntity | null {
    if (!firebaseUser) {
      return null;
    }
    
    // In a real app, we might also fetch additional user data from Firestore here
    // For now, we construct the entity from the Auth token data
    return createUser(
        firebaseUser.uid,
        firebaseUser.email || '',
        firebaseUser.displayName || 'Unknown User',
        firebaseUser.photoURL || undefined
    );
  }
}
