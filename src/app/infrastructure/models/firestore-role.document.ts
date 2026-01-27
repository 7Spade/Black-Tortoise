/**
 * Firestore Role Document
 * 
 * Layer: Infrastructure
 * Purpose: Firestore document shape for role persistence
 */

export interface FirestoreRoleDocument {
  readonly id: string;
  readonly workspaceId: string;
  readonly name: string;
  readonly permissions: string[];
  readonly isSystem: boolean;
  readonly description?: string;
  readonly color?: string;
  readonly createdAt: number;
  readonly updatedAt: number;
}
