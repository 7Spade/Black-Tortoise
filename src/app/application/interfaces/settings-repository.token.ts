import { InjectionToken } from '@angular/core';
import { SettingsRepository } from '@domain/repositories';

export const SETTINGS_REPOSITORY = new InjectionToken<SettingsRepository>('SETTINGS_REPOSITORY');
