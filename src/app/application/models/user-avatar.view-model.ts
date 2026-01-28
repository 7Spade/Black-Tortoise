export interface UserAvatarViewModel {
    /**
     * Remote URL for the user's profile image.
     * Logic: Returns `user.photoUrl` from AuthStore.
     */
    readonly photoUrl: string | null;
    
    /**
     * Two-character initials for fallback display.
     * Logic: Computed from `displayName` (e.g., "John Doe" -> "JD").
     */
    readonly initials: string; 
    
    /**
     * A CSS color string or class name.
     * Logic: Deterministic generation based on user ID or name hash.
     */
    readonly color: string; 
  }
  
