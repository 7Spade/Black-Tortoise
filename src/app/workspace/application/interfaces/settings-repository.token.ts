import { InjectionToken } from '@angular/core';
import { SettingsRepository } from '@workspace/domain';

export const SETTINGS_REPOSITORY = new InjectionToken<SettingsRepository>('SETTINGS_REPOSITORY');
