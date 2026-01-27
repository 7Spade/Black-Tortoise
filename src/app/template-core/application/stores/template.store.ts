import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { TEMPLATE_REPOSITORY_TOKEN } from '../../application/interfaces/template.repository';
import { Template } from '../../domain/aggregates/template.aggregate';

type TemplateState = {
  templates: Template[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TemplateState = {
  templates: [],
  isLoading: false,
  error: null,
};

export const TemplateStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, repository = inject(TEMPLATE_REPOSITORY_TOKEN)) => ({
    loadAll: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() => {
          return repository.findAll().then((templates) => {
             patchState(store, { templates, isLoading: false });
          }).catch(err => {
             patchState(store, { error: err.message, isLoading: false });
          });
        })
      )
    ),
    addTemplate: rxMethod<{ name: string; content: string }>(
        pipe(
            tap(() => patchState(store, { isLoading: true })),
            switchMap(async (props) => {
                const newTemplate = Template.create(props.name, props.content);
                try {
                    await repository.save(newTemplate);
                    patchState(store, (state) => ({
                        templates: [...state.templates, newTemplate],
                        isLoading: false
                    }));
                } catch (err: any) {
                    patchState(store, { error: err.message, isLoading: false });
                }
            })
        )
    )
  }))
);
