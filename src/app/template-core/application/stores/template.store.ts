import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { AddSectionToTemplateUseCase } from '@template-core/application/use-cases/add-section.use-case';
import { CreateTemplateUseCase } from '@template-core/application/use-cases/create-template.use-case';
import { GetAllTemplatesUseCase } from '@template-core/application/use-cases/get-all-templates.use-case';
import { AddTemplateSectionCommand, CreateTemplateCommand } from '@template-core/application/commands/template.commands';
import { TemplateDto } from '@template-core/application/dtos/template.dto';
import { TemplateToDtoMapper } from '@template-core/application/mappers/template.mapper';

import { TemplateEventDto } from '@template-core/application/dtos/template-event.dto';
import { TemplateEventMapper } from '@template-core/application/mappers/template-event.mapper';
import { GetTemplateHistoryQuery } from '@template-core/application/queries/get-template-history.query';
import { GetTemplateHistoryUseCase } from '@template-core/application/use-cases/get-template-history.use-case';

type TemplateState = {
  templateDtos: TemplateDto[]; // Use DTOs for UI State
  selectedTemplateId: string | null;
  history: TemplateEventDto[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TemplateState = {
  templateDtos: [],
  selectedTemplateId: null,
  history: [],
  isLoading: false,
  error: null,
};

export const TemplateStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, 
    createUseCase = inject(CreateTemplateUseCase), 
    getAllUseCase = inject(GetAllTemplatesUseCase), 
    addSectionUseCase = inject(AddSectionToTemplateUseCase),
    getHistoryUseCase = inject(GetTemplateHistoryUseCase)
  ) => ({
    loadAll: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(async () => {
          try {
            const templates = await getAllUseCase.execute();
            // Map Domain Entities to View Models (DTOs)
            const dtos = TemplateToDtoMapper.toDtoList(templates);
            patchState(store, { templateDtos: dtos, isLoading: false, error: null });
          } catch(err: any) {
            patchState(store, { error: err.message || 'Unknown error', isLoading: false });
          }
        })
      )
    ),
    loadHistory: rxMethod<string>(
        pipe(
            tap(() => patchState(store, { isLoading: true })),
            switchMap(async (templateId) => {
                try {
                    const events = await getHistoryUseCase.execute(new GetTemplateHistoryQuery(templateId));
                    const historyDtos = TemplateEventMapper.toDtoList(events);
                    patchState(store, { history: historyDtos, selectedTemplateId: templateId, isLoading: false, error: null });
                } catch(err: any) {
                    patchState(store, { error: err.message, isLoading: false });
                }
            })
        )
    ),
    clearHistory: () => {
        patchState(store, { history: [], selectedTemplateId: null });
    },
    addTemplate: rxMethod<{ name: string; content: string; userId: string }>(
        pipe(
            tap(() => patchState(store, { isLoading: true })),
            switchMap(async (props) => {
                // Use Case ensures Causality Tracking (generates correlationId)
                const command = new CreateTemplateCommand(props.name, props.content, props.userId);
                
                try {
                    await createUseCase.execute(command);
                    // Reload or Optimistic Update
                    // For simplicity, we just reload all to show the new item
                    const templates = await getAllUseCase.execute();
                    const dtos = TemplateToDtoMapper.toDtoList(templates);
                    patchState(store, { templateDtos: dtos, isLoading: false, error: null });
                } catch(err: any) {
                    patchState(store, { error: err.message, isLoading: false });
                }
            })
        )
    ),
    addSection: rxMethod<{ templateId: string; title: string; content: string; userId: string }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(async (props) => {
            const command = new AddTemplateSectionCommand(props.templateId, props.title, props.content, props.userId);
            try {
                await addSectionUseCase.execute(command);
                const templates = await getAllUseCase.execute();
                const dtos = TemplateToDtoMapper.toDtoList(templates);
                patchState(store, { templateDtos: dtos, isLoading: false, error: null });
            } catch(err: any) {
                patchState(store, { error: err.message, isLoading: false });
            }
        })
      )
    )
  }))
);
