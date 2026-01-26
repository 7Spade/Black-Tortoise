export interface IdentityViewModel {
    /** 
     * Determines the visual mode of the switcher.
     * 'personal': Shows user's name.
     * 'organization': Shows organization's name.
     */
    readonly type: 'personal' | 'organization';
    
    /**
     * The text to display in the main label.
     * Logic: Returns Organization Name if type is 'organization', otherwise User Name.
     */
    readonly displayName: string; 
    
    /**
     * Optional label for the role badge (e.g., "Owner", "Admin").
     * Logic: Derived from the user's role in the current context.
     */
    readonly roleLabel?: string | undefined; 
    
    /**
     * Whether the user is currently authenticated.
     * Used to show/hide the entire switcher or switch to 'Guest' view.
     */
    readonly isAuthenticated: boolean;
  }
  