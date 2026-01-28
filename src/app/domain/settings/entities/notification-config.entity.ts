import { Entity } from '@domain/base/entity';

/**
 * Notification Config Entity
 * 
 * Global notification settings for the workspace.
 */
export class NotificationConfig extends Entity<any> {
    private constructor(
        id: string,
        public emailEnabled: boolean,
        public inAppEnabled: boolean
    ) {
        super({ value: id });
    }

    public static create(id: string): NotificationConfig {
        return new NotificationConfig(id, true, true); // Default enabled
    }

    public toggleEmail(enabled: boolean): void {
        this.emailEnabled = enabled;
    }

    public toggleInApp(enabled: boolean): void {
        this.inAppEnabled = enabled;
    }
}
