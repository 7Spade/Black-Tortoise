import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  user,
} from '@angular/fire/auth';
import { Firestore, doc, serverTimestamp, setDoc } from '@angular/fire/firestore';
import { exhaustMap, from, map, Observable, throwError } from 'rxjs';
import type { User } from '@angular/fire/auth';
import type {
  AuthCredentials,
  AuthProfileUpdate,
} from '@domain/identity/entities/auth-user.entity';
import { AuthUser } from '@domain/identity/entities/auth-user.entity';
import { IdentityId } from '@domain/identity/value-objects/identity-id.value-object';
import { Email } from '@domain/shared/value-objects/email.value-object';
import type { AuthRepository } from '@domain/identity/repositories/auth.repository.interface';
import { Collections } from '../collections/collection-names';

/**
 * Map Firebase Auth User to the domain AuthUser entity.
 */
const toAuthUser = (authUser: User): AuthUser => {
  const id = IdentityId.create(authUser.uid);
  const email = Email.create(authUser.email ?? '');
  return AuthUser.create({
    id,
    email,
    emailVerified: authUser.emailVerified,
  });
};

const createUserProfilePayload = (
  authUser: User,
  credentials: AuthCredentials,
) => ({
  id: authUser.uid,
  email: authUser.email ?? credentials.email,
  displayName: authUser.displayName ?? '',
  photoURL: authUser.photoURL ?? '',
  createdAt: serverTimestamp(),
  organizationIds: [],
  teamIds: [],
  partnerIds: [],
  workspaceIds: [],
});

@Injectable()
export class AuthAngularFireRepository implements AuthRepository {
  private readonly auth = inject(Auth);
  private readonly firestore = inject(Firestore);

  authState(): Observable<AuthUser | null> {
    return user(this.auth).pipe(
      map((currentUser) => (currentUser ? toAuthUser(currentUser) : null)),
    );
  }

  signIn(credentials: AuthCredentials): Observable<AuthUser> {
    return from(
      signInWithEmailAndPassword(
        this.auth,
        credentials.email,
        credentials.password,
      ),
    ).pipe(map((result) => toAuthUser(result.user)));
  }

  signUp(credentials: AuthCredentials): Observable<AuthUser> {
    return from(
      createUserWithEmailAndPassword(
        this.auth,
        credentials.email,
        credentials.password,
      ),
    ).pipe(
      exhaustMap((result) =>
        from(this.createUserProfile(result.user, credentials)),
      ),
    );
  }

  signOut(): Observable<void> {
    return from(signOut(this.auth));
  }

  sendPasswordReset(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email));
  }

  updateProfile(update: AuthProfileUpdate): Observable<AuthUser> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      return throwError(() => new Error('No authenticated user.'));
    }
    const profileUpdate: { displayName?: string | null; photoURL?: string | null } = {};
    if (update.displayName !== undefined) {
      profileUpdate.displayName = update.displayName;
    }
    if (update.photoUrl !== undefined) {
      profileUpdate.photoURL = update.photoUrl;
    }
    return from(updateProfile(currentUser, profileUpdate)).pipe(
      exhaustMap(() => from(currentUser.reload())),
      map(() => toAuthUser(currentUser)),
    );
  }

  private async createUserProfile(
    authUser: User,
    credentials: AuthCredentials,
  ): Promise<AuthUser> {
    try {
      await setDoc(
        doc(this.firestore, Collections.users, authUser.uid),
        createUserProfilePayload(authUser, credentials),
      );
      return toAuthUser(authUser);
    } catch (error) {
      const email = authUser.email ?? credentials.email;
      console.error('User profile save failed after sign-up.', {
        uid: authUser.uid,
        email,
        error,
      });
      try {
        await authUser.delete();
      } catch (rollbackError) {
        console.error(
          'Rollback failed after user profile creation error.',
          rollbackError,
        );
      }
      const message =
        error instanceof Error
          ? error.message
          : 'User profile creation failed.';
      console.error('User profile persistence error detail:', message);
      throw new Error(
        'Unable to complete registration. Please try again, and contact support if the issue persists.',
      );
    }
  }
}
