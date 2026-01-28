import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { SettingsRepository } from '@domain/repositories/settings.repository';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { WorkspaceSettingsViewModel } from '../models/workspace-settings-view.model';
import { WorkspaceSettingsAggregate } from '@domain/settings/aggregates/workspace-settings.aggregate';

type SettingsState = {
    settings: WorkspaceSettingsViewModel | null;
    loading: boolean;
    error: string | null;
};

const initialState: SettingsState = {
    settings: null,
    loading: false,
    error: null
};

export const SettingsStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store, repo = inject(SettingsRepository)) => ({

        loadSettings: rxMethod<string>(
            pipe(
                tap(() => patchState(store, { loading: true })),
                switchMap((workspaceId) =>
                    repo.getSettings(workspaceId).then((entity: WorkspaceSettingsAggregate | null) => {
                        if (!entity) return null;

                        // Map Domain Entity to View Model
                        const vm: WorkspaceSettingsViewModel = {
                            workspaceId: entity.workspaceId.value,
                            theme: 'light', // Would come from entity
                            notifications: {
                                email: entity.notificationConfig?.emailEnabled ?? true,
                                inApp: entity.notificationConfig?.inAppEnabled ?? true
                            },
                            modules: {} // Populate from entity.allModuleConfigs
                        };
                        entity.allModuleConfigs.forEach(c => {
                            vm.modules[c.moduleId] = true; // Simplitic view: if config exists, module is active
                        });
                        return vm;
                    })
                ),
                tapResponse({
                    next: (settings) => patchState(store, { settings, loading: false }),
                    error: (err: any) => patchState(store, { loading: false, error: err.message })
                })
            )
        )
    }))
);
