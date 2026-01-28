import { Entity } from '@domain/base/entity';
import { SettingKey } from '../value-objects/setting-key.vo';
import { SettingValue } from '../value-objects/setting-value.vo';

/**
 * Module Config Entity
 * 
 * Configuration for a specific module.
 */
export class ModuleConfig extends Entity<any> {
    private _settings: Map<string, any> = new Map();

    private constructor(
        public readonly moduleId: string,
        settings?: Record<string, any>
    ) {
        super({ value: moduleId }); // Use moduleId as Entity ID
        if (settings) {
            Object.entries(settings).forEach(([k, v]) => this._settings.set(k, v));
        }
    }

    public static reconstitute(moduleId: string, settings: Record<string, any>): ModuleConfig {
        return new ModuleConfig(moduleId, settings);
    }

    public static create(moduleId: string): ModuleConfig {
        return new ModuleConfig(moduleId);
    }

    public setSetting(key: SettingKey, value: SettingValue): void {
        this._settings.set(key.value, value.value);
    }

    public getSetting(key: string): any {
        return this._settings.get(key);
    }
}
