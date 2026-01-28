import { Timestamp } from '@angular/fire/firestore';

export interface AuditLogDto {
    readonly id: string;
    readonly workspaceId: string;
    readonly eventId: string;
    readonly eventType: string;
    readonly userId: string;
    readonly action: string;
    readonly details: string;
    readonly timestamp: number; // or Timestamp if using Firestore timestamp
}
