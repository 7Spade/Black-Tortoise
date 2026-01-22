/**
 * User Entity
 * 
 * Layer: Domain
 * DDD Pattern: Entity
 * 
 * Represents a user in the system with unique identity.
 * Users can own workspaces and have roles within teams.
 */

export interface UserEntity {
  readonly id: string;
  readonly email: string;
  readonly displayName: string;
  readonly photoUrl?: string;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Create a new User entity
 */
export function createUser(
  id: string,
  email: string,
  displayName: string,
  photoUrl?: string
): UserEntity {
  return {
    id,
    email,
    displayName,
    photoUrl,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Update user profile
 */
export function updateUserProfile(
  user: UserEntity,
  displayName?: string,
  photoUrl?: string
): UserEntity {
  return {
    ...user,
    displayName: displayName ?? user.displayName,
    photoUrl: photoUrl ?? user.photoUrl,
    updatedAt: new Date(),
  };
}

/**
 * Deactivate user
 */
export function deactivateUser(user: UserEntity): UserEntity {
  return {
    ...user,
    isActive: false,
    updatedAt: new Date(),
  };
}

/**
 * Reactivate user
 */
export function reactivateUser(user: UserEntity): UserEntity {
  return {
    ...user,
    isActive: true,
    updatedAt: new Date(),
  };
}
