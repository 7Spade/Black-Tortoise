import { Injectable } from '@angular/core';

export interface NotificationItem {
  readonly id: string;
  readonly message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  getNotifications(): ReadonlyArray<NotificationItem> {
    return [];
  }
}
